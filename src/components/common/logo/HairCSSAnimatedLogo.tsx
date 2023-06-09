import cn from 'clsx'
import useMeasure from 'react-use-measure'

import useCSSAnimatedSVGGeometryElementStroke from '@/lib/hooks/useCSSAnimatedSVGGeometryElementStroke'

const AnimatedLogoGroup = ({ triggered = false, delay = 0, nonScalingStroke = false, scaling = 1 }) => (
  <g>
    <line
      x1='0.5'
      y1='0.5'
      x2='0.5'
      y2='77.5'
      {...useCSSAnimatedSVGGeometryElementStroke({
        triggered,
        delay: delay + 50,
        nonScalingStroke,
        scaling,
      })}
    />
    <line
      x1='62.5'
      y1='0.5'
      x2='62.5'
      y2='77.5'
      {...useCSSAnimatedSVGGeometryElementStroke({
        triggered,
        delay: delay + 200,
        nonScalingStroke,
        scaling,
      })}
    />
    <line
      x1='0.5'
      y1='35.5'
      x2='62.5'
      y2='35.5'
      {...useCSSAnimatedSVGGeometryElementStroke({
        triggered,
        delay: delay + 400,
        nonScalingStroke,
        scaling,
      })}
    />
    <polyline
      points='169.5 77.5 133.5 1.5 95.5 77.5'
      {...useCSSAnimatedSVGGeometryElementStroke({
        triggered,
        delay: delay + 600,
        nonScalingStroke,
        scaling,
      })}
    />
    <line
      x1='109.5'
      y1='50.5'
      x2='156.5'
      y2='50.5'
      {...useCSSAnimatedSVGGeometryElementStroke({
        triggered,
        delay: delay + 800,
        nonScalingStroke,
        scaling,
      })}
    />
    <line
      x1='202.5'
      y1='0.5'
      x2='202.5'
      y2='77.5'
      {...useCSSAnimatedSVGGeometryElementStroke({
        triggered,
        delay: delay + 1000,
        nonScalingStroke,
        scaling,
      })}
    />
    <line
      x1='303.5'
      y1='77.5'
      x2='277.5'
      y2='43.5'
      {...useCSSAnimatedSVGGeometryElementStroke({
        triggered,
        delay: delay + 1200,
        nonScalingStroke,
        scaling,
      })}
    />
    <path
      d='M243.5,43.5h37a59.2,59.2,0,0,0,10.8-1.11,30.82,30.82,0,0,0,7.75-2.49,13,13,0,0,0,4.57-3.78,12.86,12.86,0,0,0,2.25-4.59,23.91,23.91,0,0,0,.55-5.41v-8a22.91,22.91,0,0,0-.62-5.65,13,13,0,0,0-2.49-4.73,13.34,13.34,0,0,0-5.12-3.81,36.81,36.81,0,0,0-8.76-2.37A82.41,82.41,0,0,0,276.32.61L243,.5h.5v77'
      {...useCSSAnimatedSVGGeometryElementStroke({
        triggered,
        delay: delay + 1400,
        nonScalingStroke,
        scaling,
      })}
    />
  </g>
)
const HairCSSAnimatedLogo = ({ className = '', triggered = false, delay = 0, ...props }) => {
  const [svgRef, { width: svgWidth }] = useMeasure()

  return (
    <svg
      ref={svgRef}
      viewBox='0 0 306.92 77.8'
      fill='none'
      strokeWidth={1}
      xmlns='http://www.w3.org/2000/svg'
      className={cn(
        'overflow-visible stroke-current',
        // ' opacity-0',
        // {
        //   'opacity-100': !!svgWidth,
        // },
        className
      )}
      {...props}
    >
      <title>HAIR</title>
      <AnimatedLogoGroup
        nonScalingStroke
        scaling={svgWidth ? 306.92 / svgWidth : 1}
        triggered={triggered}
        delay={delay}
      />
    </svg>
  )
}

// * (306.92 / 687.55)

export default HairCSSAnimatedLogo
