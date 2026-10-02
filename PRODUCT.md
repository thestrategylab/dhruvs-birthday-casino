# PRODUCT.md — Dhruv's Birthday Casino

## What this is
A single-page party app for one night: Dhruv's birthday. 15 fully playable adult drinking games run from one "master phone" passed around a circle of up to 15 close friends. Sips are the universal penalty currency.

## Audience & scene
Dhruv (29) and his close friends, drinking at a house party, dim lighting, phone passed hand to hand. Everyone knows everyone — prompts can be personal and spicy without being friendship-ending. India-based crowd: Hinglish prompts, Bollywood + cricket trivia land hardest. (Confirmed via interview.)

## Confirmed decisions (interview)
- **Vibe:** Retro casino — deep green felt, gold foil, playing-card motifs.
- **Spice:** Spicy but tasteful, pushed interesting because they're all very close friends who "pretty much know everything about each other."
- **Language:** English UI, Hinglish prompts, Bollywood trivia alongside general.
- **Topology:** Shareable link; master-phone play with pass-the-phone secret reveals. Multi-phone sync explicitly optional per user ("if not no problem").

## Product truths
- Roster: 2–15 named players, editable any time, persisted in localStorage (best-effort).
- Every game must be *fully functioning* — real decks, real logic, real win/lose/drink outcomes. No placeholders.
- Penalties are sips (occasionally "finish your drink" for big moments).
- Games (15): Kings Cup, Irish Poker, Mafia, Mr. White (Undercover), Bollywood Battle, Trivia Royale, Never Have I Ever, Most Likely To, Truth or Dare, Odds Are, Flash Match (Dobble-style), Higher-Lower betting, Wheel of Fate, Categories, Chaos Deck (Picolo-style name-interpolated prompts).
- Secret-role games use tap-to-reveal / pass-the-phone; nothing requires a network.

## Assumptions (labeled, not confirmed)
- Party is imminent; shipping tonight beats any further process.
- Single dark casino theme by design (party = dim light); no light theme.
- No accounts, no persistence beyond the roster and in-progress game state.

## Brand commitments
- Title: "Dhruv's Birthday Casino" energy — it's HIS night; the app says so.
- Retro casino is the pinned world: felt, foil, chips, cards, marquee type.
