# delaware plugins for Claude Code

delaware's method for SAP development, as a Claude Code plugin:
`delaware-orbit`.

**Generated** from delaware's Orbit repository. Don't edit here; changes
made here are overwritten.

## What you get

- **Skills**
  - `/dlw-orbit`: take in a new piece of SAP development work, draft its
    spec grounded in your own system, bank it in Orbit, and track it to
    sign-off.
  - `/dlw-walkthrough`: a guided walk through the whole method on one
    requirement of your own, step by step.
- **Agents**, each with one job:
  - `orbit-spec-writer`: drafts the spec from the requester's words;
  - `orbit-spec-reviewer`: reviews it, read-only;
  - `orbit-coder`: builds exactly what the approved work package says;
  - `orbit-code-reviewer`: checks the build on the system, read-only.

- **SAP's MCP servers** for UI5, Fiori and CAP builds, started by the
  plugin at versions delaware has checked: the Fiori MCP server (with its
  telemetry off), the UI5 MCP server and the CAP MCP server. They need
  Node.js 22.9 or later. For CAP builds, also install SAP's CAP Skills:
  `claude plugin marketplace add capire/skills`, then
  `claude plugin install cap-developer@cap`.

## What you need

The **delaware MCP server**, added under the name `delaware-mcp`. The
agents call its tools by that name. delaware gives you its address.

```
claude mcp add --transport http --scope user delaware-mcp <address>
```

Then sign in from `/mcp` in Claude Code. Every tool acts as you, under your
own SAP authorisation.

## Install

```
claude plugin marketplace add pmcfarling-dna/delaware-plugins
claude plugin install delaware-orbit@delaware-plugins
```

Restart Claude Code, or run `/reload-plugins`, then type
`/dlw-walkthrough`.

## Update

```
claude plugin marketplace update delaware-plugins
claude plugin update delaware-orbit@delaware-plugins
```
