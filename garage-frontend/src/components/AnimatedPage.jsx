import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function AnimatedPage({ children, className = '' }) {
  return (
    <motion.div variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className={className}>
      {children}
    </motion.div>
  );
}

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } }),
};

export const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
};

export const cardHover = { whileHover: { y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }, transition: { type: 'spring', stiffness: 300 } };
