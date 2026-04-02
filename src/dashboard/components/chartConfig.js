// Configuration et utilités pour les graphiques professionnels
// Séparé pour éviter les conflits Fast Refresh

export const chartTheme = {
  colors: {
    primary: 'rgba(59, 130, 246, 0.8)',
    secondary: 'rgba(34, 197, 94, 0.8)',
    accent: 'rgba(168, 85, 247, 0.8)',
    warning: 'rgba(251, 191, 36, 0.8)',
    danger: 'rgba(239, 68, 68, 0.8)',
    info: 'rgba(6, 182, 212, 0.8)',
    success: 'rgba(34, 197, 94, 0.8)',
    dark: 'rgba(55, 65, 81, 0.8)',
    light: 'rgba(156, 163, 175, 0.8)',
    gradient: {
      blue: ['rgba(59, 130, 246, 0.8)', 'rgba(37, 99, 235, 0.8)'],
      green: ['rgba(34, 197, 94, 0.8)', 'rgba(22, 163, 74, 0.8)'],
      purple: ['rgba(168, 85, 247, 0.8)', 'rgba(147, 51, 234, 0.8)'],
      orange: ['rgba(251, 191, 36, 0.8)', 'rgba(245, 158, 11, 0.8)'],
      red: ['rgba(239, 68, 68, 0.8)', 'rgba(220, 38, 38, 0.8)'],
    },
  },
  fonts: {
    primary: "'Inter', 'Segoe UI', Roboto, sans-serif",
    display: "'Poppins', 'Inter', sans-serif",
  },
};

export const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 800,
    easing: 'easeInOutQuart',
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'start',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          family: chartTheme.fonts.primary,
          size: 12,
          weight: '500',
        },
        color: '#64748b',
        boxWidth: 8,
        boxHeight: 8,
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      titleColor: '#f1f5f9',
      bodyColor: '#e2e8f0',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderWidth: 1,
      cornerRadius: 12,
      padding: 16,
      displayColors: true,
      titleFont: {
        family: chartTheme.fonts.primary,
        size: 14,
        weight: '600',
      },
      bodyFont: {
        family: chartTheme.fonts.primary,
        size: 13,
        weight: '500',
      },
      titleSpacing: 8,
      bodySpacing: 6,
      footerSpacing: 8,
      caretSize: 6,
      multiKeyBackground: 'rgba(59, 130, 246, 0.1)',
      callbacks: {
        labelTextColor: () => '#e2e8f0',
      },
    },
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 8,
      borderWidth: 2,
      hoverBorderWidth: 3,
    },
    line: {
      borderWidth: 3,
      tension: 0.4,
    },
    bar: {
      borderRadius: 6,
      borderSkipped: false,
    },
  },
};

// Données d'exemple pour les graphiques
export const sampleChartData = {
  revenue: {
    labels: [
      'Jan',
      'Fév',
      'Mar',
      'Avr',
      'Mai',
      'Jun',
      'Jul',
      'Aoû',
      'Sep',
      'Oct',
      'Nov',
      'Déc',
    ],
    datasets: [
      {
        label: 'Revenus 2024',
        data: [
          12000, 15000, 8000, 18000, 22000, 25000, 28000, 32000, 27000, 35000,
          40000, 45000,
        ],
        borderColor: chartTheme.colors.primary,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Revenus 2023',
        data: [
          8000, 12000, 6000, 14000, 18000, 20000, 23000, 26000, 22000, 28000,
          32000, 35000,
        ],
        borderColor: chartTheme.colors.light,
        backgroundColor: 'rgba(156, 163, 175, 0.05)',
        fill: false,
        borderDash: [5, 5],
      },
    ],
  },
  projects: {
    labels: ['Terminés', 'En cours', 'En attente', 'Annulés'],
    datasets: [
      {
        data: [65, 25, 8, 2],
        backgroundColor: [
          chartTheme.colors.success,
          chartTheme.colors.primary,
          chartTheme.colors.warning,
          chartTheme.colors.danger,
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  },
  clients: {
    labels: [
      'Site Web',
      'Référencements',
      'Réseaux Sociaux',
      'Publicité',
      'Autres',
    ],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          chartTheme.colors.primary,
          chartTheme.colors.success,
          chartTheme.colors.accent,
          chartTheme.colors.warning,
          chartTheme.colors.light,
        ],
        borderWidth: 3,
        hoverOffset: 15,
      },
    ],
  },
  traffic: {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Visiteurs',
        data: [120, 190, 300, 500, 200, 300, 450],
        backgroundColor: chartTheme.colors.accent,
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  },
};

// Utilitaires pour les graphiques
export const chartUtils = {
  formatCurrency: (value) => `€${value.toLocaleString()}`,
  formatPercentage: (value) => `${value}%`,
  formatNumber: (value) => value.toLocaleString(),

  generateTimeLabels: (days = 7) => {
    const labels = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(
        date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
      );
    }
    return labels;
  },

  generateColors: (count, baseOpacity = 0.8) => {
    const colors = [];
    const baseColors = [
      [59, 130, 246], // Blue
      [34, 197, 94], // Green
      [168, 85, 247], // Purple
      [251, 191, 36], // Yellow
      [239, 68, 68], // Red
      [6, 182, 212], // Cyan
      [245, 158, 11], // Orange
      [139, 92, 246], // Violet
      [236, 72, 153], // Pink
      [20, 184, 166], // Teal
    ];

    for (let i = 0; i < count; i++) {
      const colorIndex = i % baseColors.length;
      const [r, g, b] = baseColors[colorIndex];
      colors.push(`rgba(${r}, ${g}, ${b}, ${baseOpacity})`);
    }

    return colors;
  },

  createGradient: (ctx, color1, color2, direction = 'vertical') => {
    const gradient =
      direction === 'vertical'
        ? ctx.createLinearGradient(0, 0, 0, 400)
        : ctx.createLinearGradient(0, 0, 400, 0);

    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  },
};
