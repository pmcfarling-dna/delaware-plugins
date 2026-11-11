# SAP tooling for ui5 and cap builds

Read this before building or reviewing a `ui5` or `cap` build. These are SAP's
own tools, pinned so every developer and reviewer runs the same version.
`delaware-build` is for ABAP and doesn't apply here.

## The pins

Read on 2026-10-19 from npm and the repositories named. **Change a pin only
on purpose:** read the new version's release notes, change it here, and say
so in the commit. SAP's own READMEs install with an unpinned `npx -y`; don't
copy that.

| Tool | Install (Claude Code) | Pin | Node |
|---|---|---|---|
| Fiori MCP server | `claude mcp add fiori-mcp -- npx --yes @sap-ux/fiori-mcp-server@1.15.13 fiori-mcp` | 1.15.13 | 22 or later |
| UI5 MCP server | `claude mcp add --scope user ui5-mcp-server -- npx -y @ui5/mcp-server@0.3.2` | 0.3.2 | 20.17 or later in the 20 line, or 22.9 or later |
| CAP MCP server | `claude mcp add --scope user cds-mcp -- npx -y @cap-js/mcp-server@0.0.8` | 0.0.8 | not stated |
| CAP Skills | `/plugin marketplace add capire/skills`, then `/plugin install cap-developer@cap` | commit `b6866e8` (no tags) | n/a |

Node 22.9 or later covers all of them. Clients other than Claude Code take the
same `npx` command in their own MCP configuration.

**The UI5 plugin** (`/plugin install ui5@claude-plugins-official`) is
optional, for its UI5 best-practice skills. The marketplace decides its version
(commit `a99b882`, plugin 0.1.8, on 2026-10-19), and it starts a second UI5 MCP
server at `@latest`, unpinned. The pinned UI5 MCP server above is the one that
counts for evidence.

## Which tool for what

- **A new Fiori elements app:** the Fiori MCP server's app generator. Prefer it
  to the SAP Fiori tools generators in the IDE, which an agent can't drive as
  well.
- **UI5 code, API documentation, guidelines, and the UI5 linter**
  (`run_ui5_linter`): the UI5 MCP server.
- **CAP:** the CAP MCP server for CAP documentation (`search_docs`) and the
  compiled CDS model (`search_model`), and CAP Skills for project setup,
  modelling and upgrades. Search the CAP documentation before you change a CDS
  model or use a CAP API.
- A pattern for which MCP server to ask about which file: the `AGENTS.md` of
  SAP-samples `cap-agentic-engineered`. It is a sample only, not a standard.

## What each one does that matters at a customer

- **Fiori MCP server:**
  - It sends usage telemetry unless you opt out: set `enableTelemetry` to
    `false` in `~/.fioritools/telemetrysettings.json`, or set the environment
    variable `SAP_UX_FIORI_TOOLS_DISABLE_TELEMETRY` to `true`. Opt out on a
    customer machine unless the customer agreed.
  - Generating an app from an OData service needs a saved SAP system
    connection (SAP's Connection Manager for SAP Systems), so it holds
    credentials for the customer's system. That is the developer's own
    connection, never a shared one.
  - It logs to `~/.fioritools/fiori-mcp-server.log`.
- **UI5 MCP server:** it fetches UI5 resources from `https://ui5.sap.com`
  (SAPUI5) and `https://sdk.openui5.org` (OpenUI5). On a customer network that
  blocks them, set `UI5_MCP_SERVER_CDN_URL` to a mirror.
- **CAP MCP server:** it is pre-1.0 (0.0.8), so expect changes between
  versions. It searches the CAP documentation with embeddings computed locally.
  Its README doesn't say whether it downloads a model on first run: not
  verified, so check it before using it on a closed network.

## When a tool is missing

If a tool here isn't installed, or can't run, say so in the delivery evidence
for the row it would have proved ("UI5 MCP server not installed; linted with
nothing"). **Never fill the gap from memory**, and never report the row `pass`
on a check that didn't run.

## Evidence

Each checklist row's evidence names the tool and its version (from this table,
or the version the tool reports), the time, and what it showed. The code
reviewer re-runs the UI5 linter through the UI5 MCP server on every `ui5`
build and records the versions it used.
