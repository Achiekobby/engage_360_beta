# Navigation — page overrides

## Product megamenu

- Full-width panel below the 64px header; white surface, `border-[#EEF0F4]`, soft shadow.
- Three columns (Engage / Operations / Growth) + spotlight card; each link has icon tile, title, one-line description.
- Hover: subtle border + `bg-[#FAFBFC]`; avoid solid purple dropdown lists.
- **Click to open** (not hover); close via backdrop click, outside click, Escape, or navigation.
- Keyboard: visible focus rings on triggers and links.
- Mobile: grouped accordion with the same copy and icons (not a flat purple list).

## Anti-patterns (avoid “AI slop”)

- No identical icons for every row.
- No generic “Lorem” or duplicate one-word descriptions.
- No oversized purple gradients on every CTA block.
- Prefer `cursor-pointer`, 150–250ms transitions, and Lucide icons at consistent stroke (2–2.25).
