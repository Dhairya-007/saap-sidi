import { useEffect, useRef } from 'react'
import rough from 'roughjs'

// Hand-sketched ink border drawn on top of its children (several siblings use
// backdrop-filter blur, which would otherwise wash the stroke out if it sat behind), folk-miniature style.
export default function RoughBorder({ children, color = '#9c3b16', className = '', radius = 18, strokeWidth = 2.2 }) {
  const wrapRef = useRef(null)
  const svgRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const svg = svgRef.current
    if (!wrap || !svg) return

    const draw = () => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      if (!w || !h) return
      svg.setAttribute('width', w)
      svg.setAttribute('height', h)
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
      svg.innerHTML = ''
      const rc = rough.svg(svg)
      const pad = strokeWidth + 1
      const node = rc.rectangle(pad, pad, w - pad * 2, h - pad * 2, {
        stroke: color,
        strokeWidth,
        roughness: 1.6,
        bowing: 1.4,
        fill: 'none',
      })
      svg.appendChild(node)
    }

    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [color, strokeWidth])

  return (
    <div ref={wrapRef} className={'rough-wrap ' + className} style={{ position: 'relative', borderRadius: radius }}>
      <div style={{ position: 'relative', zIndex: 0 }}>{children}</div>
      <svg ref={svgRef} className="rough-svg" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
      }} />
    </div>
  )
}
