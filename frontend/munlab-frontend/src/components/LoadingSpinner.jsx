import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = '40px', color = 'var(--primary-color)' }) => {
    return (
        <motion.div
        style={{
            width: size,
            height: size,
            border: `3px solid ${color}`,
            borderRadius: '50%',
            borderTopColor: 'transparent',
        }}
        animate={{ rotate: 360 }}
        transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
        }}
        />
    );
};

export default LoadingSpinner;