// Service d'export de données
// Permet d'exporter les données clients et abonnés en CSV et PDF

class ExportService {
  // Export CSV générique avec titres personnalisés et colonnes dynamiques
  exportToCSV(data, filename, columns) {
    if (!data || data.length === 0) {
      throw new Error('Aucune donnée à exporter');
    }

    // columns: [{ key, label }]
    const csvHeaders = columns.map((col) => col.label);
    const csvKeys = columns.map((col) => col.key);
    const csvContent = [
      csvHeaders.join(','),
      ...data.map((row) =>
        csvKeys
          .map((key) => {
            const value = row[key] || '';
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ].join('\n');

    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
  }

  // Export des clients en CSV
  exportClientsToCSV(clients) {
    const headers = [
      'ID',
      'Nom',
      'Email',
      'Téléphone',
      'Entreprise',
      'Type de Projet',
      'Budget',
      'Message',
      'Statut',
      'Date de Création',
    ];

    const processedData = clients.map((client) => ({
      ID: client.id,
      Nom: client.name,
      Email: client.email,
      Téléphone: client.phone || 'N/A',
      Entreprise: client.company || 'N/A',
      'Type de Projet': client.projectType || 'N/A',
      Budget: client.budget || 'N/A',
      Message: client.message || 'N/A',
      Statut: this.formatStatus(client.status),
      'Date de Création': this.formatDate(client.createdAt),
    }));

    this.exportToCSV(processedData, `clients_${this.getDateString()}`, headers);
  }

  // Export des abonnés en CSV
  exportSubscribersToCSV(subscribers) {
    const headers = ['ID', 'Email', "Date d'Abonnement", 'Statut'];

    const processedData = subscribers.map((subscriber) => ({
      ID: subscriber.id,
      Email: subscriber.email,
      "Date d'Abonnement": this.formatDate(subscriber.subscribedAt),
      Statut: this.formatStatus(subscriber.status),
    }));

    this.exportToCSV(processedData, `abonnes_${this.getDateString()}`, headers);
  }

  // Export PDF avec colonnes personnalisées, logo, pied de page, couleurs
  exportToPDF(data, title, filename, columns, options = {}) {
    const htmlContent = this.generatePDFHTML(data, title, columns, options);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
    setTimeout(() => {
      printWindow.close();
    }, 1000);
  }

  // Générer HTML pour PDF avec personnalisation
  generatePDFHTML(data, title, columns, options = {}) {
    const headers = columns.map((col) => col.label);
    const keys = columns.map((col) => col.key);
    const logoUrl = options.logoUrl || '';
    const mainColor = options.mainColor || '#8B5CF6';
    const secondaryColor = options.secondaryColor || '#f9f9f9';
    const footerText =
      options.footerText ||
      'Rapport généré par le Dashboard Admin - Bendelo Thielcy';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          h1 { color: ${mainColor}; border-bottom: 2px solid ${mainColor}; padding-bottom: 10px; }
          .logo { max-width: 120px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: ${mainColor}; color: white; font-weight: bold; }
          tr:nth-child(even) { background-color: ${secondaryColor}; }
          .export-info { margin-bottom: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px; }
          @media print { body { margin: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="export-info">
          ${logoUrl ? `<img src="${logoUrl}" class="logo" alt="Logo" />` : ''}
          <h1>${title}</h1>
          <p><strong>Exporté le:</strong> ${new Date().toLocaleDateString(
            'fr-FR'
          )} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          <p><strong>Nombre d'éléments:</strong> ${data.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              ${headers.map((header) => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row) => `
              <tr>
                ${keys.map((key) => `<td>${row[key] || 'N/A'}</td>`).join('')}
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>${footerText}</p>
        </div>
      </body>
      </html>
    `;
  }

  // Export des clients en PDF
  exportClientsToPDF(clients) {
    const processedData = clients.map((client) => ({
      ID: client.id,
      Nom: client.name,
      Email: client.email,
      Téléphone: client.phone || 'N/A',
      Entreprise: client.company || 'N/A',
      'Type de Projet': client.projectType || 'N/A',
      Budget: client.budget || 'N/A',
      Statut: this.formatStatus(client.status),
      'Date de Création': this.formatDate(client.createdAt),
    }));

    this.exportToPDF(
      processedData,
      'Rapport des Clients',
      `clients_${this.getDateString()}`
    );
  }

  // Export des abonnés en PDF
  exportSubscribersToPDF(subscribers) {
    const processedData = subscribers.map((subscriber) => ({
      ID: subscriber.id,
      Email: subscriber.email,
      "Date d'Abonnement": this.formatDate(subscriber.subscribedAt),
      Statut: this.formatStatus(subscriber.status),
    }));

    this.exportToPDF(
      processedData,
      'Rapport des Abonnés',
      `abonnes_${this.getDateString()}`
    );
  }

  // Utilitaires
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatStatus(status) {
    const statusMap = {
      nouveau: 'Nouveau',
      en_cours: 'En cours',
      termine: 'Terminé',
      actif: 'Actif',
      inactif: 'Inactif',
    };
    return statusMap[status] || status;
  }

  getDateString() {
    return new Date().toISOString().split('T')[0].replace(/-/g, '');
  }

  // Export avec filtres avancés et colonnes personnalisées
  exportWithFilters(data, filters, type = 'csv', columns = null, options = {}) {
    let filteredData = [...data];

    // Filtres génériques
    if (filters.dateFrom) {
      filteredData = filteredData.filter(
        (item) =>
          new Date(item.date || item.createdAt || item.subscribedAt) >=
          new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filteredData = filteredData.filter(
        (item) =>
          new Date(item.date || item.createdAt || item.subscribedAt) <=
          new Date(filters.dateTo)
      );
    }
    if (filters.type) {
      filteredData = filteredData.filter((item) => item.type === filters.type);
    }
    if (filters.client) {
      filteredData = filteredData.filter(
        (item) => (item.client || item.name) === filters.client
      );
    }
    if (filters.project) {
      filteredData = filteredData.filter(
        (item) => item.project === filters.project
      );
    }

    // Colonnes dynamiques
    const exportColumns =
      columns ||
      Object.keys(filteredData[0] || {}).map((key) => ({ key, label: key }));

    // Exporter selon le type
    if (type === 'csv') {
      this.exportToCSV(
        filteredData,
        options.filename || 'export',
        exportColumns
      );
    } else if (type === 'pdf') {
      this.exportToPDF(
        filteredData,
        options.title || 'Export PDF',
        options.filename || 'export',
        exportColumns,
        options
      );
    }
  }
}

export default new ExportService();
