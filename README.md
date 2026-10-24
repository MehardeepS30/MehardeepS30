<h1 align="center">Mehardeep Singh</h1>

<p align="center">
  Computer Engineering undergraduate at Thapar Institute of Engineering and Technology<br>
  <b>Machine learning</b> &nbsp;·&nbsp; <b>LLM tooling and agents</b> &nbsp;·&nbsp; <b>C++ and algorithms</b>
</p>

---

### About

I'm a Computer Engineering student (B.E., expected 2028) who builds machine-learning and LLM systems end to end. The part I care about most is whether a result can be trusted: leakage-free data splits, honest test sets, real test suites, and models and agents that can be inspected rather than taken on faith.

- **Machine learning:** deep-learning models for medical imaging and sensor time series, with explainability (Grad-CAM, SHAP) treated as part of evaluation.
- **LLM engineering:** a Model Context Protocol server, tool-calling agents and a multi-agent pipeline, built around typed tool interfaces and validated outputs.
- **Foundations:** data structures and algorithms in C++, plus DBMS and computer networks coursework.

### Featured project

#### [Brain tumour MRI classification](https://github.com/MehardeepS30/brain-tumor-mri-classification) &nbsp;·&nbsp; [v1.0.0 release](https://github.com/MehardeepS30/brain-tumor-mri-classification/releases/tag/v1.0.0)

<sub>`Python` `PyTorch` `EfficientNet` `Grad-CAM` `scikit-learn` `pytest` `GitHub Actions`</sub>

A four-class classifier (glioma, meningioma, pituitary tumour, no tumour) that compares a CNN trained from scratch with a fine-tuned, ImageNet-pretrained EfficientNet-B0 under the same data, preprocessing and model-selection rule, so the comparison is fair.

- **Result:** on an untouched test split of 612 images, macro recall rose from 0.803 to 0.916, and tumours misread as "no tumour" fell from 41 to 10 of 509.
- **Leakage-aware data pipeline:** flip- and rotation-aware perceptual hashing, SSIM and pixel correlation find copies and related images; a group-aware stratified 70/15/15 split asserts that nothing related crosses splits.
- **Explainability that found a real flaw:** Grad-CAM and a size analysis showed that small images are far more likely to be called "no tumour", a resolution/source shortcut the project measures and documents rather than hides.
- **Engineering:** installable Python package, config-driven stage scripts, bit-exact checkpoint resume, bootstrap confidence intervals, a model card, and 104 pytest tests on GitHub Actions.

### More projects

**GitHub MCP server**<br>
<sub>`Python` `MCP` `REST` `GraphQL` `pytest` `GitHub Actions`</sub>

A Model Context Protocol server, written from scratch, that lets an LLM work with GitHub through 49 typed tools covering issues, pull requests, code review, branches and CI workflows, alongside MCP resources and prompts.
- Uses MCP sampling for server-side summaries, and MCP elicitation to get human confirmation before destructive writes; every tool is annotated as read-only or destructive.
- Rate-limit retry and bounded response truncation protect the model's context; 373 tests run in CI on Python 3.10–3.14 across Linux, Windows and macOS.

**Multi-agent research and reporting pipeline**<br>
<sub>`LLM agents` `Pydantic` `async concurrency`</sub>

A four-stage LLM pipeline (planning → parallel retrieval → synthesis → delivery) orchestrated in code, so control flow is deterministic and each stage can be observed.
- Pydantic schemas validate the input and output at every agent boundary, replacing fragile string parsing with type-safe structured outputs.
- Retrieval calls run concurrently instead of one after another, and a custom callable tool handles outbound delivery.

**Task-planning agent from first principles**<br>
<sub>`LLM agents` `Chat Completions API` `JSON Schema`</sub>

An autonomous agent loop built directly on the chat completions API, with no framework, implementing the invoke → execute → feed-back cycle that agent frameworks are built on.
- Stateful functions are exposed as JSON-schema tools, so the model breaks open-ended goals into steps and updates an external task list without hard-coded control flow.
- A generic dispatch layer resolves and calls tools at runtime and returns their results to the model's context.

**Turbofan engine remaining-useful-life prediction**<br>
<sub>`Deep learning` `Time series` `SHAP` `NASA C-MAPSS`</sub>

Predicts the remaining useful life (RUL) of turbofan engines from multivariate sensor telemetry, framed as supervised sequence learning.
- Seven architectures (LSTM, BiLSTM, GRU, BiGRU, CNN-BiLSTM, Attention-BiLSTM, TCN) share one sliding-window pipeline for preprocessing, training, checkpointing and evaluation, so the benchmark is reproducible.
- Evaluated with RMSE, MAE and $R^2$; BiGRU performed best (RMSE 16.87), and SHAP gives sensor-level interpretation for a safety-critical setting.

### Tech

| | Used in my projects and coursework |
|---|---|
| **Languages** | Python · C++ · SQL |
| **ML and data** | PyTorch · scikit-learn · SHAP · Grad-CAM · Pandas · NumPy |
| **LLM and agents** | Model Context Protocol · Chat Completions API · Pydantic |
| **Data and APIs** | REST and GraphQL APIs · Oracle SQL / PL/SQL |
| **Engineering** | Git · GitHub Actions · pytest |

**Also worked with:** C · JavaScript · Node.js · Express · MongoDB · XGBoost · Hugging Face · Streamlit · Jupyter<br>
**Currently learning:** retrieval-augmented generation (RAG) with FAISS · LangGraph

<!--
### Contact

[LinkedIn](https://www.linkedin.com/in/YOUR-HANDLE) &nbsp;·&nbsp; [Email](mailto:YOUR-EMAIL)
-->
