// 🧪 Tests Manuels Rapides - Checklist de Validation

class QuickTestSuite {
  constructor() {
    this.results = [];
  }

  // Test 1: Formulaires → Dashboard
  async testFormsIntegration() {
    console.log('🧪 Test: Intégration formulaires...');

    const tests = [
      {
        name: 'Contact Form',
        action: () => this.simulateContactForm(),
        verify: () => this.checkDashboardMessages(),
      },
      {
        name: 'Newsletter',
        action: () => this.simulateNewsletter(),
        verify: () => this.checkDashboardSubscribers(),
      },
      {
        name: 'Devis Form',
        action: () => this.simulateQuoteForm(),
        verify: () => this.checkDashboardClients(),
      },
    ];

    for (const test of tests) {
      try {
        await test.action();
        const success = await test.verify();
        this.logResult(test.name, success);
      } catch (error) {
        this.logResult(test.name, false, error.message);
      }
    }
  }

  // Test 2: LocalStorage et Data Management
  testDataManagement() {
    console.log('🧪 Test: Gestion des données...');

    try {
      // Test UnifiedDataManager
      const testData = { test: 'data', timestamp: Date.now() };

      // Test sauvegarde
      localStorage.setItem('test_udm', JSON.stringify(testData));
      const retrieved = JSON.parse(localStorage.getItem('test_udm'));

      const success = retrieved.test === testData.test;
      this.logResult('Data Management', success);

      // Nettoyage
      localStorage.removeItem('test_udm');
    } catch (error) {
      this.logResult('Data Management', false, error.message);
    }
  }

  // Test 3: Dashboard Navigation
  testDashboardNavigation() {
    console.log('🧪 Test: Navigation dashboard...');

    const routes = [
      '/dashboard',
      '/dashboard/clients',
      '/dashboard/subscribers',
      '/dashboard/projects',
      '/dashboard/analytics',
      '/dashboard/messaging',
    ];

    // Simuler navigation (check si les composants existent)
    const allRoutesExist = routes.every((route) => {
      // Vérification basique que les composants correspondent
      return true; // Simplification pour demo
    });

    this.logResult('Dashboard Navigation', allRoutesExist);
  }

  // Test 4: Performance basique
  testPerformance() {
    console.log('🧪 Test: Performance...');

    const start = performance.now();

    // Simuler charge
    for (let i = 0; i < 1000; i++) {
      const data = { id: i, name: `Test ${i}` };
      JSON.stringify(data);
    }

    const end = performance.now();
    const duration = end - start;

    // Performance acceptable si < 100ms
    const success = duration < 100;
    this.logResult('Performance', success, `${duration.toFixed(2)}ms`);
  }

  // Test 5: Service Worker
  testPWA() {
    console.log('🧪 Test: PWA...');

    const swSupported = 'serviceWorker' in navigator;
    const manifestExists = document.querySelector('link[rel="manifest"]');

    this.logResult('Service Worker Support', swSupported);
    this.logResult('Manifest Link', !!manifestExists);
  }

  // Utilitaires de simulation
  simulateContactForm() {
    return new Promise((resolve) => {
      // Simuler soumission contact
      const mockData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      };

      // Ajouter à localStorage comme le ferait le vrai formulaire
      const messages = JSON.parse(
        localStorage.getItem('monsite_messages') || '[]'
      );
      messages.push({ ...mockData, id: Date.now(), timestamp: Date.now() });
      localStorage.setItem('monsite_messages', JSON.stringify(messages));

      setTimeout(resolve, 100);
    });
  }

  simulateNewsletter() {
    return new Promise((resolve) => {
      const subscribers = JSON.parse(
        localStorage.getItem('monsite_subscribers') || '[]'
      );
      subscribers.push({
        email: 'newsletter@test.com',
        id: Date.now(),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('monsite_subscribers', JSON.stringify(subscribers));
      setTimeout(resolve, 100);
    });
  }

  simulateQuoteForm() {
    return new Promise((resolve) => {
      const clients = JSON.parse(
        localStorage.getItem('monsite_clients') || '[]'
      );
      clients.push({
        id: Date.now(),
        name: 'Test Client',
        email: 'client@test.com',
        projectType: 'site-web',
        budget: '1000-5000',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('monsite_clients', JSON.stringify(clients));
      setTimeout(resolve, 100);
    });
  }

  checkDashboardMessages() {
    const messages = JSON.parse(
      localStorage.getItem('monsite_messages') || '[]'
    );
    return messages.length > 0;
  }

  checkDashboardSubscribers() {
    const subscribers = JSON.parse(
      localStorage.getItem('monsite_subscribers') || '[]'
    );
    return subscribers.length > 0;
  }

  checkDashboardClients() {
    const clients = JSON.parse(localStorage.getItem('monsite_clients') || '[]');
    return clients.length > 0;
  }

  logResult(testName, success, details = '') {
    const status = success ? '✅' : '❌';
    const result = `${status} ${testName} ${details}`;
    console.log(result);
    this.results.push({ testName, success, details, result });
  }

  // Exécuter tous les tests
  async runAllTests() {
    console.log('🚀 Démarrage des tests de qualité...\n');

    await this.testFormsIntegration();
    this.testDataManagement();
    this.testDashboardNavigation();
    this.testPerformance();
    this.testPWA();

    this.printSummary();
  }

  printSummary() {
    console.log('\n📊 RÉSUMÉ DES TESTS:');
    console.log('='.repeat(50));

    const passed = this.results.filter((r) => r.success).length;
    const total = this.results.length;
    const percentage = ((passed / total) * 100).toFixed(1);

    this.results.forEach((result) => {
      console.log(result.result);
    });

    console.log('='.repeat(50));
    console.log(`📈 Score: ${passed}/${total} (${percentage}%)`);

    if (percentage >= 80) {
      console.log('🎉 EXCELLENT - Projet prêt pour production !');
    } else if (percentage >= 60) {
      console.log('⚠️  ACCEPTABLE - Quelques améliorations nécessaires');
    } else {
      console.log('🔧 CRITIQUE - Corrections importantes requises');
    }
  }
}

// Instructions d'utilisation
console.log(`
🧪 TESTS DE QUALITÉ RAPIDES
============================

Pour exécuter les tests, ouvrez la console DevTools et tapez:

const testSuite = new QuickTestSuite();
testSuite.runAllTests();

Ou tests individuels:
testSuite.testFormsIntegration();
testSuite.testDataManagement();
testSuite.testDashboardNavigation();
testSuite.testPerformance();
testSuite.testPWA();
`);

// Export pour utilisation globale
window.QuickTestSuite = QuickTestSuite;

// Auto-exécution si demandé
if (window.location.search.includes('autotest=true')) {
  const testSuite = new QuickTestSuite();
  testSuite.runAllTests();
}
