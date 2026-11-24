# Receipt

Every slide is a printed thermal-paper receipt lying on a solid color: torn zigzag edges, warm white paper
and one slightly faded black ink. The type is a monospace with real receipt habits (a centered store header,
dashed rules, dot leaders, a big total, a barcode), so the carousel reads like one long receipt torn into
pieces. Playful and very legible; at its best when the content really is prices, numbers or lists.

**Suits:** money and budgeting, price breakdowns ("what X really costs"), shopping and food lists, funny lists, product launches.
**Not for:** serious, sad or sensitive topics (illness, grief, layoffs, politics). Use Swiss Grid for those.

## Writing for this style

- Headlines: 3 to 8 words on the cover, 2 to 6 words on the other slides. The cover title is big, bold and
  wide, in sentence case, about 11 characters per line, so 8 words make 4 lines. Section titles print in
  capitals between dashed rules. Words of 12 letters or more (German compounds) get hyphenated in big type:
  rephrase, or force the break with `\n`. The cover `subtitle` takes up to 14 words.
- `kicker`: on the cover it is the order line under the store header, in small capitals ("Ticket n° 042,
  mardi 7 h 30", "Order #001, launch day"); on `text`, `points` and `stat` it is a small centered line above
  the title. 1 to 6 words.
- `text`: `body` up to 45 words, printed in condensed type.
- `points`: 3 to 5 items, up to 14 words each (`title` and `text` together). Each item prints as a line
  item: "1×", the `title` in capitals, dot leaders to a check mark, the `text` below. Put prices or amounts
  at the end of the `text` ("15 g à 18 € le kilo : 0,27 €"). A plain-text item prints as one line item
  with the check mark after its last line. The check mark means "counted", so items need not be steps.
- `stat`: the total line. `value` is a price or a short number, at most 7 characters ("0,33 €", "792 €",
  "3×", "−40 %"); it prints big on the right. `label` (1 to 5 words) prints in bold capitals on the left
  ("Total par tasse", "Saved per year"). `note`: up to 18 words, small, under a dashed rule.
- `quote`: up to 24 words, centered between two rows of asterisks like the message at the foot of a
  receipt. `author` (in capitals, after a dash) and `role` sit right-aligned below.
- `image`: printed the way a thermal printer does it: grayscale, high contrast, with an ordered dither. It
  spans the width of the paper and is cropped to the space above the `title` (up to 6 words, in capitals)
  and `caption` (up to 16 words). Pictures with one clear subject, big light and dark areas and a plain,
  light background work best; fine detail and dark photos turn into noise.
- `cta`: `title` up to 6 words and `text` up to 16, centered. `action` (2 to 5 words) prints in paper color
  on a full-width ink bar; a cut line with scissors and a barcode follow on their own.
- `*word*`: printed inverted, paper-colored letters on an ink bar. Use it once or twice in the whole
  carousel, for the number or phrase the slide is about ("*792 €*").
- Numbers: write them the way the language does ("0,27 €" in French, "€0.27" in English). In French, put a
  non-breaking space (U+00A0) before ":", "?", "!" and "€" and inside « », so they never start a line. The
  narrow non-breaking space (U+202F) is not in the font.

## Slides

| type | looks like |
|---|---|
| `cover` | the receipt header, centered: `logo`, the store `name` in big capitals and the `handle`, then a dashed rule. Below, the kicker as the order line, the title big and bold, the subtitle, and the counter at the foot. Without a brand the header disappears and the receipt starts with the order line. |
| `text` | the title as a centered section header between dashed rules, then the body |
| `points` | line items: 1×, the title in capitals, dot leaders to a check mark, the text below |
| `quote` | the quote centered between two rows of asterisks; author and role right-aligned below |
| `stat` | the total line: a double dashed rule, the label on the left, the value big on the right, the note under a dashed rule |
| `image` | the picture dithered in black ink across the paper, the title in capitals and the caption below |
| `cta` | the end of the receipt: the logo (if any), title and text centered, the action on an ink bar, a scissors cut line and a barcode |

## Brand

`brand.accent` replaces the cobalt blue (#2347D8). It colors only the backdrop the receipt lies on; nothing
printed on the paper uses it, so text never sits on the accent. Pick a strong or dark color that the warm
white paper stands out from: cobalt, tomato red, deep green, navy, black or mustard yellow all work. Very pale
accents (off-white, beige, light grey, pastels) don't: the receipt melts into the backdrop and only its
shadow is left. `brand.logo` prints in grayscale at the top of the cover and of the last slide, like a logo on
a receipt; a simple, solid logo prints best. `brand.handle` appears under the store name on the cover and in
the footer of every other slide. `brand.name` is the store name in the cover header.
