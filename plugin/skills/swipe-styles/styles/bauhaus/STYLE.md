# Bauhaus

Every slide is a Bauhaus poster: circles, squares, triangles, semicircles and quarter circles in red,
yellow, blue and black on cool grey paper, with a heavy geometric sans that stands on the same black rule
as the shapes, sits beside them or inside them. It feels built rather than decorated: bright, confident and
a little playful, like an exercise from the basic course.

**Suits:** design, architecture, art history, education, culture, creative process.
**Not for:** cosy, handmade or very text-heavy topics, and sober business advice. Use Notebook for cosy or
handmade topics and Swiss Grid for text-heavy or business posts.

## Writing for this style

- Headlines: 2 to 7 words on the cover, up to 6 on `text`, `points` and `cta`, up to 7 on `image`. They
  are set in an extra bold geometric sans, exactly in the case you write them (the style never changes
  case). Long headlines get smaller automatically; on the cover, force the breaks with `\n` so every line
  holds two or three words and none ends alone. `subtitle`: up to 16 words.
- `kicker`: 1 to 4 words. On the cover it sits inside the red square; on `text`, `points` and `stat` it is
  set vertically, reading upwards, next to the headline or beside the big circle. Short labels work best
  ("Leçon 1", "Weimar, Dessau, Berlin").
- `points`: 3 to 5 items, 12 words per item at most (title and text together). Each item is marked by its
  own primary form, always in this order: blue circle, red square, yellow triangle, black semicircle, blue
  quarter circle. The forms are not numbers, so the items don't have to be steps. Three items get the most
  room; with four or five the headline moves up and gets smaller. Plain strings work too.
- `stat`: `value` sits inside the big red circle. 1 to 5 characters work best ("14", "3×", "87 %",
  "1919"); up to about 8 still fit but get smaller ("12.500 €"). `label` (up to 8 words) says what the
  number counts, `note` (up to 18 words) gives the source or the context.
- `quote`: up to 26 words, set large above a yellow dome; `author` and `role` sit inside the dome. The
  quotation marks are added for the carousel's language (« » in French, „ “ in German, “ ” otherwise), so
  don't type them. A short quote stays big; a long one gets smaller so it never touches the red ball.
- `image`: the picture is cut into a big circle, with a black quarter circle and a yellow semicircle
  touching it and a red square overlapping its edge. The corners of the picture are cut away, so keep the
  subject in the middle. Simple, strong subjects work best: a building, an object, a face, a drawing.
  `title` up to 7 words, `caption` up to 16. Without title and caption the circle grows.
- `cta`: a blue circle, a red square and a yellow triangle form an arrow that points at `action`, all
  standing on a black rule. `action`: 1 to 4 words ("Enregistrez ce post", "Save this post"). `title` up
  to 6 words, `text` up to 16.
- `*word*`: the word is printed on a yellow block. Use it once or twice per carousel, in body text, on the
  one word that matters, never on a whole sentence.
- French: before `:` `;` `!` `?` and inside « » use the normal no-break space (U+00A0). The font has no
  narrow no-break space (U+202F) and no `№` sign, so don't use them.

## Slides

| type | looks like |
|---|---|
| `cover` | a red square, a big blue circle and a yellow triangle stand on a black horizon, with a black quarter circle in the top-right corner; the kicker sits inside the red square, the logo at the top left; the title is huge below the horizon, then the subtitle; handle and counter in the footer |
| `text` | the vertical kicker and the title stand on a full-width black rule next to a red semicircle, a blue circle is cut off in the top-right corner; the body hangs below the rule |
| `points` | the vertical kicker and the title stand on the rule next to a yellow triangle that points up at a black semicircle; below, every item has its own form as marker |
| `quote` | a blue quarter circle in the top-left corner, the quote large, then a red ball on top of a yellow dome rising from the bottom edge; author and role inside the dome |
| `stat` | the value huge inside a red circle, a black square overlapping it, a yellow triangle hanging from the top edge; the kicker runs vertically beside the circle; label and note below |
| `image` | the picture in a big circle with a black quarter circle and a yellow semicircle touching it and a red square overlapping its edge; title and caption below |
| `cta` | a big yellow quarter circle in the top-right corner, the logo at the top left, title and text, then the arrow of circle, square and triangle pointing at the action on a black rule |

## Brand

`brand.accent` replaces the Bauhaus red (#D5281B). It colors the square on the cover, the semicircle on the
text slides, the square marker of the second point, the stat circle, the square beside the picture, the
ball on the quote dome and the square in the arrow. Text set inside the accent (the cover kicker and the stat
value) turns white on a dark or mid accent and black on a light one by itself, so it stays readable.
Strong, saturated mid-tones work best (vermilion, crimson, orange, emerald, magenta): the slides stay a
primary-color poster. Navy or dark green work but read close to the fixed blue and black; pale pastels are
darkened a little so they still show on the grey paper, and they soften the poster. Avoid blue and yellow
accents, which the style already uses. `brand.logo` appears at the top left of the cover and the last slide,
up to 76 px high and 270 px wide, on the grey paper, so a dark or full-color logo works. `brand.handle`
appears in the footer of every slide, next to the slide counter.
