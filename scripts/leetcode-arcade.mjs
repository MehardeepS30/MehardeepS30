import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PADDLE_SWEET_SPOT = 0.15;
const PADDLE_SPEED = 3;

const loadArcadeRenderer = async (game) => {
	if (game !== 'breakout') return (await import('pacman-contribution-graph')).ArcadeRenderer;
	const bundle = fileURLToPath(import.meta.resolve('pacman-contribution-graph'));
	const zone = +(3.5 * PADDLE_SWEET_SPOT).toFixed(4);
	const patches = [
		['n=Math.max(-1,Math.min(1,(o.x-e)/3.5))', `n=Math.max(-1,Math.min(1,(o.x-e)/${zone}))`],
		['h=s-Math.max(-65,Math.min(65,d))/65*3.5', `h=s-Math.max(-65,Math.min(65,d))/65*${zone}`],
		['a.x<u-2?a.x+=2:a.x>u+2?a.x-=2:a.x=u', `a.x<u-${PADDLE_SPEED}?a.x+=${PADDLE_SPEED}:a.x>u+${PADDLE_SPEED}?a.x-=${PADDLE_SPEED}:a.x=u`]
	];
	let code = readFileSync(bundle, 'utf8');
	for (const [from, to] of patches) {
		if (code.split(from).length !== 2) throw new Error(`Breakout paddle patch no longer matches the library: ${from}`);
		code = code.replace(from, to);
	}
	const patched = bundle.replace(/\.js$/, '.centre-paddle.mjs');
	writeFileSync(patched, code);
	return (await import(pathToFileURL(patched).href)).ArcadeRenderer;
};

const username = process.env.LEETCODE_USERNAME;
const game = process.env.ARCADE_GAME || 'breakout';
const outDir = process.env.OUT_DIR || 'dist';
if (!username) throw new Error('LEETCODE_USERNAME is not set');
const ArcadeRenderer = await loadArcadeRenderer(game);

const fetchCalendar = async () => {
	const query = 'query ($username: String!) { matchedUser(username: $username) { userCalendar { submissionCalendar } } }';
	const response = await fetch('https://leetcode.com/graphql/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Referer: `https://leetcode.com/u/${username}/`,
			'User-Agent': 'Mozilla/5.0 (profile-readme arcade generator)'
		},
		body: JSON.stringify({ query, variables: { username } })
	});
	if (!response.ok) throw new Error(`LeetCode request failed: ${response.status}`);
	const json = await response.json();
	const raw = json?.data?.matchedUser?.userCalendar?.submissionCalendar;
	if (!raw) throw new Error(`No submission calendar returned for ${username}`);
	return JSON.parse(raw);
};

const toLevels = (counts) => {
	const active = counts.filter((c) => c > 0).sort((a, b) => a - b);
	const at = (p) => active[Math.min(active.length - 1, Math.floor(p * active.length))] ?? 1;
	const [q1, q2, q3] = [at(0.25), at(0.5), at(0.75)];
	return (c) => (c === 0 ? 'NONE' : c <= q1 ? 'FIRST_QUARTILE' : c <= q2 ? 'SECOND_QUARTILE' : c <= q3 ? 'THIRD_QUARTILE' : 'FOURTH_QUARTILE');
};

const toGithubCalendar = (calendar) => {
	const byDay = new Map();
	for (const [ts, count] of Object.entries(calendar)) {
		const day = new Date(Number(ts) * 1000).toISOString().slice(0, 10);
		byDay.set(day, (byDay.get(day) ?? 0) + count);
	}
	const end = new Date();
	end.setUTCHours(0, 0, 0, 0);
	const start = new Date(end);
	start.setUTCDate(start.getUTCDate() - 364 - start.getUTCDay());
	const days = [];
	for (const d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
		const date = d.toISOString().slice(0, 10);
		days.push({ date, contributionCount: byDay.get(date) ?? 0 });
	}
	const level = toLevels(days.map((d) => d.contributionCount));
	const weeks = [];
	for (let i = 0; i < days.length; i += 7) {
		weeks.push({ contributionDays: days.slice(i, i + 7).map((d) => ({ ...d, color: '', contributionLevel: level(d.contributionCount) })) });
	}
	return { data: { user: { contributionsCollection: { contributionCalendar: { weeks } } } } };
};

const render = (calendarResponse, gameTheme) => {
	const realFetch = globalThis.fetch;
	globalThis.fetch = async (url, init) =>
		String(url) === 'https://api.github.com/graphql'
			? new Response(JSON.stringify(calendarResponse), { status: 200, headers: { 'Content-Type': 'application/json' } })
			: realFetch(url, init);
	return new Promise((resolve, reject) => {
		let svg = '';
		new ArcadeRenderer({
			game,
			platform: 'github',
			username,
			gameTheme,
			showMonthLabels: true,
			githubSettings: { accessToken: 'leetcode-calendar' },
			svgCallback: (s) => {
				svg = s;
			},
			gameOverCallback: () => {
				globalThis.fetch = realFetch;
				resolve(svg);
			},
			pointsIncreasedCallback: () => {}
		})
			.start()
			.catch((e) => {
				globalThis.fetch = realFetch;
				reject(e);
			});
	});
};

const calendar = process.env.LEETCODE_CALENDAR_FILE
	? JSON.parse(readFileSync(process.env.LEETCODE_CALENDAR_FILE, 'utf8'))
	: await fetchCalendar();
const response = toGithubCalendar(calendar);
mkdirSync(outDir, { recursive: true });
for (const [theme, suffix] of [['github', ''], ['github-dark', '-dark']]) {
	const svg = await render(response, theme);
	if (!svg.startsWith('<svg')) throw new Error(`Renderer returned no SVG for ${theme}`);
	writeFileSync(`${outDir}/leetcode-${game}${suffix}.svg`, svg);
	console.log(`wrote ${outDir}/leetcode-${game}${suffix}.svg (${svg.length} bytes)`);
}
