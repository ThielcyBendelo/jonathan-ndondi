// Test de vérification du système
console.log('Test des services...');

// Import des services
const _testData = {
  client: {
    nom: 'Test Client',
    email: 'test@example.com',
    telephone: '123456789',
    typeProjet: 'Site Web',
    budget: '1000-5000',
    delai: '1-2 mois',
    description: 'Test de projet',
  },
  subscriber: {
    email: 'subscriber@example.com',
  },
};

// Test localStorage
try {
  localStorage.setItem('test', 'data');
  const result = localStorage.getItem('test');
  console.log('localStorage fonctionne:', result === 'data');
  localStorage.removeItem('test');
} catch (error) {
  console.error('Erreur localStorage:', error);
}

console.log('Tests terminés');
