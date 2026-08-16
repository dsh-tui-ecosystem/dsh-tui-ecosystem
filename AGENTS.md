# dsh-tui-ecosystem — workspace rules

This folder is the local workspace for the `dsh-tui-ecosystem` GitHub
organization (community plugins, templates, and listings around
`@deepseek-harness-tui/dsh-tui`). The core dsh-TUI repository is **never
migrated here**; it stays at `ccch1mneyyy/dsh-TUI` and is only linked.

## Target areas

- `plugin-template/` — the plugin scaffolding repo; its own git repository.
- Future community plugin repos live as sibling folders, each its own git repo.
- The root `README.md` doubles as the GitHub organization profile README.

## Rules

1. Each subfolder that will become a GitHub repo is its own git repository;
   never commit one repo's files inside another.
2. Follow the plugin contract in the core repo's `docs/plugins.md`
   (ESM-only, `.js` import suffixes, `name`/`Config`/`apply` shape,
   log-only session events with type registration, MIT license).
3. Keep the core package as the single authority: no forks of the core here,
   no re-implementations of DSH services.
4. Do not publish, tag, commit, or push without an explicit user request.
5. Package names follow `@dsh-tui-ecosystem/<name>` (verify npm availability
   before publishing).
