# SAP tooling for ui5 and cap builds

Read this before building or reviewing a `ui5` or `cap` build. These are SAP's
own tools, pinned so every developer and reviewer runs the same version.
`delaware-build` is for ABAP and doesn't apply here.

## The pins

Read on 2026-11-11 from npm, each version's release notes, and the
repositories named; each MCP server was started at its pin and its tools
listed. **Change a pin only on purpose:** read the new version's release
notes, change it here, and say so in the commit. SAP's own READMEs install
with an unpinned `npx -y`; don't copy that.

| Tool | Pin | Node | Server name |
|---|---|---|---|
| Fiori MCP server, `@sap-ux/fiori-mcp-server` | 1.15.24 | 22 or later | `fiori-mcp` |
| UI5 MCP server, `@ui5/mcp-server` | 0.3.3 | 20.17 or later in the 20 line, or 22.9 or later | `ui5-mcp-server` |
| CAP MCP server, `@cap-js/mcp-server` | 0.1.0 | not stated | `cds-mcp` |
| CAP Skills (`cap-developer`, marketplace `capire/skills`) | commit `b6866e8` (no tags; only a `.gitattributes` file since) | n/a | n/a |

Node 22.9 or later covers all of them.

**Fiori stays on 1.15.24:** from 1.16.0 to 1.16.2, its `search_docs` answers
"Search is currently unavailable. The embeddings service failed to
initialize." (tried on 2026-11-11; 1.16.0 upgraded the embeddings library).
Before moving the pin, run `search_docs` on the new version.

**CAP's `search_docs` fails on Linux, WSL included,** at 0.1.0 and 0.0.8 alike
(tried on 2026-11-11 with an empty npm cache): "Failed to provision embedding
model". The install holds two copies of `onnxruntime-node` (1.31.1, and 1.30.0
under `@huggingface/transformers`), and the second can't load beside the
first. `search_model` is unaffected. Until SAP fixes it, read the CAP
documentation at https://cap.cloud.sap/docs/ instead, and say so in the
evidence. Windows and macOS were not tried.

## How you get them

- **Claude Code with delaware's `delaware-orbit` plugin:** the plugin starts
  the three MCP servers at these pins, with the Fiori MCP server's telemetry
  off. Nothing else to install. Check with `/mcp`.
- **CAP Skills, for a `cap` build:** a separate plugin, installed once:
  `claude plugin marketplace add capire/skills`, then
  `claude plugin install cap-developer@cap`. It isn't a dependency of
  `delaware-orbit`, because a missing marketplace would stop the whole plugin
  loading.
- **Any other client, or without the plugin:** add each server yourself, at
  its pin, under the server name above:
  - `claude mcp add --scope user fiori-mcp -e SAP_UX_FIORI_TOOLS_DISABLE_TELEMETRY=true -- npx -y @sap-ux/fiori-mcp-server@1.15.24 fiori-mcp`
  - `claude mcp add --scope user ui5-mcp-server -- npx -y @ui5/mcp-server@0.3.3`
  - `claude mcp add --scope user cds-mcp -- npx -y @cap-js/mcp-server@0.1.0`

  Other clients take the same `npx` command in their own MCP configuration.

**SAP's UI5 plugin** (`ui5@claude-plugins-official`) is optional, for its UI5
best-practice skills. It starts its own UI5 MCP server, pinned by SAP (0.3.3
on 2026-11-10, the same as ours). Ours is the one that counts for evidence.

## Which tool for what

- **A new Fiori elements app:** the Fiori MCP server's app generator. Prefer it
  to the SAP Fiori tools generators in the IDE, which an agent can't drive as
  well.
- **UI5 code, API documentation, guidelines, the UI5 linter**
  (`run_ui5_linter`) **and manifest validation** (`run_manifest_validation`):
  the UI5 MCP server. Read `get_guidelines` before writing UI5 code.
- **Fiori elements and the Flexible Programming Model:** the Fiori MCP
  server's `search_docs`, and its functionality tools (`list_functionality`,
  `get_functionality_details`, `execute_functionality`) to change an app's
  pages and annotations rather than editing them by hand.
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
- **CAP MCP server:** it is pre-1.0 (0.1.0), so expect changes between
  versions. It searches the CAP documentation with embeddings. Since 0.1.0 it
  downloads its embedding model on demand into `~/.cds/models`, and falls back
  to local embeddings if the download fails; on a closed network, expect the
  fallback.

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
