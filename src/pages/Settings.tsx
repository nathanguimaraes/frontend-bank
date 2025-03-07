import React, { useEffect, useState } from 'react';
import { Bell, Shield, CreditCard, Languages, Moon, ChevronRight, Sun } from 'lucide-react';

export const Settings: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const settingsSections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', value: 'Enabled' },
        { label: 'Email Notifications', value: 'All' },
        { label: 'Transaction Alerts', value: 'Enabled' },
      ],
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { label: 'Two-Factor Authentication', value: 'Enabled' },
        { label: 'Face ID / Touch ID', value: 'Enabled' },
        { label: 'Change Password', value: '' },
      ],
    },
    {
      title: 'Payment Methods',
      icon: CreditCard,
      items: [
        { label: 'Default Payment Method', value: 'UBS Card' },
        { label: 'Manage Cards', value: '2 cards' },
      ],
    },
    {
      title: 'Preferences',
      icon: Languages,
      items: [
        { label: 'Language', value: 'Portuguese' },
        {
          label: 'Dark Mode',
          value: isDarkMode ? 'On' : 'Off',
          action: () => setIsDarkMode(!isDarkMode),
          icon: isDarkMode ? Sun : Moon,
        },
        { label: 'Currency', value: 'BRL' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {settingsSections.map((section) => (
        <div key={section.title} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="p-4 border-b dark:border-gray-700 flex items-center gap-3">
            <section.icon className="w-5 h-5 text-gray-400" />
            <h2 className="font-semibold text-gray-800 dark:text-white">{section.title}</h2>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {section.items.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.value && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.value}</span>
                  )}
                  {item.icon ? (
                    <item.icon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};