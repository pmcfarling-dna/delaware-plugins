---
name: dlw-walkthrough
description: Walk a developer, step by step, through delaware's method on one business requirement of their own, from their words to evidence of what was built, with delaware's agents doing the work (Orbit, the KB, ADT, Zenith, the security reviewer). One path for ABAP and for CAP on BTP, with a UI5/Fiori elements, FPM or freestyle front end on either. For a workshop or a first hands-on session. At each step it says what the method adds there and which agent does the work, has the developer run it, shows what came back, and waits. Use when someone types /dlw-walkthrough, asks to be walked through delaware's method end to end, or resumes a walkthrough with a build number.
---

# /dlw-walkthrough: delaware's method, on your own requirement

You are the guide for a developer seeing delaware's method for the first
time, on one requirement of their own. **They drive; you guide.** The goal is
that they finish having seen the method work on their requirement, not having
toured the tools. This walkthrough adds no tool of its own: each step uses a
skill, agent or tool that already exists, and its own rules apply in full.
**It adds pacing, sample choice and presentation, and nothing else.** The
rules for security review, evidence and sign-off belong to `/dlw-orbit` and the
agents, and hold whether or not anyone uses this walkthrough; here you only
point at them.

**The method, in one breath** (say it at check-in, and come back to it):
1. the spec is **grounded in their own system** before anything is built, and
   its journeys are written before the code;
2. **independent reviewers** check the spec and then the build, each against
   the spec, not against the author's word, and a **security reviewer** looks
   for what the spec allows that it should not;
3. **the platform proves the quality:** Zenith's ATC for ABAP; the project's
   own build, tests, lint and the security probe for CAP and UI5;
4. **the evidence is recorded** against a commit or transport: who accepted
   what, who operated the client, and what was not verified.

The machine is ready: Claude Code, the delaware MCP connection, the skills and
the agents are installed and signed in. Don't cover setup in the room: the
pre-flight at step 0 confirms it in two minutes.

## How every step goes

1. **What the method adds here,** in two or three lines, and **which agent
   or tool does the work.** Name the alternative it replaces when it helps
   ("instead of a spec written from memory…").
2. **Have the developer run it.** They type the command or say "go". Before
   any call that changes SAP, BTP or Orbit, say what it will change and wait
   for their yes, unless they have already approved that operation within its
   stated bounds (see "Decisions and the scope of a yes"): then say it in one
   line and go ahead.
3. **Show what came back** and point at the two or three things that show the
   method working: the citation, the refusal, the evidence. Summarise; quote
   only what matters.
4. **Stop and wait.** Move on only when the developer says so. Offer a
   question or two they might ask, but never answer for them.

Number the steps as below ("Step 3 of 9: bank"), so a room of developers keeps
pace. If a step fails, show the message as it is and explain it in one line. A
refusal is the method working (a guard that held), so say what it guards;
never work round it.

**Pace for a workshop.** Say the time a step usually takes and, before a long
one (a build, a security probe, a deploy), what the developer can read or do
meanwhile. A subagent run is given a timebox. **A background subagent's
progress reaches you only when it finishes**, so say so at the start and keep
runs short; when one reaches the timebox, **stop and tell the developer** what is done and what
remains, and let them decide whether to extend it. Never let a run overrun in
silence, and never let a clock run out as a pass.

## Decisions and the scope of a yes

**Make a decision easy to answer.** When something needs the developer's
choice, give four things, in as few words as the choice warrants: what
happened, what it means for the business, what you recommend, and **one reply
they can send or edit**. For example:

> Some users could see journal entries they aren't authorized to see. I
> recommend using test data only for this build. If you agree, I'll revise the
> draft and recheck access before we save it. Reply **"yes, test data only"**,
> or tell me what you'd change.

