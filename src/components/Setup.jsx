import { useState } from 'react'
import { PLAYERS, SNAKES, LADDERS } from '../data/board.js'

export default function Setup({ onStart }) {
  const [count, setCount] = useState(2)
  const [names, setNames] = useState(PLAYERS.map((p) => p.name))
  const [humans, setHumans] = useState([true, false, false, false])

  return (
    <div className="setup">
      <div className="setup-card">
        <div className="setup-art">
          <span>🐍</span><span>🪜</span>
        </div>
        <h1>Saap <span>Sidi</span></h1>
        <p className="setup-sub">
          {LADDERS.length} ladders up, {SNAKES.length} snakes down, and one
          very specific excuse written on every single one of them.
        </p>

        <div className="setup-field">
          <label>Khiladi</label>
          <div className="seg">
            {[2, 3, 4].map((n) => (
              <button key={n} className={count === n ? 'on' : ''} onClick={() => setCount(n)}>{n}</button>
            ))}
          </div>
        </div>

        <div className="setup-list">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="setup-row" style={{ '--c': PLAYERS[i].hex }}>
              <span className="pemoji big">{PLAYERS[i].token}</span>
              <input value={names[i]} maxLength={12}
                onChange={(e) => setNames(names.map((n, k) => (k === i ? e.target.value : n)))} />
              <button className={'who' + (humans[i] ? ' human' : '')}
                onClick={() => setHumans(humans.map((h, k) => (k === i ? !h : h)))}>
                {humans[i] ? 'Human' : 'Computer'}
              </button>
            </div>
          ))}
        </div>

        <ul className="setup-rules">
          <li>Land on 100 exactly. Overshoot and you stay put.</li>
          <li>A six gets you another roll — three in a row and the turn is void.</li>
        </ul>

        <button className="btn primary big" onClick={() => onStart(
          Array.from({ length: count }).map((_, i) => ({
            name: (names[i] || PLAYERS[i].name).trim() || PLAYERS[i].name,
            ai: !humans[i],
          }))
        )}>Daav shuru</button>
      </div>
    </div>
  )
}
