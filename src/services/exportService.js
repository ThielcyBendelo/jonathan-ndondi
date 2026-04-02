// Service d'export pour les données clients et abonnés
// Supporte les formats CSV et PDF

class ExportService {
  // Fonction utilitaire pour formater les dates
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Fonction utilitaire pour échapper les virgules dans CSV
  escapeCSVField(field) {
    if (field === null || field === undefined) return '';
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  // Export CSV des clients
  exportClientsCSV(clients) {
    try {
      const headers = [
        'ID',
        'Nom',
        'Email',
        'Téléphone',
        'Entreprise',
        'Type de projet',
        'Budget',
        'Message',
        'Statut',
        'Date de création',
      ];

      const csvRows = [headers.join(',')];

      clients.forEach((client) => {
        const row = [
          this.escapeCSVField(client.id),
          this.escapeCSVField(client.name),
          this.escapeCSVField(client.email),
          this.escapeCSVField(client.phone || ''),
          this.escapeCSVField(client.company || ''),
          this.escapeCSVField(client.projectType || ''),
          this.escapeCSVField(client.budget || ''),
          this.escapeCSVField(client.message || ''),
          this.escapeCSVField(client.status || 'nouveau'),
          this.escapeCSVField(this.formatDate(client.createdAt)),
        ];
        csvRows.push(row.join(','));
      });

      const csvContent = csvRows.join('\n');
      const blob = new Blob(['\ufeff' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const filename = `clients-${new Date().toISOString().split('T')[0]}.csv`;

      this.downloadFile(blob, filename);
      return { success: true, filename };
    } catch (error) {
      console.error("Erreur lors de l'export CSV clients:", error);
      throw new Error("Erreur lors de l'export CSV");
    }
  }

  // Export CSV des abonnés
  exportSubscribersCSV(subscribers) {
    try {
      const headers = ['ID', 'Email', "Date d'abonnement", 'Statut'];

      const csvRows = [headers.join(',')];

      subscribers.forEach((subscriber) => {
        const row = [
          this.escapeCSVField(subscriber.id),
          this.escapeCSVField(subscriber.email),
          this.escapeCSVField(this.formatDate(subscriber.subscribedAt)),
          this.escapeCSVField(subscriber.status || 'actif'),
        ];
        csvRows.push(row.join(','));
      });

      const csvContent = csvRows.join('\n');
      const blob = new Blob(['\ufeff' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const filename = `abonnes-${new Date().toISOString().split('T')[0]}.csv`;

      this.downloadFile(blob, filename);
      return { success: true, filename };
    } catch (error) {
      console.error("Erreur lors de l'export CSV abonnés:", error);
      throw new Error("Erreur lors de l'export CSV");
    }
  }

  // Export PDF des clients (format simple - peut être amélioré avec jsPDF)
  exportClientsPDF(clients) {
    try {
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Liste des Clients - ${this.formatDate(new Date())}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #8b5cf6;
              padding-bottom: 10px;
            }
            .stats {
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #8b5cf6;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
            .status {
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 0.8em;
              font-weight: bold;
            }
            .status-nouveau { background: #fef3c7; color: #92400e; }
            .status-en_cours { background: #dbeafe; color: #1e40af; }
            .status-termine { background: #d1fae5; color: #065f46; }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 0.9em;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Liste des Clients</h1>
            <p>Rapport généré le ${this.formatDate(new Date())}</p>
          </div>
          
          <div class="stats">
            <strong>Statistiques :</strong>
            <ul>
              <li>Nombre total de clients : ${clients.length}</li>
              <li>Nouveaux clients : ${
                clients.filter((c) => c.status === 'nouveau').length
              }</li>
              <li>Projets en cours : ${
                clients.filter((c) => c.status === 'en_cours').length
              }</li>
              <li>Projets terminés : ${
                clients.filter((c) => c.status === 'termine').length
              }</li>
            </ul>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Entreprise</th>
                <th>Type de projet</th>
                <th>Budget</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
      `;

      clients.forEach((client) => {
        htmlContent += `
          <tr>
            <td>${client.name || ''}</td>
            <td>${client.email || ''}</td>
            <td>${client.phone || '-'}</td>
            <td>${client.company || '-'}</td>
            <td>${client.projectType || '-'}</td>
            <td>${client.budget || '-'}</td>
            <td><span class="status status-${client.status || 'nouveau'}">${
          client.status || 'nouveau'
        }</span></td>
            <td>${this.formatDate(client.createdAt)}</td>
          </tr>
        `;
      });

      htmlContent += `
            </tbody>
          </table>
          
          <div class="footer">
            <p>Document généré automatiquement par le Dashboard Admin - Bendelo Thielcy</p>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const filename = `clients-rapport-${
        new Date().toISOString().split('T')[0]
      }.html`;

      this.downloadFile(blob, filename);
      return { success: true, filename };
    } catch (error) {
      console.error("Erreur lors de l'export PDF clients:", error);
      throw new Error("Erreur lors de l'export PDF");
    }
  }

  // Export PDF des abonnés
  exportSubscribersPDF(subscribers) {
    try {
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Liste des Abonnés - ${this.formatDate(new Date())}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #8b5cf6;
              padding-bottom: 10px;
            }
            .stats {
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #8b5cf6;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 0.9em;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Liste des Abonnés Newsletter</h1>
            <p>Rapport généré le ${this.formatDate(new Date())}</p>
          </div>
          
          <div class="stats">
            <strong>Statistiques :</strong>
            <ul>
              <li>Nombre total d'abonnés : ${subscribers.length}</li>
              <li>Abonnés actifs : ${
                subscribers.filter((s) => s.status === 'actif').length
              }</li>
            </ul>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Date d'abonnement</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
      `;

      subscribers.forEach((subscriber) => {
        htmlContent += `
          <tr>
            <td>${subscriber.email || ''}</td>
            <td>${this.formatDate(subscriber.subscribedAt)}</td>
            <td>${subscriber.status || 'actif'}</td>
          </tr>
        `;
      });

      htmlContent += `
            </tbody>
          </table>
          
          <div class="footer">
            <p>Document généré automatiquement par le Dashboard Admin - Bendelo Thielcy</p>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const filename = `abonnes-rapport-${
        new Date().toISOString().split('T')[0]
      }.html`;

      this.downloadFile(blob, filename);
      return { success: true, filename };
    } catch (error) {
      console.error("Erreur lors de l'export PDF abonnés:", error);
      throw new Error("Erreur lors de l'export PDF");
    }
  }

  // Fonction utilitaire pour télécharger les fichiers
  downloadFile(blob, filename) {
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Nettoyer l'URL après téléchargement
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  }

  // Export combiné (clients + abonnés) en CSV
  exportAllDataCSV(clients, subscribers) {
    try {
      const clientsResult = this.exportClientsCSV(clients);
      const subscribersResult = this.exportSubscribersCSV(subscribers);

      return {
        success: true,
        files: [clientsResult.filename, subscribersResult.filename],
      };
    } catch (error) {
      console.error("Erreur lors de l'export combiné:", error);
      throw new Error("Erreur lors de l'export combiné");
    }
  }
}

export default new ExportService();