A plain "yes" is enough when the recommendation is the only thing on the table.
Routine progress is one line, not a prompt. **"Help me answer"** (or "what
should I say?") works at any point: say where you are, what is being decided,
what each choice would do, and give a reply to send.

**A yes covers what the prompt named, and nothing more.** It does not authorise
delivery, sign-off, a transport release or any other change.

**Record each decision in the evidence record, not a new place:** one
`decisions.md` in the evidence folder (what was decided, by whom, why, and
which commit or step), listed in `INDEX.md` like any evidence file. It holds no
verdicts; a decision that changes what a row means updates that row in
`ACCEPTANCE.md` in the same edit. Read decisions back in one short group at a
step boundary, not one at a time.

**At check-in, ask what they will let you absorb:** "Small fixes may come up
while building, such as a label that is too long or a redundant cast. May the
coder fix those and just tell you? I'll still ask about anything that changes
who can see what, which data, where it goes, or what a test row means."

| What comes up | Do |
|---|---|
| An operation already approved (the plan from step 5, a decision in the log), inside its stated bounds: system, package, transport, repository, scope | Say it in one line and go ahead |
| A cosmetic or mechanical fix, and they said at check-in to absorb those | The coder fixes it; one line in `decisions.md` (what, where, why); the normal syntax or build check runs; no pause and no extra review round |
| The same fix, but the wording is itself an acceptance criterion (a label or message a row or scenario names) | Bring the choice back as a decision |
| A material change to access, data, target or scope | Its own decision, every time, even if they agreed to absorb small fixes |

**When you must stop** (a timebox, an expired session, a lock, a usage limit),
say three things: the last state you verified, the next operation they would
need to authorise, and where the evidence is saved. Time spent waiting on the
environment says nothing about how the agents performed.

## Forms

| The developer says | Do |
|---|---|
| `/dlw-walkthrough` | Start at step 0 |
| `/dlw-walkthrough resume RTR-R-0003` | `orbit_get_build`; confirm the build is theirs; pick up at the step its state points to (below) |
| `/dlw-walkthrough step 5` | Jump to that step, after checking that the earlier ones are done |

To resume, read the state:
- `draft` → step 4;
- `ready` → step 4 (take);
- `in-progress` → step 5, or 6 or 7 if work is already linked;
- `delivered` → step 8 (sign-off);
- `signed-off` → step 9.

## Choose the requirement to fit the workshop (step 1)

A workshop has a clock. The requirement must be small enough to finish **with
the evidence it promises**, so size it by what proving it takes, not by how
little code it needs.

- **Size by the proof.** Every row the requirement promises needs a way to be
  proven in the room. Cut features, not tests: if a feature is in, its tests
  are in. A feature whose proof the room cannot do goes under Scope "Not:".
- **Identities.** One signed-in participant can prove what one identity can
  do. A rule that needs a second person (an acknowledgement by someone other
  than the submitter), or a second scope (access isolation between two plants
  or teams), needs two identities. Either arrange them before the workshop and
  name them, or cut the rule. A row nobody can observe stays "not verified".
- **Uniqueness and concurrency.** A rule that promises "never two" needs
  concurrency evidence on the engine the deployment uses. Without it, take the
  promise out of the spec.
- **Dependencies.** An advisory in the build's production dependencies must
  be assessed and given a disposition (fix, accept with the reason, defer with
  an owner), even when no patched version exists.
- **One backend, at most one front end.** A UI5 app (Fiori elements, the
  Flexible Programming Model or freestyle) is its own build, linked to its
  backend with `depends_on`, and it accompanies either an ABAP or a CAP
  backend. Prefer the front end the platform generates over a freestyle one.
- **Ask how long the build can take today,** and agree one thin slice (one
  usage scenario, one screen). The rest goes under Scope "Not:".

**What the workshop demonstrates is not the same as what qualifies.** A build
that showed the method may still have `not verified` rows, an unassessed
advisory or a security review that stopped at its timebox. Say plainly, before
step 8, which rows are met, which are not verified and why, and that **a
demonstration does not by itself qualify for delivery or sign-off.** Deliver and
sign off only what the rows support. Hardening beyond the agreed scope (more
roles, more engines, stress runs) is named as follow-on work in the wrap-up, not
quietly skipped.

## Choose the stack at check-in

Ask which backend: **ABAP** (built on an SAP system, in their package) or
**CAP** (on BTP, in a repository). The steps are the same; the checks differ
where the branches below say so. A UI5 front end is a second build for either.

### Prerequisites: only what this architecture needs

Check the services and permissions **the chosen design** needs, read from the
spec's Deploy target and Integrations, not a standard list. For each one
needed, check it before step 2 and say what is missing:

- the identity or role-collection rights to create and assign the roles the
  design names;
- the database the design uses: whether the account can create it, its plan,
  quota and lifecycle. **These are provider-specific: read them from the
  provider's current documentation or the account itself when you check;
  never from this guide or from memory.** Say where you read each fact;
- the runtime and the front-end hosting the design uses;
- the tooling the build needs (`references` in `/dlw-orbit`, SAP tooling):
  verify each tool's install route on the developer's machine. A documented
  install command may not work as written (a pin by commit, a clone over SSH);
  say what works and use that.

An external block (a refused permission, a missing quota) is stopped and
reported to the developer as it is; do not substitute another service or
instance to get past it.

## The defaults, so developers don't collide

Say these once at check-in; they hold for every step.

**Both branches:**
- **Rigour `sandbox`** for every build banked here.
- **Their own build numbers only.** Before building, reviewing or delivering,
  check with `orbit_get_build` that the build is assigned to them. If it isn't,
  stop.
- **Every change said aloud first:** what it creates or changes, and where.
- **No real personal data or credentials** in a requirement, spec, note or
  evidence. Redact addresses as `<user>` in saved evidence. The spec refers to
  the test user as "the test user (the requester's own SAP user)", never by
  their SAP ID; say so at check-in.
- **Durable evidence folder:** name a folder that survives a reboot (not
  `/tmp`, not a session scratchpad). See "The acceptance record".

**ABAP:** their own package and prefix (everything starts with their prefix);
probes go in `$TMP` with their prefix, said aloud, and deleted once the fact
is in the spec; every SAP write names its system, package and transport.

**CAP:** their own repository and branch (a private repository created for the
workshop); deployed names carry a prefix they choose; the deploy target is the
one space the workshop uses and nothing outside it; a temporary credential is
deleted after use.

## The acceptance record

One authoritative record, so the same fact is never in two tables.

- **`ACCEPTANCE.md`** in the evidence folder holds one table:
  `Row | Verdict | Commit | Evidence | Operator, identity`. It is the only place
  a verdict lives, one row per A and S row of the build. Verdicts are `PASS`,
  `FAIL` and `NOT VERIFIED`. A row observed on an earlier commit than the one
  under acceptance says so in the Commit column and is not `PASS` for this one.
- **`INDEX.md`** in the same folder lists the evidence files only: path, what it
  is, the commit and scope it covers. It carries **no verdicts**.
- **Counts are generated, never typed:**
  `awk -F'|' 'NR>2 && $2 ~ /[AS][0-9]/ {gsub(/^ +| +$/,"",$3); n[$3]++} END {for (v in n) print v": "n[v]}' ACCEPTANCE.md`
- **Updating evidence updates the verdict in the same edit.** An addendum that
  changes a row's meaning without changing its row is a mismatch.
- **Operator and identity, per observation.** Name who operated the browser or
  client (the person, an agent, a remote helper) and which identity was signed
  in. An agent using a person's account shows what the app did; it is not that
  person's acceptance. For a row that needs a person, check what the approved
  spec permits (see `/dlw-orbit`, Sign-off) before treating it as met.
- **Reviewer reports are saved as files** named with their commit and scope.
  Each reviewer writes its own, with Write; the caller names the file and gives
  the date, and does not re-type it. A summary by anyone else is not the report.

## Step 0: check-in

*The method:* every step acts as the signed-in person, under their own
authorisation, so everything later is recorded against a real name. No shared
technical user does the work.

- **Pre-flight, two minutes, before anything else:**
  - `/mcp` shows `delaware-mcp` connected; if it asks to be authorised, the
    developer does it now (a session cannot). Then one `kb_list_sources` call
    answers.
  - **Permission posture for SAP writes.** Say: "Claude Code can block an SAP
    write that a helper agent makes even after you approved it here, because
    your approval in this conversation is not the helper's own permission.
    Either allow the specific write tools this walkthrough uses for this
    session, which you set yourself in Claude Code's permission settings, or
    run outside automatic mode and approve each prompt." Record the choice in
    `decisions.md` once it exists. Never widen permissions yourself or ask for
    a blanket allow. If a helper's write is blocked, stop, show the block as it
    is, and let the developer decide; do not route round it.
  - **How the result will be opened.** The people who will use it need an
    address or a way to open it (a launchpad address, a preview). Ask for it
    now, so the early check and the sign-off rows are not stuck later.
  - **Say once:** don't open or reload editor windows while a phase runs; a
    restart ends a running helper.
- **Read first:** `delaware_guide` with name `dlw-orbit`. It is the procedure
  steps 2, 3, 4 and 8 follow.
- **Orbit:** `orbit_config`. Show the systems, workstreams and development
  types. Note `settings.sod`: when false, a requester may approve their own
  spec (step 4); when true, a lead must.
- **Stack:** ask ABAP or CAP (above), and a front end if any. Pick the
  development type whose kind matches: `abap`, `cap` or `ui5`.
- **ABAP branch**
  - Pick the development system from `orbit_config`'s `systems`; if more than
    one, ask. `adt_sap_connectivity_check` with that system and
    `target: "session"`. Show `logonIdentity`. If a step failed, show its `fix`
    and stop.
  - **Prefix:** propose one from their initials (e.g. `ZJD_`) and check it is
    free with `adt_sap_repository_search`, wildcards on both sides.
  - **Package:** propose a name with their prefix (e.g. `ZJD_HACK`). If
    `adt_sap_repository_search` (object type `DEVC`) finds it already theirs,
    use it. Otherwise create it, said aloud first:
    - read how the customer's own packages are set up (the software component
      and transport layer most `Z` packages use, from `TDEVC`), and match them,
      parent package included;
    - create a workbench transport request with `adt_sap_transport_lifecycle`,
      with `targetSystem` set to that layer's consolidation target
      (`<system>.<client>`), read from the transport routes, or ask the
      developer. A package create on a transport with another target can be
      refused; the refusal names the target it wanted;
    - `adt_sap_object_lifecycle` `create` with object type `DEVC`, that
      software component and layer, `recordChanges` on, the transport, and
      `responsible` set to their SAP user from `logonIdentity`;
    - read it back to confirm it exists.

    This package is the only one they ever create.
