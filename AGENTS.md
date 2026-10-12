# Code Flex Project Instructions

## Permanent Architecture Rules

1. Next.js 16 App Router only.
2. Preserve TypeScript strictness.
3. React Server Components are the default.
4. Add `"use client"` only when browser interactivity genuinely requires it.
5. Customer UI must be mobile-first.
6. Customer-facing performance on weak/slow internet is a primary architectural requirement.
7. Avoid unnecessary JavaScript and dependencies.
8. Do not add Redux.
9. Do not add Redis unless explicitly requested later.
10. Do not add Elasticsearch unless explicitly requested later.
11. Do not create a separate Express/Nest/backend service.
12. Do not introduce customer authentication.
13. Do not introduce carts.
14. Do not introduce payment gateways.
15. Do not introduce wishlists.
16. Do not invent the final visual design.
17. Never commit secrets.
18. Environment secrets must remain server-side unless explicitly intended to be public.
19. Avoid unrelated refactoring.
20. Every future task must preserve the established architecture unless explicitly instructed otherwise.

## Acceptance Verification

For every major task, implementation is complete only when its runnable PowerShell verifier exists and reports `PASS`, `FAIL`, or `BLOCKED`. Static inference alone cannot produce a Production PASS. Production mutations require explicit opt-in and must clean temporary data by exact IDs. Keep manual QA to subjective visual or UX checks that cannot be safely automated.

## Database Architecture

- Use Prisma ORM 7 with PostgreSQL/Neon.
- Store monetary amounts and exchange rates as integers; never use floating-point types for money.
- Store analytics as raw timestamped events rather than daily, weekly, or monthly counter tables.
- Use conservative deletion behavior so dependent cleanup never erases independent or historical business records.
- Orders and analytics must survive Product deletion; their nullable Product references use `SetNull` while historical snapshots and events remain intact.

## Future Application Context

This context is informational only. Do not implement these features until a future task explicitly requests them.

- Public storefront
- Admin dashboard
- Products
- Nested categories
- Laptop-specific filtering
- USD and SYP prices
- Orders/leads
- Business analytics
- Cloudinary images
- Arabic default + English support
- Fully responsive mobile experience

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
