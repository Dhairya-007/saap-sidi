import { centerOf, SIZE, LADDERS, SNAKES, SNAKE_SKINS, JUMPS, PLAYERS } from '../data/board.js'

// ---- geometry helpers -------------------------------------------------
const lerp = (a, b, t) => a + (b - a) * t

function wavyPoints(from, to, amp, waves, n = 44) {
  const a = centerOf(from)
  const b = centerOf(to)
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const pts = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const wobble = Math.sin(t * Math.PI * waves) * amp * Math.sin(Math.PI * t) * 1.15
    pts.push({ x: lerp(a.x, b.x, t) + nx * wobble, y: lerp(a.y, b.y, t) + ny * wobble })
  }
  return pts
}

function Snake({ snake, i }) {
  const skin = SNAKE_SKINS[i % SNAKE_SKINS.length]
  const span = Math.abs(snake.from - snake.to)
  const pts = wavyPoints(snake.from, snake.to, span > 25 ? 0.72 : 0.36, span > 25 ? 3 : 2)
  const head = pts[0]
  const next = pts[2]
  const angle = (Math.atan2(head.y - next.y, head.x - next.x) * 180) / Math.PI

  const seg = (p, q, w, color, opacity = 1) => (
    <line key={`${p.x}-${p.y}-${w}-${color}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y}
      stroke={color} strokeWidth={w} strokeLinecap="round" opacity={opacity} />
  )

  const body = []
  for (let k = 0; k < pts.length - 1; k++) {
    const t = k / (pts.length - 1)
    const w = lerp(0.46, 0.1, Math.pow(t, 0.85))
    body.push(seg(pts[k], pts[k + 1], w + 0.07, skin.spot, 0.55))
  }
  for (let k = 0; k < pts.length - 1; k++) {
    const t = k / (pts.length - 1)
    const w = lerp(0.44, 0.09, Math.pow(t, 0.85))
    body.push(seg(pts[k], pts[k + 1], w, skin.body))
  }
  for (let k = 2; k < pts.length - 3; k += 3) {
    const t = k / (pts.length - 1)
    body.push(
      <circle key={'sc' + k} cx={pts[k].x} cy={pts[k].y} r={lerp(0.11, 0.025, t)}
        fill={skin.belly} opacity={0.75} />
    )
  }

  return (
    <g className="snake" filter="url(#softShadow)">
      {body}
      <g transform={`translate(${head.x} ${head.y}) rotate(${angle})`}>
        <ellipse rx="0.42" ry="0.3" fill={skin.body} />
        <ellipse rx="0.42" ry="0.3" fill="url(#headShine)" opacity="0.45" />
        <path d="M0.38 0 L0.6 0 M0.6 0 L0.75 -0.1 M0.6 0 L0.75 0.1"
          stroke="#e03131" strokeWidth="0.05" fill="none" strokeLinecap="round" />
        <circle cx="0.06" cy="-0.14" r="0.085" fill="#fff" />
        <circle cx="0.06" cy="0.14" r="0.085" fill="#fff" />
        <circle cx="0.08" cy="-0.14" r="0.042" fill="#111" />
        <circle cx="0.08" cy="0.14" r="0.042" fill="#111" />
      </g>
    </g>
  )
}

function Ladder({ ladder }) {
  const a = centerOf(ladder.from)
  const b = centerOf(ladder.to)
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  const nx = (-dy / len) * 0.19
  const ny = (dx / len) * 0.19
  const rungs = Math.max(3, Math.round(len / 0.62))
  return (
    <g className="ladder" filter="url(#softShadow)">
      <line x1={a.x + nx} y1={a.y + ny} x2={b.x + nx} y2={b.y + ny}
        stroke="#7a4a1d" strokeWidth="0.17" strokeLinecap="round" />
      <line x1={a.x - nx} y1={a.y - ny} x2={b.x - nx} y2={b.y - ny}
        stroke="#7a4a1d" strokeWidth="0.17" strokeLinecap="round" />
      <line x1={a.x + nx} y1={a.y + ny} x2={b.x + nx} y2={b.y + ny}
        stroke="url(#wood)" strokeWidth="0.1" strokeLinecap="round" />
      <line x1={a.x - nx} y1={a.y - ny} x2={b.x - nx} y2={b.y - ny}
        stroke="url(#wood)" strokeWidth="0.1" strokeLinecap="round" />
      {Array.from({ length: rungs + 1 }).map((_, i) => {
        const t = i / rungs
        const cx = lerp(a.x, b.x, t)
        const cy = lerp(a.y, b.y, t)
        return (
          <g key={i}>
            <line x1={cx + nx} y1={cy + ny} x2={cx - nx} y2={cy - ny}
              stroke="#7a4a1d" strokeWidth="0.11" strokeLinecap="round" />
            <line x1={cx + nx} y1={cy + ny} x2={cx - nx} y2={cy - ny}
              stroke="url(#wood)" strokeWidth="0.06" strokeLinecap="round" />
          </g>
        )
      })}
    </g>
  )
}

export default function BoardSVG({ state }) {
  const stacks = {}
  state.players.forEach((p) => {
    stacks[p.pos] = stacks[p.pos] || []
    stacks[p.pos].push(p)
  })

  return (
    <div className="board-wrap">
      <div className="board">
        <svg viewBox="0 0 10 10" className="board-svg" role="img" aria-label="Snakes and ladders board">
          <defs>
            <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f6c177" />
              <stop offset="50%" stopColor="#d99746" />
              <stop offset="100%" stopColor="#b9762c" />
            </linearGradient>
            <radialGradient id="headShine" cx="0.3" cy="0.25">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0.05" dy="0.07" stdDeviation="0.06" floodColor="#2b1200" floodOpacity="0.45" />
            </filter>
          </defs>

          {Array.from({ length: 100 }).map((_, k) => {
            const n = k + 1
            const { x, y } = centerOf(n)
            const jump = JUMPS[n]
            const dark = (Math.floor(x) + Math.floor(y)) % 2 === 0
            return (
              <g key={n}>
                <rect x={x - 0.5} y={y - 0.5} width="1" height="1"
                  className={'cell' + (dark ? ' cell-dark' : '') + (n === 100 ? ' cell-finish' : '')} />
                {jump && (
                  <circle cx={x} cy={y} r="0.4"
                    className={jump.kind === 'ladder' ? 'mark-ladder' : 'mark-snake'} />
                )}
              </g>
            )
          })}

          {LADDERS.map((l) => <Ladder key={'l' + l.from} ladder={l} />)}
          {SNAKES.map((sn, i) => <Snake key={'s' + sn.from} snake={sn} i={i} />)}

          {/* numbers ride on top of the art so nothing hides a square */}
          {Array.from({ length: 100 }).map((_, k) => {
            const n = k + 1
            const { x, y } = centerOf(n)
            return <text key={'n' + n} x={x - 0.42} y={y - 0.28} className="cell-num">{n}</text>
          })}
        </svg>

        <div className="token-layer">
          {state.players.map((p) => {
            const at = p.pos === 0 ? null : centerOf(p.pos)
            const peers = p.pos === 0 ? [] : stacks[p.pos] || []
            const slot = peers.findIndex((q) => q.id === p.id)
            const dx = peers.length > 1 ? (slot - (peers.length - 1) / 2) * 13 : 0
            const c = PLAYERS[p.id]
            const style = at
              ? { left: `${at.x * 10}%`, top: `${at.y * 10}%`, transform: `translate(calc(-50% + ${dx}px), -55%)` }
              : { left: `${5 + p.id * 8}%`, top: '105%', transform: 'translate(-50%, -50%)' }
            return (
              <span key={p.id}
                className={'token' + (state.turn === p.id ? ' token-turn' : '') + (p.pos === 100 ? ' token-done' : '')}
                style={{ ...style, background: `radial-gradient(circle at 32% 26%, #fff8, transparent 58%), linear-gradient(160deg, ${c.hex}, ${c.deep})` }}
                title={`${p.name} on ${p.pos}`}>
                {c.token}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