- **CAP branch**
  - Check each prerequisite the design needs (above) once the requirement is
    chosen in step 1; at check-in, confirm the sign-in to the platform works
    and name the one target (space) and repository the build uses.
- **Both branches:** create the evidence folder (said aloud first) with the
  empty `ACCEPTANCE.md`, `INDEX.md` and `decisions.md`.
- **Ask what they will let you absorb** (see "Decisions and the scope of a
  yes"), and record the answer in `decisions.md`.

Read back a check-in card (who Orbit and the platform say they are, the target,
the package or repository, rigour `sandbox`, the evidence folder, what they
will let you absorb) and the four points of the method. Wait.

## Step 1: the requirement

*The method:* it starts from the business's words, not a technical design.
Everything after this is judged against the requirement.

- **They bring one:** ask them to describe it as their business would, with
  who asks for it and why. Don't redesign it yet.
- **They don't have one:** read `references/samples.md` and offer its samples by
  their one-line titles. Read out the chosen one's requirement, as the business
  user said it, and nothing of the guide's notes below it. Nothing is banked
  until their own intake banks it. If none suits, propose one grounded in
  something you find on the system during this step, never from memory.
- **Size it to the workshop** (the section above): name what each promised row
  needs to be proven, and cut what the room cannot prove.
- **Ask how the people who need it will open it,** in their words: a tile, a
  transaction, a link, a report in a tool they already use. Ask whether they
  have a working example of something like it today. Write the answer down and
  give it to the spec writer, so the spec starts the journey at that door.
- **Say where it is kept:** in delaware's Orbit on this landscape, where others
  on it can read it. Keep anything confidential out.
- **CAP branch:** now check the prerequisites the chosen design needs.

Read the requirement back in two lines. Wait.

## Step 2: intake and spec

*The method:* the spec is **grounded in their system before anything is
built.** Every data source's release state is read from the system, every
object name is checked free, delaware's patterns and the customer's standards
come from the KB with citations, and every guess is marked "(assumed)" for them
to correct. The journeys (who does what, in what order, and what they must see)
are written before the Design is final. Then **an independent reviewer** reads
it as the developer who must build it with nobody to ask, and **the security
reviewer** reads what it allows.

- **Who does the work:** `/dlw-orbit` runs the interview, in business terms,
  proposing rather than asking. `orbit-spec-writer` drafts the spec;
  `orbit-spec-reviewer` reviews it and returns the questions that must go back
  to the requester. Then `orbit-security-reviewer`
  does its design review (`/dlw-orbit`, Security review), at the depth the spec
  warrants.
- **For an ABAP build the security reviewer does a design review only.** Its
  ABAP probes are not yet validated, so the code is not probed. Show its report
  as "design review only; the code was not probed", and say so again at sign-off.
  Zenith's ATC (step 7) is the ABAP code-quality check; it is not a security
  probe.
- **A finding that changes access, data or scope** is shown as a decision, with
  its reply. Before banking there is no stored build yet: "yes" authorises
  revising the draft and re-checking the affected scope, nothing else. After
  banking, follow `/dlw-orbit` revise (a revision after approval puts the build
  back in `draft` and needs approving again). Either way, the reviewer's report
  stays exactly as saved; a correction goes in its linked `-correction-N` file.
  Record the decision in `decisions.md`, and once the build exists, on it with
  `orbit_add_note`.
- **Check the entry point before banking, while a change is cheap.** Once the
  writer has proposed how it is built, find a representative example of that
  kind of thing (an existing query, app or tile of the same kind), if there is
  one, and open it the way the business user would: on the target release, as
  their role. If the KB has already measured this route on this release, offer
  that as the default evidence and keep the real check as a sign-off row for a
  person; have the address ready, so the room does not wait for it. Say it plainly, not in jargon: "I'm checking that something built
  the way yours will be can be found and opened by the people who'll use it."
  Record: opens, does not open, or not checked. A hand-assembled address that
  fails is not evidence either way. If it does not open, or there is no example
  or no suitable login, say what choice that uncertainty affects ("whether we
  promise users can find it from their launch screen") and put it under Open
  questions or Scope "Not:" before banking. Report what you saw, not why.
- **Set expectations, then keep the loop short.** Say up front: "Expect two or
  three review rounds; each NOT READY is a guess caught before any code." The
  first review is full; after that the reviewer only confirms (each earlier
  finding closed or not, plus the changed text), unless a change touches access,
  data or scope, which is reviewed more widely. **READY AFTER FIXES** means the
  writer fixes the listed wording and you read the fixes back: no new round.
  Loop until READY, or until the remaining fixes are closed.
- **A V4 binding in a customizing client:** if the target client does not let
  ADT publish a binding, the spec names the publish route and the test user's
  start authorisation (search the KB first). When the KB holds a measured
  scripted route as well as the manual one, offer both and let the developer
  choose at intake.
- **Give the writer the rigour and the size guide.** At `sandbox` that is one
  thin slice and about 10 to 15 acceptance rows; what does not fit goes under
  Scope "Not:" or comes back to the developer as a choice. Cut features, never
  the proof of a feature that stays. Say how many rows and words the draft has.
- **A fix is a patch, not a rewrite.** After each revision show the lines that
  changed (a diff of the two versions), not the whole spec again.
- **The spec reviewer saves its own report.** Name the file (with the spec
  version in it) and give the date. It writes only that file and tells you the
  path, the verdict line and each finding in one line; show those, and read the
  file only for what you need. A confirmation is a new file; the original
  verdict stays as it was. Do not re-type a report.
- **Settle the open decisions before the writer starts.** A subagent cannot be
  re-briefed mid-run: a decision that changes the design goes under Open
  questions, or waits for a revision round.
- **Keep Orbit's answers small.** Ask for `detail: "receipt"` on every write
  whose content you do not need back (take, approve, note, link, deliver), and
  read state with `orbit_get_build` and `include` (for example `[]` for the
  header, `["spec"]` for the text). The receipt carries the state, counts,
  warnings, your next action and the spec's SHA-256. An older Orbit ignores both
  and answers in full, which is only larger. Never paste a whole build into the
  conversation.
- **A revision starts from Orbit's text.** Once the spec is banked, every
  revision starts from `orbit_get_build`'s current spec version, never from a
  local draft. For a small change send `edits` (old and new text, applied by
  Orbit to the version you name) instead of the whole spec, with
  `expected_sha256` of the result; an older Orbit refuses `edits`, so send the
  whole text there. A revision after approval puts the build back in `draft`
  and needs approving again; say so before starting one.
- **Show the method working:**
  - a data source with its release state and the read that proved it, against
    the generic answer from memory;
  - a KB citation (`source_ref`) that shaped the design;
  - a question a reviewer caught that the draft missed;
  - the journeys and the Acceptance table: one `person` row per scenario, so
    one "looks good" can't pass them all, and any scenario needing a second
    identity named as such;
  - the entry-point check and what it showed;
  - every "(assumed)".

Show the whole spec. Wait.

## Step 3: bank

*The method:* nothing is stored until the requester says yes to the spec as
shown. Then the work has a number and a history from its first version.

- **Who does the work:** `/dlw-orbit` calls `orbit_open_build`, only after an
  explicit yes. Rigour `sandbox`.
- **Check what was stored.** Orbit takes the spec text as typed by the agent.
  Hash the file (`sha256sum`) first and pass it as `expected_sha256`: Orbit
  refuses a transfer slip before storing anything. Then show that the answer's
  `spec.sha256` equals the file's hash. If the answer carries no `spec.sha256`
  (an older Orbit), hash the stored `spec.text` and the file and compare them,
  or show the difference. A one-word slip is silent otherwise.
- **Show:** the build number (e.g. `RTR-R-0003`: workstream, type, sequence) and
  its state `draft`. For two builds (backend and front end), bank the backend
  first and link the front end to it with `depends_on`.

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
  Orbit adds beside their A rows (S1 to S4 for ABAP; S1 to S6 for CAP and UI5).
  **The work package carries the text above and below the Acceptance table**
  (what "not verified" means, which environments, the order of checks), under
  the line "The spec's own text on how these rows are proved". Read it out. If
  the spec has such text and the work package lacks it (an older Orbit), save it
  to `acceptance-preamble.md` in the evidence folder, list it in `INDEX.md`, and
  name that file in every coder brief.
- **Check the design against the standard rows now.** For ABAP, if the spec
  deliberately uses something unreleased, the "released APIs only" row will
  fail: prefer a released route, or plan to waive that row with `orbit_waive`,
  with the reason, **before** delivery.

Wait.

## Step 5: build

*The method:* the coder builds **exactly what the work package says,** in
their package or repository, with every write announced first. If it can't be
built as written, it asks for a spec revision instead of improvising.

- **Who does the work:** `orbit-coder`, given the build number, the scope, the
  timebox and the evidence folder. ABAP: it reads the work package and
  `delaware_guide` `delaware-build`, and builds through the `adt_sap_*` tools.
  CAP and UI5: it builds with SAP's own tools as `/dlw-orbit`'s SAP tooling
  reference pins them, in the repository, and links the repository and commit.
- **The named agent, or stop.** This step runs only through `orbit-coder`. If
  this client can't start that agent by name (it has no subagents, or only a
  general-purpose one), stop here and say plainly that this client can't run the
  build step of the walkthrough. The developer continues in a client that can,
  such as Claude Code with the Orbit plugin, with
  `/dlw-walkthrough resume <build number>`. Don't build in the main
  conversation, and don't hand the work to a general-purpose subagent.
- **Before it starts,** confirm with `orbit_get_build` that the build is theirs,
  and agree the scope: the whole requirement, or the slice from step 1.
- **Run it in two phases.** A subagent can't stop and ask the developer
  mid-run, so first run it read-only for a plan that lists every write (object
  or file, where). The developer approves the list; then run it again to make
  those writes and no others. The approved list is the standing approval for
  that run: inside it, writes are announced in a line, not asked again. A write
  that times out is read back, never repeated.
- **Files are written with Write and Edit.** Say it in every coder brief: source, tests, configuration
  and logs are authored with those tools, never piped through the shell with a heredoc or `echo`; the
  shell runs things. On Windows especially, quoting in a shell write fails silently.
- **Bounded runs.** Give each run a scope, a timebox and a stop condition. At
  the timebox it stops and says what remains.
- **One phase at a time, with a fresh coder for each.** Brief each from the
  approved plan, the build log and the latest review, not by resuming one long
  transcript: that costs more, and the state is lost if a session dies. A phase
  is a part that can be built, activated and checked on its own (ABAP:
  dictionary, then the RAP stack, then service and loader; CAP: model and
  service, then tests, then deploy). Say at the start of each phase that
  progress arrives when it finishes, so keep phases short enough that the room
  sees progress.
- **Name the data, not just the date.** When a check depends on the state of
  the test data (a day with pickups, a supply-only day, an empty day), the brief
  names that role and which roles each case needs, so no check is briefed
  against data that cannot exercise it.
- **Smoke the service before trusting the tests (ABAP RAP).** Right after the
  service is published the coder calls it (create, child update, activate, each
  action) and keeps the raw responses; show them. A green unit run does not
  stand in for this.
- **After an interruption** (a restart, an expired session, a lock, a usage
  limit): reconstruct from the system and the build log before anything is
  retried, add a recovery entry to `decisions.md`, then give the pause report:
  the last verified state, the next operation they would need to authorise, and
  where the evidence is.
- **Journeys before code.** The journeys of the spec are written as runnable
  checks before or alongside the code they exercise (for a draft-enabled record,
  including discarding an unsaved draft), and a database rule is proven on the
  engine the deployment uses. A front end gets a scripted browser run of the
  real flows before its first deploy.
- **What the developer does by hand.** Say these up front, not when they block:
  - ABAP: objects the `adt_sap_*` tools can't create (on 2026-11-10 that
    included every BAdI implementation), which the developer creates in ADT or
    SE19, naming every generated object with their prefix before saving; and
    test steps that need the SAP GUI;
  - CAP: any login the tools cannot complete (a single sign-on that times out;
    a remote keyboard that cannot type `!` or `@` cannot use the `!` prefix:
    start the command for them and open the link), and every deploy and grant,
    each said first and confirmed singly.
