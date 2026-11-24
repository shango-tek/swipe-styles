# Comic

Every slide is a page of a comic book: thick black ink panels on newsprint with paper gutters between
them, flat red, yellow and blue, Ben-Day dots, yellow caption boxes and speech balloons. The cover title
is a slanted comic logo with a hard 3D shadow over a burst of rays. Loud, warm and funny, but each page
still carries one clear idea.

**Suits:** storytelling, myths vs. facts, before and after, explainers for kids and parents, humor, fun science.
**Not for:** formal B2B, finance, legal topics, grief or crisis news. Use Swiss Grid for those.

## Writing for this style

- Headlines: 2 to 6 words. Everything is lettered in capitals, as in comics: titles in Bangers, a
  condensed, slanted comic face, running text in Comic Neue. On the cover and the last slide the title is
  the comic logo, where about 10 letters fit on a line, so short words hit hardest ("Tu y croyais ?").
  Long compounds get hyphenated or shrink; prefer short words or force the break with `\n`.
- `kicker`: 1 to 4 words, in a small caption box tucked into the top left corner of the panel ("Idée
  reçue 1", "Mythes contre faits", "Plus tard…"). It is yellow, except on the points slide, where it is
  a paper box on the yellow title panel.
- `subtitle` (cover, up to 14 words) and `text` (last slide, up to 14 words) are spoken in a speech
  balloon. `body` (text slide, up to 40 words) is the narration in a yellow caption box.
- `points`: 3 to 5 items, each one a small panel of a comic page with a number tab (01, 02, …) in the
  accent, so they read in order like panels. Give each item a short `title` (1 to 4 words, in Bangers) and
  a `text`: 12 words per item at most, together. Plain strings work too and become the panel's lettering.
  With 4 or 5 items, keep each to about 10 words so the lettering stays big.
- `stat`: `value` goes into the jagged action burst: 1 to 5 characters ("7–9 h", "3×", "80 %", "1/3");
  longer values shrink. `label` (up to 10 words) sits in a yellow caption box under the burst, `note` (up
  to 16 words) in a paper box right below it: the place for the source.
- `quote`: up to 20 words, lettered in a big speech balloon. Don't type quotation marks: the balloon
  already shows it is spoken. Its tail points down at a yellow name tag with `author` (in Bangers) and
  `role` under it. Use a real person's words, or the creator's own words with the brand name as author.
- `image`: the picture fills a panel and is printed as a halftone: blue Ben-Day dots for the greys and
  solid black ink for the darkest lines, cropped to fill the panel. Simple drawings, flat illustrations
  and photos with one clear subject and strong darks and lights work best; busy photos turn into a blur of
  dots, and small text in the picture is lost. `title` (up to 6 words) sits in a caption box in the
  panel's top left corner, `caption` (up to 16 words) in a full-width yellow caption box below.
- `cta`: `action` (1 to 5 words) is lettered in a yellow box with a thick black outline and a red arrow
  pointing at it. Keep it a command ("Commente 1, 2 ou 3", "Abonne-toi").
- `*word*`: in captions and balloons the word turns italic in a dark shade of the accent; in Bangers
  titles it is filled with the accent and outlined in ink; in the comic-logo title the letters turn to the
  accent and the 3D shadow turns black. Use it once or twice in the whole carousel, on the word that
  carries the twist.
- No emoji, no arrows (→), check marks (✓) or № in the text: the fonts don't have them (the arrow on the
  last slide is drawn by the style). Write `ß`, never `ẞ`: in capitals it is shown as SS. In French,
  put a no-break space inside « » and before : ? ! so the marks never end up alone on a line.
- Running text is in Comic Neue, where 0 and O look alike. Put a number that matters into the `stat`
  value, which is set in Bangers.

## Slides

| type | looks like |
|---|---|
| `cover` | one big panel: blue rays and a halftone burst behind the title, set as a slanted yellow comic logo with an ink outline and a 3D shadow in the accent. The kicker is in a caption box in the top left corner, the logo in a paper box in the top right corner, the subtitle in a speech balloon below the title. The handle and the page number sit in the gutter under the panel. |
| `text` | one big panel: the kicker in the corner caption, the title large in black Bangers, the body as narration in a yellow caption box at the bottom; accent halftone dots grow toward the bottom right corner. Without a title, the narration box sits in the middle in bigger lettering. |
| `points` | a comic page: the kicker and the title on a yellow panel at the top, then one panel per item with a number tab in the accent. Three items make two panels and a wide one, four make two rows with alternating widths, five make two, one wide, two. The panels are tinted with light blue dots, light accent dots, or a blue halftone corner, in turn. |
| `quote` | one panel with a light accent dot tint; a big speech balloon with the quote, its tail pointing at the yellow name tag with author and role. Without an author, the balloon stands alone in the middle. |
| `stat` | one panel with a light blue dot tint; the kicker in the corner caption, the value huge in paper-white Bangers with an ink outline on a red and yellow action burst, then the label and the note in two stacked caption boxes. |
| `image` | the picture as a blue halftone with black ink lines, in a panel with the title in a caption box in its corner; the caption in a yellow caption panel below. |
| `cta` | like the cover, but the rays meet at the bottom, behind the action: the title as the comic logo, the text in a speech balloon, the action in a yellow outlined box with an accent arrow. The logo sits in a paper box in the top right corner. |

## Brand

`brand.accent` replaces the comic red (`#E63B2E`). It colors the 3D shadow of the cover and last-slide
titles, the inside of the action burst on the stat slide, the number tabs of the points panels, the arrow
on the last slide, `*emphasis*`, and the dot tints on the text and quote slides and on every second points
panel. Strong colors work best: red, orange, magenta, purple, green. The style keeps any accent readable:
emphasis in captions and balloons uses a darker shade of it (at least 4.5:1 on the yellow boxes and the
paper), the dot tints use a mid shade, and wherever the accent is a fill (tabs, burst, arrow, title
shadow) it has a black outline and the lettering on it is outlined in ink, so dark accents (navy) and pale
ones (pink) work too. Avoid yellow, which vanishes as the shadow under the yellow title, and a blue close
to the rays. `brand.logo` appears in a paper box in the top right corner of the cover and the last slide,
76px high; a logo with dark lines on a transparent background fits the ink look best. `brand.handle`
appears in the bottom gutter of every slide, on the left, with the page number (1/7) on the right.
