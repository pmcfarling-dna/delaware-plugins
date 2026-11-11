# App design defaults

Read this when drafting `## Usage` and `## Design` for anything with a screen
or stored data: a Fiori app, a RAP business object, a custom table maintained
by users. These are the defaults you propose. The requester corrects them; you
don't ask them to invent a design.

Each rule names the delaware KB entries that show it in code. Read them with
`kb_get_doc` (by `source_ref`) before you write that part of the design; they
are the reference, not your memory.

They exist because a spec that names only fields and permissions ("browse
suppliers, create/read/update/delete notes") leaves the shape to the
developer's generator. The generator's default is one flat table with a UUID
key and nothing mandatory: a blank-record generator, whatever the field list
says.

## Usage first

Write who uses it, when, and 2–3 scenarios, each starting a line with `U1`,
`U2`, …:

- **Who:** the role, not a person.
- **Trigger:** what makes them open it ("a supplier missed a delivery").
- **Steps:** what they do, in their words.
- **Expected result:** what they see when it worked.

The scenarios decide the design. "The buyer finds the supplier, then adds a
note" means the supplier is what they navigate by: its object page is the
screen, and the notes are a table on it.

## Data model

1. **Our own data on a standard object: choose by usage** (the author's
   ruling of 2026-10-16, which replaces the earlier UUID-keyed header). When
   the app adds data to a standard business object (sales order, purchase
   order, supplier, material), ask how the app is used:
   - **(a) Root on the standard object**, when the app works across the
     standard data: the user browses sales orders, and our data sits beside
     each one.
     - The root view reads the released view (C1, read from the system) with
       a 1:1 left outer join to our own table, keyed by the standard
       object's key.
     - Managed with an unmanaged save, which writes our half only and never
       touches SAP's.
     - Every row is an existing standard object, so a duplicate header can't
       arise.
     - For draft, the root declares `internal create; update; internal
       delete;`.
     - Total etag: our table's last-changed timestamp, read through the join
       (to be verified on a system; a standard object with no row of ours
       has none yet). If it can't be used, concurrency rests on the draft
       lock and the children's etags; say which in the spec.
   - **(b) Our own header table**, when our data is the exception: a small
     subset of the standard data it enriches (notes on 2 or 3 of 500,000
     sales orders). The app reads only our rows, not the whole standard
     table.
     - The header table is keyed by the standard object's key (client plus
       sales order), **never a UUID**. It can't hold two rows for one
       object, and RAP locking stops a second creator, so no duplicate
       check or unique index is needed.
     - The standard key is entered at create, with a value help and an
       existence check, and can't be changed after.
     - The standard object's fields are joined in on the root view,
       read-only, through a to-one association to its released view.
     - Managed, with draft. Add `with additional save` only where something
       must happen beyond the tables.
     - Total etag: the header's last-changed timestamp (the field annotated
       `@Semantics.systemDateTime.lastChangedAt`), never a key: a key never
       changes, so it detects nothing.
   - **In both:**
     - Our data hangs under the root as composition children, at any depth,
       each created through its association (notes under the sales order),
       each in its own table keyed by its parent's key plus its own.
     - Draft at every level. The root is the lock master.
     - Say where each part is stored, and which pattern you chose and why,
       in the requester's words about usage.
     - A UUID-keyed header for data on a standard object is a defect: it
       allows two headers for one object.
     - Never let the standard key be typed as free text on our data with no
       check. That is how a blank record with no sales order gets saved.
   - KB (being updated to this ruling; where an entry still shows a UUID
     header, this guide wins):
     `sap-development/rap-patterns/rap-read-only-released-root-with-custom-child.md`
     (pattern (a));
     `sap-development/rap-patterns/rap-additional-vs-unmanaged-save.md` and
     `sap-development/rap-patterns/rap-choose-implementation-type.md` (the
     save);
     `sap-development/rap-patterns/rap-create-child-through-parent.md` and
     `sap-development/rap-patterns/rap-composition-parent-child-grandchild.md`
     (the children; read both);
     `sap-development/rap-patterns/rap-etag-and-total-etag.md` and
     `sap-development/rap-patterns/rap-locking-master-and-dependent.md`
     (lock and etag).
2. **No data of our own on a standard object** (a table of our own that
   stands alone): a managed root on our table, with draft. Use an unmanaged
   business object only as a last resort.
3. **Every key and foreign key** that a user sees or enters:
   - uses the data element whose domain carries the conversion (for example
     ALPHA, so `1000` and `0000001000` are the same supplier);
   - has a **value help** from a released view;
   - has an **existence check** on save, so an unknown key is refused.

   KB: `sap-development/rap-patterns/rap-validate-a-foreign-key.md` (existence
   check and simple value help);
   `sap-development/rap-patterns/rap-value-help-with-additional-binding.md`
   (a value help that filters by, or fills, other fields).
4. **Every association shown as a list column is to-one.** Name the key that
   makes it to-one. A supplier has many purchasing organisations, so the
   purchasing data is a section or a filter on the object page, not a column
   on the list.

## Screen

- **List:** the columns, the filters and the default sort.
- **Object page:** the header (what identifies the record), the sections, and
  the actions.
- **Each field appears once.** A key shown in the header is not repeated in a
  section.
- Say which fields are read-only. Everything joined in from the standard
  object is.
- On a standard object, the object page is the root's: the standard
  object's data, read-only, and our children as tables you can create in.
  In (a) the list is the standard data; in (b) it is only our rows.

## Required fields and validations

- Mark every mandatory field.
- List every check on save: mandatory fields filled, each foreign key exists,
  any rule between fields.
- On a standard object: in (b) the standard key exists and is entered at
  create only. No duplicate check is needed in either pattern: (a) has one
  row per standard object, and (b) is keyed by the standard key.
- Say what a determination fills: the read-only standard data and any
  status.
- **A record with only a generated key can't be saved.** Say which field
  makes it meaningful (the note text, for a note).
- Say what fills itself in (created by, created on, changed by, changed on)
  and that the user can't edit those fields.
- KB: `sap-development/rap-patterns/rap-mandatory-and-readonly-fields.md`;
  `sap-development/rap-patterns/rap-administrative-fields.md` and
  `sap-development/rap-patterns/rap-determination-on-modify-or-save.md`.

## Authorisation

Always state a decision. "None in this version, because …" is a decision. An
empty global authorisation left by a generator is not. If records are
restricted by an organisational field (plant, purchasing organisation),
name the field.

On a standard object, in (a) and (b):

- The root is `authorization master ( global, instance )`. Both run the
  standard object's authority check (for example the supplier's). Global
  covers create.
- An on-save validation on the root repeats that check, because activating
  a draft calls no authorisation method.
- The children are `authorization dependent` by the root.

KB: `sap-development/rap-patterns/rap-authorization-global-instance-precheck.md`.

## Acceptance

- One `person` row per scenario. Its criterion names the scenario: `U1: the
  buyer finds supplier 1000 and adds a note; it shows with their name and the
  time`.
- Rows for what must be **refused**: saving an empty record; an unknown key;
  editing a read-only field.
- Tool rows for what a tool can prove: `adt_sap_cds_getViewInfo` for release
  state, `adt_sap_http_raw` for the service answering.

## Not applicable

Forms, interfaces and background jobs often have no screen or no stored data.
Write "Not applicable" under that Design part and say why. Never drop the
heading.