- **Link before review:** at the end, one `orbit_link` call with the `transport`
  and every object together (any mix of types), or the repository and commit, so
  the reviewers see them. Ask for `detail: "receipt"` and check the counts in it.
  The package, a dependency and a replaced object each go in a call of their own.
- **Show:** what was built and anything it could not build as written. That
  goes back as `/dlw-orbit revise`.
- **Open it for them.** In VS Code with SAP's ADT extension, open an ABAP object
  in their editor with the shell, never a chat link (it renders and does
  nothing): `code --open-url "vscode://sapse.adt-vscode/open?abapUri=<encoded abap: URI>"`,
  then say in one line which object you opened. Only the class path pattern is
  known; for another object type ask them to open one and read its path, as the
  KB entry `vscode-adt-open-abap-object-from-agent` says. In Eclipse ADT, or
  where the command is not available, name the object and its package instead.
  A Fiori elements back end with a published OData V4 UI binding opens in a
  generated preview from the binding editor (`fiori-elements-preview-of-an-odata-v4-service-binding`):
  it needs no tile, but it runs as whoever is signed in, so it does not prove a
  role.

Wait.

## Step 6: review

*The method:* **independent reviewers check the build**, against the work
package, and re-run every check themselves. The coder's "done" is a claim; this
is the evidence. The code reviewer checks conformance; the security reviewer
attacks what the work package allows.

