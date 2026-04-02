import { useState, useCallback } from 'react';
import securityService from '../services/securityService';

/**
 * Hook pour gérer la sécurité et validation des formulaires
 * @param {Object} initialSchema - Schéma de validation du formulaire
 * @param {Function} onSubmit - Callback au succès de validation
 * @returns {Object} - État et fonctions pour gérer le formulaire
 */
export const useFormSecurity = (initialSchema, onSubmit) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Valider un champ individuel
  const validateField = useCallback(
    (fieldName, value, fieldSchema) => {
      let error = null;

      if (fieldSchema.type === 'email') {
        const result = securityService.validateEmail(value);
        error = result.error;
      } else if (fieldSchema.type === 'phone') {
        const result = securityService.validatePhone(value);
        error = result.error;
      } else if (fieldSchema.type === 'text') {
        const result = securityService.validateText(value, fieldSchema);
        if (!result.isValid) {
          error = result.errors[0];
        }
      } else if (fieldSchema.type === 'password') {
        const result = securityService.validatePasswordStrength(value);
        if (!result.isValid) {
          error = `Mot de passe faible (${result.strength})`;
        }
      }

      return error;
    },
    []
  );

  // Gérer le changement d'un champ
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      const fieldSchema = initialSchema[name];

      // Sanitiser l'input
      const sanitized = securityService.sanitizeInput(value, fieldSchema?.type);

      setFormData((prev) => ({
        ...prev,
        [name]: sanitized,
      }));

      // Valider si le champ a été touché
      if (touched[name]) {
        const error = validateField(name, sanitized, fieldSchema);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [initialSchema, touched, validateField]
  );

  // Marquer un champ comme touché
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    const fieldSchema = initialSchema[name];

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Valider le champ au blur
    const error = validateField(name, value, fieldSchema);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, [initialSchema, validateField]);

  // Valider tout le formulaire
  const validateForm = useCallback(() => {
    const newErrors = {};

    Object.keys(initialSchema).forEach((fieldName) => {
      const value = formData[fieldName] || '';
      const fieldSchema = initialSchema[fieldName];
      const error = validateField(fieldName, value, fieldSchema);

      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [initialSchema, formData, validateField]);

  // Soumettre le formulaire
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Marquer tous les champs comme touchés
      const allTouched = {};
      Object.keys(initialSchema).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      // Valider
      if (!validateForm()) {
        return;
      }

      // Rate limiting
      const rateLimit = securityService.checkRateLimit('form-submit');
      if (!rateLimit.allowed) {
        setErrors({
          _form: `Trop de soumissions. Réessayez dans ${rateLimit.retryAfter}s`,
        });
        return;
      }

      setIsLoading(true);

      try {
        await onSubmit(formData);
      } catch (error) {
        setErrors({
          _form: error.message || 'Erreur lors de la soumission',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [initialSchema, formData, validateForm, onSubmit]
  );

  // Réinitialiser le formulaire
  const resetForm = useCallback(() => {
    setFormData({});
    setErrors({});
    setTouched({});
  }, []);

  return {
    formData,
    errors,
    touched,
    isLoading,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormData,
  };
};

export default useFormSecurity;
