# Telangana Open Data Skill

An agent skill for [data.telangana.gov.in](https://data.telangana.gov.in).

The portal publishes 364 datasets as 7,326 distribution entries, 7,324 with a download URL, and 7,318 distinct URLs, totaling 24.48 GB. It has no working full-text search, no datastore, and no published column metadata.

This repository is the generated skill: a dataset index, one file per theme, column names, byte sizes, source URLs, and license classes. Load `SKILL.md`; it links to every theme file under `skills/`. No install or code is required to use it.

## What it is for

This is a context document for AI agents. Load `SKILL.md` into an agent and it can:

- Find datasets by title, theme, or publisher.
- Inspect column names and coverage before downloading anything.
- Plan analyses, comparisons, and time-series work against the right files.
- Generate ideas and hypotheses from what the portal actually publishes.
- Cite the source URL and license class for every dataset it uses.

It does not answer questions by itself. It tells the agent what data exists, which columns are available, how large each file is, and where to get it.

## Contents

| Path | What it is |
|---|---|
| `SKILL.md` | The index: 364 datasets, theme, resource count, bytes, license, and a link to the theme file. |
| `skills/` | One file per theme with resources, columns, sources, and license. |

Each theme file contains:

- A Rules block for querying the data safely.
- Dataset identity, source URL, and license.
- A resource table with format, byte size, and probe status.
- The column list with the number of resources in which each column appears.

## Data quality

- 7,208 of 7,323 URL-bearing resources were probed successfully.
- 87 CSV files have no header; their first row is data. They are marked `no_header` and excluded from the column lists rather than published with fake columns.
- 28 non-CSV resources are size-only.
- 7,208 of 7,295 CSV resources have a parsed header (98.8%).
- 5,829 distinct column names are indexed across 364 datasets.
- CR-only, LF, and CRLF line endings are handled.
- No rows, cell values, or sample rows are included.

## Source and licensing

- Source: [data.telangana.gov.in](https://data.telangana.gov.in), Government of Telangana.
- This repository contains metadata only: dataset titles, resource titles, URLs, byte sizes, column names, and license labels. It contains no rows or cell values.
- Licenses vary by dataset. Each theme file records the raw license string and a normalized class. In this build: 208 open, 3 open variants, 1 other-open, 5 portal-specific, 30 non-commercial, 113 unspecified, and 4 missing.
- Check the source dataset's license before using its data. The non-commercial and unspecified sets are not granted for reuse by this repository.
- Not affiliated with or endorsed by the Government of Telangana.

See [DISCLAIMER.md](DISCLAIMER.md) for the full notice.

## License

Apache-2.0 for the skill text. The license does not grant rights to the portal data.
