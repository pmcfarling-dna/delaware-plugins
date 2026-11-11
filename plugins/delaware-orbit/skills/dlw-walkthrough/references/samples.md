# Sample requirements

For a developer who arrives without a requirement of their own. They pick one
and go with it. Each is written the way a business user would say it, so the
intake in step 2 has real work to do: **read the requirement out as written,
and nothing below it.** The rest is for you, the guide.

None of these is banked in Orbit. They stay as text here until a developer
picks one, and then the developer's own intake banks it.

**The objects named below are where to start looking, not facts about the
developer's system.** They were found on one S/4HANA system; release
state, what exists and what data there is differ by system and release. The
intake reads each one on the developer's own system (repository search, CDS
view info, a row count) before relying on it. If one is missing or not
released there, that is a finding for the intake, not an error in the
sample.

---

## 1. Late deliveries from suppliers (a report on CDS)

> "Every Monday I ring round suppliers about deliveries that are late, and I
> build the list by hand from the purchase orders. I'd like to open a list of
> everything that should have arrived by now and hasn't, by supplier, with how
> many days late, so I can start with the worst ones."
> — a buyer

- **Likely shape:** a report (`R`, kind `abap`): a CDS view on the purchase
  order item and its schedule lines, shown as a Fiori elements list.
- **Where to look:** `I_PurchaseOrderItemAPI01`,
  `I_PurOrdScheduleLineAPI01` and `I_Supplier`, all released for cloud use
  where found. Count the schedule lines past their delivery date with less
  received than ordered: with none, there is nothing to show.
- **Thin slice:** the CDS view and a list of late items with days late; no
  sorting by "worst", no supplier grouping.
- **What it shows of the method:** grounding. "Late" and "arrived" sound
  obvious and aren't: delivery date versus goods receipt, partial deliveries,
  the deletion indicator and the "delivery completed" flag. The intake turns
  each into a business question, and the released views decide what can be
  read at all.

## 2. Notes on suppliers (a Fiori app)

> "Our buyers keep notes about suppliers in their own spreadsheets: who to
> call, what went wrong last time, what was promised. When someone is off,
> nobody can find them. I'd like one place in SAP where any buyer can see and
> add notes against a supplier, with who wrote it and when."
> — a purchasing lead

- **Likely shape:** two builds: the backend (a custom table and a RAP
  business object keyed by the supplier, kind `abap`) and the app (`U`, kind
  `ui5`, Fiori elements), linked with `depends_on`.
- **Where to look:** `I_Supplier` (released for cloud use where found) as the
  root's standard object.
- **Thin slice:** the backend only, with the list and object page through
  the service binding's preview; the `U` build is named and left for later.
- **What it shows of the method:** the design defaults. The data model's
  root (the standard supplier joined to our notes, not a free-standing UUID
  table), the screen, the validations (a note with no text is refused), and
  one person row per scenario. It also shows why a UI5 app on a new backend
  is two builds.

## 3. Stop a delivery date years in the future (an enhancement)

> "People mistype delivery dates on purchase orders: 2062 instead of 2026,
> that kind of thing. Then the order sits there for decades and nobody chases
> it. When someone saves a purchase order, no item should be due more than
> five years after the order was created, or SAP should tell them which item
> is wrong and not let it through."
> — a procurement manager

- **Why not "no delivery date":** SAP already refuses a purchase order item
  without a delivery date, so that rule has nothing left to build. This one
  does.
- **Likely shape:** an enhancement (`E`, kind `abap`): an implementation of
  the BAdI `BD_MMPUR_FINAL_CHECK_PO` ("Check of Purchase Order Before
  Saving").
- **Where to look:** `BD_MMPUR_FINAL_CHECK_PO`, where found in enhancement
  spot `ES_MMPUR_PROCESS_PO_CLOUD` (package `APPL_MM_PUR_PO_EXT`), with its
  interface `IF_EX_MMPUR_FINAL_CHECK_PO` released for C1. Its one method, `check`,
  gets the header (`purchaseorder`, with `creationdate` and
  `purchaseorderdate`), the items, and their schedule lines (each with
  `schedulelinedeliverydate`), and returns `messages`, which is how a save is
  refused. SAP's example implementation is `CL_EXM_MMPUR_FINAL_CHECK_PO_CE`.
  Check that purchase orders exist to test against.
- **Questions the intake should raise:** which date is "created": the
  creation date SAP stamps, or the purchase order date the buyer can change?
  Is it every schedule line or only the item's first? Exactly five years, and
  what about 29 February? Does changing an old order re-check its existing
  lines? Each is a business question with a business answer.
- **A trap the intake should catch:** the neighbouring BAdI
  `MM_PUR_S4_PO_CHECK_ALL_ITEMS` sounds right but can't refuse a save. Its
  interface's only method, `recalculate_items`, sets a flag to recheck all
  items and returns no messages. If the intake reaches for it, its own read of
  the interface should send it to `BD_MMPUR_FINAL_CHECK_PO`. Let it find this;
  don't tell the developer up front.
- **Test data** (from an end-to-end run):
  - SAP proposes a delivery date from the info record's lead time, which is
    why an empty date never reaches the BAdI.
  - The plant's factory calendar has a last year, and SAP itself refuses a
    date after it. Read the calendar's range and test with a date inside it
    that is still more than five years out.
  - If `BAPI_PO_CREATE1` fails or dumps on the system, create test orders
    with EML on `I_PurchaseOrderTP_2`, or by hand in ME21N.
  - If the plant's orders are under version management, changing one in
    ME22N asks for a reason for change.
- **Thin slice:** the one rule (a schedule line's delivery date more than five
  years after the chosen date), one message; no exceptions by document type.
- **What it shows of the method:** released extension points only, chosen by
  reading what each one can actually do, not by its name. Block or only warn
  is a business decision the intake asks, in business words. The reviewer
  checks the build against that decision.

## 4. Product data for the warehouse partner (an interface)

> "Our warehouse partner keeps asking us for product details by plant
> (weights, units, which plant stocks what) and we email them a spreadsheet.
> They'd like to fetch it themselves whenever they need it."
> — a logistics coordinator

- **Likely shape:** an interface (`I`, kind `abap`): a read-only OData V4
  web API service on released product views.
- **Where to look:** `I_Product` and `I_ProductPlantBasic`, both released for
  cloud use where found.
- **Thin slice:** one entity (product with its plants), read-only, published
  and answering a GET; no filtering beyond what OData gives by default.
- **What it shows of the method:** acceptance that a tool can prove. The rows
  are a GET on the published service and a count against the source, which
  the reviewer re-runs itself. It also shows the authorisation section: who may
  call the service and which plants they may see.

## 5. Check a sales order before it is saved (an enhancement, spare)

> "Customer service sometimes saves a sales order with a requested delivery
> date in the past. I want SAP to stop that at save and say why."
> — a customer service lead

- **Likely shape:** an enhancement (`E`, kind `abap`): an implementation of
  `SD_SLS_CHECK_BEFORE_SAVE` (enhancement spot `ES_SD_SLS_EXTEND`, package
  `ERP_SD_EXT_SLS`).
- **Where to look:** the BAdI's interface `IF_SD_SLS_CHECK_BEFORE_SAVE`,
  released for C1 where found. Its method `check_document` gets the header
  and returns `messages`, so it can refuse a save. `I_SalesDocument`
  (released for cloud use where found) for test orders.
- **Thin slice:** the one check on the header's requested delivery date.
- **What it shows of the method:** the same as sample 3 on another process.
  Use it when two developers at one table both want an enhancement.
