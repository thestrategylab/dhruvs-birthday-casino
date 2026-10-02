---
name: Dhruv's Birthday Casino
description: A pocket casino table for one birthday night — felt, foil, and dealt cards in dim light.
colors:
  felt-deep: "#052018"
  felt: "#082B20"
  felt-bright: "#0B3D2E"
  felt-line: "#1A5C46"
  gold: "#D4AF37"
  gold-hi: "#F0D98C"
  gold-dim: "#8C7426"
  gold-ink: "#2A2008"
  bone: "#F3EBD8"
  card-face: "#F7F1E1"
  card-ink: "#232019"
  card-back-red: "#7E1F15"
  red: "#C0392B"
  red-hi: "#E05445"
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
  control: "10px"
  option: "12px"
  card: "14px"
  playing-card: "16px"
  chip: "999px"
spacing:
  xs: "8px"
  sm: "10px"
  md: "14px"
  lg: "18px"
components:
  chip-gold:
    backgroundColor: "linear-gradient(180deg, {colors.gold-hi}, {colors.gold} 55%, #B8932C)"
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
felt green — a fixed-attachment gradient from Bright Felt (#0B3D2E) down into
Deep Felt (#052018) with a faint gold glow at the top and crosshatch texture —
and everything on it reads as a physical table object: chip-shaped buttons
with gold edge-rings, bone-paper playing cards with corner pips and an inset
gold frame, a maroon diagonal-stripe card back. Antique gold foil is the
signage voice; carmine red is the second suit. This is a single dark theme by
design: the party scene is a dim room, and the system never offers a light
mode.

The world explicitly refuses the pastel "party app" look — no confetti, no
card-grid of flat tiles, no system fonts. It is dense but legible at arm's
length on a passed phone (390px primary viewport), with big tap targets and
one shared reveal grammar (the deal) so every game feels like the same table.

**Key Characteristics:**
- Dark felt ground, fixed; the only light surfaces are dealt paper objects.
- Gold is signage and edge, never a wash; it carries labels, rules, and rims.
- Every surface is a casino object: chip, card, wheel, ring — not a generic panel.
- One motion grammar (deal / flip / glint) shared by all 15 games.
- Four-font cast with strict roles: marquee, label, body, card pips.

## Colors

A three-material palette: felt (ground), foil (signage), and paper (objects),
with carmine red as the lone hot accent.

### Primary
- **Antique Gold** (#D4AF37): the foil. Section labels, chip button bodies, wheel rims and hub, timer-ring progress, selection states. The voice of the house.
- **Foil Highlight** (#F0D98C): the lit edge of gold — marquee title, emphasized words in rules text, sip-strip text, scoreboard values, card-back monogram, focus outline.
- **Dim Foil** (#8C7426): worn gold for hairlines — the double rule, dashed how-to borders, fading flourishes.
- **Foil Ink** (#2A2008): the only text color allowed on gold surfaces (chip buttons, toast).

### Secondary
- **Carmine** (#C0392B): red suit pips, destructive/opposing chip buttons, Team B. The casino's second suit.
- **Carmine Lit** (#E05445): hover-energy red — red chip gradient top, danger timer ring, wrong-answer state (doubles as the `--bad` token).
- **Card-Back Maroon** (#7E1F15, striped with #6E1A11): the diagonal-stripe card back and the hold-to-peek secret surface, always framed by a 6px bone border.

### Neutral
- **Bone** (#F3EBD8): primary text on felt (`--ink-hi` resolves to the same value), icon strokes, black-suit symbols on dark ground.
- **Card Face** (#F7F1E1, gradient to #FBF6E8/#ECE2C8): the paper of every dealt object — table tiles, prompt cards, player chips, card fronts.
- **Card Ink** (#232019): all text printed on paper surfaces; muted on-paper secondary text is #6b6353.
- **Table Mist** (#C9D6CB `--ink-mid` / #8FA796 `--ink-low`): secondary and tertiary text on felt — how-to copy, counts, notes, quiet labels.
- **Felt Line** (#1A5C46): the only border color on dark surfaces — boxes, inputs, option rows, topbar rule.
- **Win Green** (#7FC98B): correct-answer state only.

### Named Rules
**The Three-Materials Rule.** Every element is made of felt, foil, or paper. A
light background means the element is a dealt paper object (card ink text, inset
gold frame, drop shadow onto the table); there are no light "UI panels."

**The Foil Ink Rule.** Text on a gold surface is always Foil Ink (#2A2008),
never white, never bone. Text on paper is always Card Ink (#232019).

**The One Hot Suit Rule.** Red appears only as suit pips, opposing/destructive
actions, danger states, and the card back. It never decorates.

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
- **Body** (Source Sans 3 400–700, 12.5–20px, lh 1.3–1.45): prompts, how-to copy, options, verdicts. Prompt text is 20px/600 with `text-wrap:balance`; on-paper secondary text is italic or #6b6353.
- **Card** (Libre Bodoni 700, 14–72px): corner pips, big center suits, suit glyphs. Exclusively for playing-card anatomy.
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
of table cards (12px gap) that becomes 3-up at ≥460px — the only breakpoint.
Game screens use a sticky blurred topbar (back · title · restart) and a
`.panel` that vertically centers its content against `min-height: calc(100svh
- 170px)`, so every game presents like a cleared table. Rhythm runs on an
8/10/12/14/18px step; section gaps are 14–18px, control gaps 8–10px. Section
boundaries are drawn with gold hairlines (the double rule, gradient-fade
flanks on floor labels), never with heavy dividers.

## Elevation & Depth

Depth is physical: objects sit on the felt and cast real shadows downward;
nothing glows upward except the marquee's foil halo. The system is a hybrid of
drop shadows (for paper and chips) and translucent tonal layering (for
felt-on-felt boxes like `rgba(5,32,24,.5)` roster and how-to panels, which use
a Felt Line border instead of a shadow).

### Shadow Vocabulary
- **Chip stack** (`0 2px 0 #06251B, 0 6px 14px rgba(0,0,0,.45)` — `--chip-s`): chip buttons; the hard 2px base is the chip's edge. On press the button translates down 2px and the base compresses to 1px.
- **Dealt card** (`0 3px 7px rgba(0,0,0,.4), 0 10px 22px rgba(0,0,0,.25)`): table tiles; prompt cards use the heavier `0 5px 12px / 0 16px 34px` pair.
- **Held card** (`0 6px 16px rgba(0,0,0,.5), 0 18px 40px rgba(0,0,0,.3)`): the 3D playing card and peek card — lifted highest off the table.
- **Toast** (`0 8px 24px rgba(0,0,0,.5)`): the floating gold announcement.

### Named Rules
**The Table Physics Rule.** Shadows always drop down onto the felt; the higher
an object sits in the hierarchy (tile → prompt → held card), the longer its
shadow. Pressing a chip compresses its stack — elevation responds to touch,
not hover.

## Shapes

Two silhouettes rule the system: the pill and the card. Buttons and player
chips are full pills (999px) with inset rings (a 1px white inner highlight and
a 5px dark inner ring on gold chips — the chip's edge-print). Cards are
rounded rectangles — 14px for tiles and prompt cards, 16px for the 5:7
playing card — and every paper surface carries an inset printed gold frame:
`inset 5–7px, 1px solid rgba(176,142,45,.45), radius 9–10px`. Playing-card
anatomy repeats everywhere: corner pip top-left, rotated mirror pip
bottom-right. Utility shapes (inputs, option rows, icon buttons, scoreboxes)
are 10–12px rounded rectangles with 1px Felt Line borders. Dark surfaces are
bordered, never framed; borders on felt are always Felt Line except the
intentionally dashed Dim Foil how-to box.

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

### Table Cards (`.table-card`, the game floor)
- Playing-card tile: paper gradient, 14px radius, inset gold frame, min-height 128px, content bottom-aligned.
- Corner pip (Libre Bodoni 700, red or near-black #20242c) top-left, rotated mirror pip bottom-right; player-count tag (Oswald 10.5px, #6f6236) top-right.
- Title: Oswald 600 uppercase 15.5px; hook line 12.5px #6b6353. Active: scale(.97).

### Prompt Card (`.prompt-card`)
- The dealt content surface: paper gradient, centered 20px/600 balanced text, tracked-caps category line in #6f6236, italic sub-line, deals in with the shared dealIn motion.

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

### Inputs (`.addrow input`, `.numin`)
- Near-black felt wells (`rgba(3,22,16,.6)`), Felt Line border, 10–12px radius, bone text, ≥16px font (no iOS zoom), Table Mist placeholders. Focus: global 2px Foil Highlight outline, offset 3px.

### Timer Ring (`.ring`)
- 140×140 SVG ring, 9px stroke: faint bone track, gold progress (stroke-dashoffset, .2s linear tick), flipping to Carmine Lit in danger; Oswald 40px tabular numeral centered.

### Wheel (`.wheel`)
- SVG roulette: segments alternate Carmine (#C0392B) and felt green (#0E4A37) with 1.5px gold strokes, bone Oswald segment labels, gold hub with Limelight "D" monogram, 4px gold rim, Foil Highlight pointer. Spin: 4.6s `cubic-bezier(.12,.6,.04,1)` rotation with long decelerating settle.

### Toast (`#toast`)
- Gold pill fixed bottom-center, Foil Ink 700 text, rises in .25s. The house announcing.

### Motion Grammar (the deal)
All reveals share one family: **dealIn** (.4s `cubic-bezier(.2,1.1,.3,1)` — rise 16px, un-rotate -1.2°, settle from .97 scale), **flip** (.55s `cubic-bezier(.3,1.2,.3,1)` — slight overshoot), **glint** on settle, screen entry .32s `cubic-bezier(.2,.8,.2,1)`. Durations .12–.55s for interaction, long tails only for the wheel. `prefers-reduced-motion` collapses all animation to ~0.

## Do's and Don'ts

### Do:
- **Do** render every new surface as a table object — chip, card, or felt box — with the matching material, shadow, and (on paper) the inset gold frame.
- **Do** use the shared deal/flip/glint grammar for any new reveal; never invent a second reveal motion.
- **Do** keep tap targets ≥40px and input font-size ≥16px; this is a passed phone in a dim room.
- **Do** use tabular numerals for every count, score, and timer.
- **Do** respect the fixed felt background (`background-attachment:fixed`) — screens change, the table does not.

### Don't:
- **Don't** add a light theme, white panels, or pastel accents; the single dark felt theme is a confirmed product decision.
- **Don't** put white or bone text on gold — gold surfaces take Foil Ink (#2A2008) only.
- **Don't** set Limelight below 30px or use it for running copy; it is signage.
- **Don't** use borders other than Felt Line on dark surfaces, or drop the gold frame from paper surfaces.
- **Don't** use hover as a primary state — this is a touch surface; states respond to `:active` and `:focus-visible`.
