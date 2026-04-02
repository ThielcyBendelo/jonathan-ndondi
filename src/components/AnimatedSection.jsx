import React from 'react';
import { useInView } from 'framer-motion';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useRef } from 'react';

const AnimatedSection = ({
  children,
  variant = 'slideUp',
  delay = 0,
  duration = 0.8,
  className = '',
  once = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  const variants = {
    slideUp: {
      hidden: {
        opacity: 0,
        y: 60,
        scale: 0.95,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.25, 0.25, 0.75],
        },
      },
    },
    slideDown: {
      hidden: {
        opacity: 0,
        y: -60,
        scale: 0.95,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.25, 0.25, 0.75],
        },
      },
    },
    slideLeft: {
      hidden: {
        opacity: 0,
        x: 60,
        scale: 0.95,
      },
      visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.25, 0.25, 0.75],
        },
      },
    },
    slideRight: {
      hidden: {
        opacity: 0,
        x: -60,
        scale: 0.95,
      },
      visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.25, 0.25, 0.75],
        },
      },
    },
    fadeIn: {
      hidden: {
        opacity: 0,
        scale: 0.9,
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: 'easeOut',
        },
      },
    },
    scaleIn: {
      hidden: {
        opacity: 0,
        scale: 0.8,
        rotate: -5,
      },
      visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
          duration,
          delay,
          ease: 'backOut',
          scale: {
            type: 'spring',
            damping: 15,
            stiffness: 300,
          },
        },
      },
    },
    staggerChildren: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: delay,
        },
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[variant]}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour animer les éléments enfants avec stagger
export const AnimatedStagger = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div variants={itemVariants} key={index}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Hook déplacé vers ../hooks/useScrollAnimation.js

export default AnimatedSection;
