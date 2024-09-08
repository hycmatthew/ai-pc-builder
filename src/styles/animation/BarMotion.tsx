import { motion, Variants } from 'framer-motion'

const cardVariants: Variants = {
  offscreen: {
    scale: 0,
    x: '-50%',
  },
  onscreen: {
    scale: 1,
    x: '0%',
    transition: {
      type: 'spring',
      bounce: 0.3,
      duration: 0.9,
    },
  },
}

type BarMotionProp = {
  children: JSX.Element
}

function BarMotion({ children }: BarMotionProp) {
  return (
    <motion.div
      className="card-container"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.8 }}
    >
      <motion.div className="card" variants={cardVariants}>
        {children}
      </motion.div>
    </motion.div>
  )
}

export default BarMotion
