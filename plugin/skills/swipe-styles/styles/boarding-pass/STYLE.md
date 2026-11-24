# Boarding Pass

Every slide is a portrait boarding pass, edge to edge: a band in the airline color at the top, the ticket
area on light security paper, a perforated tear line with half-circle notches, and a stub with a stacked
barcode. In the band a flight route arcs from a dot to a ring, and the plane sits further along it on every
slide, so the reader watches it take off on the cover and come in to land on the last slide. Field labels
are icons (a calendar, a person, a seat), so the pass works in any language. Clear signage type, crisp,
travel-ready.

**Suits:** travel tips, itineraries, events, product launches, roadmaps, career journeys.
**Not for:** long explanations or quiet, reflective topics. Use Notebook for those.

## Writing for this style

- Headlines: up to 6 words on the cover, up to 7 on text slides, up to 6 on points, image and cta slides.
  They are set big and bold in Overpass, sentence case. The cover title is very large (about 9 letters per
  line), so 3 to 5 words look best there. Words of 12 letters or more get hyphenated in big type: rephrase,
  or force the break with `\n`. The cover `subtitle` takes up to 16 words.
- `kicker`: 1 to 4 words, printed in monospace like a field value. On the cover it sits in the data row
  above the tear line with a calendar icon, so a date or a time span works best ("Freitag bis Sonntag",
  "June 14, 9 am"). On `text`, `points` and `stat` it sits above the title with a clock icon ("Day 1",
  "Before you fly").
- `text`: `body` up to 40 words. Without `title` and `kicker` the body becomes the statement of the slide,
  bigger and in the middle.
- `points`: an itinerary. 3 to 5 items, up to 12 words each (`title` and `text` together). Every item is a
  stop on a dotted vertical route; the stop marker carries the item number (01, 02, …), so the items read
  as a sequence: stops, steps, days, milestones. Give each item a short `title` (the place or the step) and
  one sentence of `text`; plain strings work too. In the square format keep it to 4 items.
- `stat`: the departure board. `value` is short: each character gets its own split flap, so 1 to 4
  characters are best ("7", "48", "4,5×", "€90"); up to 7 work but shrink ("1.250 €"). A space shows as a
  blank flap. No `*emphasis*` in the value. `label` up to 7 words: with a 1 or 2 character value it sits
  to the right of the board, otherwise under it. `note` up to 20 words, below.
- `quote`: up to 28 words, in a white message card with a speech icon. The language's own quotation marks
  are added („…“, « … », “…”), so don't type them. `author` sits under the card with a person icon, like a
  passenger name; `role` under it.
- `image`: the picture becomes a postcard from the destination: a white border, slightly turned, with a
  postmark in the accent color over its top right corner. It is cropped to fill the space above the
  `title` (up to 6 words) and `caption` (up to 16 words). Photos of places, streets, food and views work
  best; keep the subject away from the top right corner.
- `cta`: `title` up to 6 words, `text` up to 18. `action` (2 to 4 words) is the boarding button: a pill in
  the accent color with a plane icon. A large barcode fills the stub below.
- `*word*`: marked with a yellow highlighter stroke, the way travellers mark the gate on their pass. Use it
  once or twice in the whole carousel, for the place, time or word the reader must not miss.

## Slides

| type | looks like |
|---|---|
| `cover` | the band with the brand and the plane just after take-off; the title huge; the subtitle; a data row above the tear line: kicker (calendar icon), handle (person icon) and the counter (seat icon); a wide barcode in the stub |
| `text` | kicker with a clock icon, the title, the body; handle and counter in the stub next to the barcode |
| `points` | kicker, title, then a vertical dotted route with one numbered stop per item, title and text beside each stop |
| `quote` | a white message card with a speech icon on its edge and a tail pointing to the author and role |
| `stat` | kicker, the value on a split-flap departure board (one dark flap per character, with the hinge through the middle), the label beside or below it, the note |
| `image` | the picture as a postcard with a postmark, the title and caption below |
| `cta` | the title, the text, the action as the boarding button; a large barcode with handle and counter in the stub |

## Brand

`brand.accent` replaces the teal (#0B6872), the airline color. It fills the band at the top of every slide
and the boarding button as it is, and colors the field icons, the itinerary stops, the speech icon and the
postmark on the paper. Text and lines on the band and the button switch on their own: white on strong and
dark colors, near-black on light ones, so any accent stays readable there. On the paper a light accent is
printed darker (same hue), so icons and stops stay visible: bright and pale brand colors (orange, yellow,
pastels) keep their real color in the band but look darker and more muted on the paper. Mid to dark colors
(teal, navy, red, green, purple) look the same everywhere and suit the style best. `brand.logo` appears on a small white tag at the top
left of the band on the cover and the last slide; any logo works on it. `brand.name` is printed in the band
on every slide, like the airline's name. `brand.handle` appears in the data row on the cover and in the
stub of every other slide, with the person icon.
