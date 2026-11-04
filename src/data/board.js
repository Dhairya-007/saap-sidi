// Saap Sidi. 100 squares, boustrophedon numbering: 1 is bottom-left,
// 100 is top-left, and the rows snake left-right-left like the painted
// boards sold outside every stationery shop.

export const SIZE = 10

export function cellOf(n) {
  const i = n - 1
  const rowFromBottom = Math.floor(i / SIZE)
  const inRow = i % SIZE
  const col = rowFromBottom % 2 === 0 ? inRow : SIZE - 1 - inRow
  return { col, row: SIZE - 1 - rowFromBottom }
}

// centre of a square in viewBox units (0..10)
export const centerOf = (n) => {
  const { col, row } = cellOf(n)
  return { x: col + 0.5, y: row + 0.5 }
}

export const LADDERS = [
  { from: 1, to: 38, text: 'Caught the BRTS exactly on time' },
  { from: 4, to: 14, text: 'Chai with the right contact' },
  { from: 9, to: 31, text: 'Board exam result came out golden' },
  { from: 21, to: 42, text: 'Uncle knew someone at the RTO' },
  { from: 28, to: 84, text: 'Funding cheque from a CIIE demo day' },
  { from: 36, to: 44, text: 'Found parking right at Manek Chowk' },
  { from: 51, to: 67, text: 'Your garba steps went viral' },
  { from: 71, to: 91, text: 'Riverfront flat allotted at last' },
  { from: 80, to: 100, text: 'Jalebi-fafda breakfast of champions' },
]

export const SNAKES = [
  { from: 17, to: 7, text: 'Pothole season on the ring road' },
  { from: 54, to: 34, text: 'Load shedding, fridge was open' },
  { from: 62, to: 19, text: 'Your kite got cut on Uttarayan' },
  { from: 64, to: 60, text: 'Fafda at noon, nap till four' },
  { from: 87, to: 24, text: 'Underpass flooded in the first shower' },
  { from: 93, to: 73, text: 'Society AGM ran three hours long' },
  { from: 95, to: 75, text: 'Forgot the gift, went back home' },
  { from: 98, to: 78, text: 'Diwali traffic near Lal Darwaja' },
  { from: 49, to: 11, text: 'Challan for riding without a helmet' },
  { from: 56, to: 53, text: 'Rickshaw refused, meter kept running' },
]

export const JUMPS = (() => {
  const map = {}
  LADDERS.forEach((l) => { map[l.from] = { ...l, kind: 'ladder' } })
  SNAKES.forEach((s) => { map[s.from] = { ...s, kind: 'snake' } })
  return map
})()

export const SNAKE_SKINS = [
  { body: '#2f9e44', belly: '#b2f2bb', spot: '#145a32' },
  { body: '#d6336c', belly: '#ffdeeb', spot: '#7d1a3d' },
  { body: '#f08c00', belly: '#ffec99', spot: '#8a4b00' },
  { body: '#1098ad', belly: '#c5f6fa', spot: '#07515e' },
  { body: '#6741d9', belly: '#e5dbff', spot: '#331a7a' },
]

export const PLAYERS = [
  { name: 'Kesari', hex: '#ff7a18', deep: '#a43400', token: '🐘' },
  { name: 'Peacock', hex: '#13b0a5', deep: '#0a5f58', token: '🦚' },
  { name: 'Rani', hex: '#e2338c', deep: '#8b1050', token: '🐅' },
  { name: 'Unt', hex: '#5a5bf0', deep: '#2a2a9c', token: '🐫' },
]
