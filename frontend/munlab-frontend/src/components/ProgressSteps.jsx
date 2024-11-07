import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ProgressSteps = ({ currentStep, totalSteps }) => {
    return (
        <div className="progress-steps mb-4">
        {/* Labels degli step */}
        <div className="steps-labels d-flex justify-content-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
            <motion.div 
            key={index}
            className={`step-label ${index + 1 <= currentStep ? 'active' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.2 }}
            >
            {`Step ${index + 1}`}
            </motion.div>
        ))}
        </div>
        
        {/* Barra di progresso */}
        <div className="progress" style={{ height: '8px' }}>
        <motion.div
        className="progress-bar"
        style={{ 
            background: 'var(--primary-color)',
            originX: 0 
        }}
        initial={{ width: "0%" }}
        animate={{ 
            width: `${(currentStep / totalSteps) * 100}%` 
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        </div>
        
        {/* Step descriptions */}
        <div className="step-descriptions mt-2 text-center">
        <small className="text-muted">
        {currentStep === 1 && 'Informazioni Personali'}
        {currentStep === 2 && 'Dettagli Account'}
        {currentStep === 3 && 'Sicurezza'}
        </small>
        </div>
        </div>
    );
};

ProgressSteps.propTypes = {
    currentStep: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired
};

export default ProgressSteps;