import { PLAYERS } from '../data/board.js'

const PIPS = {
  1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8],
}
const FACE_ROT = {
  1: 'rotateX(0deg) rotateY(0deg)',
  2: 'rotateY(-90deg)',
  3: 'rotateY(180deg)',
  4: 'rotateY(90deg)',
  5: 'rotateX(-90deg)',
  6: 'rotateX(90deg)',
}

function Face({ n, className }) {
  return (
    <div className={'face ' + className}>
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} className={PIPS[n].includes(i) ? 'pip on' : 'pip'} />
      ))}
    </div>
  )
}

export function Dice3D({ value, spins, rolling }) {
  const rot = `rotateX(${spins * 360}deg) rotateY(${spins * 360}deg) ${FACE_ROT[value || 1]}`
  return (
    <div className={'dice-stage' + (rolling ? ' is-rolling' : '')}>
      <div className="cube" style={{ transform: rot }}>
        <Face n={1} className="f-front" />
        <Face n={2} className="f-right" />
        <Face n={3} className="f-back" />
        <Face n={4} className="f-left" />
        <Face n={5} className="f-top" />
        <Face n={6} className="f-bottom" />
      </div>
    </div>
  )
}

export default function Panel({ state, dispatch }) {
  const p = state.players[state.turn]
  const human = !p.ai
  const spins = state.players.reduce((n, q) => n + q.rolls, 0)
  const busy = state.phase === 'walk' || state.phase === 'land' || state.phase === 'slide'

  return (
    <aside className="panel">
      <div className="turnbox" style={{ '--c': PLAYERS[p.id].hex }}>
        <div className="turnbox-head">
          <span className="emoji">{PLAYERS[p.id].token}</span>
          <div>
            <strong>{p.name}</strong>
            <small>{human ? 'your daav' : 'computer is playing'}</small>
          </div>
          <span className="square-chip">{p.pos === 0 ? 'start' : p.pos}</span>
        </div>

        <Dice3D value={state.dice} spins={spins} rolling={busy} />

        <div className="actions">
          {state.phase === 'roll' && (
            <button className="btn primary" onClick={() => dispatch({ type: 'ROLL' })} disabled={!human}>
              {human ? 'Roll the dice' : 'Rolling…'}
            </button>
          )}
          {state.phase === 'end' && (
            <button className="btn primary" onClick={() => dispatch({ type: 'END_TURN' })} disabled={!human}>
              {state.dice === 6 ? 'Six! Roll again' : 'Next player'}
            </button>
          )}
          {busy && <button className="btn primary" disabled>Moving…</button>}
        </div>
      </div>

      <div className="players">
        {state.players.map((q) => {
          const c = PLAYERS[q.id]
          const pct = Math.min(100, q.pos)
          return (
            <div key={q.id} className={'prow' + (q.id === state.turn ? ' prow-turn' : '')} style={{ '--c': c.hex }}>
              <span className="pemoji">{c.token}</span>
              <div className="pbody">
                <div className="pline">
                  <strong>{q.name}</strong>
                  <span>{q.pos === 100 ? 'finished' : q.pos === 0 ? 'at start' : `square ${q.pos}`}</span>
                </div>
                <div className="track"><i style={{ width: pct + '%', background: c.hex }} /></div>
                <div className="pstats">
                  <span>🪜 {q.climbs}</span><span>🐍 {q.bites}</span><span>🎲 {q.rolls}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="log">
        <h3>Khabar</h3>
        <ul>
          {state.log.map((l) => <li key={l.id} className={'tone-' + l.tone}>{l.text}</li>)}
        </ul>
      </div>
    </aside>
  )
}
