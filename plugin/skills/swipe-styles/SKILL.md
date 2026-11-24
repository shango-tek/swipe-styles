---
name: swipe-styles
description: Make finished social media carousels from a topic or a draft. Writes the slides and renders them as Instagram PNG slides, a PDF for LinkedIn document posts and a caption with hashtags, in a ready-made designed style (for example Swiss Grid, Notebook or Riso Zine) with the user's handle, brand color and logo. Use this whenever someone wants a carousel, a swipe post, a multi-image Instagram post, a LinkedIn PDF or document post, or slides about a topic for social media, even if they never say the word carousel. Also use it to restyle, shorten, translate or re-render an existing carousel.json. Not for presentation decks (PowerPoint, Keynote, Google Slides).
argument-hint: "[topic, and optionally style, platform, language]"
---

# Swipe Styles

Turn a topic into a carousel the user can post right away. You write only the content, as a small
`carousel.json`. The style's templates do the design, and the renderer checks that every text fits.
Don't build slides from your own HTML or CSS: the styles come with bundled fonts, tuned type sizes and
a fit check, and hand-made slides lose all three.

`${CLAUDE_SKILL_DIR}` below is the folder of this file. The scripts need Node.js 20 or newer.

## 1. Check the setup

```bash
node "${CLAUDE_SKILL_DIR}/scripts/setup.mjs" --check
```

- **Exit 0:** ready. Go on.
- **Exit 3:** the one-time setup is needed. Tell the user in one sentence what it does: it installs
  Playwright (about 20 MB) into `~/.cache/swipe-styles` and uses a browser that is already there (their
  Google Chrome); only when there is none, it downloads a headless Chromium (about 100 MB, 300 MB on disk).
  Then run it, allowing up to 10 minutes:
  ```bash
  node "${CLAUDE_SKILL_DIR}/scripts/setup.mjs"
  ```
  Its output says which browser it chose and whether it downloaded anything. Mention that in your final
  reply, so the user knows what was installed.
- **`node` not found, or a Node.js version error:** ask the user to install Node.js 20 or newer from
  nodejs.org. Don't install it yourself.

## 2. Work out the brief, without an interview

The promise is one sentence in, a finished carousel out. So make the choices yourself and list them when
you deliver, where the user can change them in one sentence. Ask first only when you cannot tell what the
carousel should be about.

| Decide | Default |
|---|---|
| Angle | One concrete angle on the topic: a how-to, mistakes to avoid, a story with a lesson, a checklist. |
| Audience | Whoever the user seems to be talking to. |
| Language | The language of the request. Set `lang` to its code (`en`, `de`, `fr`); hyphenation depends on it. |
| Platform | Instagram: `"format": "instagram"` (1080×1350). LinkedIn: `"format": "linkedin"`, same size, posted as the PDF. `"square"` (1080×1080) only when asked. |
| Length | 7 slides: a cover, 5 content slides, a call to action. Use 5 to 10. Instagram allows at most 20. |
| Style | The one the user named. Otherwise the best match from step 3. |
| Brand | What the user gave: name, handle, accent color, logo file. If `carousels/` already has a `carousel.json` from an earlier run, reuse its `brand` block. Otherwise leave `brand` out; never invent a handle. |

## 3. Choose the style

```bash
node "${CLAUDE_SKILL_DIR}/core/render.mjs" --styles
```

This lists every style with what it suits. Pick by topic, and when several fit, by the tone the user's
audience expects; name the runner-up when you deliver, so the user can switch. Then read two files of the
chosen style:

- `${CLAUDE_SKILL_DIR}/styles/<id>/STYLE.md`: how each slide type looks in this style, what the accent color
  does, and how to write for it. Follow its writing notes: they are what makes the slides look designed
  rather than filled in.
- `${CLAUDE_SKILL_DIR}/styles/<id>/style.json`: its `limits` are the word limits per field, such as
  `"text.body": { "words": 55 }`. For `points.items`, `count` is the most items, and `words` counts each
  item's title and text together. Write within them from the start; the renderer warns about every text
  that goes over.

## 4. Write carousel.json

Save it as `carousels/<short-topic-name>/carousel.json` in the current folder, unless the user named another
place.

```json
{
  "style": "swiss-grid",
  "format": "instagram",
  "lang": "en",
  "topic": "Pricing design work",
  "brand": { "name": "Northline Studio", "handle": "@northline.studio", "accent": "#0F766E" },
  "slides": [
    { "type": "cover", "kicker": "Pricing guide", "title": "How we price design work", "subtitle": "Three rules that ended our underpaid projects." },
    {
      "type": "points",
      "title": "Three rules",
      "items": [
        { "title": "Price the outcome", "text": "Clients pay for what the work changes, not for the hours." },
        "Write the scope down before the first sketch.",
        { "title": "Raise prices every year", "text": "Small steps keep long-term clients on board." }
      ]
    },
    { "type": "cta", "title": "Save this for your next quote", "action": "Follow for more" }
  ],
  "caption": "We stopped charging by the hour. Here is what changed.\n\nSave it for your next quote.",
  "hashtags": ["designbusiness", "freelancedesign", "pricing"]
}
```

