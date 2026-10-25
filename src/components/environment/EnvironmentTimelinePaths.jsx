import { useEffect, useState } from 'react'

function coordinate(value) {
  return Math.round(value * 100) / 100
}

// The Figma route alternates bottom-to-side elbows, rather than sharing a spine.
function elbow(start, end, verticalFirst) {
  const dx = Math.sign(end.x - start.x)
  const dy = Math.sign(end.y - start.y)
  const radius = Math.min(64, Math.abs(end.x - start.x) * 0.4, Math.abs(end.y - start.y) * 0.75)
  const n = coordinate
  if (verticalFirst) {
    return `M ${n(start.x)} ${n(start.y)} V ${n(end.y - dy * radius)} Q ${n(start.x)} ${n(end.y)} ${n(start.x + dx * radius)} ${n(end.y)} H ${n(end.x)}`
  }
  return `M ${n(start.x)} ${n(start.y)} H ${n(end.x - dx * radius)} Q ${n(end.x)} ${n(start.y)} ${n(end.x)} ${n(start.y + dy * radius)} V ${n(end.y)}`
}

export default function EnvironmentTimelinePaths({ rootRef }) {
  const [geometry, setGeometry] = useState({ width: 1, height: 1, paths: [] })

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const list = root.querySelector('.environment-timeline')
    const events = [...list.querySelectorAll('.environment-timeline__event')]
    let frame = 0
    let disposed = false

    function measure() {
      const narrow = window.matchMedia('(max-width: 720px)').matches
      const width = root.clientWidth
      if (!width) return
      list.dataset.layout = narrow ? 'stack' : 'flow'

      if (narrow) {
        list.style.height = ''
        events.forEach((event) => { event.style.top = '' })
      } else {
        // Measure live copy and gallery dimensions. The Figma spacing is retained,
        // but longer wrapped text never collides with the next event or connector.
        const metric = events.map((event) => {
          const bounds = event.getBoundingClientRect()
          const media = (event.querySelector('.portfolio-gallery__window, .environment-timeline__image') || event.querySelector('.environment-timeline__note')).getBoundingClientRect()
          return { height: bounds.height, mediaTop: media.top - bounds.top, mediaHeight: media.height, top: 0 }
        })
        const gap = Math.max(30, width * 0.035)
        const bend = Math.max(54, width * 0.1)
        const [member, culture, president, first, green, tet, camp, closing] = metric
        culture.top = member.mediaTop + Math.max(110, width * 0.14)
        president.top = Math.max(member.height + gap, culture.top + culture.height + bend - president.mediaTop - president.mediaHeight * 0.1)
        first.top = Math.max(
          culture.top + culture.height + gap,
          president.top + president.mediaTop + president.mediaHeight * 0.1 + gap,
          president.top + president.mediaTop + president.mediaHeight * 0.73 - first.mediaTop - first.mediaHeight * 0.5,
        )
        green.top = Math.max(
          president.top + president.height + gap,
          first.top + first.height + bend - green.mediaTop - green.mediaHeight * 0.22,
        )
        tet.top = Math.max(
          first.top + first.height + gap,
          green.top + green.height + bend - tet.mediaTop - tet.mediaHeight * 0.85,
        )
        camp.top = Math.max(
          green.top + green.height + gap,
          tet.top + tet.height + bend - camp.mediaTop - camp.mediaHeight * 0.22,
        )
        closing.top = Math.max(
          tet.top + tet.height + gap,
          camp.top + camp.height + bend - closing.mediaTop - closing.mediaHeight * 0.85,
        )
        events.forEach((event, index) => { event.style.top = `${coordinate(metric[index].top)}px` })
        list.style.height = `${Math.ceil(Math.max(...metric.map((item) => item.top + item.height)))}px`
      }

      const bounds = root.getBoundingClientRect()
      function box(element) {
        const rectangle = element.getBoundingClientRect()
        return {
          left: rectangle.left - bounds.left,
          right: rectangle.right - bounds.left,
          top: rectangle.top - bounds.top,
          bottom: rectangle.bottom - bounds.top,
          width: rectangle.width,
          height: rectangle.height,
          center: rectangle.left - bounds.left + rectangle.width / 2,
        }
      }
      const points = events.map((event) => ({
        article: box(event),
        media: box(event.querySelector('.portfolio-gallery__window, .environment-timeline__image') || event.querySelector('.environment-timeline__note')),
      }))
      const paths = []
      const clearance = Math.max(10, width * 0.018)
      if (narrow) {
        // Keep the same chronological DOM order with individual rounded joins.
        for (let index = 0; index < points.length - 1; index += 1) {
          const current = points[index].article
          const next = points[index + 1].article
          const y1 = coordinate(current.bottom - 12)
          const y2 = coordinate(next.top + 12)
          paths.push(`M 18 ${y1} H 13 Q 7 ${y1} 7 ${y1 + 6} V ${y2 - 6} Q 7 ${y2} 13 ${y2} H 18`)
        }
      } else {
        const [member, culture, president, first, green, tet, camp, closing] = points
        paths.push(elbow(
          { x: member.media.right + clearance, y: member.media.top + member.media.height * 0.06 },
          { x: culture.article.center, y: culture.article.top - clearance }, false,
        ))
        paths.push(elbow(
          { x: culture.article.center, y: culture.article.bottom + clearance },
          { x: president.media.right + clearance, y: president.media.top + president.media.height * 0.1 }, true,
        ))
        const firstMidpoint = first.media.top + first.media.height / 2
        paths.push(`M ${coordinate(president.media.right + clearance)} ${coordinate(firstMidpoint)} H ${coordinate(first.media.left - clearance)}`)
        for (const [previous, next, fromRight, fraction] of [
          [first, green, true, 0.22],
          [green, tet, false, 0.85],
          [tet, camp, true, 0.22],
          [camp, closing, false, 0.85],
        ]) {
          paths.push(elbow(
            { x: previous.article.left + previous.article.width * (fromRight ? 0.5 : 0.3), y: previous.article.bottom + clearance },
            { x: fromRight ? next.media.right + clearance : next.media.left - clearance, y: next.media.top + next.media.height * fraction }, true,
          ))
        }
      }
      const nextGeometry = { width: coordinate(width), height: Math.ceil(root.scrollHeight), paths }
      setGeometry((previous) => previous.width === nextGeometry.width && previous.height === nextGeometry.height && previous.paths.join() === paths.join() ? previous : nextGeometry)
    }

    function schedule() {
      if (disposed) return
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(measure)
    }
    const observer = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null
    observer?.observe(root)
    events.forEach((event) => observer?.observe(event))
    root.addEventListener('load', schedule, true)
    window.addEventListener('resize', schedule, { passive: true })
    document.fonts?.ready.then(schedule)
    measure()

    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
      root.removeEventListener('load', schedule, true)
      window.removeEventListener('resize', schedule)
    }
  }, [rootRef])

  return (
    <svg aria-hidden="true" className="environment-timeline-paths" data-timeline-paths={geometry.paths.length} preserveAspectRatio="none" style={{ '--timeline-stroke': `${Math.min(18, Math.max(6, geometry.width * 0.019))}px` }} viewBox={`0 0 ${geometry.width} ${geometry.height}`}>
      {geometry.paths.map((path, index) => <path d={path} key={index} />)}
    </svg>
  )
}
