# Evidence and review notes

## Scope and screening

**Concise analysis.** The repository is a small original monitoring experiment layered on starter code. Fourteen commits after the initial scaffold demonstrate project-specific implementation; it is neither an empty repository nor merely unchanged configuration.

Inspected all 15 locally available commits, `main`, `origin/main`, and `origin/HEAD` (same tip); there are no local tags or additional branch histories. No remote fetch or external research was needed. Inspected root README, package manifests, TypeScript configuration, source and type declarations, shell scripts, environment example, Docker files, SQL, and test directory. No previous analysis directory existed. A pre-existing change to `.vscode/settings.json` was left untouched. Analysis describes HEAD plus the inspected working tree; that editor change is not part of the implementation analysis.

No dependencies were installed and no repository programs, builds, lint scripts, browser requests, or email sends were executed. The test directory contains only `.gitkeep`; Jest is declared but no tests or execution results are present. Root README contains no images.

## Claim ledger

| Claim | Evidence | Confidence |
| --- | --- | --- |
| Monitoring is original work layered on a starter; broader scaffold authorship is unverified. | Initial commit `9726965` has starter README and package identity; `666ee1e` adds browser modules; `203f1bd` adds `scalpAll`. | High for the differentiation; medium for personal attribution based on history and owner context. |
| Seven active URLs across six retailers target PS5 availability. | `src/config/config.ts`, `inputWebsites`; additions in `0490e09` and replacements in `d40e768`. | High; commented-out retailer excluded. |
| Detection is an absence heuristic gated on HTTP 200, not positive purchase availability. | `src/lib/scalp.ts`, `scalpWebsite`; `fbd5d1c`. | High; direct condition. |
| A shared page checks URLs sequentially and captures screenshots; candidates are emailed in one batch. | `src/lib/scalp.ts`, `scalpAll`; `src/script/scalp-all.ts`, `main`; `src/lib/email.ts`, `sendEmail`; `c9ef676`, `1dcc18e`. | High for implementation; successful execution not established. |
| A cron-oriented wrapper exists and overlap checking was integrated. | `run-once.sh`, `ff32f5b`; `src/lib/tools.ts`, `throwIfAnotherInstanceRunning`; `09953fc`. | High for code; no installed crontab or cadence evidence. |
| PostgreSQL, Redis, Express API, and Docker scaffolding are not the stock-check architecture. | `src/script/api.ts`, `src/lib/app.ts`, `src/lib/db.ts`, `src/lib/redis.ts`, `src/sql/db.sql`, `docker-compose.yml`; compare monitoring imports. | High; no DB/Redis connection on monitoring path, although unrelated credentials are required at startup. |
| Project is personal and currently inactive. | Owner describes an old personal purchasing attempt; latest observed commit is in 2021. | Medium; no verified cessation date. |

## Timeline basis

Earliest observed author and committer timestamp: `9726965`, 2021-05-09T09:31:41+03:00. Latest: `09953fc`, 2021-05-13T10:24:31+03:00. Both date fields agree throughout available history.

- May 9: scaffold, Playwright (`666ee1e`), iteration (`203f1bd`), email (`59549a9`), attachments (`c9ef676`), per-run screenshots (`2345afd`), cron wrapper (`ff32f5b`).
- May 12: screenshot date formatting (`beeb965`), another retailer (`0490e09`), HTTP filtering (`fbd5d1c`). The date-format change still leaves a zero-based month.
- May 13: retailer replacements (`d40e768`), process guard integration (`09953fc`).

No commits dated May 10–11 are available. No inference of continuous work, actual start/end dates, deployment duration, or employment is made.

## Owner recollections cross-check

- **2021 PS5 notification attempt:** supported by Git dates, configured products, and email subject/body.
- **New pages may have caused missed stock:** consistent with fixed URLs and no link discovery. One DNS URL is a catalog search page, so the configuration is not exclusively individual product pages. Whether retailers actually created new pages, or this was the dominant failure cause, cannot be established here.
- **Some detections arrived too late:** plausible with sequential visits, roughly 4.758–7.246 seconds of deliberate delay per visit, and email sent only after the batch. No latency measurements or stock-event logs establish timing or competing buyers' actions.
- **Possibly local crontab:** supported as intent by the wrapper and commit message, unverified as deployment. `setup.sh` references an absent `cronfile` and targets the starter project.
- **No PS5 bought using this method:** retained as explicitly attributed owner report; no checkout, purchase record, saved alert, or delivery log independently verifies the outcome.

## Uncertainties

1. Actual schedule, local machine setup, operating duration, alert delivery, and useful detection rate are unknown.
2. No retained screenshots/logs show whether a candidate represented genuine stock, a changed page, or a challenge page.
3. Exact personal ownership of the starter scaffold and its upstream licensing should be confirmed before attributing or publishing the whole codebase. Package metadata identifies a starter repository and declares ISC, but no standalone license file is present.
4. Remote URL comes from local Git configuration; accessibility and publication authorization were not checked. Root README uses an older account path.

## Publication risks

No live credential file is tracked in the inspected tree; `.env.example` contains placeholders. This is not an exhaustive forensic secrets audit. Do not publish runtime logs without review: `src/util/secret.ts` logs environment values at debug level; `src/util/settings.ts` logs the settings object at verbose level, including secrets. Browser options and API request logging can also expose credentials or tokens. No secret values or personal contact addresses are reproduced here.

Docker/Express/PostgreSQL/Redis/Jest declarations are scaffold evidence, not evidence of a deployed backend, queue system, database-driven monitoring, or tested service. Public documentation must avoid claims of successful purchasing, proven detection accuracy, high scale, or reliable production operation.
