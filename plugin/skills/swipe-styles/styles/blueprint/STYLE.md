# Blueprint

Every slide is a sheet of a technical drawing: white linework on deep blueprint blue, a fine construction
grid inside a drawing frame, and a title block in the bottom-right corner. Dimension lines, callout balloons
and leader lines carry the content, and the accent is the redline an engineer draws over a print: a loop,
an underline, a revision cloud, a rubber stamp. It feels precise, calm and a little nerdy.

**Suits:** tech explainers, system design, how things work, engineering, software architecture, product teardowns.
**Not for:** cosy or emotional topics, and playful ones. Use Notebook or Riso Zine for those.

## Writing for this style

- Headlines: 3 to 7 words, up to 8 on the cover and up to 6 on `points`. Plain statements in sentence case,
  set in a condensed sans, white and left-aligned. Write like an engineer explains: concrete nouns, real
  names of things (DNS, TLS, the load balancer), no hype.
- `kicker`: 1 to 6 words, in mono. On the cover it is the label of the dimension line under the headline;
  on `text` and `points` it is the note under the title's rule, where a drawing gives the scale, so a step
  or part name works well ("Step 1: DNS lookup"); on `stat` it sits at the top of the sheet.
- `points`: 3 to 5 items. Each is a short `title` (2 to 4 words) plus one sentence of `text`, 12 words
  per item at most; plain strings work too, one line each. Every item gets a numbered balloon with a leader
  line, like a parts list, so the numbers should mean something: steps in order, or the parts of a whole.
- `stat`: `value` is drawn as a dimension between two arrows and circled by a revision cloud. Keep it to
  1 to 5 characters ("13", "4.2×", "1 s", "99%"); longer values get smaller. `label` (up to 8 words) says
  what the number counts; `note` (up to 20 words) gives the context or the source.
- `quote`: up to 28 words. It sits in a dashed redline note box, with a leader line down to `author` and
  `role`, both in mono.
- `image`: the picture is printed as a cyanotype: in greys, dark parts turn blue and light parts turn white,
  in a white frame with crop marks. It is cropped to fill the frame, so keep the subject in the middle.
  Diagrams and line drawings on a dark background, night photos and dark-mode screenshots look best; a light
  screenshot becomes a mostly white print. `title` up to 7 words, `caption` (in mono) up to 18.
- `cta`: `action` is a tilted redline rubber stamp with a double border, next to the title block: 1 to 4
  words ("Save this post", "Follow @handle"). `title` up to 7 words, `text` up to 18.
- `*word*`: the word stays white and gets a thick redline underline, the mark a reviewer makes. Use it once
  or twice per carousel, on the key fact or the surprise, never on a whole sentence.
- Use typographic apostrophes and quotation marks (’ “ ” „ « »); both fonts have them.

## Slides

| type | looks like |
|---|---|
| `cover` | a small isometric part with a redline loop at the top right (it shrinks when the headline is long), the headline large below it, a full-width dimension line with arrows and the kicker as its label, the subtitle in pale cyan, registration marks in the left corners; the title block holds the logo and the handle |
| `text` | the headline beside a detail bubble with the slide number, on a heavy double rule; the kicker under the rule in mono; the body in the middle of the free sheet, aligned with the headline |
| `points` | headline on a double rule, kicker under it, then a parts list spread over the sheet: numbered balloons, leader lines ending in dots, item titles in white and their text in pale cyan |
| `quote` | the quote large inside a dashed redline note box in the middle of the sheet, a redline leader down to the author and role |
| `stat` | kicker at the top; the value huge, drawn as a dimension between extension lines and circled by a redline revision cloud; the label below, the note in pale cyan |
| `image` | the picture as a cyanotype in a white frame with crop and centre marks, then the title beside a detail bubble on a double rule, the caption in mono below it |
| `cta` | the headline large at the top, the text in pale cyan, the action as a tilted redline rubber stamp next to the title block; without an action, headline and text sit in the middle of the sheet |

## Brand

`brand.accent` replaces the redline red-orange (#FF6B4A). It colors the loop on the cover drawing, the
underline under `*emphasis*`, the dashed quote box and its leader, the revision cloud around the stat and the
rubber stamp. Warm, bright colors work best (red-orange, coral, amber, yellow, magenta): they stand apart
from both the white linework and the blue paper. The accent never colors small text; the only text in it is
the stamp, set large and bold. Dark colors are lifted automatically to a lighter tint of the same hue so they
stay visible on the blue, but they then look paler than the brand color, and blue or grey accents read as
linework rather than markup. `brand.logo` appears in its own cell of the title block on the cover and the
last slide, about 46 px high; use a white or light version, because a dark logo disappears on the blue.
`brand.handle` appears in the title block on every slide, in mono, next to the slide counter.
