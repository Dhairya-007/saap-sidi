import { useEffect, useReducer } from 'react'
import BoardSVG from './components/BoardSVG.jsx'
import Panel from './components/Panel.jsx'
import Setup from './components/Setup.jsx'
import { createGame, reducer, aiAction } from './game/engine.js'
import { PLAYERS } from './data/board.js'

const DELAY = { walk: 170, land: 220, slide: 90, ai: 650 }

export default function App() {
  const [game, dispatch] = useReducer(reducer, null)

  useEffect(() => {
    if (!game || game.winner !== null) return
    if (game.phase === 'walk') {
      const t = setTimeout(() => dispatch({ type: 'STEP' }), DELAY.walk)
      return () => clearTimeout(t)
    }
    if (game.phase === 'land') {
      const t = setTimeout(() => dispatch({ type: 'LAND' }), DELAY.land)
      return () => clearTimeout(t)
    }
    if (game.phase === 'slide') {
      const t = setTimeout(() => dispatch({ type: 'SLIDE' }), DELAY.slide)
      return () => clearTimeout(t)
    }
    const ai = aiAction(game)
    if (ai) {
      const t = setTimeout(() => dispatch(ai), DELAY.ai)
      return () => clearTimeout(t)
    }
  }, [game])

  if (!game) return <Setup onStart={(s) => dispatch({ type: 'INIT', state: createGame(s) })} />

  const winner = game.winner !== null ? game.players[game.winner] : null

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span>🪜</span>
          <h2>Saap Sidi</h2>
          <small>snakes & ladders, Amdavad edition</small>
        </div>
        <button className="btn ghost small" onClick={() => dispatch({ type: 'INIT', state: null })}>New game</button>
      </header>

      <main className="layout">
        <BoardSVG state={game} />
        <Panel state={game} dispatch={dispatch} />
      </main>

      {game.toast && (
        <div className={'toast ' + game.toast.kind} key={game.toast.from + '-' + game.toast.to}>
          <span className="toast-icon">{game.toast.kind === 'ladder' ? '🪜' : '🐍'}</span>
          <div>
            <strong>{game.toast.from} → {game.toast.to}</strong>
            <p>{game.toast.text}</p>
          </div>
        </div>
      )}

      {winner && (
        <div className="modal-wrap">
          <div className="winner">
            <div className="confetti">{Array.from({ length: 28 }).map((_, i) => <i key={i} style={{ '--i': i }} />)}</div>
            <span className="winner-emoji">{PLAYERS[winner.id].token}</span>
            <h2>{winner.name} jeet gaya!</h2>
            <p>{winner.rolls} rolls, {winner.climbs} ladders climbed, {winner.bites} snake bites survived.</p>
            <button className="btn primary" onClick={() => dispatch({ type: 'INIT', state: null })}>Ek vaar fari</button>
          </div>
        </div>
      )}
    </div>
  )
}