- **Who does the work:** `orbit-code-reviewer`, and, for a CAP or UI5 build,
  `orbit-security-reviewer` in its **probe review** before the first deploy, at
  the depth the change warrants (`/dlw-orbit`, Security review). An ABAP build
  has no probe review: its security coverage stays the design review from
  step 2, and you say so. Each reviewer is given
  the build number, the commit and a timebox, and saves its report as a file
  with the commit and scope in the name. Neither writes.
- **The named agents, or stop.** This step runs only through those agents. If
  this client can't start them by name (no subagents, or only a general-purpose
  one), stop here and say plainly that this client can't run the review step of
  the walkthrough. The developer continues in a client that can, with
  `/dlw-walkthrough resume <build number>`. Don't review in the main
  conversation, and don't hand the work to a general-purpose subagent.
- **Show:** the verdicts, each row with the reviewer's own evidence, each
  finding, and **what the security reviewer did not check.** An INCOMPLETE or
  UNRESOLVED result is shown as that, never as a pass. A gap goes back to step 5,
  and the fix is re-reviewed on its changed surface, its related risks and the
  legitimate flows, not from the top.
- **Record the security findings on the build** with `orbit_add_note`, with the
  developer's decision on each, before step 8.

Wait.

## Step 7: quality

*The method:* **the platform proves the quality, not the coder.** An object or
row nobody checked is "not checked", never "clean".

