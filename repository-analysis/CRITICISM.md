# Remaining issues and simplification opportunities

## Remaining Issues

- **Fragile availability detection:** `src/lib/scalp.ts` treats missing sold-out text on HTTP 200 as a candidate. A layout change or challenge page can produce false positives; fixed URLs cannot discover replacement product pages. Add positive product/stock checks and an explicit unknown state; where needed, extract product links from relevant listings. Actual historical misses remain unverified.
- **Notification delay and repetition:** `scalpAll` visits URLs sequentially, waits after each navigation, and emails only after the full batch. There is no persisted alert state, so unchanged candidates can generate repeated emails. Send validated candidates sooner and retain minimal last-seen state if repetition was a practical problem. No measured latency or alert-volume data is available.
- **Incognito option is ineffective:** `src/util/settings.ts` assigns `settings.cla.incognito`, but `src/lib/browser.ts` reads `settings.incognito`. The cron wrapper's `--incognito` therefore leaves the persistent-context branch selected. Read the same setting in both places and verify the launch path.
- **Sensitive logging:** environment values and settings containing secrets are logged in `src/util/secret.ts` and `src/util/settings.ts`. Redact credentials before logging or error reporting and review existing runtime logs before sharing.
- **Incomplete operational setup:** `setup.sh` targets the starter and references a missing `cronfile`; Docker defines no monitoring service and does not explicitly install the configured system Chrome executable. The email sender is hardcoded in `src/lib/email.ts`. Provide a minimal monitoring-specific setup and configurable authorized sender before reuse.
- **Lifecycle and guard weaknesses:** the browser/context is never explicitly closed in `src/script/scalp-all.ts`; termination relies on `process.exit`. The process snapshot guard is not atomic, and its retry sleep is not awaited (`src/lib/tools.ts`). Use `try/finally` cleanup, await retries, and prefer a scheduler-level lock if overlap prevention matters.
- **Unverified behavior and screenshot dates:** no implemented tests cover the heuristic or error paths. `getStringDateTime` uses zero-based `getMonth()`, mislabeling screenshot directories by one month. Add focused fixture tests for stock, sold-out, changed-page, and navigation-failure cases, and correct the date conversion.

## Simplification Opportunities

The monitor does not use the scaffold's API, SQL, Redis, or general HTTP-fetch utilities. A monitoring-only configuration and dependency set would remove unrelated credential requirements, native dependency installation burden, and misleading deployment instructions. Keep the existing one-shot scheduling model unless a verified requirement justifies a long-running service.
