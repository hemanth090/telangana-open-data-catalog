# Telangana Open Data Universal Skill Packaging — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Package the existing Telangana Open Data catalog as one universal Agent Skill that installs on every coding agent in the Firecrawl screenshot via `npx skills`, plus native Claude Code and Antigravity plugins.

**Architecture:** Move the 71 KB index to `skills/telangana-open-data/SKILL.md`, move the 106 theme files to `references/`, rewrite the index links, add Claude/Antigravity manifests, and document the full agent install matrix. One skill directory; no per-agent copies in the repo.

**Tech Stack:** Markdown, YAML frontmatter, JSON manifests, `npx skills` (Agent Skills CLI), shell validation.

**Spec:** `docs/superpowers/specs/2026-11-13-universal-skill-packaging-design.md`

## Global Constraints

- Skill name: `telangana-open-data`; directory must be `skills/telangana-open-data/`.
- Frontmatter description must be 1–1,024 characters.
- Preserve all 364 dataset rows and all 106 theme files.
- Preserve every source URL, column list, byte size, and license label.
- No npm package, no custom installer CLI, no MCP server.
- No push to GitHub; work stays on `feat/universal-skill-packaging`.
- Apache-2.0 for skill text; portal data licenses unchanged.

## Review Focus

1. **Broken/missing theme links** — every dataset row must point to an existing `references/*.md` file. Pinned by Task 1's link checker.
2. **Duplicate skill discovery** — a root `SKILL.md` plus the nested one makes `npx skills` see two skills. Pinned by Task 1's `skills add . -l` check.
3. **Name/directory mismatch** — Antigravity rejects `name` that does not match the parent directory. Pinned by Task 1's frontmatter check.
4. **Invalid plugin manifests** — missing required fields break `claude plugin` / `agy plugin install`. Pinned by Tasks 2 and 3.
5. **Wrong agent install matrix** — documented IDs or paths that do not exist. Pinned by Task 4's grep check and Task 5's temp-home install.

---

### Task 1: Canonical skill layout and frontmatter

**Files:**
- Move: `SKILL.md` → `skills/telangana-open-data/SKILL.md`
- Move: `skills/*.md` → `skills/telangana-open-data/references/*.md` (106 files)
- Modify: `skills/telangana-open-data/SKILL.md` (frontmatter + links)

**Interfaces:**
- Consumes: existing index table and 106 theme files.
- Produces: skill ID `telangana-open-data`; frontmatter `name`, `description`; `references/` with 106 files.

- [ ] **Step 1: Verify the starting counts**

Run:

```bash
cd /Users/hemanth/Desktop/newproj
test -f SKILL.md
test "$(ls skills/*.md | wc -l | tr -d ' ')" = "106"
test "$(grep -c '](skills/' SKILL.md)" = "364"
```

Expected: all commands exit 0.

- [ ] **Step 2: Create the skill directory and move files**

Run:

```bash
mkdir -p skills/telangana-open-data/references
git mv SKILL.md skills/telangana-open-data/SKILL.md
git mv skills/*.md skills/telangana-open-data/references/
```

Expected: `ls skills/telangana-open-data/references/*.md | wc -l` prints `106`.

- [ ] **Step 3: Add YAML frontmatter**

Prepend exactly:

```yaml
---
name: telangana-open-data
description: |
  Dataset index for data.telangana.gov.in: 364 datasets and 7,325 resources
  from the Government of Telangana, with download URLs, CSV column names,
  formats, byte sizes, and license classes. Use when finding, citing,
  comparing, or planning analysis of Telangana open data across agriculture,
  health, education, municipal administration, elections, energy, transport,
  and other themes. Metadata only; no rows or cell values.
---
```

Expected: the first line of `skills/telangana-open-data/SKILL.md` is `---`.

- [ ] **Step 4: Rewrite index links from `skills/` to `references/`**

Run:

```bash
perl -pi -e 's#\]\(skills/#](references/#g' skills/telangana-open-data/SKILL.md
```

Expected: `grep -c '](references/' skills/telangana-open-data/SKILL.md` prints `364`.

- [ ] **Step 5: Run the link/frontmatter checker**

Run:

```bash
python3 - <<'PY'
import re
from pathlib import Path

skill = Path("skills/telangana-open-data/SKILL.md")
text = skill.read_text()
refs = sorted(p.name for p in (skill.parent / "references").glob("*.md"))
links = re.findall(r"\]\(references/([^)]+\.md)\)", text)
rows = [l for l in text.splitlines() if l.startswith("| ") and "](references/" in l]
missing = sorted(set(links) - set(refs))
orphans = sorted(set(refs) - set(links))
desc = text.split("description: |", 1)[1].split("---", 1)[0].strip()

assert text.startswith("---\nname: telangana-open-data\n"), "bad frontmatter"
assert 1 <= len(desc) <= 1024, f"description length {len(desc)}"
assert len(refs) == 106, f"references {len(refs)}"
assert len(rows) == 364, f"dataset rows {len(rows)}"
assert not missing, f"missing {missing}"
assert not orphans, f"orphans {orphans}"
print(f"OK: {len(refs)} references, {len(rows)} rows, 0 broken links, description {len(desc)} chars")
PY
```