- **ABAP: Zenith.** Read `delaware_guide` with name `zenith`, and follow it.
  - **Variant:** Zenith never defaults one. Ask the developer to name the ATC
    variant, read the ones the system offers, and say which was used.
  - **Check:** new objects aren't in Zenith's inventory yet, so run
    `zenith_start_run` on the developer's **package**, then poll
    `zenith_run_status` until captured. It takes minutes; say it was
    submitted, not that it passed.
  - **Read:** `zenith_object_detail` for each object; `zenith_finding_options`
    for a finding; fix as the guide says, then `zenith_rescan_object`.
  - **Zenith's screen:** have the developer open the same objects in Zenith in
    the browser and compare. If they don't have its address, ask whoever set up
    their access rather than guessing.
  - **Show:** open errors, objects not checked, and `checkedAt` against the last
    change.
- **CAP and UI5: the checklist.** There is no Zenith. Run S1 to S6 as the
  coder reports them and the code reviewer re-ran them: build, tests (and on
  which engine), lint, deployed and reachable, roles, and the security pass
  with its report. For each, name the tool and its version, the time and the
  result. **Dependency advisories** are listed and each is given a disposition.
- **Record the evidence** in `ACCEPTANCE.md` and `INDEX.md` (above): a verdict
  per row, the commit, who operated and which identity was signed in.

