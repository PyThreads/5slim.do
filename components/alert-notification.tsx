'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { eventBus } from '../app/utils/broadcaster';

interface Alert {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export default function AlertNotification() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const handleAlert = (data: { message: string; type?: 'success' | 'error' | 'warning' | 'info' }) => {
      const newAlert: Alert = {
        id: Date.now().toString(),
        message: data.message,
        type: data.type || 'info'
      };

      setAlerts(prev => [...prev, newAlert]);

      setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
      }, 5000);
    };

    (eventBus as any).on('publicAlert', handleAlert);

    return () => {
      (eventBus as any).off('publicAlert', handleAlert);
    };
  }, []);

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 text-emerald-800 shadow-emerald-100';
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800 shadow-red-100';
      case 'warning':
        return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-800 shadow-amber-100';
      default:
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-800 shadow-blue-100';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center px-4 py-3 border rounded-xl shadow-lg backdrop-blur-sm animate-in slide-in-from-top duration-300 ${getAlertStyles(alert.type)}`}
          style={{ minWidth: '320px', maxWidth: '480px' }}
        >
          <div className="flex-shrink-0 mr-3">
            {getIcon(alert.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium leading-relaxed">{alert.message}</p>
          </div>
          <button
            onClick={() => removeAlert(alert.id)}
            className="flex-shrink-0 ml-3 p-1 rounded-full hover:bg-black/5 transition-colors"
          >
            <X className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
          </button>
        </div>
      ))}
    </div>
  );
}