Expected: `OK: 106 references, 364 rows, 0 broken links, description ... chars`.

- [ ] **Step 6: Confirm `npx skills` sees exactly one skill**

Run:

```bash
npx -y skills add . -l 2>&1 | tail -20
```

Expected: one skill named `telangana-open-data`; no `SKILLS_NO_VALID_SKILLS` and no second skill.

- [ ] **Step 7: Commit**

```bash
git add skills
git commit -m "feat: package catalog as universal telangana-open-data skill"
```

---

### Task 2: Claude Code plugin manifests

**Files:**
- Create: `.claude-plugin/plugin.json`
- Create: `.claude-plugin/marketplace.json`

**Interfaces:**
- Consumes: `skills/telangana-open-data/SKILL.md` from Task 1.
- Produces: plugin `telangana-open-data` in marketplace `hemanth090`.

- [ ] **Step 1: Create `.claude-plugin/plugin.json`**

```json
{
  "name": "telangana-open-data",
  "description": "Dataset index and metadata for data.telangana.gov.in.",
  "version": "1.0.0",
  "author": {
    "name": "Hemanth"
  }
}
```

- [ ] **Step 2: Create `.claude-plugin/marketplace.json`**

```json
{
  "name": "hemanth090",
  "description": "Agent skills by Hemanth.",
  "owner": {
    "name": "Hemanth"
  },
  "plugins": [
    {
      "name": "telangana-open-data",
      "source": "./",
      "description": "Dataset index and metadata for data.telangana.gov.in.",
      "version": "1.0.0"
    }
  ]
}
```

- [ ] **Step 3: Validate the manifests**

Run:

```bash
python3 - <<'PY'
import json
from pathlib import Path

plugin = json.loads(Path(".claude-plugin/plugin.json").read_text())
market = json.loads(Path(".claude-plugin/marketplace.json").read_text())
assert plugin["name"] == "telangana-open-data"
assert plugin["version"] == "1.0.0"
assert market["plugins"][0]["name"] == plugin["name"]
assert market["plugins"][0]["source"] == "./"
assert Path("skills/telangana-open-data/SKILL.md").is_file()
print("OK: Claude plugin manifests valid")
PY
```

Expected: `OK: Claude plugin manifests valid`.

- [ ] **Step 4: Commit**

```bash
git add .claude-plugin
git commit -m "feat: add Claude Code plugin manifests"
```

---

### Task 3: Antigravity plugin manifest

**Files:**
- Create: `.antigravity-plugin/plugin.json`

**Interfaces:**
- Consumes: `skills/telangana-open-data/SKILL.md` from Task 1.
- Produces: Antigravity plugin `telangana-open-data`.

- [ ] **Step 1: Create `.antigravity-plugin/plugin.json`**

```json
{
  "$schema": "https://antigravity.google/schemas/v1/plugin.json",
  "name": "telangana-open-data",
  "displayName": "Telangana Open Data",
  "version": "1.0.0",
  "description": "Dataset index and metadata for data.telangana.gov.in.",
  "suggestedPrompts": [
    "Find Telangana datasets about agriculture and list their columns.",
    "Which Telangana open datasets cover district-wise health data?",
    "Plan an analysis of Telangana municipal water supply data and cite the sources."
  ],
  "author": {
    "name": "Hemanth",
    "url": "https://github.com/hemanth090"
  },
  "homepage": "https://github.com/hemanth090/telangana-open-data-catalog",
  "repository": "https://github.com/hemanth090/telangana-open-data-catalog",
  "license": "Apache-2.0",
  "keywords": ["telangana", "open-data", "datasets", "catalog", "government"]
}
```

- [ ] **Step 2: Validate the manifest**

Run:

```bash
python3 - <<'PY'
import json, re
from pathlib import Path

p = Path(".antigravity-plugin/plugin.json")
m = json.loads(p.read_text())
assert re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", m["name"])
assert Path(f"skills/{m['name']}/SKILL.md").is_file()
assert 1 <= len(m["description"]) <= 200
assert 1 <= len(m["suggestedPrompts"]) <= 3
assert m["$schema"] == "https://antigravity.google/schemas/v1/plugin.json"
print("OK: Antigravity plugin manifest valid")
PY
```

Expected: `OK: Antigravity plugin manifest valid`.

- [ ] **Step 3: Run Antigravity strict validation if available**

Run:

```bash
if command -v agy >/dev/null 2>&1; then agy plugin validate --strict .; else echo "agy not installed; schema checks only"; fi
```

