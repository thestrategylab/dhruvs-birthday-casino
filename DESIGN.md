---
name: Dhruv's Birthday Casino
description: A pocket casino table for one birthday night — felt, foil, and dealt cards in dim light.
colors:
  felt-deep: "#052018"
  felt: "#082B20"
  felt-bright: "#0B3D2E"
  felt-mid: "#11503C"
  felt-line: "#1A5C46"
  gold: "#D4AF37"
  gold-hi: "#F0D98C"
  gold-dim: "#8C7426"
  gold-ink: "#2A2008"
  brass-lit: "#E9CC74"
  brass-shade: "#B8932C"
  bone: "#F3EBD8"
  bone-dim: "#CFC5AC"
  card-face: "#F7F1E1"
  card-ink: "#232019"
  card-back-red: "#7E1F15"
  red: "#C0392B"
  red-hi: "#E05445"
  cabinet: "#123F30"
  ink-mid: "#C9D6CB"
  ink-low: "#8FA796"
  good: "#7FC98B"
typography:
  marquee:
    fontFamily: "Limelight, Georgia, serif"
    fontSize: "clamp(34px, 11vw, 48px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "0.01em"
  label:
    fontFamily: "Oswald, Avenir Next Condensed, sans-serif"
    fontWeight: 500
    fontSize: "12px"
    letterSpacing: "0.2em"
  body:
    fontFamily: "Source Sans 3, -apple-system, Segoe UI, sans-serif"
    fontSize: "16px"
    lineHeight: 1.45
  card:
    fontFamily: "Libre Bodoni, Georgia, serif"
    fontWeight: 700
    fontSize: "24px"
    lineHeight: 1
rounded:
  plaque: "8px"
  control: "10px"
  option: "12px"
  card: "14px"
  playing-card: "16px"
  cabinet: "18px"
  chip: "999px"
spacing:
  xs: "8px"
  sm: "10px"
  md: "14px"
  lg: "18px"
components:
  chip-gold:
    backgroundColor: "linear-gradient(180deg, {colors.gold-hi}, {colors.gold} 55%, {colors.brass-shade})"
    textColor: "{colors.gold-ink}"
    rounded: "{rounded.chip}"
    padding: "14px 22px"
  chip-red:
    backgroundColor: "linear-gradient(180deg, {colors.red-hi}, {colors.red} 55%, #8E2A1F)"
    textColor: "{colors.bone}"
    rounded: "{rounded.chip}"
    padding: "14px 22px"
  chip-quiet:
    backgroundColor: "rgba(243,235,216,.07)"
    textColor: "{colors.bone}"
    rounded: "{rounded.chip}"
    padding: "14px 22px"
  table-card:
    backgroundColor: "linear-gradient(168deg, #FBF6E8 0%, {colors.card-face} 60%, #ECE2C8 100%)"
    textColor: "{colors.card-ink}"
    rounded: "{rounded.card}"
    padding: "40px 28px 13px 13px"
  prompt-card:
    backgroundColor: "linear-gradient(168deg, #FBF6E8, {colors.card-face} 60%, #ECE2C8)"
    textColor: "{colors.card-ink}"
    rounded: "{rounded.card}"
    padding: "30px 22px"
  sip-strip:
    backgroundColor: "linear-gradient(180deg, {colors.brass-lit}, {colors.gold} 50%, {colors.brass-shade})"
    textColor: "{colors.gold-ink}"
    rounded: "{rounded.plaque}"
    padding: "11px 20px"
  suit-tile-spade:
    backgroundColor: "linear-gradient(170deg, #14513E, {colors.felt-mid})"
    textColor: "{colors.bone}"
    rounded: "{rounded.card}"
    padding: "14px 14px 12px"
  suit-tile-heart:
    backgroundColor: "linear-gradient(170deg, {colors.red-hi}, #993022)"
    textColor: "{colors.bone}"
    rounded: "{rounded.card}"
    padding: "14px 14px 12px"
  suit-tile-club:
    backgroundColor: "linear-gradient(170deg, {colors.gold-hi}, #BE9A2F)"
    textColor: "{colors.gold-ink}"
    rounded: "{rounded.card}"
    padding: "14px 14px 12px"
  suit-tile-diamond:
    backgroundColor: "linear-gradient(170deg, #93362A, #6E2018)"
    textColor: "{colors.bone}"
    rounded: "{rounded.card}"
    padding: "14px 14px 12px"
  slot-cabinet:
    backgroundColor: "linear-gradient(180deg, {colors.cabinet}, #0A2B20)"
    textColor: "{colors.bone}"
    rounded: "{rounded.cabinet}"
    padding: "16px 14px 18px"
  slot-reel:
    backgroundColor: "linear-gradient(180deg, #FBF6E8, {colors.card-face})"
    textColor: "{colors.card-ink}"
    rounded: "{rounded.control}"
    height: "162px"
  player-chip:
    backgroundColor: "linear-gradient(180deg, #FBF6E8, {colors.card-face})"
    textColor: "{colors.card-ink}"
    rounded: "{rounded.chip}"
    padding: "7px 8px 7px 13px"
  option-row:
    backgroundColor: "rgba(243,235,216,.07)"
    textColor: "{colors.bone}"
    rounded: "{rounded.option}"
    padding: "13px 16px"
  input-text:
    backgroundColor: "rgba(3,22,16,.6)"
    textColor: "{colors.bone}"
    rounded: "{rounded.control}"
    padding: "11px 14px"
