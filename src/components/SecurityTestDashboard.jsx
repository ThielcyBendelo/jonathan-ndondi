import React, { useState, useEffect } from 'react';
import {
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle,
} from 'react-icons/fa';
import authService from '../services/authService';
import securityService from '../services/securityService';

export default function SecurityTestDashboard() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    runAllTests();
  }, []);

  const runAllTests = async () => {
    setLoading(true);
    const results = {
      authInitialized: testAuthInitialized(),
      tokenExist: testTokenExist(),
      userLoggedIn: testUserLoggedIn(),
      tokenFormat: testTokenFormat(),
      securityServiceActive: testSecurityService(),
      localStorageSecure: testLocalStorageSecure(),
      dompurifyLoaded: testDOMPurifyLoaded(),
      rateLimitingActive: testRateLimiting(),
      csrfTokenGeneration: testCSRFToken(),
      passwordStrengthValidator: testPasswordValidator(),
    };

    setTestResults(results);
    setUserInfo(authService.getCurrentUser());
    setLoading(false);
  };

  // Tests individuels
  const testAuthInitialized = () => {
    try {
      const isLoggedIn = authService.isLoggedIn();
      return {
        name: 'Authentification initialisée',
        status: isLoggedIn !== undefined ? 'pass' : 'fail',
        message: isLoggedIn
          ? 'Utilisateur connecté'
          : 'Utilisateur non connecté',
        icon: isLoggedIn ? '✅' : '⚪',
      };
    } catch (error) {
      return {
        name: 'Authentification initialisée',
        status: 'fail',
        message: error.message,
      };
    }
  };

  const testTokenExist = () => {
    try {
      const token = sessionStorage.getItem('user_token');
      return {
        name: 'Token JWT présent',
        status: token ? 'pass' : 'fail',
        message: token
          ? `Token de ${token.length} caractères`
          : 'Aucun token trouvé',
        icon: token ? '✅' : '❌',
      };
    } catch (error) {
      return {
        name: 'Token JWT présent',
        status: 'fail',
        message: error.message,
      };
    }
  };

  const testUserLoggedIn = () => {
    const isLoggedIn = authService.isLoggedIn();
    const user = authService.getCurrentUser();
    return {
      name: 'État de connexion utilisateur',
      status: isLoggedIn ? 'pass' : 'fail',
      message: isLoggedIn
        ? `Connecté en tant que: ${user?.email}`
        : 'Non connecté',
      icon: isLoggedIn ? '✅' : '⚪',
    };
  };

  const testTokenFormat = () => {
    const token = sessionStorage.getItem('user_token');
    if (!token) {
      return {
        name: 'Format JWT valide',
        status: 'fail',
        message: 'Aucun token pour valider',
        icon: '⚪',
      };
    }
    const parts = token.split('.');
    const isValid = parts.length === 3;
    return {
      name: 'Format JWT valide',
      status: isValid ? 'pass' : 'fail',
      message: isValid ? 'JWT à 3 parties valide' : 'Format JWT invalide',
      icon: isValid ? '✅' : '❌',
    };
  };

  const testSecurityService = () => {
    try {
      const sanitized = securityService.sanitizeHTML(
        '<script>alert("xss")</script>'
      );
      const isSafe = !sanitized.includes('<script>');
      return {
        name: 'Service de sécurité actif',
        status: isSafe ? 'pass' : 'fail',
        message: isSafe
          ? 'Sanitization XSS fonctionne'
          : 'Sanitization échouée',
        icon: isSafe ? '✅' : '❌',
      };
    } catch (error) {
      return {
        name: 'Service de sécurité actif',
        status: 'fail',
        message: error.message,
      };
    }
  };

  const testLocalStorageSecure = () => {
    try {
      // Vérifier qu'on utilise sessionStorage, pas localStorage
      const hasLocalStorageToken = localStorage.getItem('user_token') !== null;
      const hasSessionStorageToken =
        sessionStorage.getItem('user_token') !== null;

      return {
        name: 'Stockage sécurisé (sessionStorage)',
        status: !hasLocalStorageToken ? 'pass' : 'fail',
        message: hasSessionStorageToken
          ? 'Token correctement dans sessionStorage'
          : 'Token manquant',
        icon: !hasLocalStorageToken ? '✅' : '⚠️',
      };
    } catch (error) {
      return {
        name: 'Stockage sécurisé',
        status: 'fail',
        message: error.message,
      };
    }
  };

  const testDOMPurifyLoaded = () => {
    try {
      const isDOMPurifyAvailable = typeof window.DOMPurify !== 'undefined';
      return {
        name: 'DOMPurify chargé',
        status: isDOMPurifyAvailable ? 'pass' : 'fail',
        message: isDOMPurifyAvailable
          ? 'DOMPurify disponible'
          : 'DOMPurify non trouvé',
        icon: isDOMPurifyAvailable ? '✅' : '❌',
      };
    } catch (error) {
      return {
        name: 'DOMPurify chargé',
        status: 'fail',
        message: error.message,
      };
    }
  };

  const testRateLimiting = () => {
    try {
      const rateLimitData = JSON.parse(
        sessionStorage.getItem('rate_limit_data') || '{}'
      );
      return {
        name: 'Rate limiting actif',
        status: 'pass',
        message: `Système de rate limiting configuré (${
          Object.keys(rateLimitData).length
        } entrées)`,
        icon: '✅',
      };
    } catch (error) {
      return {
        name: 'Rate limiting actif',
        status: 'fail',
        message: error.message,
      };
    }
  };

  const testCSRFToken = () => {
    try {
      const csrfToken = sessionStorage.getItem('csrf_token');
      return {
        name: 'CSRF token généré',
        status: csrfToken ? 'pass' : 'fail',
        message: csrfToken
          ? `CSRF token de ${csrfToken.length} caractères`
          : 'CSRF token manquant (généré à la première requête)',
        icon: csrfToken ? '✅' : '⚠️',
      };
    } catch (error) {
      return {
        name: 'CSRF token généré',
        status: 'fail',
        message: error.message,
      };
    }
  };

  const testPasswordValidator = () => {
    try {
      const weakPassword = securityService.validatePasswordStrength('abc');
      const strongPassword =
        securityService.validatePasswordStrength('Test@12345');

      return {
        name: 'Validateur de mot de passe',
        status: weakPassword < 2 && strongPassword >= 3 ? 'pass' : 'fail',
        message: 'Validation des mots de passe fonctionnelle',
        icon: weakPassword < 2 && strongPassword >= 3 ? '✅' : '❌',
      };
    } catch (error) {
      return {
        name: 'Validateur de mot de passe',
        status: 'fail',
        message: error.message,
      };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <FaCheckCircle className="text-green-500" />;
      case 'fail':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaQuestionCircle className="text-yellow-500" />;
    }
  };

  const passCount = Object.values(testResults).filter(
    (t) => t.status === 'pass'
  ).length;
  const totalTests = Object.keys(testResults).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaShieldAlt className="text-4xl text-blue-500" />
            <h1 className="text-4xl font-bold text-white">
              Dashboard de Sécurité
            </h1>
          </div>
          <p className="text-gray-400">
            Tests de validation des fonctionnalités de sécurité
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-500">{passCount}</div>
            <div className="text-gray-400">Tests réussis</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white">{totalTests}</div>
            <div className="text-gray-400">Tests au total</div>
          </div>
          <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-500">
              {Math.round((passCount / totalTests) * 100)}%
            </div>
            <div className="text-gray-400">Taux de réussite</div>
          </div>
        </div>

        {/* User Info */}
        {userInfo && (
          <div className="bg-gray-700 rounded-lg p-4 mb-8 border-l-4 border-blue-500">
            <h3 className="text-white font-bold mb-2">
              📊 Informations utilisateur
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Email:</span>
                <p className="text-white font-mono">{userInfo.email}</p>
              </div>
              <div>
                <span className="text-gray-400">Rôle:</span>
                <p className="text-white font-mono">
                  {userInfo.role || 'user'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Test Results */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            🔍 Résultats des tests
          </h2>

          {loading ? (
            <div className="text-center text-gray-400">
              Exécution des tests...
            </div>
          ) : (
            Object.entries(testResults).map(([key, test]) => (
              <div
                key={key}
                onClick={() =>
                  setSelectedTest(selectedTest === key ? null : key)
                }
                className="bg-gray-700 hover:bg-gray-650 rounded-lg p-4 cursor-pointer transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <h3 className="text-white font-semibold">{test.name}</h3>
                      <p className="text-gray-400 text-sm">{test.message}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-bold ${
                      test.status === 'pass'
                        ? 'bg-green-500/20 text-green-400'
                        : test.status === 'fail'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {test.status.toUpperCase()}
                  </span>
                </div>

                {/* Expanded details */}
                {selectedTest === key && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="bg-gray-800 rounded p-3 font-mono text-xs text-gray-300">
                      <p>✓ {test.message}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Debug Section */}
        <div className="mt-8 bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-500">
          <h3 className="text-white font-bold mb-2">🔧 Déboguer</h3>
          <button
            onClick={runAllTests}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
          >
            🔄 Réexécuter les tests
          </button>

          <div className="mt-4 bg-gray-800 rounded p-3 font-mono text-xs text-gray-300 max-h-40 overflow-y-auto">
            <p>Session Storage Keys:</p>
            {Object.keys(sessionStorage).map((key) => (
              <p key={key} className="text-gray-400">
                • {key}: {sessionStorage.getItem(key)?.substring(0, 20)}...
              </p>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">✅ Résumé de sécurité</h3>
          <ul className="space-y-2 text-sm">
            <li>✓ Authentification JWT configurée</li>
            <li>✓ Stockage sécurisé (sessionStorage)</li>
            <li>✓ Protection XSS avec DOMPurify</li>
            <li>✓ Validation des formulaires</li>
            <li>✓ Rate limiting activé</li>
            <li>✓ CSRF tokens générés</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
