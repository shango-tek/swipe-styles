# Chat Thread

Every slide is one screen of a messaging conversation: a header bar with the brand's avatar and handle,
the audience's questions in white bubbles on the left, the creator's answers in accent bubbles on the
right. Warm, personal and instantly familiar, but its own app: a pale canvas tinted to the accent, plump
bubbles with a swept tail, and big type that reads easily on a phone.

**Suits:** coaching, relationships, customer stories, FAQs, marketing tips, conversations and dialogues.
**Not for:** data-heavy explainers, frameworks and step-by-step technical topics. Use Swiss Grid or
Blueprint for those.

## Writing for this style

- Write it as a conversation. A `title` on `text`, `points` and `image` is what the audience asks, so
  phrase it as their question ("How far ahead should we book you?"): up to 10 words on `text`, 8 on
  `points` and `image`. The answer is the creator talking: plain, warm, first person ("we", "I").
- The cover `title` is the first message, set very large in an accent bubble: up to 8 words. The
  `subtitle`, up to 14 words, follows as a second message. A typing indicator under them invites the swipe.
- `kicker`: on the cover, `text` and `points` it is a small centered pill above the messages, like the
  date line in a chat: 1 to 4 words ("Booking season", "Monday"). On `stat` the kicker is different: it is
  the question the number answers, shown as a received message, up to 8 words.
- `text`: the `body` is one answer bubble with a small heart reaction on it: up to 35 words.
- `points`: 3 to 5 items, sent as a burst of consecutive messages, one bubble per item. Give each item a
  `title` (1 to 3 words) and a `text`, up to 12 words per item together; plain strings work too. Write
  the title as a short label and the text as a full sentence: with 3 items the bold title sits on its own
  line, with 4 or 5 it runs into the text as a bold lead-in to save height.
- `stat`: `value` is sent on its own, huge and without a bubble, like a big emoji: up to 5 characters fit
  at full size ("700", "6–8", "92%", "3×"); longer values shrink. `label` (up to 9 words) follows as a
  bubble and reads on from the value ("edited photos from a full day"); `note` (up to 16 words) is a
  smaller follow-up bubble.
- `quote`: up to 26 words, as a large received message in the middle of the screen. Don't type quotation
  marks: the bubble already says someone is talking. `author` sits above the bubble in the accent, with a
  small avatar showing the first letter of the name; `role` follows the author in grey (2 to 4 words).
- `image`: the picture is sent as a photo message: a rounded bubble with a thin accent rim, cropped to
  fill all the height the text leaves. Photos with one clear subject in the middle work best; the edges
  may be cut. `title` (up to 8 words) is the question above it, `caption` (up to 16 words) the message
  under it.
- `cta`: the `title` (up to 7 words) is the creator's last message, the `text` (up to 16 words) a
  follow-up. The `action` appears typed into the input bar at the bottom, next to the send button, as if
  the reader is about to send it: 2 to 5 words ("Send us your date", "Save this for later").
- `*word*` makes words bold, the way chat apps do. Use it for the one fact a bubble is about ("*6 to 8
  weeks*"), at most once per slide, and not in the big cover and last messages.
- Keep a number and its unit together: type a no-break space (U+00A0) between them, and inside ranges
  ("12 to 18 months"), so a line never ends with a bare number. No emoji, ✓, ★, ♥ or №: Figtree has
  none of them (the style draws its own heart and send arrow). Arrows (→), × and € are fine.

## Slides

| type | looks like |
|---|---|
| `cover` | the header bar (avatar, name, handle, counter); the kicker as a centered day pill; the title as a huge sent bubble with the subtitle as a second bubble joined to it; a typing indicator on the left |
| `text` | the day pill if there is a kicker; the title as a white received question; the body as the sent answer with a heart reaction on its corner |
| `points` | the day pill; the title as the received question; the items as a burst of joined sent bubbles, bold title line on top, only the last one with a tail |
| `quote` | the author in the accent and the role in grey above a large white received bubble; a small round avatar with the author's first letter beside it |
| `stat` | the kicker as the received question; the value huge in the accent, right-aligned and without a bubble; the label and the note as two joined sent bubbles |
| `image` | the title as the received question; the picture as a photo message in a rounded accent rim, as tall as the slide allows; the caption as the sent bubble under it |
| `cta` | the title as a big last message, the text as a follow-up; at the bottom the input bar with the action typed in, a cursor after it, and the round send button |

Every slide has the same header bar: the logo or avatar, the brand name, the handle and the counter.

## Brand

`brand.accent` replaces mulberry (`#7A2E6B`). It colors the sent bubbles, the big stat value, the photo
rim, the send button, the back arrow, the author's name, the cursor and the reaction heart, and its hue
tints the whole screen: the canvas, the day pill and the grey text are pale or dark versions of it (a
grey or black accent gives a neutral grey screen). Sent bubbles always carry white text, so the style
darkens bright accents to a deeper shade of the same hue until white reaches at least 4.5:1. Deep and
mid colors (berry, plum, navy, forest, teal, brick, charcoal) stay exactly as given and look best; signal
red and orange come out a little deeper; yellow, mint and pastels come out much darker (yellow turns
ochre), so for a pale brand color pass a deeper shade of it. `brand.logo` appears in the round avatar in the header on every slide
(on white, scaled to fit, so square or round logos work best); without a logo the avatar shows the first
letter of `brand.name`, and without a name a neutral person icon. `brand.handle` appears under the name
in the header on every slide.
