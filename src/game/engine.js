import { JUMPS } from '../data/board.js'

const d6 = () => 1 + Math.floor(Math.random() * 6)

export function createGame(setup) {
  return {
    players: setup.map((p, i) => ({
      id: i, name: p.name, ai: p.ai, skin: i,
      pos: 0, sixes: 0, climbs: 0, bites: 0, rolls: 0,
    })),
    turn: 0,
    dice: null,
    remaining: 0,
    phase: 'roll',      // roll | walk | land | slide | end | over
    pending: null,      // the snake or ladder just hit
    toast: null,
    winner: null,
    order: [],
    log: [{ id: 0, text: 'Board painted, dice in hand. Pehla daav!', tone: 'plain' }],
    logId: 1,
  }
}

const say = (s, text, tone = 'plain') => {
  s.log = [{ id: s.logId++, text, tone }, ...s.log].slice(0, 50)
}

export function reducer(state, action) {
  if (action.type === 'INIT') return action.state
  if (!state) return state
  const s = structuredClone(state)
  const p = s.players[s.turn]

  switch (action.type) {
    case 'ROLL': {
      if (s.phase !== 'roll') return state
      const d = d6()
      s.dice = d
      s.toast = null
      s.pending = null
      p.rolls += 1

      if (d === 6) {
        p.sixes += 1
        if (p.sixes === 3) {
          say(s, `${p.name} rolled a third six — turn cancelled, that is the rule`, 'bad')
          p.sixes = 0
          s.phase = 'end'
          return s
        }
      } else {
        p.sixes = 0
      }

      if (p.pos + d > 100) {
        say(s, `${p.name} rolled ${d} and needs an exact ${100 - p.pos} to finish`, 'bad')
        s.phase = 'end'
        return s
      }

      s.remaining = d
      s.phase = 'walk'
      return s
    }

    case 'STEP': {
      if (s.phase !== 'walk') return state
      p.pos += 1
      s.remaining -= 1
      if (s.remaining <= 0) s.phase = 'land'
      return s
    }

    case 'LAND': {
      if (s.phase !== 'land') return state
      if (p.pos === 100) {
        s.winner = p.id
        s.phase = 'over'
        say(s, `${p.name} reached 100. Jeet gaya!`, 'good')
        return s
      }
      const jump = JUMPS[p.pos]
      if (jump) {
        s.pending = { ...jump, player: p.id }
        s.phase = 'slide'
        return s
      }
      s.phase = 'end'
      return s
    }

    case 'SLIDE': {
      if (s.phase !== 'slide' || !s.pending) return state
      const j = s.pending
      p.pos = j.to
      if (j.kind === 'ladder') { p.climbs += 1; say(s, `${p.name} climbed ${j.from} → ${j.to}: ${j.text}`, 'good') }
      else { p.bites += 1; say(s, `${p.name} slid ${j.from} → ${j.to}: ${j.text}`, 'bad') }
      s.toast = { kind: j.kind, text: j.text, from: j.from, to: j.to }
      s.phase = p.pos === 100 ? 'land' : 'end'
      return s
    }

    case 'END_TURN': {
      if (s.phase !== 'end') return state
      if (s.dice === 6) {
        say(s, `${p.name} rolled a six — another daav`, 'good')
        s.phase = 'roll'
        return s
      }
      let guard = 0
      do {
        s.turn = (s.turn + 1) % s.players.length
        guard += 1
      } while (s.players[s.turn].pos === 100 && guard < 10)
      s.dice = null
      s.phase = 'roll'
      return s
    }

    case 'CLEAR_TOAST':
      s.toast = null
      return s

    default:
      return state
  }
}

export function aiAction(state) {
  const p = state.players[state.turn]
  if (!p || !p.ai || state.winner !== null) return null
  if (state.phase === 'roll') return { type: 'ROLL' }
  if (state.phase === 'end') return { type: 'END_TURN' }
  return null
}
