# Tarot

Every slide is a tarot card: an oxblood card on a dark cloth, framed by a double gold border with corner
fans, with the slide number as a Roman numeral at the top, an arched inner frame of fine double lines, a
line-art emblem (sun and moon, eye, key, three moons) and a name plate at the foot. The last slide is the
back of the card, a gold lattice around a star medallion. It feels like a ritual deck: warm, quiet and a
little ceremonial, never spooky.

**Suits:** astrology, spirituality, self-reflection and journaling prompts, wellness rituals, moon and seasonal rituals, books and fantasy.
**Not for:** business, tech or data topics. Use Swiss Grid or Blueprint for those.

## Writing for this style

- Headlines: 2 to 6 words, up to 5 on `points` and `image`. They are centred in Cinzel, a face of Roman
  inscription capitals: lowercase letters come out as small capitals, so write normal sentence case and
  every capitalised word (German nouns too) gets a full capital. The cover title and the image title sit
  on the plate in full capitals. Avoid very long compounds in headlines; they get hyphenated.
- `kicker`: 1 to 4 words. On the cover it is a small gold line of spaced capitals with a star at each end,
  above the emblem. On `text`, `points` and `stat` it is the card's name on the plate at the foot of the
  arch, so name the card: "Die Idee", "Das Ritual", "Frage 3". Without a kicker these cards close with the
  arch line, which also looks finished.
- `text`: `body` up to 40 words, two or three sentences, centred in Garamond under the emblem and a small
  gold rule. The emblem changes from text card to text card: eye, key, three moons.
- `points`: 3 to 5 items, 12 words per item at most (title and text together). The items are laid out as
  a spread: each gets a small card with its position in Roman numerals (I to V), so they should be the
  positions or steps of one reading, questions or prompts. An item is a short `title` (2 to 5 words, set
  in Cinzel) plus one sentence, or a plain string of one line.
- `stat`: `value` is set in Cinzel inside a sun. Keep it to 1 to 4 characters ("78", "3×", "22", "7 d");
  longer values get smaller. `label` (up to 7 words) says what is counted; `note` (up to 16 words) gives
  the context or the source.
- `quote`: up to 24 words, in italic Garamond inside an oval cartouche with a star on top and a crescent
  at its foot. The style adds the quotation marks in the form of the carousel's language („…“, « … »,
  “…”), so don't type them. `author` follows in gold spaced capitals, `role` in italic below it.
- `image`: the picture fills an arched window, printed as a duotone: dark parts turn deep wine, light
  parts gold and bone. It is cropped to fill the window (upright in 4:5, wide in the square format), and
  the title plate covers its bottom 40 px, so keep the subject in the upper middle. Candlelight, night
  scenes, still lifes, plants and line drawings work best; colourful photos lose their colours. `title` up
  to 5 words, on the plate; `caption` up to 14 words, in italic below it.
- `cta`: the back of the card. `title` up to 6 words and `text` up to 16 sit in an arched capsule under a
  star medallion; `action` is set in dark capitals on a solid gold plate at the foot of the capsule: 1 to
  4 words ("Post speichern", "Save this post").
- `*word*`: gold, and italic in the Garamond text (body, subtitle, notes, captions). In headlines the word
  only turns gold. Use it once or twice per carousel, on a short phrase of 1 to 3 words.
- Use typographic apostrophes and quotation marks (’ „ “ « »); both fonts have them. In capitals and
  small capitals Cinzel sets ß as SS ("GROSSE"), which is correct German capital setting.

## Slides

| type | looks like |
|---|---|
| `cover` | a star in place of the numeral; in the arch the logo, the kicker as a small gold line between two stars, and a large emblem of a sun rising from a crescent moon (it shrinks when the title is long); the title in capitals on the plate over the foot of the arch; the subtitle in italic below; the handle at the foot |
| `text` | Roman numeral at the top; in the arch an emblem (eye, key or three moons, taking turns), the headline, a small gold rule and the body, centred; the kicker on the name plate |
| `points` | Roman numeral at the top; the headline in the arch, then the items as a spread: small tilted cards numbered I to V, each with the item title in Cinzel and its text in Garamond; the kicker on the name plate |
| `quote` | Roman numeral at the top; the quote in italic Garamond, centred in a double oval with a star on top and a crescent at its foot; author and role below |
| `stat` | Roman numeral at the top; the value inside a double circle with sun rays, the label in Cinzel, the note in Garamond; the kicker on the name plate |
| `image` | Roman numeral at the top; the picture as a wine-and-gold duotone in an arched window with a double frame; the title on the plate over its foot, the caption in italic below |
| `cta` | the back of the card: a gold lattice inside the border, an arched capsule with the logo, a star medallion, the title and the text; the action in dark capitals on a gold plate; the handle on a small patch of plain ground |

## Brand

`brand.accent` replaces the antique gold (#C9A44C). It colors all the line art: the card border and corner
fans, the numeral, the arch, the emblems, the plate frames, the small cards of the spread, the oval, the
sun, the lattice of the card back, `*emphasis*`, the highlights of the image duotone and the action plate.
The oxblood ground and the bone text never change. Metallic and light, soft colors work best on the
oxblood: brass, champagne, rose gold, silver, sage, dusty rose, pale blue. Dark colors are lifted
automatically to a light tint of the same hue so the lines stay visible (navy becomes periwinkle), but they
then look paler than the brand color. Red, orange and wine accents blend into the ground; avoid them. The
text on the action plate is always dark wine, which reads on every accent after the lift. `brand.logo`
appears on the cover at the top of the arch, above the kicker, and on the card back above the medallion,
64 px high; use a light version (white, bone or gold), because a dark logo disappears on the oxblood.
`brand.handle` appears at the foot of every card in small italic between two gold diamonds.
