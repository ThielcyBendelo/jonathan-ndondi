import { useState } from 'react';
import { FiDownload, FiFileText, FiDatabase } from 'react-icons/fi';
import { toast } from 'react-toastify';
import exportService from '../../services/exportService';
import dataService from '../../services/dataService';

export default function ExportButtons({ type = 'clients' }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format) => {
    setIsExporting(true);

    try {
      if (type === 'clients') {
        const clients = dataService.getClients();
        if (clients.length === 0) {
          toast.warning('Aucun client à exporter');
          return;
        }

        if (format === 'csv') {
          exportService.exportClientsCSV(clients);
        } else if (format === 'pdf') {
          exportService.exportClientsPDF(clients);
        }

        toast.success(`Export ${format.toUpperCase()} des clients réussi !`);
      } else if (type === 'subscribers') {
        const subscribers = dataService.getSubscribers();
        if (subscribers.length === 0) {
          toast.warning('Aucun abonné à exporter');
          return;
        }

        if (format === 'csv') {
          exportService.exportSubscribersCSV(subscribers);
        } else if (format === 'pdf') {
          exportService.exportSubscribersPDF(subscribers);
        }

        toast.success(`Export ${format.toUpperCase()} des abonnés réussi !`);
      } else if (type === 'all') {
        const clients = dataService.getClients();
        const subscribers = dataService.getSubscribers();

        if (clients.length === 0 && subscribers.length === 0) {
          toast.warning('Aucune donnée à exporter');
          return;
        }

        exportService.exportAllDataCSV(clients, subscribers);
        toast.success('Export complet réussi ! Fichiers téléchargés.');
      }
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error(`Erreur lors de l'export: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'clients':
        return 'Exporter les clients';
      case 'subscribers':
        return 'Exporter les abonnés';
      case 'all':
        return 'Exporter toutes les données';
      default:
        return 'Exporter';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'clients':
        return <FiFileText className="mr-2" />;
      case 'subscribers':
        return <FiDownload className="mr-2" />;
      case 'all':
        return <FiDatabase className="mr-2" />;
      default:
        return <FiDownload className="mr-2" />;
    }
  };

  return (
    <div className="flex gap-2">
      {/* Bouton Export CSV */}
      <button
        onClick={() => handleExport('csv')}
        disabled={isExporting}
        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg 
                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={`${getTitle()} en CSV`}
      >
        {getIcon()}
        <span className="hidden sm:inline">
          {isExporting ? 'Export...' : 'CSV'}
        </span>
      </button>

      {/* Bouton Export PDF (HTML) */}
      <button
        onClick={() => handleExport('pdf')}
        disabled={isExporting}
        className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg 
                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={`${getTitle()} en PDF`}
      >
        <FiFileText className="mr-2" />
        <span className="hidden sm:inline">
          {isExporting ? 'Export...' : 'PDF'}
        </span>
      </button>
    </div>
  );
}
