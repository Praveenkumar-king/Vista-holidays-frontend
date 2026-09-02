import React from 'react';
import { 
  Calendar, 
  Clock, 
  Coins, 
  CloudSun, 
  Banknote, 
  Globe, 
  Compass 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export const DestinationMeta = ({ destination, className = '' }) => {
  if (!destination) return null;

  const {
    bestTime = 'All Year',
    duration = '3-5 Days',
    estimatedBudget = '$150/day',
    climate,
    currency,
    language,
    category
  } = destination;

  const metaItems = [
    {
      icon: Calendar,
      label: 'Best Time to Visit',
      value: bestTime,
      iconColor: 'text-amber-600 bg-amber-50'
    },
    {
      icon: Clock,
      label: 'Ideal Duration',
      value: duration,
      iconColor: 'text-brand-600 bg-brand-50'
    },
    {
      icon: Coins,
      label: 'Est. Daily Budget',
      value: estimatedBudget,
      iconColor: 'text-emerald-600 bg-emerald-50'
    },
    {
      icon: CloudSun,
      label: 'Climate Profile',
      value: climate || 'Moderate temperate',
      iconColor: 'text-sky-600 bg-sky-50'
    },
    {
      icon: Banknote,
      label: 'Local Currency',
      value: currency || 'Local Currency',
      iconColor: 'text-indigo-600 bg-indigo-50'
    },
    {
      icon: Globe,
      label: 'Primary Language',
      value: language || 'English / Local',
      iconColor: 'text-purple-600 bg-purple-50'
    }
  ];

  return (
    <Card variant="default" className={`shadow-card ${className}`}>
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle as="h3" className="text-lg">
          Travel Essentials
        </CardTitle>
        <CardDescription>
          Key parameters and local logistics at a glance
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 divide-y divide-slate-100">
        {metaItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex items-start justify-between py-3.5 ${
                idx === 0 ? 'pt-1' : ''
              } ${idx === metaItems.length - 1 ? 'pb-1' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-600">
                  {item.label}
                </span>
              </div>

              <span className="text-xs sm:text-sm font-bold text-slate-900 text-right max-w-[180px] leading-tight pl-2">
                {item.value}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DestinationMeta;
