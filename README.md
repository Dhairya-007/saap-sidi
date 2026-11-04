# 🪜 Saap Sidi

Snakes and ladders the way it was played on a folded board on the floor —
except every snake and every ladder has a very specific Ahmedabad excuse
written on it, and the snakes are drawn properly instead of being two
curvy lines.

Frontend only. React + Vite, no backend.

![stack](https://img.shields.io/badge/React-18-61dafb) ![stack](https://img.shields.io/badge/Vite-5-646cff) ![stack](https://img.shields.io/badge/SVG-hand--drawn-ff8f3c)

## Play

```bash
npm install
npm run dev
```

2–4 players, any mix of humans and computers, on one screen.

## What makes it worth a look

- **The snakes are real art, not clip-art.** Each one is generated from a
  wavy path between its two squares, then stroked segment by segment with a
  tapering width so the body thins toward the tail, plus belly scales, a
  shaded head, eyes and a forked tongue. Ladders get wooden rails, rungs and
  a drop shadow at the correct angle between squares.
- **Every jump has a reason.** 62 → 19 is *your kite got cut on Uttarayan*.
  28 → 84 is *funding cheque from a CIIE demo day*. 87 → 24 is *the underpass
  flooded in the first shower*. A toast shows it the moment you slide.
- **A real 3D dice** — six CSS faces on a `preserve-3d` cube that spins a full
  turn and lands on the rolled face.
- **Proper rules**: exact roll to land on 100, a six earns another turn, and
  three sixes in a row cancels the turn.
- Tokens hop square by square along the boustrophedon path, so you watch
  yourself walk into the snake's mouth.

## How it is built

```
src/
  data/board.js        boustrophedon geometry, 9 ladders, 10 snakes, captions
  game/engine.js       pure reducer: roll → walk → land → slide → end
  components/
    BoardSVG.jsx       the painted board, snakes, ladders, token layer
    Panel.jsx          3D dice, player progress, match log
    Setup.jsx          player picker
```

Board coordinates come from one function: square `n` → `{col, row}`, used for
the squares, the snake endpoints, the ladder angles and the token positions,
so nothing can drift out of alignment.

## License

MIT
