import { useState, useEffect } from 'react';

export default function AnimatedStatsCard({
  title,
  value,
  change,
  changeType,
  icon,
  color = 'purple',
}) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (value > 0) {
      // Animation du compteur
      let start = 0;
      const end = parseInt(value);
      const duration = 1500;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedValue(end);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [value]);

  const getColorClasses = (color) => {
    const colors = {
      purple: 'from-purple-500 to-purple-600',
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600',
      pink: 'from-pink-500 to-pink-600',
    };
    return colors[color] || colors.purple;
  };

  return (
    <div
      className="relative p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            {icon}
          </div>
          {change !== undefined && (
            <div
              className="text-sm font-medium"
              style={{
                color: changeType === 'positive' ? '#22c55e' : '#ef4444',
              }}
            >
              {changeType === 'positive' ? '+' : ''}
              {change}%
            </div>
          )}
        </div>

        <div>
          <h3
            className="text-sm font-medium mb-1"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            {title}
          </h3>
          <p className="text-3xl font-bold" style={{ color: '#ffffff' }}>
            {animatedValue.toLocaleString()}
          </p>
        </div>

        {/* Pulse effect */}
        <div
          className={`absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br ${getColorClasses(
            color
          )} 
                        rounded-full opacity-20 animate-ping`}
        />
      </div>
    </div>
  );
}
