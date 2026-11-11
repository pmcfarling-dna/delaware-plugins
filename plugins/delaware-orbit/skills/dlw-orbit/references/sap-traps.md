# SAP lookup traps

Read this when grounding a spec against the system. Each entry is a way an SAP
read gives a wrong or empty answer that looks right. Most were learned by Orbit
Lite (a delaware colleague's Copilot skill set, 2026-09-30) and are restated here in short form.

## Reading the system

- **Record the system context once, then reuse it.** That means the system, the
  logon client, the client's category (`T000.CCCATEGORY`: C customizing, T test,
  P production) and the release (`CVERS` for `S4CORE` and `SAP_BASIS`, raw
  values). Report raw values beside any product name. **Don't map a release
  number to a product name from memory.**
- **Name the client** on every configuration value. The connector reads its logon
  client, which is often a test client rather than the customizing or production
  client the design depends on.
- **Internal values, not external ones.** A field with a conversion exit
  (`DD01L.CONVEXIT`) is stored in its internal form. Some examples:
  - sales order type OR is stored as TA (mapped in `TAUUM`);
  - document numbers carry leading zeros (ALPHA);
  - material numbers use MATN1.

  Querying with the value a user sees returns nothing, which looks like "not
  found". Convert first, and write both in the spec: "OR (internal TA)".
- **Dictionary tables** (`DD01L`, `DD03L`, `DD04T`, `DD07T`, `DD08L`, `DD26S`) hold
  several versions. Filter `AS4LOCAL = 'A'` for the active one, or you get
  duplicates.
- **Read configuration and metadata, never business data.** Customer, supplier,
  employee and price data don't belong in a spec. A count is enough when volume
  matters.

## `adt_sap_data_preview`

- One ABAP SQL `SELECT`, **255 characters at most** (a run of whitespace counts
  as one). A longer statement is refused rather than silently changed. Shorten
  it with aliases, or use `get_contents` with `sqlFilter` on one narrow table.
- **Never put `MANDT` in a join condition.** The client is handled for you, and
  the query fails if you add it.
- **Always set `maxRows`.** `truncated: true` means more rows exist: say so, and
  never present part of a list as the whole list.

## Finding objects

- **Repository search is prefix-anchored.** An empty result from `ABC*` is not
  proof of absence, so search `*ABC*` before calling a name free.
- **Search for BAdIs without `objectType` first,** then read each result's
  `type`. The type filter matches the *container*, so `ENHS` with a guessed spot
  prefix finds nothing, and `SXSD` finds only classic BAdIs. The result types
  are:
  - `SXSD/XD`: a classic BAdI;
  - `ENHS/XSB`: an enhancement spot;
  - `ENHS/XB`: a new BAdI;
  - `CFDA`: the same BAdI offered for key-user logic.

  A new BAdI's interface is usually `IF_<BADI>`.
- **Reuse before you add.** `adt_sap_code_search` finds customer code that already
  reads that view, calls that API or implements that BAdI. Filter it to customer
  packages, because native search covers SAP standard too. **A search with no
  hits is not proof that the code doesn't exist:** the native index is
  incomplete by design, and the response says so.
- **Released successors.** `adt_sap_table_getMetadata` with `includeCdsViews: true`
  returns the released views over a table and its deprecation successor. A
  release state is always read with `includeFullReleaseState`/
  `includeReleaseStatus`, never assumed. Custom code needs **C1**.
- **Wide tables** return every field. Cite only the fields the requirement
  needs.
- **OData:** call `adt_sap_odata_getMetadata` with `summary: true` first.
  `/IWFND/MED/170` "No service found" means the service is **not activated**.
  That makes activating it a prerequisite in the spec, not a reason to pick
  another API.

## Authorisations, configuration paths, documentation

- **Which authorisation objects a transaction checks:** `USOBX_C` (SU24,
  `OKFLAG = 'Y'`) is the better source. `TSTCA` holds only the start
  authorisation and is often empty.
- **The SPRO path behind a view or table:** follow the chain
  `CUS_ACTOBJ` → `CUS_IMGACH` → `TNODEIMGR`/`TNODEIMG`, walking up to the
  structure titled "SAP Customizing Implementation Guide".
  - **Picking the structure:** an activity appears in several structures. Pick
    the one with an application-area text.
  - **If the walk can't be finished:** give the part you verified and mark the
    rest "verify in SPRO".
- **Read SAP's own documentation inside the system first,** since it matches the
  installed release exactly. `DOKHL` gives the latest version and `DOKTL` the
  lines:
  - use `ID 'HY'` for IMG activities and `ID 'DE'` for data elements;
  - the lines are SAPscript, so strip the tags;
  - summarise it, and never paste it into the spec.
- **Key-user custom fields** use the system's configured prefix (`YY1_` by
  default). Read the prefix from the system. The fields appear in `DD03L` and in
  the `*_INCL_EEW_PS` extension include.
- **IDoc segment structures** have no data elements in `DD03L`. Field texts come
  from `EDSAPPL` joined to `DD04T`.
- **SAP Notes:** use the `sap-notes` MCP. **Never cite a note number you have not
  fetched.**
