# Pixel Quest

Every slide is a screen of an 8-bit role-playing game: a night sky with pixel stars, cream dialog windows
with a double pixel border, a ▶ cursor and an XP bar. The first slide is a title screen where a tiny hero
sets out; on the last one the hero has reached the castle. Playful and nerdy, but tidy: one pixel grid,
five colors, no blur.

**Suits:** gaming, tech tips, habits and productivity ("level up"), learning, fun explainers, challenges.
**Not for:** serious finance, legal or health topics, grief or crisis news. Use Swiss Grid for those.

## Writing for this style

- Headlines: 2 to 5 short words. Titles are set in Silkscreen, a wide pixel font that only has capitals:
  about 9 letters fit on a cover line and 16 on a title plate. Long compounds get hyphenated or shrunk, so
  prefer short words ("Combo-Bonus", not "Gewohnheitsverknüpfung") or force the break with `\n`.
  Game words fit the voice: quest, level, XP, save point, inventory, combo, tutorial.
- `kicker`: 1 to 3 words. On the cover it sits under the title as a menu entry with the ▶ cursor
  ("Neue Quest", "Start"); on the other slides it is a small lavender line above the title ("Regel 1").
- `points`: 3 to 5 items, shown as an inventory. Each item gets a pixel icon (heart, star, potion, key,
  shield, always in this order; they are decoration, don't refer to them). The first item is selected: the
  ▶ cursor points at it and its title is in the accent. Give each item a short `title` (1 to 3 words) and a
  `text`, up to 10 words together; with five items keep each text to about 6 words so nothing shrinks.
  Plain strings work too.
- `stat`: `value` is a score of 1 to 4 characters ("66", "38%", "3×", "12k"); longer values shrink.
  `label`, up to 7 words, stands in pixel capitals under the XP bar; `note`, up to 18 words, goes in a
  dialog window and is the place for the source.
- `quote`: up to 22 words; a character speaks in a dialog window. Don't type quotation marks: the style
  adds them in the form of the carousel's language („…“, «…», “…”). `author` sits on a cream name tag on
  the window's top edge (keep it short, it is set in capitals); `role` is a small lavender line under the
  quote.
- `image`: the picture sits in a chunky stepped cream frame with faint CRT scanlines and is cropped to fill
  it. Pixel art, game and app screenshots and simple, bold photos work best; busy photos get lost.
  `title` (up to 5 words) and `caption` (up to 16 words) appear in a dialog window below, like an item
  description.
- `cta`: `action` is the selected entry of a game menu, with the ▶ cursor: 1 to 4 words ("Post speichern",
  "Folge für Level 2"). The title has up to 5 words, `text` up to 18 words.
- `*word*` turns a word into the accent color. Use it once or twice in the whole carousel, in running text.
  Big titles already carry an accent shadow, so leave them without it.
- Running text is set in Pixelify Sans, where 5 and S look alike. Put the number that matters into a
  `stat` value, which is set in Silkscreen.
- No emoji and no arrows (→) in the text: the fonts have none. The ▶ and ▼ are drawn by the style.

## Slides

| type | looks like |
|---|---|
| `cover` | a title screen: the title huge and centered in cream pixel capitals with an accent shadow, the kicker under it as a ▶ menu entry, the subtitle in a dialog window; at the bottom the hero sets out over the hills and a castle waits far away. The logo sits top right, the handle bottom left on the ground. |
| `text` | the kicker and the title on a quest-name plate at the top, the body in a dialog window at the bottom with a ▼ continue marker, the moon in the sky between them when there is room |
| `points` | the title plate, then an inventory window: a pixel icon per item, the ▶ cursor on the first |
| `quote` | a dialog window in the middle of the night sky with the author on a cream name tag on its top edge, the role small under the quote, the moon above when there is room |
| `stat` | the kicker small at the top, the value huge in the accent like a score, an XP bar that fills up as the reader swipes, the label in pixel capitals, the note in a dialog window |
| `image` | the picture in a stepped cream pixel frame with scanlines, title and caption in a dialog window below |
| `cta` | a menu screen: the title centered, the text below it, the action as the selected menu entry with the ▶ cursor; the hero stands at the castle with its flag raised. The logo sits top center. |

## Brand

`brand.accent` replaces the pixel pink `#FF5470`. It colors the ▶ cursor, the ▼ continue marker, the XP
bar, the score, `*emphasis*`, the selected inventory item, the colored parts of the inventory icons, the
shadow under the big titles, the hero's scarf and the castle flag. All of these sit on the dark night sky
(`#1A1C3A`) or the dark windows (`#0E0F28`), and no text is ever written on the accent, so bright,
saturated colors work best: pink, coral, gold, mint, cyan, lime. Dark accents (navy, forest green,
burgundy) are lifted automatically to a lighter shade of the same hue, so text in the accent keeps at least
4.5:1 contrast; very light accents (pale yellow) get a darker shade for the title shadow, so the cream
letters keep their edges. `brand.logo` appears top right on the cover and top center on the last slide,
72px high; a light or transparent logo shows best on the night sky. `brand.handle` appears bottom left on
every slide in small lavender pixel capitals, with the slide counter on the right.
