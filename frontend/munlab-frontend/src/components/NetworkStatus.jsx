import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from 'react-bootstrap';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';

const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    
    return (
        <AnimatePresence>
        {!isOnline && (
            <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="network-status-container"
            >
            <Alert variant="warning" className="d-flex align-items-center">
            <FaExclamationTriangle className="me-2" />
            Connessione assente. Verifica la tua connessione internet.
            </Alert>
            </motion.div>
        )}
        </AnimatePresence>
    );
};

export default NetworkStatus;