| type | needs | optional | use it for |
|---|---|---|---|
| `cover` | `title` | `kicker`, `subtitle` | the hook |
| `text` | `body` | `title`, `kicker` | one idea in two or three sentences |
| `points` | `items` | `title`, `kicker` | 3 to 5 items; each is text, or `{ "title": …, "text": … }` |
| `quote` | `quote` | `author`, `role` | a real quote by a real person |
| `stat` | `value`, `label` | `note`, `kicker` | one number that matters |
| `image` | `src` | `title`, `caption` | a photo or screenshot the user gave you |
| `cta` | `title` | `text`, `action` | the last slide |

- **Top level:** `style`, `format`, `lang`, `topic`, `brand`, `slides`, `caption`, `hashtags`. `topic` is
  a note for you and later edits; it is not drawn on the slides. File paths are relative to
  `carousel.json`. Unknown fields are errors, so typos get caught.
- **Brand:** every field is optional. `handle` appears in the footer of every slide, `logo` (an image file)
  on the cover and the last slide, and `accent` (a hex color such as `"#2F5D50"`) replaces the style's
  accent color, as STYLE.md describes. `name` is kept with the carousel but not drawn by the current styles.
- **In the text:** `*word*` marks emphasis (each style draws it its own way), and `\n` forces a line break.
  Nothing else: no Markdown, no HTML, and no emoji on slides (the style fonts have none).

### Writing that works on a carousel

- **The cover is the hook.** It decides whether anyone swipes. Promise a specific payoff ("How we price
  design work", "5 mistakes that sink your sourdough"), not a topic label ("About pricing").
- **One idea per slide**, readable in about three seconds on a phone. Stay within the word limits in
  STYLE.md. The renderer shrinks text that is too long, and shrunk text is harder to read on a phone.
- **Be specific.** Use the user's own numbers, names and examples. Generic advice reads as filler.
- **Every claim must be true, on every slide.** People save carousels and act on them. Check legal, tax,
  health and money advice twice, and prefer advice that holds in all common cases. When it depends on the
  country, write for the country of the user's language and say so when you deliver.
- **Don't invent numbers or quotes.** A `stat` needs a number the user gave you, a well-known fact, or a
  common rule of thumb that the `note` calls one; without one, use another slide type. A `quote` needs a
  real quote with its real author, or no quote slide at all.
- **Images only from the user.** Don't download pictures from the web for an `image` slide: the user may
  have no right to post them. Without a user image, use the other types.
- **Watch the line breaks in big type.** A headline should not break inside a word with a hyphen
  ("Steuer-ID", "e-mail") or between a number and its unit, and should not end with one lonely word. The
  fit check can't see this; the overview in step 6 can. Rephrase, or force the break with `\n`.
- **End with one action** in the `cta`: save, share, comment, follow, or the link in the bio. One, not
  three: the `text` above it gives the reason, not a second request.
- **Caption:** a first line that works on its own (it is all people see before "more"), two to four short
  lines, then the call to action. Hashtags without the `#` (the renderer adds it): 3 to 5 specific ones
  for Instagram, 2 or 3 for LinkedIn.

## 5. Render and fix

```bash
node "${CLAUDE_SKILL_DIR}/core/render.mjs" carousels/<name>/carousel.json
```

It writes `carousels/<name>/slides/`: `slide-01.png` and onwards, `carousel.pdf`, `caption.txt`,
`report.json`, and `.swipe/overview.png`. It prints how many errors and warnings there are, then one line
for each; `report.json` has the same list.

| exit | meaning | what to do |
|---|---|---|
| 0 | done | Read the warnings, then go to step 6. |
| 2 | rendered, but `report.json` has errors | An `overflow` error names the slide and the field whose text does not fit, even at the smallest allowed size. Rewrite that text shorter (keep the meaning, don't just cut the end) or split the slide in two. `font` and `image` errors name the file. Then render again. |
| 1 | `carousel.json` is invalid | The message lists every problem. Fix them and render again. |
| 3 | setup needed | Go back to step 1. |

Warnings don't block, but act on them. `limit` means the text is longer than the style is designed for;
shorten it. `small-text` means a text was shrunk below a comfortable reading size; shorten it too.
Two or three rounds are normal. If a slide still fails after three, spread its content over two slides.

## 6. Look at it

Read `slides/.swipe/overview.png`, which shows all slides on one image. The fit check catches overflow, not
taste, so check what only eyes can: Does the cover make you want to swipe? Does each slide read at phone
size? Do the line breaks and the emphasis fall in good places? Does the order build up to the call to
action? Open a single `slide-NN.png` where the overview is too small to judge. Fix and render again if
needed.

## 7. Deliver

Reply briefly:
- where the files are, and what to post: for Instagram the PNGs in order; for LinkedIn `carousel.pdf`,
  as a document post;
- the caption from `caption.txt`, ready to paste;
- the choices you made (style, format, language, number of slides), and that one sentence changes them
  ("switch to Notebook", "make it German", "shorter").

Don't post or upload anything yourself. Posting is the user's call.

## Later changes

Edit `carousel.json` and render again. To try another style and keep the first one:
`--style <id> --out carousels/<name>/slides-<id>`. To change the size: `--format square`.

## If something goes wrong

- **Long words break badly, or text fits on one computer but not on another:** that computer's Chrome may
  lack hyphenation for the language. `node "${CLAUDE_SKILL_DIR}/scripts/setup.mjs" --browser chromium`
  switches to Playwright's Chromium.
- **Setup fails behind a company proxy:** npm needs the proxy settings. Tell the user; don't change their
  npm configuration yourself.
- **Anything else:** `report.json` lists every error with the slide it belongs to.
