import { PLAYERS } from '../data/board.js'
import Dice3D from './Dice3D.jsx'
import RoughBorder from './RoughBorder.jsx'

export default function Panel({ state, dispatch }) {
  const p = state.players[state.turn]
  const human = !p.ai
  const spins = state.players.reduce((n, q) => n + q.rolls, 0)
  const busy = state.phase === 'walk' || state.phase === 'land' || state.phase === 'slide'

  return (
    <aside className="panel">
      <RoughBorder color={PLAYERS[p.id].hex}>
        <div className="turnbox rough-skin" style={{ '--c': PLAYERS[p.id].hex }}>
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
      </RoughBorder>

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

      <RoughBorder color="#c0410f">
        <div className="log rough-skin">
          <h3>Khabar</h3>
          <ul>
            {state.log.map((l) => <li key={l.id} className={'tone-' + l.tone}>{l.text}</li>)}
          </ul>
        </div>
      </RoughBorder>
    </aside>
  )
}
