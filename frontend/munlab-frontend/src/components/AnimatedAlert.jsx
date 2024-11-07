import React from 'react';
import { Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const AnimatedAlert = ({ show, variant, onClose, children }) => {
    return (
        <AnimatePresence>
        {show && (
            <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            >
            <Alert 
            variant={variant} 
            onClose={onClose} 
            dismissible
            className="mb-4"
            >
            {children}
            </Alert>
            </motion.div>
        )}
        </AnimatePresence>
    );
};

AnimatedAlert.propTypes = {
    show: PropTypes.bool.isRequired,
    variant: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

export default AnimatedAlert;