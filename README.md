<img src="assets/banner.svg" alt="Telangana Open Data — a citation-friendly catalog for agents, researchers, and builders" width="100%">

# Telangana Open Data Skill

> **Find the right Telangana dataset before downloading 24 GB.**
> A citation-friendly index of [data.telangana.gov.in](https://data.telangana.gov.in) for AI agents and the people who build with them.

[![Datasets](https://img.shields.io/badge/datasets-364-0f766e)](#by-the-numbers)
[![Theme files](https://img.shields.io/badge/theme_files-106-1d4ed8)](#by-the-numbers)
[![Indexed size](https://img.shields.io/badge/indexed_size-24.48_GB-7c3aed)](#by-the-numbers)
[![Agent Skills](https://img.shields.io/badge/agent_skills-universal-111827)](#supported-agents)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-0f766e)](#contributing)
[![License](https://img.shields.io/badge/skill_license-Apache--2.0-0f172a)](LICENSE)

The catalog in this repository covers **364 datasets** and **7,325 distribution
entries** — **7,323 with a download URL** — totaling **24.48 GB**. The portal has
no working full-text search, no datastore, and no published column metadata.
This skill supplies the missing map: dataset titles, themes, resource counts,
byte sizes, download URLs, column names, and license classes.

It ships no rows and no runtime code. It is a context document that tells an
agent what exists, what each file contains, and where to get it.

**Jump to:** [Who it's for](#who-its-for) · [Quick start](#quick-start) · [By the numbers](#by-the-numbers) · [What's inside](#whats-inside) · [Data quality](#data-quality) · [How to cite](#how-to-cite) · [Licensing](#source-and-licensing)

## Who it's for

| You are | Use it to | Try asking |
|---|---|---|
| **AI builders** | Ground agents in real, licensed government data without writing a scraper. | “Find district-level health datasets and return their CSV URLs and columns.” |
| **Researchers** | Check coverage and columns before committing to a dataset, then cite the original source and license. | “Which datasets cover Anganwadi centres, and what columns do they expose?” |
| **Founders** | Size a market or pressure-test a product hypothesis with district-level signals. | “Find datasets on urban water supply, sanitation, and municipal finance.” |
| **Fast prototypers** | Skip portal spelunking and get a small CSV for a demo today. | “Give me three small CSVs with district-level data for a quick dashboard.” |
| **Analysts** | Plan joins, comparisons, and time-series work against the right files. | “Compare paddy area, production, and yield datasets across years.” |

An agent using this skill can:

- Find datasets by title, theme, or publisher.
- Inspect column names and coverage before downloading anything.
- Plan analyses, comparisons, and time-series work against the right files.
- Generate ideas and hypotheses from what the portal actually publishes.
- Cite the source URL and license class for every dataset it uses.

## Quick start

### 1. Install

Any coding agent:

```bash
npx skills add hemanth090/telangana-open-data-catalog -a '*' -g
```

`-a '*'` installs to every agent in the CLI's registry, not only agents detected
on your machine. To install only the agents listed below:

```bash
npx skills add hemanth090/telangana-open-data-catalog -g -y \
  -a claude-code codex cursor grok gemini-cli github-copilot opencode amp \
     cline goose devin hermes-agent openclaw antigravity universal
```

For a single agent, use just that ID:

```bash
npx skills add hemanth090/telangana-open-data-catalog -g -a opencode
```

<details>
<summary><strong>Claude Code and Antigravity plugin installs</strong></summary>

Claude Code:

```text
/plugin marketplace add hemanth090/telangana-open-data-catalog
/plugin install telangana-open-data@hemanth090
```

Antigravity:

```bash
agy plugin install https://github.com/hemanth090/telangana-open-data-catalog
```

</details>

ChatGPT and Claude web are connector or manual-upload targets, not local skill
installs. Upload `skills/telangana-open-data/SKILL.md` with its `references/`
folder if you need the catalog there.

### 2. Ask

```text
Find district-wise health datasets in the Telangana catalog. Open the matching
theme file, list the CSV columns, and cite the source URL and license.
```

The agent loads `SKILL.md` first, follows the row to one file in `references/`,
and reads only the theme it needs. That keeps the 0.95 MB catalog out of the
context window until it matters.

## By the numbers

| Metric | Value |
|---|---:|
| Datasets | 364 |
| Theme files | 106 across 23 themes |
| Distribution entries | 7,325 |
| Entries with a download URL | 7,323 |
| Indexed size | 24.48 GB |
| Probed successfully | 7,208 of 7,323 |
| CSV resources with parsed headers | 7,208 of 7,295 (98.8%) |
| Column entries | 5,829 |
| Distinct column names | 2,080 |
| Dataset source references | 364 (362 distinct; two pairs repeat) |

Every count above is reproducible from the committed index and theme files. Run
`python3 scripts/verify-readme.py` to check them.

## What's inside

```text
.
├── assets/banner.svg         # ASCII mesh banner (Geist)
├── skills/telangana-open-data/
│   ├── SKILL.md              # index: 364 datasets, theme, size, license, link
│   └── references/           # 106 theme files with resources and columns
├── .claude-plugin/           # Claude Code plugin manifest
├── .antigravity-plugin/      # Antigravity plugin manifest
├── scripts/verify-readme.py  # recomputes and checks the README numbers
├── README.md
├── DISCLAIMER.md
└── LICENSE
```

Each theme file contains:

- A **Rules** block for querying the data safely.
- Dataset identity, source URL, and license.
- A resource table with format, byte size, and probe status.
- The column list with the number of resources in which each column appears.

## Supported agents

| Agent | `--agent` |
|---|---|
| Claude Code | `claude-code` |
| Codex | `codex` |
| Cursor | `cursor` |
| Grok Build | `grok` |
| Gemini CLI | `gemini-cli` |
| VS Code / Copilot | `github-copilot` |
| OpenCode | `opencode` |
| Amp | `amp` |
| Cline | `cline` |
| Goose | `goose` |
| Devin | `devin` |
| Hermes | `hermes-agent` |
| OpenClaw | `openclaw` |
| Antigravity | `antigravity` |
| Muse / Other | `universal` |

## Data quality

- **7,208 of 7,323** URL-bearing resources were probed successfully.
- **87 CSV files** have no header; their first row is data. They are marked
  `no_header` and excluded from the column lists rather than published with
  fake columns.
- **28 non-CSV resources** are size-only.
- **7,208 of 7,295** CSV resources have a parsed header (**98.8%**).
- **5,829 column entries** map to **2,080 distinct column names** across 364
  datasets.
- CR-only, LF, and CRLF line endings are handled.
- No rows, cell values, or sample rows are included.

## Counting notes

- Distribution entries and total size come from the index table in `SKILL.md`.
- Probe, CSV, and column counts come from the resource tables and `Columns:`
  lines in `references/`.
- `7,323` download-URL entries = `7,325` total minus two `no_url` probes.
- `7,295` CSV resources = `7,323` URL-bearing entries minus 28 non-CSV files.
- `7,208` parsed headers = `7,295` CSV resources minus 87 `no_header` files.
- `5,829` is the number of column entries, not distinct names. The distinct
  count is `2,080`.

## How to cite

This repository indexes metadata. Cite the dataset you actually analyze — copy
its **Source** and **License** lines from the theme file:

```text
Dataset: <title> — <source URL>. Government of Telangana,
data.telangana.gov.in. License: <license class from the theme file>.
Indexed with the Telangana Open Data Skill:
https://github.com/hemanth090/telangana-open-data-catalog
```

If you use the index itself in a paper or report, link this repository and note
the original dataset's license. The index does not grant rights to the data.

## Source and licensing

- Source: [data.telangana.gov.in](https://data.telangana.gov.in), Government of
  Telangana.
- This repository contains metadata only: dataset titles, resource titles,
  URLs, byte sizes, column names, and license labels. It contains no rows or
  cell values.
- Licenses vary by dataset. Each theme file records the raw license string and a
  normalized class. In this build: **208 open**, **3 open variants**,
  **1 other-open**, **5 portal-specific**, **30 non-commercial**,
  **113 unspecified**, and **4 missing**.
- Check the source dataset's license before using its data. The non-commercial
  and unspecified sets are not granted for reuse by this repository.
- Not affiliated with or endorsed by the Government of Telangana.

See [DISCLAIMER.md](DISCLAIMER.md) for the full notice.

## Contributing

Found a dead URL, a renamed column, or a missing dataset? Open an issue with the
dataset title and source URL. If you change the index or theme files, run
`python3 scripts/verify-readme.py` before opening a PR.

## License

Apache-2.0 for the skill text. The license does not grant rights to the portal
data.
