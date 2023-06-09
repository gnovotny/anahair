import { useRef, useEffect, memo, FC, PropsWithChildren, useState } from 'react'

import cn from 'clsx'

type PageTransitionStackProps = {
  customClassName?: string
  customInactiveClassName?: string
  customActiveClassName?: string
}

/**
 *
 * @param children
 * @param customClassName
 * @param customInactiveClassName
 * @param customActiveClassName
 * @constructor
 */
const PageTransitionStack: FC<PropsWithChildren<PageTransitionStackProps>> = ({
  children,
  customClassName = '',
  customInactiveClassName = '',
  customActiveClassName = '',
}): JSX.Element => {
  const [nodes] = useState([children, null])

  const className =
    'will-change-[opacity] transform-opacity duration-[1000ms] opacity-0 absolute pointer-events-none z-10'
  const activeClassName = '!opacity-100 !static !pointer-events-auto !z-0'

  const [activeNodeIndex, setActiveNodeIndex] = useState(0)

  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    if (children) {
      // @ToDo performant?
      if (children !== nodes[activeNodeIndex]) {
        const newActiveNodeIndex = activeNodeIndex === 0 ? 1 : 0
        setActiveNodeIndex(newActiveNodeIndex)
        nodes[newActiveNodeIndex] = children
      }
    }
  }, [children])

  return (
    <>
      {nodes.map((node, index) => (
        <div
          key={`node-${index}`}
          className={cn(className, customClassName, {
            [activeClassName]: activeNodeIndex === index,
            [customActiveClassName]: activeNodeIndex === index,
            [customInactiveClassName]: activeNodeIndex !== index,
          })}
        >
          {nodes[index]}
        </div>
      ))}
    </>
  )
}

export default memo(PageTransitionStack)