---

# Design System: Dhruv's Birthday Casino

## Overview

**Creative North Star: "The Pocket Casino Table"**

The phone is a casino table dealt for one birthday night. The ground is deep
felt green — a fixed full-viewport layer (`body::before`; iOS Safari breaks
`background-attachment:fixed`, so the felt lives on its own fixed element)
running Bright Felt (#0B3D2E) down into Deep Felt (#052018) with a faint gold
glow at the top and crosshatch texture — and everything on it reads as a
physical table object: chip-shaped buttons with gold edge-rings, bone-paper
playing cards with corner pips and an inset gold frame, a maroon
diagonal-stripe card back, a brass payout plaque, a slot-machine cabinet. A
thin fixed gold rail (`body::after`, inset 5px, 1px rgba(212,175,55,.22), 16px
radius) frames every viewport like the padded rim of the table. Antique gold
foil is the signage voice; carmine red is the second suit. Single dark theme
by design: the party scene is a dim room, and the system never offers a light
mode.

The world explicitly refuses the pastel "party app" look — no confetti, no
flat tile grid, no system fonts, and (round-2 confirmed) **no raw emoji**:
every pictorial glyph renders as a local Twemoji sticker SVG via `emo()`, and
UI chrome uses hand-drawn stroke icons. It is dense but legible at arm's
length on a passed phone (390px primary viewport), with big tap targets and
one shared reveal grammar (the deal) so all 16 games feel like the same table.

**Key Characteristics:**
- Dark felt ground on a fixed layer; the only light surfaces are dealt paper objects.
- Gold is signage, edge, and payout brass — never a wash; it carries labels, rules, rims, and the table rail.
- Every surface is a casino object: chip, card, tile, reel, wheel, plaque — not a generic panel.
- One motion grammar (deal / flip / glint) shared by all 16 games.
- Four-font cast with strict roles: marquee, label, body, card pips.
- Pictorials are stickers (local Twemoji SVGs) and drawn stroke icons, never raw emoji glyphs.

## Colors

A three-material palette: felt (ground), foil (signage), and paper (objects),
with carmine red as the lone hot accent. Each material carries its own shipped
tonal ramp (the full ramps are enumerated in `.impeccable/design.json`);
gradient endpoints like Brass Lit (#E9CC74) and Brass Shade (#B8932C) are ramp
members, not strays.

### Primary
- **Antique Gold** (#D4AF37): the foil. Section labels, chip button bodies, wheel rims and hub, timer-ring progress, slot-reel bezels, selection states, the table rail. The voice of the house.
- **Foil Highlight** (#F0D98C): the lit edge of gold — marquee title, emphasized words in rules text, scoreboard values, card-back monogram, locked-reel glow, correct-tile outline, focus outline.
- **Brass Lit / Brass Shade** (#E9CC74 / #B8932C): the engraved-brass ends of gold gradients — payout plaque top, chip and club-tile bottoms.
- **Dim Foil** (#8C7426): worn gold for hairlines — the double rule, dashed how-to borders, slot-cabinet border, fading flourishes. Its darker engraving cut is #8C6F1E (plaque flourettes).
- **Foil Ink** (#2A2008): the only text color allowed on gold and brass surfaces (chip buttons, toast, sip strip, club tile).

### Secondary
- **Carmine** (#C0392B): red suit pips, destructive/opposing chip buttons, Team B, the slot payline band (rgba(192,57,43,.55)). The casino's second suit.
- **Carmine Lit** (#E05445): hover-energy red — red chip and heart-tile gradient tops, danger timer ring, wrong-answer state (doubles as the `--bad` token).
- **Card-Back Maroon** (#7E1F15, striped with #6E1A11): the diagonal-stripe card back and the hold-to-peek secret surface, always framed by a 6px bone border. The diamond tile runs the adjacent maroon pair #93362A → #6E2018.

### Neutral
- **Bone** (#F3EBD8): primary text on felt (`--ink-hi` resolves to the same value), icon strokes, black-suit symbols on dark ground. Dimmed to Bone Dim (#CFC5AC) where paper must recede.
- **Card Face** (#F7F1E1, gradient to #FBF6E8/#ECE2C8): the paper of every dealt object — table tiles, prompt cards, player chips, card fronts, slot reels.
- **Card Ink** (#232019): all text printed on paper surfaces; muted on-paper secondary text is #6b6353.
- **Table Mist** (#C9D6CB `--ink-mid` / #8FA796 `--ink-low`): secondary and tertiary text on felt — how-to copy, counts, notes, quiet labels.
- **Felt Line** (#1A5C46): the only border color on dark surfaces — boxes, inputs, option rows, topbar rule. The felt family runs #052018 → #082B20 → #0B3D2E → #11503C (Felt Mid, spade-tile ground) with #123F30 as the slot-cabinet shade.
- **Win Green** (#7FC98B): correct-answer state only.

### Named Rules
**The Three-Materials Rule.** Every element is made of felt, foil, or paper. A
light background means the element is a dealt paper object (card ink text, inset
gold frame, drop shadow onto the table); there are no light "UI panels."

**The Foil Ink Rule.** Text on a gold or brass surface is always Foil Ink
(#2A2008), never white, never bone. Text on paper is always Card Ink (#232019).

**The One Hot Suit Rule.** Red appears only as suit pips, opposing/destructive
actions, danger states, the payline, and the card back. It never decorates.

**The Ramp Rule.** New shades of felt, gold, or red are drawn from the shipped
tonal ramps in the sidecar; don't invent a fourth material or an off-ramp hue.

## Typography

**Marquee Font:** Limelight (with Georgia, serif) — self-hosted woff2
**Label Font:** Oswald variable 200–700 (with Avenir Next Condensed, sans-serif)
**Body Font:** Source Sans 3 variable 200–900 + italic (with -apple-system, Segoe UI)
**Card Font:** Libre Bodoni variable 400–700 (with Georgia, serif)

**Character:** A 1930s marquee headliner over a condensed signage voice, with a
plainspoken body and a Bodoni deck for pips and ranks. Four fonts, zero overlap
in duty.

### Hierarchy
- **Marquee** (400, clamp(34px, 11vw, 48px), lh 1.04): the title sign only — app name, with layered gold text-shadow glow. Smaller marquee moments (30px) announce the current player's name, big results, and the card-back monogram. Limelight never drops below 30px.
- **Label** (Oswald 500–600, 10.5–15px, uppercase, tracked .07–.32em): all signage — topbar titles, section markers, chip button text, card ranks-in-words, sip strips, footer foil. Tracking widens as size shrinks (15px/.18em → 11px/.3em).
- **Body** (Source Sans 3 400–700, 12.5–20px, lh 1.3–1.45): prompts, how-to copy, options, verdicts. Prompt text is 20px/600 with `text-wrap:balance`; on-paper secondary text is italic or #6b6353. Suit-tile answers are 15px/700.
- **Card** (Libre Bodoni 700, 14–72px): corner pips, big center suits, suit glyphs — and slot-reel player names (15px/700). Exclusively for playing-card and reel anatomy.
- **Numerals:** scores, counts, and timers always use `font-variant-numeric: tabular-nums`.

### Named Rules
**The Four-Voices Rule.** Limelight announces, Oswald labels, Source Sans
speaks, Bodoni deals. No font ever does another's job — body text is never
uppercase, labels are never sentence-case, Limelight never sets copy.

**The Tracked Caps Rule.** Every Oswald label is uppercase with letter-spacing
of at least .07em; tightest on big buttons (.14em), widest on tiny flourishes
(.3em+).

## Layout

Single column, mobile-first for a 390px master phone, max-width 520px centered
(`.wrap`), 18px side padding, 40px bottom padding plus safe-area insets. Two
screens toggle (home / game) with a .32s rise-in. The game floor is a 2-up grid
of 16 table cards (12px gap) that becomes 3-up at ≥460px — the only breakpoint
— with the orphan tile centered (`last-child:nth-child(3n+1)` → column 2).
Answer boards (`.optgrid`) and player picks (`.pgrid`) are 2-up grids (9–10px
gap). Game screens use a sticky blurred topbar (back · title · restart) and a
`.panel` that vertically centers its content against `min-height: calc(100svh
- 170px)`, so every game presents like a cleared table. Rhythm runs on an
8/10/12/14/18px step; section gaps are 14–18px, control gaps 8–10px. Section
boundaries are drawn with gold hairlines (the double rule, gradient-fade
flanks on floor labels), never with heavy dividers. Two fixed framing layers
bracket everything: the felt on `body::before` (z -1) and the gold table rail
on `body::after` (z 95).

## Elevation & Depth

Depth is physical: objects sit on the felt and cast real shadows downward;
nothing glows upward except the marquee's foil halo. The system is a hybrid of
drop shadows (for paper, chips, tiles) and translucent tonal layering (for
felt-on-felt boxes like `rgba(5,32,24,.5)` roster and how-to panels, which use
a Felt Line border instead of a shadow). The slot cabinet adds the one recessed
surface: inset shadow (`inset 0 2px 10px rgba(0,0,0,.5)`) with reels shaded by
inset top/bottom gradients (`inset 0 ±14px 16px rgba(0,0,0,.28)`) so the strip
reads as curved behind glass.

### Shadow Vocabulary
- **Chip stack** (`0 2px 0 #06251B, 0 6px 14px rgba(0,0,0,.45)` — `--chip-s`): chip buttons; the hard 2px base is the chip's edge. On press the button translates down 2px and the base compresses to 1px.
- **Tile stack** (`0 3px 0 rgba(4,24,17,.8), 0 7px 16px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.14)`): suit tiles — same press-flat physics as chips.
- **Plaque base** (`0 2px 0 #06251B, 0 5px 12px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.5)`): the sip strip; the inset white line is the engraved brass bevel, paired with `text-shadow: 0 1px 0 rgba(255,255,255,.35)`.
- **Dealt card** (`0 3px 7px rgba(0,0,0,.4), 0 10px 22px rgba(0,0,0,.25)`): table tiles; prompt cards use the heavier `0 5px 12px / 0 16px 34px` pair.
- **Held card** (`0 6px 16px rgba(0,0,0,.5), 0 18px 40px rgba(0,0,0,.3)`): the 3D playing card and peek card — lifted highest off the table.
- **Toast** (`0 8px 24px rgba(0,0,0,.5)`): the floating gold announcement.

### Named Rules
**The Table Physics Rule.** Shadows always drop down onto the felt; the higher
an object sits in the hierarchy (tile → prompt → held card), the longer its
shadow. Pressing a chip or tile compresses its stack — elevation responds to
touch, not hover.

## Shapes

Two silhouettes rule the system: the pill and the card. Buttons and player
chips are full pills (999px) with inset rings (a 1px white inner highlight and
a 5px dark inner ring on gold chips — the chip's edge-print). Cards are
rounded rectangles — 14px for tiles, prompt cards, and suit tiles, 16px for
the 5:7 playing card — and every paper surface carries an inset printed gold
frame: `inset 5–7px, 1px solid rgba(176,142,45,.45), radius 9–10px`.
Playing-card anatomy repeats everywhere: corner pip top-left, rotated mirror
pip bottom-right. Hardware shapes bracket the range: the brass plaque is the
tightest corner (8px), the slot cabinet the roundest box (18px) with 10px
reels inside 3px gold bezels. Utility shapes (inputs, option rows, icon
buttons, scoreboxes) are 10–12px rounded rectangles with 1px Felt Line
borders; number steppers reuse the `.scorebox` shell for their readouts. Dark
surfaces are bordered, never framed; borders on felt are always Felt Line
except the intentionally dashed Dim Foil how-to box and the Dim Foil cabinet.

### Named Rules
**The Gold Frame Rule.** Every paper surface (tile, prompt card, card front,
symbol card) carries the inset 1px gold frame. A light surface without the
frame is not of this world.

## Components

### Chip Buttons (`.chipbtn`)
- **Character:** a casino chip you press flat into the table.
- **Shape:** full pill ({rounded.chip}), Oswald 500 uppercase .14em, 14px/16px text, padding 14px 22px (big: 17px 22px, full width).
- **Gold (primary):** vertical foil gradient (#F0D98C → #D4AF37 → #B8932C), Foil Ink text, chip-stack shadow + inset edge rings.
- **Red:** carmine gradient (#E05445 → #C0392B → #8E2A1F), bone text — opposing or lower-stakes choices.
- **Quiet:** translucent bone fill `rgba(243,235,216,.07)`, Felt Line inner ring — secondary/skip actions.
- **Active:** translateY(2px) + compressed shadow (.12s). **Disabled:** grayscale + dimmed, no pointer events.
- Inline arrows/checks inside buttons are drawn SVGs (see Icons), never glyphs.

### Table Cards (`.table-card`, the game floor)
- Playing-card tile: paper gradient, 14px radius, inset gold frame, min-height 128px, content bottom-aligned.
- Corner pip (Libre Bodoni 700, red or near-black #20242c) top-left, rotated mirror pip bottom-right; player-count tag (Oswald 10.5px, #6f6236) top-right.
- Title: Oswald 600 uppercase 15.5px; hook line 12.5px #6b6353. Active: scale(.97).

### Prompt Card (`.prompt-card`)
- The dealt content surface: paper gradient, centered 20px/600 balanced text, tracked-caps category line in #6f6236, italic sub-line, deals in with the shared dealIn motion. Sticker rows (`.emojirow`) run 40px with .1em spacing.

### Sip Strip (`.sip-strip`, the payout plaque)
- Every penalty and payout is announced on an engraved brass plaque: brass gradient (#E9CC74 → #D4AF37 → #B8932C), Foil Ink Oswald 600 uppercase .14em 13px, 8px radius, width fit-content centered, plaque-base shadow + bevel text-shadow, flanked by small #8C6F1E four-point flourettes.
- **Rule of use:** if someone drinks, the plaque says so — sips are never announced in plain body text.

### Suit-Tile Answer Board (`.optgrid` + `.suit-tile`)
- Trivia answers are four casino tiles in a 2×2 grid, one per suit, each with a Bodoni suit pip and 15px/700 answer text, 14px radius, tile-stack shadow, press-flat active.
- **Shades:** spade #14513E→#11503C (bone text), heart #E05445→#993022 (bone), club #F0D98C→#BE9A2F (Foil Ink), diamond #93362A→#6E2018 (bone); each with a 1px lit border of its own hue.
- **Resolve:** wrong picks shake (.4s) then the field dims to 35%/desaturated; the correct tile stays lit with a 3px Foil Highlight outline and scale(1.02).

### Daaru Slots (`.slots` / `.reel` / `.slotname`)
- A dark cabinet (gradient #123F30 → #0A2B20, 18px radius, 2px Dim Foil border, recessed inset shadow) holding three paper reels (3px gold bezel, 10px radius, max 118px × 162px, inset top/bottom shading).
- Names are 54px-tall Bodoni 700 cells; the payline is a translucent carmine band across the middle cell. Reels spin by translating the strip with staggered durations (1.6s + 0.7s per reel, `cubic-bezier(.15,.85,.25,1)`); a settled reel locks with a Foil Highlight border + glow and a haptic tick.

### Playing Card (`.pcard`)
- True 3D card, 5:7 ratio, min(210px, 56vw), 16px radius, 900px perspective.
- **Back:** maroon diagonal stripes + gold center glow, 6px Card Face border, Limelight monogram.
- **Front:** paper gradient, Bodoni corner pips + 72px center suit, Oswald rank-word.
- **Flip:** `.flip` rotates Y 180° over .55s `cubic-bezier(.3,1.2,.3,1)`; **Glint:** `.glint` sweeps a white diagonal highlight across the settled face (.9s ease-out, .35s delay). This flip+glint pair is the signature reveal.

### Peek Card (`.peek`, hold-to-reveal)
- Secret-role surface: card-back material (maroon stripes, 6px bone border) with gold hint label and Limelight player name; `touch-action:none`.
- **Open:** flips material to paper — card-ink text, maroon border; role colors inside (#1d6b3a villager / Carmine bad / #1d4e6b special).

### Options & Player Grid (`.opt`, `.pgrid`)
- 12px-rounded translucent rows on felt, Felt Line border, 16px/600 text, gold Oswald letter prefix.
- **Correct:** Win Green tint/border; **Wrong:** Carmine Lit tint/border; **Selected:** gold border + `rgba(212,175,55,.16)` fill; **Eliminated:** 35% opacity + strikethrough.

### Inputs & Steppers (`.addrow input`, `.numin`, `.scorebox`)
- Near-black felt wells (`rgba(3,22,16,.6)`), Felt Line border, 10–12px radius, bone text, ≥16px font (no iOS zoom), Table Mist placeholders. Focus: global 2px Foil Highlight outline, offset 3px.
- Number steppers pair chip buttons with a `.scorebox` readout (Felt Line box, Oswald tracked-caps label, 26px/700 Foil Highlight tabular numeral) — the same box that serves as scoreboard cell.

### Icons & Stickers (the no-raw-emoji system)
- **Drawn icons:** every chrome icon is an inline stroke SVG — `currentColor`, `fill:none`, round caps and joins; `icon()` emits 14px glyphs at stroke 2.4 for inline use, the 40px topbar `.iconbtn` runs its 20px glyphs at stroke 1.8. No icon fonts, no glyph characters.
- **Stickers:** `emo()` grapheme-segments any string and swaps each emoji for a local Twemoji SVG `<img class="twe">` (1.18em, vertical-align -.2em; `.twe-big` 1.4em) from `assets/twemoji/` via `EMOJI_SRC`. Unmapped text passes through escaped. 141 stickers ship locally; nothing loads from a CDN.

### Timer Ring (`.ring`)
- 140×140 SVG ring, 9px stroke: faint bone track, gold progress (stroke-dashoffset, .2s linear tick), flipping to Carmine Lit in danger; Oswald 40px tabular numeral centered.

### Wheel (`.wheel`)
- SVG roulette: segments alternate Carmine and felt green with 1.5px gold strokes, bone Oswald segment labels, gold hub with Limelight "D" monogram, 4px gold rim, Foil Highlight pointer. Spin: 4.6s `cubic-bezier(.12,.6,.04,1)` rotation with long decelerating settle.

### Toast (`#toast`)
- Gold pill fixed bottom-center, Foil Ink 700 text, rises in .25s. The house announcing.

### Motion Grammar (the deal)
All reveals share one family: **dealIn** (.4s `cubic-bezier(.2,1.1,.3,1)` — rise 16px, un-rotate -1.2°, settle from .97 scale), **flip** (.55s `cubic-bezier(.3,1.2,.3,1)` — slight overshoot), **glint** on settle, screen entry .32s `cubic-bezier(.2,.8,.2,1)`. Durations .12–.55s for interaction; long tails only for the wheel spin and the staggered slot reels. `prefers-reduced-motion` collapses all animation to ~0.

## Do's and Don'ts

### Do:
- **Do** render every new surface as a table object — chip, card, tile, reel, plaque, or felt box — with the matching material, shadow, and (on paper) the inset gold frame.
- **Do** use the shared deal/flip/glint grammar for any new reveal; never invent a second reveal motion.
- **Do** announce every sip penalty on the brass sip-strip plaque, never in plain body text.
- **Do** keep tap targets ≥40px and input font-size ≥16px; this is a passed phone in a dim room.
- **Do** use tabular numerals for every count, score, and timer.
- **Do** respect the fixed framing layers — felt on `body::before`, gold rail on `body::after`; screens change, the table does not.

### Don't:
- **Don't** add a light theme, white panels, or pastel accents; the single dark felt theme is a confirmed product decision.
- **Don't** render raw emoji or glyph icons anywhere — pictorials go through `emo()` (local Twemoji stickers) and chrome icons are drawn stroke SVGs; confirmed round-2 product decision.
- **Don't** put white or bone text on gold or brass — those surfaces take Foil Ink (#2A2008) only.
- **Don't** set Limelight below 30px or use it for running copy; it is signage.
- **Don't** use borders other than Felt Line on dark surfaces (the two Dim Foil exceptions: dashed how-to box, slot cabinet), or drop the gold frame from paper surfaces.
- **Don't** use hover as a primary state — this is a touch surface; states respond to `:active` and `:focus-visible`.