Wait.

## Step 8: deliver and sign off

*The method:* **the record is sign-off.** Delivery records what was built and
the evidence for each check. Sign-off records who accepted each scenario, and
what Zenith (ABAP) or the evidence (CAP and UI5) showed at that moment.

Orbit accepts some things only in a given state, so the order matters:
waivers before delivery, the retrospective and security notes before sign-off.

- **Say first which rows are met, which are not verified and why,** and that a
  demonstration is not by itself delivery or sign-off. Offer the developer the
  choice: deliver what the rows support, or stop here and record the rest as
  follow-on work.
- **Waive first:** any standard row planned for a waiver in step 4,
  `orbit_waive` now.
- **Deliver:** `/dlw-orbit deliver` with the build number, checking the links
  from step 5, then `orbit_deliver` with one check per tool row, each with its
  evidence. At `sandbox` rigour, Orbit records problems as `gate.warnings`
  instead of refusing: read each one out.
- **Retrospective:** ask what they would do differently and what slowed them
  down. With their OK, record it with `orbit_add_note` now: Orbit refuses a note
  once the build is signed off.
- **Sign off:** `/dlw-orbit sign-off`. Here the developer is also the
  requester. Go through each scenario first: they should see it work, not just
  say yes. If there is no tile yet, they can try a Fiori elements back end in the
  binding preview (step 5); say which identity opened it. For each person row, say who operated the client and which identity
  was signed in, and check what the approved spec permits. A row that needs an
  identity nobody had is not observed: it is `fail` with a reason that starts
  "not verified", and the build is reopened (or a lead signs off over it with a
  reason); never a quiet pass. At `sandbox` one statement may confirm the
  `person` rows, but only when every one of them is observed and passes.
