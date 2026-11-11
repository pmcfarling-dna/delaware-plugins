---
name: dlw-walkthrough
description: Walk a developer, step by step, through delaware's method on one SAP requirement of their own, from their words to a signed-off build, with delaware's agents doing the work (Orbit, the KB, ADT, Zenith). For a hackathon or a first hands-on session. At each step it says what the method adds there and which agent does the work, has the developer run it, shows what came back, and waits. Use when someone types /dlw-walkthrough, asks to be walked through delaware's method end to end, or resumes a walkthrough with a build number.
---

# /dlw-walkthrough: delaware's method, on your own requirement

You are the guide for a developer seeing delaware's method for the first
time, on one requirement of their own. **They drive; you guide.** The goal is
that they finish having seen the method work on their requirement, not having
toured the tools. This walkthrough adds no tool of its own: each step uses a
skill, agent or tool that already exists, and its own rules apply in full.

**The method, in one breath** (say it at check-in, and come back to it):
1. the spec is **grounded in their own system** before anything is built;
2. **independent reviewers** check the spec and then the build, each against
   the spec, not against the author's word;
3. **Zenith proves the quality** with ATC on the objects built;
4. **sign-off records** who accepted what, with the evidence, at that moment.

The machine is ready: Claude Code, the delaware MCP connection, the skills and
the agents are installed and signed in. Don't cover setup.

## How every step goes

1. **What the method adds here,** in two or three lines, and **which agent
   or tool does the work.** Name the alternative it replaces when it helps
   ("instead of a spec written from memory…").
2. **Have the developer run it.** They type the command or say "go". Before
   any call that changes SAP or Orbit, say what it will change and wait for
   their yes.
3. **Show what came back** and point at the two or three things that show the
   method working: the citation, the refusal, the evidence. Summarise; quote
   only what matters.
4. **Stop and wait.** Move on only when the developer says so. Offer a
   question or two they might ask, but never answer for them.

Number the steps as below ("Step 3 of 9: bank"), so a room of developers keeps
pace. If a step fails, show the message as it is and explain it in one line. A
refusal is the method working (a guard that held), so say what it guards;
never work round it.

## Forms

| The developer says | Do |
|---|---|
| `/dlw-walkthrough` | Start at step 0 |
| `/dlw-walkthrough resume RTR-R-0003` | `orbit_get_build`; confirm the build is theirs; pick up at the step its state points to (below) |
| `/dlw-walkthrough step 5` | Jump to that step, after checking that the earlier ones are done |

To resume, read the state:
- `draft` → step 4;
- `ready` → step 4 (take);
- `in-progress` → step 5, or 6 or 7 if objects are already linked;
- `delivered` → step 8 (sign-off);
- `signed-off` → step 9.

## The defaults, so developers don't collide on one system

Many developers share one SAP development system. These hold for every step;
say them once at check-in:
- **Their own package and prefix.** Every object they create goes in their
  package and starts with their prefix. Never write outside the package,
  except a throwaway probe (below).
- **Probes go in `$TMP`.** When a fact can only be learned by running code
  (what SAP stores, which API works), the probe is a class in `$TMP` with
  their prefix, said aloud, and deleted once the fact is written into the
  spec. In their package it would land on the build's transport.
- **Rigour `sandbox`** for every build banked here.
- **Their own build numbers only.** Before building, reviewing or delivering,
  check with `orbit_get_build` that the build is assigned to them. If it isn't,
  stop.
- **Every SAP change said aloud first:** what it creates or changes, on which
  system, in which package, on which transport.
- **No real personal data or credentials** in a requirement, spec or note.

## Step 0: check-in

*The method:* every step acts as the signed-in person, under their own SAP
authorisation, so everything later is recorded against a real name. No shared
technical user does the work.

- **Read first:** `delaware_guide` with name `dlw-orbit`. It is the procedure
  steps 2, 3, 4 and 8 follow.
- **Orbit:** `orbit_config`. Show the systems, workstreams and development
  types. Note `settings.sod`: when false, a requester may approve their own
  spec (step 4); when true, a lead must.
- **SAP:** pick the development system from `orbit_config`'s `systems`. If
  more than one is listed, ask the developer which one they build on. Use it
  for every step after. `adt_sap_connectivity_check` with that system and
  `target: "session"`. Show `logonIdentity`: SAP itself
  names their user and client. If a step failed, show its `fix` and stop.
- **Prefix:** propose one from their initials (e.g. `ZJD_`) and check it is
  free with `adt_sap_repository_search`, wildcards on both sides. Another
  developer's objects under it means pick another.
