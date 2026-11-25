# Entry template

Each entry is one call to `kb_submit_for_review`. These are its fields; the
`delaware-kb` guide is the authority on their rules.

| field | what goes in it |
|---|---|
| `entry_id` | lowercase words joined by hyphens; stable, never renamed |
| `topic_path` | the folder, e.g. `sap-development/fiori-deployment`; reuse an existing folder from `kb_list_sources` when one fits |
| `title` | what the entry settles, as a reader would search for it |
| `abstract` | one line you write yourself: the answer in brief |
| `question` | the one question this entry answers, as a person would ask it |
| `topic` | one line |
| `author` | one of the allowed practice lines (see the guide), never a person |
| `created` | today, `YYYY-MM-DD` (an edit keeps the original date) |
| `measured_on` | where and how it was established: from the source or the person, never guessed |
| `goes_stale_when` | what change would make it wrong |
| `confidence` | how sure, and on what evidence |
| `decision` | `new: <reason>` or `edit <id>` |
| `declared_names` | `{"customer": [...], "person": [...], "system": [...]}`, always present |
| `body` | the entry, in the shape below |

## Body shape

Use these sections, in this order, as level-2 headings (`##`). Leave out a
section only when it truly has nothing to say.

```
## The question this answers
<The question, then the answer in two or three sentences.>

## Use this when
<The situation, so an agent can tell whether this entry applies.>

## How
<The steps or the pattern. Code identifiers, annotations, paths and URLs in
backticks. Short code only where it is the point, and never customer code.>

## The plausible wrong answer
<What someone would reasonably do instead, and why it fails.>

## Related
<Ids of existing KB entries this builds on, one per line.>
```