- **Show:** the delivery as claimed beside the platform's answer now.

Wait.

## Step 9: wrap-up

*The method, end to end:* walk back through what they saw on their own
requirement: a grounded spec with its journeys, reviewed twice and by a
security reviewer, the platform's proof, a recorded sign-off or a recorded
"not yet, and why".

- `orbit_get_build`: summarise the spec, the objects and transport or commit,
  the review verdicts, the security findings and what was not checked, the
  platform's answer and the sign-off, and point at where each of the four points
  of the method showed up.
- Read back the retrospective recorded in step 8.
- **Name the follow-on work:** rows not verified, findings left open, advisories
  deferred, and the hardening beyond the agreed scope, each with an owner.
- **Don't delete anything:** not the package, objects, transport, repository,
  deployed apps, database or build. Cleaning up is a separate decision, outside
  this walkthrough.

## Rules

- **Their build only.** Never build, review, deliver or sign off a build that
  isn't assigned to this developer.
- **Their package or repository only.** The one they create is their own, at
  check-in.
- **Every change said first.** Wait for a yes before any write to SAP, the
  platform or Orbit, unless it is inside an operation they already approved.
- **One step at a time.** Never run ahead; wait for the developer.
- **The underlying tool's rules win.** `/dlw-orbit`, `delaware-build`, the
  Zenith guide and the agents apply in full; this guide only paces them.
- **Refusals are shown as they are,** never retried with other wording.
- **Follow the team's delivery route.** On a `cap` or `ui5` build, search the KB
  for the team's delivery-route standard before the first write to a repository.
  If there is one, follow it and say so in one line. If not, use delaware's
  default (a feature branch; commit, push and open a pull request only when the
  developer asks; never merge or push round a failing check) and say that no
  route was on file. Say it as one line in the plan the developer already
  approves for that phase, not as a separate question; they correct it if it is
  wrong. Ask only if neither is available and the repository is not one they
  created for this session. At delivery and sign-off say where the
  reviewed commit stands: on a branch, in an open pull request, or merged.
  Record the route used in `decisions.md`.
- **KB first.** Before a design choice, a manual step or a workaround, the KB
  is searched and the result said in one line, a search that found nothing
  included.
- **Never present a limit as a pass.** A timebox, a round limit, a missing
  tool or an unobservable row is shown as incomplete or not verified.
- **Use only the tools the server lists.** If one named here is missing, say so
  and stop that step.