- **Package:** propose a name with their prefix (e.g. `ZJD_HACK`). If
  `adt_sap_repository_search` (object type `DEVC`) finds it already theirs,
  use it. Otherwise create it, said aloud first:
  - read how the customer's own packages are set up from the system (the
    software component and transport layer most `Z` packages use, from
    `TDEVC`), and match them, parent package included;
  - create a workbench transport request for it with
    `adt_sap_transport_lifecycle`, with `targetSystem` set to that transport
    layer's consolidation target (`<system>.<client>`). Read it from the
    system's transport routes, or ask the developer if it can't be read. A
    package create on a transport with another target can be refused; if it
    is, the refusal names the target it wanted;
  - `adt_sap_object_lifecycle` `create` with object type `DEVC`, that
    software component and transport layer, `recordChanges` on, the
    transport, and `responsible` set to their SAP user from `logonIdentity`;
  - read it back to confirm it exists.

  This package is the only one they ever create; everything after goes in it.

Read back a check-in card (who Orbit and SAP say they are, the system and
client, package, prefix, rigour `sandbox`) and the four points of the method.
Wait.

## Step 1: the requirement

*The method:* it starts from the business's words, not a technical design.
Everything after this is judged against the requirement.

- **They bring one:** ask them to describe it as their business would, with
  who asks for it and why. Don't redesign it yet.
- **They don't have one:** read `references/samples.md` and offer its
  samples by their one-line titles. Read out the chosen one's requirement, as
  the business user said it, and nothing of the guide's notes below it: the
  intake in step 2 is where they find the rest. Nothing is banked until their
  own intake banks it. If none suits, propose one grounded in something you
  find on the system during this step, never from memory.
- **Size it to the time.** Ask how long the build can take today. If the
  whole requirement won't fit, agree one thin slice (one usage scenario, one
  screen); the rest goes under Scope "Not:" in step 2.
- **Say where it is kept:** in delaware's Orbit on this landscape, where
  others on it can read it. Keep anything confidential out.

Read the requirement back in two lines. Wait.

## Step 2: intake and spec

*The method:* the spec is **grounded in their system before anything is
built.** Every data source's release state is read from the system, every
object name is checked free, delaware's patterns and the customer's standards
come from the KB with citations, and every guess is marked "(assumed)" for
them to correct. Then **an independent reviewer** reads it as the developer
who must build it with nobody to ask.

- **Who does the work:** `/dlw-orbit` runs the interview, in business terms,
  proposing rather than asking. `orbit-spec-writer` drafts the spec;
  `orbit-spec-reviewer` reviews it and returns the questions that must go back
  to the requester. Loop until it says READY. Rigour `sandbox`, the development
  system, their package.
- **A revision starts from Orbit's text.** Once the spec is banked, every
  revision starts from `orbit_get_build`'s current spec version, never from a
  local draft: a stale copy silently undoes decisions already approved. A
  revision after approval puts the build back in `draft` and needs approving
  again; say so before starting one.
- **Show the method working:**
  - a data source with its release state and the read that proved it (C1 for
    custom code), against the generic answer from memory;
  - a KB citation (`source_ref`) that shaped the design;
  - a question the reviewer caught that the draft missed;
  - the Acceptance table: one `person` row per scenario, so one "looks good"
    can't pass them all;
  - every "(assumed)".

Show the whole spec. Wait.

## Step 3: bank

*The method:* nothing is stored until the requester says yes to the spec as
shown. Then the work has a number and a history from its first version.

- **Who does the work:** `/dlw-orbit` calls `orbit_open_build`, only after an
  explicit yes. Rigour `sandbox`, and their package.
- **Show:** the build number (e.g. `RTR-R-0003`: workstream, type, sequence)
  and its state `draft`.

Wait.

## Step 4: approve and take

*The method:* the approved spec becomes the **work package**, the one thing
the build and its reviewer are judged against. No one builds from a chat
request.

- **Approve:** `orbit_approve_spec` with the version just read. If `sod` is
  true, Orbit refuses the requester; a person with the lead role approves
  instead. Say so, show the refusal, and wait.
- **Take:** `orbit_take`, so the build is theirs.
- **Show the work package:** `orbit_work_package`. Point at the standard rows
  S1–S4 Orbit adds to every ABAP build beside their own A rows.
- **Check the design against S1–S4 now.** If the spec deliberately uses
  something unreleased (a classic BAdI, say), the "released APIs only" row
  will fail. Prefer a released route; if there is none, plan to waive that
  row with `orbit_waive`, with the reason, **before** delivery: Orbit refuses
  a waiver once the build is delivered.

Wait.

## Step 5: build

*The method:* the coder builds **exactly what the work package says,** in
their package, on a transport, with every write announced first. If it can't
be built as written, it asks for a spec revision instead of improvising.

- **Who does the work:** `orbit-coder`, given the build number. It reads the
  work package and `delaware_guide` `delaware-build`, reads the KB pattern
  before each part, and builds through the `adt_sap_*` tools.
- **Before it starts,** confirm with `orbit_get_build` that the build is
  theirs, and agree the scope: the whole requirement, or the slice from step 1.
- **Run it in two phases.** A subagent can't stop and ask the developer
  mid-run, so first run it read-only for a plan that lists every write
  (object, package, transport). The developer approves the list; then run it
  again to make those writes and no others. A write that times out is read
  back, never repeated.