Expected: `agy` exits 0 with no errors/warnings, or prints `agy not installed; schema checks only`.

- [ ] **Step 4: Commit**

```bash
git add .antigravity-plugin
git commit -m "feat: add Antigravity plugin manifest"
```

---

### Task 4: README install matrix

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: Task 1 layout, Task 2/3 install commands.
- Produces: documented install paths for every agent in the screenshot.

- [ ] **Step 1: Replace the "no install" paragraph with install sections**

The README must contain these exact commands:

```bash
# Every detected agent
npx skills add hemanth090/telangana-open-data-catalog -a '*' -g

# One agent, for example OpenCode
npx skills add hemanth090/telangana-open-data-catalog -g -a opencode
```

```text
/plugin marketplace add hemanth090/telangana-open-data-catalog
/plugin install telangana-open-data@hemanth090
```

```bash
agy plugin install https://github.com/hemanth090/telangana-open-data-catalog
```

And this table:

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

Add a note: ChatGPT and Claude web use a connector or manual upload, not a local
skill install.

- [ ] **Step 2: Update the contents table**

Change the `SKILL.md` and `skills/` rows to:

| Path | What it is |
|---|---|
| `skills/telangana-open-data/SKILL.md` | The index: 364 datasets, theme, resource count, bytes, license, and a link to the theme file. |
| `skills/telangana-open-data/references/` | One file per theme with resources, columns, sources, and license. |

- [ ] **Step 3: Validate the README**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
t = Path("README.md").read_text()
agents = ["claude-code","codex","cursor","grok","gemini-cli","github-copilot",
          "opencode","amp","cline","goose","devin","hermes-agent","openclaw",
          "antigravity","universal"]
missing = [a for a in agents if a not in t]
assert not missing, f"missing agent IDs: {missing}"
for cmd in ["npx skills add", "/plugin marketplace add", "agy plugin install",
            "skills/telangana-open-data/SKILL.md", "skills/telangana-open-data/references/"]:
    assert cmd in t, f"missing: {cmd}"
print("OK: README covers all agents")
PY
```

Expected: `OK: README covers all agents`.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add universal agent install matrix"
```

---

### Task 5: End-to-end install into a temporary home

**Files:**
- No repo changes.

**Interfaces:**
- Consumes: Task 1 skill layout; Task 2/3 manifests.
- Produces: proof that `npx skills` installs the skill into each agent's path.

- [ ] **Step 1: Run the installer with a temporary HOME**

Run:

```bash
TMP_HOME="$(mktemp -d)"
HOME="$TMP_HOME" NPM_CONFIG_CACHE="$TMP_HOME/.npm" \
  npx -y skills add . -g -a '*' -y
echo "$TMP_HOME"
```

Expected: installer exits 0 and reports `telangana-open-data`.

- [ ] **Step 2: Verify the installed paths**

Run (replace `$TMP_HOME` with the printed path):

```bash
test -f "$TMP_HOME/.claude/skills/telangana-open-data/SKILL.md"
test -f "$TMP_HOME/.agents/skills/telangana-open-data/SKILL.md"
test -f "$TMP_HOME/.cursor/skills/telangana-open-data/SKILL.md"
test -f "$TMP_HOME/.gemini/skills/telangana-open-data/SKILL.md"
test -f "$TMP_HOME/.config/opencode/skills/telangana-open-data/SKILL.md"
echo "OK: installed to Claude, Codex/universal, Cursor, Gemini, OpenCode"
```

Expected: `OK: installed to Claude, Codex/universal, Cursor, Gemini, OpenCode`.

- [ ] **Step 3: Clean up**

```bash
rm -rf "$TMP_HOME"
```

Expected: command exits 0.

- [ ] **Step 4: If `-a '*'` fails, rerun with the explicit list**

```bash
npx -y skills add . -g -y \
  -a claude-code codex cursor grok gemini-cli github-copilot opencode amp \
     cline goose devin hermes-agent openclaw antigravity universal
```

Expected: same result; record the working command in the final report.

- [ ] **Step 5: No commit**

Verification only. If a fix is needed, return to the owning task and commit there.

---

### Task 6: Final consistency check

**Files:**
- No new files.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: clean branch ready for the owner to review and push.

- [ ] **Step 1: Check the diff and whitespace**

Run:

```bash
git status --short
git diff --check
git diff --stat HEAD~1
```

Expected: no whitespace errors; theme files show as renames.

- [ ] **Step 2: Re-run skill discovery**

```bash
npx -y skills add . -l 2>&1 | tail -20
```

Expected: exactly one skill, `telangana-open-data`.

- [ ] **Step 3: Final commit if anything remains**

```bash
git add -A
git commit -m "chore: final universal skill validation"
```

If there is nothing to commit, skip this step.

- [ ] **Step 4: Report**

Report: branch name, commit list, skill location, install commands, and the
ChatGPT/Claude-web exception. Do not push.
