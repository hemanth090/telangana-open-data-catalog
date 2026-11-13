# Telangana Open Data — Universal Skill Packaging

Date: 2026-11-13
Status: proposed (revised for all agents)
Branch: `feat/universal-skill-packaging`

## Intent

Package the existing generated Telangana Open Data catalog as one Agent Skill that
installs and works across every agent shown in the Firecrawl launcher screenshot,
using `npx skills` as the universal install path.

The catalog content is already generated and correct. This work is packaging and
discoverability only.

## What exists today

- `SKILL.md` at the repository root: a 71 KB dataset index with 364 datasets.
- `skills/`: 106 theme files with resource URLs, columns, sizes, and licenses.
- No YAML frontmatter, so `npx skills add` rejects the repo with
  `missing required frontmatter field(s): name, description`.
- No Claude or Antigravity plugin manifests.
- No install instructions beyond "load `SKILL.md`".

## Target agents

From the screenshot, the coding agents that accept local skills are covered by
`npx skills`:

| Screenshot label | `--agent` ID | Project path | Global path |
|---|---|---|---|
| Claude Code | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |
| Codex | `codex` | `.agents/skills/` | `~/.agents/skills/` |
| Cursor | `cursor` | `.agents/skills/` | `~/.cursor/skills/` |
| Grok Build | `grok` | `.grok/skills/` | `~/.grok/skills/` |
| Gemini CLI | `gemini-cli` | `.agents/skills/` | `~/.gemini/skills/` |
| VS Code / Copilot | `github-copilot` | `.agents/skills/` | `~/.copilot/skills/` |
| opencode | `opencode` | `.agents/skills/` | `~/.config/opencode/skills/` |
| Amp | `amp` | `.agents/skills/` | `~/.config/agents/skills/` |
| Cline | `cline` | `.agents/skills/` | `~/.agents/skills/` |
| Goose | `goose` | `.goose/skills/` | `~/.config/goose/skills/` |
| Devin | `devin` | `.devin/skills/` | `~/.config/devin/skills/` |
| Hermes | `hermes-agent` | `.hermes/skills/` | `~/.hermes/skills/` |
| OpenClaw | `openclaw` | `skills/` | `~/.openclaw/skills/` |
| Antigravity | `antigravity` | `.agents/skills/` | `~/.gemini/config/skills/` |
| Muse / Other | `universal` | `.agents/skills/` | `~/.config/agents/skills/` |

Two exceptions are not local skill targets:

- **ChatGPT** and **Claude web**: they use the Firecrawl connector/plugin, not a
  local skill install. The same `SKILL.md` can be pasted into a project or
  uploaded manually, but `npx skills` cannot install into the web app.
- **Muse** has no dedicated `--agent` ID in `skills` 1.8.1; use `universal` or
  copy into Muse's skill directory manually.

## Goals

1. One canonical skill at `skills/telangana-open-data/SKILL.md` with valid
   frontmatter (`name` matching the directory, `description` within 1,024 chars).
2. Theme files preserved as `references/*.md` beside the skill, keeping
   progressive disclosure: the index loads first, one theme file loads on demand.
3. `npx skills add hemanth090/telangana-open-data-catalog` finds exactly one
   skill and can install it to every supported agent in the table above.
4. Native plugin installs work:
   - Claude Code via `.claude-plugin/plugin.json` and `marketplace.json`.
   - Antigravity via `.antigravity-plugin/plugin.json`.
5. README documents each install path and the repository layout.
6. All existing dataset metadata, URLs, column lists, licenses, and counts are
   preserved byte-for-byte apart from link paths and frontmatter.

## Non-goals

- No npm package and no `npx telangana-open-data install` CLI.
- No MCP server.
- No changes to the catalog generator or dataset metadata.
- No dataset downloads, rows, or cell values added to the repo.
- No push to GitHub; the commit stays local until the owner pushes.

## Anti-goals

- Do not create 106 separate skills.
- Do not duplicate theme files per agent.
- Do not inline the 1 MB of theme content into `SKILL.md`.
- Do not break existing relative links or dataset rows.

## Chosen approach

Option A: universal skill only. One Agent Skill directory is readable by every
skill-capable agent, and `npx skills` handles the per-agent copy or symlink. This
is the smallest change that satisfies every coding agent in the screenshot.

Options B (npm installer) and C (MCP server) were considered and deferred.

