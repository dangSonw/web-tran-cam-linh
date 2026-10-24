import { useEffect, useState } from 'react'

function coordinate(value) {
  return Math.round(value * 100) / 100
}

function connect(start, end) {
  const middle = (start.x + end.x) / 2
  const horizontal = end.x >= start.x ? 1 : -1
  const vertical = end.y >= start.y ? 1 : -1
  const radius = Math.min(28, Math.abs(end.x - start.x) / 3, Math.abs(end.y - start.y) / 2)
  return [
    'M', coordinate(start.x), coordinate(start.y),
    'H', coordinate(middle - radius * horizontal),
    'Q', coordinate(middle), coordinate(start.y), coordinate(middle), coordinate(start.y + radius * vertical),
    'V', coordinate(end.y - radius * vertical),
    'Q', coordinate(middle), coordinate(end.y), coordinate(middle + radius * horizontal), coordinate(end.y),
    'H', coordinate(end.x),
  ].join(' ')
}

export default function EnvironmentTimelinePaths({ rootRef }) {
  const [geometry, setGeometry] = useState({ width: 1, height: 1, paths: [] })

  useEffect(() => {
    const root = rootRef.current
    if (!root) {
      return undefined
    }
    const list = root.querySelector('.environment-timeline')
    let frame = 0
    let disposed = false

    function measure() {
      const bounds = root.getBoundingClientRect()
      const events = [...list.querySelectorAll('.environment-timeline__event')]
      const points = events.map((event) => {
        const image = event.querySelector('.portfolio-gallery__viewport, .environment-timeline__image') || event.querySelector('article')
        const rectangle = image.getBoundingClientRect()
        return {
          left: rectangle.left - bounds.left,
          right: rectangle.right - bounds.left,
          y: rectangle.top - bounds.top + rectangle.height / 2,
          fromLeft: event.classList.contains('environment-timeline__event--left'),
        }
      })
      const paths = []
      if (points.length > 1 && getComputedStyle(list).display === 'block') {
        paths.push('M 7 ' + coordinate(points[0].y) + ' V ' + coordinate(points[points.length - 1].y))
      } else {
        for (let index = 0; index < points.length - 1; index += 1) {
          const current = points[index]
          const next = points[index + 1]
          paths.push(connect(
            { x: current.fromLeft ? current.right + 12 : current.left - 12, y: current.y },
            { x: next.fromLeft ? next.right + 12 : next.left - 12, y: next.y },
          ))
        }
      }
      const nextGeometry = { width: coordinate(bounds.width), height: Math.ceil(root.scrollHeight), paths }
      setGeometry((previous) => {
        if (previous.width === nextGeometry.width && previous.height === nextGeometry.height && previous.paths.join() === paths.join()) {
          return previous
        }
        return nextGeometry
      })
    }

    function schedule() {
      if (disposed) {
        return
      }
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(measure)
    }

    const observer = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null
    observer?.observe(root)
    root.addEventListener('load', schedule, true)
    window.addEventListener('resize', schedule, { passive: true })
    document.fonts?.ready.then(schedule)
    schedule()

    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
      root.removeEventListener('load', schedule, true)
      window.removeEventListener('resize', schedule)
    }
  }, [rootRef])

  return (
    <svg
      aria-hidden="true"
      className="environment-timeline-paths"
      data-timeline-paths={geometry.paths.length}
      preserveAspectRatio="none"
      viewBox={'0 0 ' + geometry.width + ' ' + geometry.height}
    >
      {geometry.paths.map((path, index) => <path d={path} key={index} />)}
    </svg>
  )
}

