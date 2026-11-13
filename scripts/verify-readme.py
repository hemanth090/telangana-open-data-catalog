#!/usr/bin/env python3
"""Recompute the README's catalog numbers from the committed index and references."""

import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills/telangana-open-data/SKILL.md"
REFS = ROOT / "skills/telangana-open-data/references"
README = ROOT / "README.md"


def parse_index():
    rows = []
    for line in SKILL.read_text().splitlines():
        if line.startswith("| ") and "](references/" in line:
            rows.append([cell.strip() for cell in line.strip("|").split("|")])
    return rows


def parse_references():
    probes = Counter()
    formats = Counter()
    columns = []
    source_urls = []
    resource_rows = 0

    for path in sorted(REFS.glob("*.md")):
        body = path.read_text()
        for part in re.split(r"(?m)^## ", body)[1:]:
            if "- Dataset:" not in part:
                continue

            source = re.search(r"(?m)^- Source: (.*)$", part)
            if source:
                source_urls.append(source.group(1).strip())

            columns_match = re.search(r"(?ms)^Columns: (.*?)(?=\n\n|\n##|\Z)", part)
            if columns_match:
                columns.extend(re.findall(r"`([^`]+)` \((\d+)\)", columns_match.group(1)))

            for line in part.splitlines():
                if not line.startswith("| "):
                    continue
                cells = [cell.strip() for cell in line.strip("|").split("|")]
                if len(cells) != 4 or cells[0] == "Resource":
                    continue
                if cells[3] not in {"ok", "size_only", "no_url", "no_header"}:
                    continue
                resource_rows += 1
                formats[cells[1] or "(blank)"] += 1
                probes[cells[3]] += 1

    return resource_rows, probes, formats, columns, source_urls


def main():
    index = parse_index()
    resource_rows, probes, formats, columns, source_urls = parse_references()

    datasets = len(index)
    resources = sum(int(row[2]) for row in index)
    total_bytes = sum(int(row[3]) for row in index)
    total_gb = round(total_bytes / 1e9, 2)
    themes = len({row[1] for row in index})
    theme_files = len(list(REFS.glob("*.md")))
    licenses = Counter(row[4] for row in index)

    non_csv = sum(count for fmt, count in formats.items() if fmt not in {"csv", "(blank)"})
    url_bearing = resources - probes["no_url"]
    csv_resources = url_bearing - non_csv
    parsed_headers = csv_resources - probes["no_header"]
    header_rate = round(parsed_headers / csv_resources * 100, 1)
    column_entries = len(columns)
    distinct_columns = len({name for name, _ in columns})
    distinct_sources = len(set(source_urls))
    duplicate_source_pairs = sum(1 for count in Counter(source_urls).values() if count > 1)
    skill_bytes = sum(
        path.stat().st_size for path in (ROOT / "skills/telangana-open-data").rglob("*") if path.is_file()
    )
    skill_mb = round(skill_bytes / 1e6, 2)

    expected = {
        "datasets": 364,
        "resources": 7325,
        "total_gb": 24.48,
        "themes": 23,
        "theme_files": 106,
        "url_bearing": 7323,
        "non_csv": 28,
        "csv_resources": 7295,
        "parsed_headers": 7208,
        "header_rate": 98.8,
        "column_entries": 5829,
        "distinct_columns": 2080,
        "source_urls": 364,
        "distinct_sources": 362,
        "duplicate_source_pairs": 2,
        "skill_mb": 0.95,
        "ok": 7208,
        "no_header": 87,
        "no_url": 2,
        "size_only": 28,
    }
    actual = {
        "datasets": datasets,
        "resources": resources,
        "total_gb": total_gb,
        "themes": themes,
        "theme_files": theme_files,
        "url_bearing": url_bearing,
        "non_csv": non_csv,
        "csv_resources": csv_resources,
        "parsed_headers": parsed_headers,
        "header_rate": header_rate,
        "column_entries": column_entries,
        "distinct_columns": distinct_columns,
        "source_urls": len(source_urls),
        "distinct_sources": distinct_sources,
        "duplicate_source_pairs": duplicate_source_pairs,
        "skill_mb": skill_mb,
        "ok": probes["ok"],
        "no_header": probes["no_header"],
        "no_url": probes["no_url"],
        "size_only": probes["size_only"],
    }
    for key, want in expected.items():
        if actual[key] != want:
            raise AssertionError(f"{key}: expected {want}, computed {actual[key]}")

    skill_text = SKILL.read_text()
    if "364 datasets and 7,325 resources" not in skill_text:
        raise AssertionError("SKILL.md frontmatter does not state 7,325 resources")
    if "7,326" in skill_text:
        raise AssertionError("SKILL.md still contains the stale 7,326 count")

    readme = README.read_text()
    required = [
        "364 datasets",
        "7,325 distribution",
        "7,323 with a download URL",
        "24.48 GB",
        "0.95 MB catalog",
        "106 across 23 themes",
        "7,208 of 7,323",
        "7,208 of 7,295",
        "98.8%",
        "5,829 column entries",
        "2,080 distinct",
        "364 (362 distinct",
        "two pairs repeat",
        "208 open",
        "3 open variants",
        "1 other-open",
        "5 portal-specific",
        "30 non-commercial",
        "113 unspecified",
        "4 missing",
        "87 CSV files",
        "28 non-CSV resources",
    ]
    missing = [text for text in required if text not in readme]
    if missing:
        raise AssertionError(f"README is missing verified strings: {missing}")

    stale = ["7,326", "7,324", "7,318", "5,829 distinct", "1.4 MB"]
    present = [text for text in stale if text in readme]
    if present:
        raise AssertionError(f"README still contains stale numbers: {present}")

    print("OK: README numbers match the committed catalog")
    for key in expected:
        print(f"  {key}: {actual[key]}")


if __name__ == "__main__":
    try:
        main()
    except AssertionError as error:
        print(f"FAIL: {error}", file=sys.stderr)
        sys.exit(1)
