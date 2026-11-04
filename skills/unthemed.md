# Unthemed

## Rules

- Quote mixed-case column names with double quotes.
- Trim and lowercase text values before comparing.
- Treat `'Y'` and NULL as flags, not booleans.
- Do not guess a column that is not listed.
- Use LIMIT on exploratory queries.

## Test

- Dataset: `4306032c-9e6e-41fa-84fe-9fcb26c7a116`
- Source: https://data.telangana.gov.in/sites/default/files/uploaded_resources/hyd_sef_2018_12_0.csv
- License: missing
- Bytes: 53820242

| Resource | Format | Bytes | Probe |
|---|---|---|---|
|  |  | 7688606 | ok |
|  |  | 7688606 | ok |
|  |  | 7688606 | ok |
|  |  | 7688606 | ok |
|  |  | 7688606 | ok |
|  |  | 7688606 | ok |
|  |  | 7688606 | ok |

Columns: `district` (7), `mandal` (7), `village` (7), `establishment_name` (7), `employer_name` (7), `category_name` (7), `nature_of_business` (7), `male` (7), `female` (7), `total_employees` (7), `commencement_date` (7), `applied_date` (7), `approved_date` (7), `status` (7)