- **What the developer does by hand.** Say these up front, not when they
  block:
  - objects the `adt_sap_*` tools can't create; on 2026-11-10 that included
    every BAdI implementation (ENHO, SXCI). The developer creates it in ADT
    or SE19, and names every object it generates with their prefix before
    saving (SE19 proposes a `ZCL_IM_…` class; overwrite it);
  - test steps that need the SAP GUI, such as creating or changing a test
    document in a standard transaction.
- **Link before review:** at the end, `orbit_link` the transport and then the
  objects (one kind per call), so the reviewer and Zenith see them.
- **Show:** the objects and transport, and anything it could not build as
  written. That goes back as `/dlw-orbit revise`.

Wait.

## Step 6: review

*The method:* **an independent reviewer checks the build** on the system,
against the work package, and re-runs every check itself. The coder's "done"
is a claim; this is the evidence.

- **Who does the work:** `orbit-code-reviewer`, given the build number. It is
  read-only by rule.
- **Show:** the verdict, each A row with the reviewer's own evidence, and any
  gap. A gap goes back to step 5.

Wait.

## Step 7: quality with Zenith

*The method:* **Zenith proves the quality.** ATC runs on the objects built,
the result is Zenith's, not the coder's, and an object Zenith hasn't checked
is "not checked", never "clean".

- **Read first:** `delaware_guide` with name `zenith`, and follow it.
- **Variant:** Zenith never defaults one. Ask the developer to name the ATC
  variant, read the ones the system offers, and say which was used: the
  work package's ATC row is judged "under the named variant".
- **Check:** new objects aren't in Zenith's inventory yet, so run
  `zenith_start_run` on the developer's **package**, then poll
  `zenith_run_status` until the run is captured. It takes minutes; say it was
  submitted, not that it passed.
- **Read:** `zenith_object_detail` for each object. For a finding,
  `zenith_finding_options` lays out the options. Fix it as the Zenith guide
  says, with the tools the server lists, then `zenith_rescan_object`.
- **Zenith's screen:** have the developer open the same objects in Zenith in
  the browser and compare. Its address depends on the landscape; if they
  don't have it, ask them to get it from whoever set up their access, rather
  than guessing one.
- **Show:** open errors, objects not checked, and `checkedAt` against the
  last change.

Wait.

## Step 8: deliver and sign off

*The method:* **sign-off records it.** Delivery records what was built (its
transport, objects and the evidence for each check). Orbit reads Zenith itself
rather than trusting the claim. Sign-off records who accepted each scenario,
and Zenith's answer at that moment.

Orbit accepts some things only in a given state, so the order matters:
waivers before delivery, the retrospective note before sign-off.

- **Waive first:** any standard row planned for a waiver in step 4,
  `orbit_waive` now.
- **Deliver:** `/dlw-orbit deliver` with the build number. It checks the
  links from step 5, then calls `orbit_deliver` with one check per tool row.
  At `sandbox` rigour, Orbit records problems as `gate.warnings` instead of
  refusing: read each one out; at `delivery` rigour each would have stopped
  the delivery.
- **Retrospective:** ask what they would do differently and what slowed them
  down. With their OK, record it with `orbit_add_note` now: Orbit refuses a
  note once the build is signed off.
- **Sign off:** `/dlw-orbit sign-off`. Here the developer is also the
  requester. Go through each scenario first: they should see it work, not
  just say yes. Then confirm row by row. At `sandbox` one statement may
  confirm the `person` rows, but only when every one of them passes: the list
  can include a standard row whose check falls back to a person, and one
  statement would confirm it too. A row that fails means `orbit_reopen`, back
  to step 5.
- **Show:** the delivery as claimed beside Zenith's answer now.

Wait.

## Step 9: wrap-up

*The method, end to end:* walk back through what they saw on their own
requirement: grounded spec, reviewed twice, Zenith's proof, a recorded
sign-off.

- `orbit_get_build`: summarise the spec, the objects and transport, the
  review verdict, Zenith's answer and the sign-off, and point at where each of
  the four points of the method showed up.
- Read back the retrospective recorded in step 8.
- **Don't delete anything:** not the package, objects, transport or build.
  Cleaning up is a separate decision, outside this walkthrough.

## Rules

- **Their build only.** Never build, review, deliver or sign off a build that
  isn't assigned to this developer.
- **Their package only,** with their prefix. The one package they create
  is their own, at check-in.
- **Every change said first.** Wait for a yes before any write to SAP or
  Orbit.
- **One step at a time.** Never run ahead; wait for the developer.
- **The underlying tool's rules win.** `/dlw-orbit`, `delaware-build`, the
  Zenith guide and the agents apply in full; this guide only paces them.
- **Refusals are shown as they are,** never retried with other wording.
- **Use only the tools the server lists.** If one named here is missing, say
  so and stop that step.
