import React from 'react';
import useFormSecurity from '../hooks/useFormSecurity';
import { sendContact } from '../services/contactApi';

const SecureContactForm = () => {
  // Schéma de validation du formulaire
  const formSchema = {
    name: {
      type: 'text',
      minLength: 2,
      maxLength: 50,
      required: true,
    },
    email: {
      type: 'email',
      required: true,
    },
    phone: {
      type: 'phone',
      required: false,
    },
    subject: {
      type: 'text',
      minLength: 5,
      maxLength: 100,
      required: true,
    },
    message: {
      type: 'text',
      minLength: 10,
      maxLength: 1000,
      required: true,
    },
  };

  // Hook de sécurité
  const {
    formData,
    errors,
    touched,
    isLoading,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useFormSecurity(formSchema, async (data) => {
    try {
      // Envoyer les données à l'API backend
      await sendContact(data);
      alert('✓ Message envoyé avec succès !');
      resetForm();
    } catch (error) {
      console.error('Erreur :', error);
      throw new Error(error.message || 'Erreur lors de l\'envoi');
    }
  });

  // Composant d'erreur
  const FieldError = ({ error, touched }) => {
    return touched && error ? (
      <p className="text-red-500 text-sm mt-1">⚠️ {error}</p>
    ) : null;
  };

  // Composant d'input sécurisé
  const SecureInput = ({
    label,
    name,
    type = 'text',
    placeholder,
    required = false,
  }) => {
    const isTouched = touched[name];
    const error = errors[name];
    const hasError = isTouched && error;

    return (
      <div className="mb-4">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={formData[name] || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
            hasError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          disabled={isLoading}
        />
        <FieldError error={error} touched={isTouched} />
      </div>
    );
  };

  // Composant textarea sécurisé
  const SecureTextarea = ({
    label,
    name,
    placeholder,
    required = false,
    rows = 4,
  }) => {
    const isTouched = touched[name];
    const error = errors[name];
    const hasError = isTouched && error;

    return (
      <div className="mb-4">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={formData[name] || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={rows}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
            hasError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          disabled={isLoading}
        />
        <FieldError error={error} touched={isTouched} />
        <p className="text-xs text-gray-500 mt-1">
          {formData[name]?.length || 0}/1000 caractères
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🔒 Formulaire de Contact Sécurisé
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Erreur générale */}
        {errors._form && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{errors._form}</p>
          </div>
        )}

        {/* Champs du formulaire */}
        <SecureInput
          label="Nom complet"
          name="name"
          placeholder="Jean Dupont"
          required
        />

        <SecureInput
          label="Email"
          name="email"
          type="email"
          placeholder="jean@example.com"
          required
        />

        <SecureInput
          label="Téléphone (optionnel)"
          name="phone"
          type="tel"
          placeholder="+33 6 12 34 56 78"
        />

        <SecureInput
          label="Sujet"
          name="subject"
          placeholder="Sujet de votre demande"
          required
        />

        <SecureTextarea
          label="Message"
          name="message"
          placeholder="Décrivez votre demande en détails..."
          required
          rows={5}
        />

        {/* Boutons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isLoading ? '⏳ Envoi en cours...' : '✓ Envoyer'}
          </button>

          <button
            type="button"
            onClick={resetForm}
            disabled={isLoading}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 disabled:opacity-50 transition"
          >
            ✕ Réinitialiser
          </button>
        </div>
      </form>

      {/* Indicateurs de sécurité */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">
          🛡️ <strong>Fonctionnalités de sécurité:</strong>
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>✓ Validation XSS et injection HTML</li>
          <li>✓ Sanitisation des entrées utilisateur</li>
          <li>✓ Validation des emails et numéros</li>
          <li>✓ Rate limiting (protection contre les abus)</li>
          <li>✓ Validation forte des mots de passe</li>
        </ul>
      </div>
    </div>
  );
};

export default SecureContactForm;
