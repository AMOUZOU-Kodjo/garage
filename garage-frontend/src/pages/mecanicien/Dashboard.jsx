import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Car, Wrench, ClipboardList, Calendar } from 'lucide-react';

export default function DashboardMecanicien() {
  const [stats, setStats] = useState({ assignes: 0, en_cours: 0, historique: 0, rendezvous: 0 });

  useEffect(() => {
    api.get('/dashboard/mecanicien').then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Véhicules assignés', value: stats.assignes, icon: Car, color: 'bg-blue-500' },
    { label: 'En cours', value: stats.en_cours, icon: Wrench, color: 'bg-yellow-500' },
    { label: 'Réparations effectuées', value: stats.historique, icon: ClipboardList, color: 'bg-green-500' },
    { label: 'Rendez-vous', value: stats.rendezvous, icon: Calendar, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Mécanicien</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