## Target layout

```text
.
├── README.md
├── DISCLAIMER.md
├── LICENSE
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
├── .antigravity-plugin/
│   └── plugin.json
└── skills/
    └── telangana-open-data/
        ├── SKILL.md                    # index + frontmatter
        └── references/
            ├── administration-....md
            ├── agriculture-....md
            └── ... (106 theme files)
```

The root `SKILL.md` is removed after its content moves into the skill directory.
Keeping a root copy would make `npx skills` see two competing skills.

## Skill frontmatter

```yaml
---
name: telangana-open-data
description: |
  Dataset index for data.telangana.gov.in: 364 datasets and 7,326 resources
  from the Government of Telangana, with download URLs, CSV column names,
  formats, byte sizes, and license classes. Use when finding, citing,
  comparing, or planning analysis of Telangana open data across agriculture,
  health, education, municipal administration, elections, energy, transport,
  and other themes. Metadata only; no rows or cell values.
---
```

The body stays the existing index. The only body edit is rewriting links from
`skills/<theme>.md` to `references/<theme>.md`.

## Install paths after packaging

| Target | Command |
|---|---|
| All detected agents | `npx skills add hemanth090/telangana-open-data-catalog -a '*' -g` |
| One agent | `npx skills add hemanth090/telangana-open-data-catalog -g -a opencode` |
| Claude Code plugin | `/plugin marketplace add hemanth090/telangana-open-data-catalog` then `/plugin install telangana-open-data@hemanth090` |
| Antigravity plugin | `agy plugin install https://github.com/hemanth090/telangana-open-data-catalog` |

`-a '*'` installs to every agent the CLI detects or supports. `universal` covers
clients without a dedicated ID, including Muse and "Other".

## Manifests

### `.claude-plugin/plugin.json`

```json
{
  "name": "telangana-open-data",
  "description": "Dataset index and metadata for data.telangana.gov.in.",
  "version": "1.0.0",
  "author": { "name": "Hemanth" }
}
```

### `.claude-plugin/marketplace.json`

Marketplace name `hemanth090`, one plugin entry with `"source": "./"`.

### `.antigravity-plugin/plugin.json`

Antigravity schema (`https://antigravity.google/schemas/v1/plugin.json`), with
`name`, `displayName`, `version`, `description`, up to three suggested prompts,
author, homepage, repository, license, and keywords. No logo is required for a
local install; it is only required for Marketplace submission.

## README changes

Replace the "no install or code is required" paragraph with:

- What the skill is.
- A compact install table for all agents: Claude Code, Codex, Cursor, Grok Build,
  Gemini CLI, VS Code/Copilot, OpenCode, Amp, Cline, Goose, Devin, Hermes,
  OpenClaw, Antigravity, Muse/Other, plus the universal `-a '*'` command.
- A note that ChatGPT and Claude web are connector/manual targets, not local
  skill installs.
- The target layout.
- A short "use it" example: ask about a theme, open the linked reference file,
  cite source URL and license.
- Keep the existing data-quality and licensing sections unchanged.

## Verification

1. `npx skills add <local-path> -l` lists exactly one skill,
   `telangana-open-data`.
2. `npx skills add <local-path> -g -a '*' -y` installs into temporary homes for
   every supported agent and creates the expected directories.
3. Every link in `SKILL.md` resolves to a file under `references/`; every
   reference file is linked at least once.
4. All JSON manifests parse, and `agy plugin validate --strict .` passes if
   `agy` is available.
5. The dataset count in the index still matches the original (364 datasets).
6. `git diff --stat` shows renames, not content rewrites, for theme files.

## Risks

- The skill body is 71 KB. This is intentional: it is the index the agent needs
  to choose a theme. It is still far smaller than loading all 1 MB of references.
- Antigravity requires `name` to match the parent directory; both are
  `telangana-open-data`.
- Claude plugin skills are namespaced; the universal skill install exposes the
  skill directly as `telangana-open-data`.
- `npx skills` clones from GitHub, so remote installs only work after the owner
  pushes the branch. Local validation uses the working tree.
- ChatGPT and Claude web cannot receive a local skill through `npx skills`.

## Open decisions already settled

- Approach A, not B or C.
- One skill, not 106.
- All coding agents in the screenshot, with `universal` as the fallback.
- Changes stay on `feat/universal-skill-packaging` and are committed locally.
