import { useState, useCallback } from 'react';

export const useFormValidation = (initialValues, validationRules) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const validateField = useCallback((name, value) => {
        const rule = validationRules[name];
        if (!rule) return '';
        
        if (typeof rule === 'function') {
            return rule(value);
        }
        
        if (rule.required && !value) {
            return 'Questo campo è obbligatorio';
        }
        
        if (rule.pattern && !rule.pattern.test(value)) {
            return rule.message || 'Formato non valido';
        }
        
        if (rule.minLength && value.length < rule.minLength) {
            return `Minimo ${rule.minLength} caratteri`;
        }
        
        return '';
    }, [validationRules]);
    
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    }, [validateField]);
    
    const handleSubmit = async (callback) => {
        setIsSubmitting(true);
        const newErrors = {};
        
        Object.keys(values).forEach(key => {
            const error = validateField(key, values[key]);
            if (error) newErrors[key] = error;
        });
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            try {
                await callback(values);
            } catch (error) {
                // Gestione errori di invio
                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors);
                }
            }
        }
        setIsSubmitting(false);
    };
    
    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        setValues,
        setErrors
    };
};