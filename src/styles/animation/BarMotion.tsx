import React, { useEffect } from 'react'

import { motion, useAnimation, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const cardVariants: Variants = {
  offscreen: {
    scaleX: 0,
    x: '-50%',
  },
  onscreen: {
    scaleX: 1,
    x: '1%',
    transition: {
      type: 'spring',
      bounce: 0.3,
      duration: 0.9,
    },
  },
}

type BarMotionProp = {
  children: React.ReactNode
}

function BarMotion({ children }: BarMotionProp) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.01, // 更低的觸發閾值
    rootMargin: '0px 0px -50px 0px', // 預加載區域
  })

  useEffect(() => {
    if (inView) {
      controls.start('onscreen')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="offscreen"
      animate={controls}
      variants={cardVariants}
    >
      {children}
    </motion.div>
  )
}

export default BarMotion
