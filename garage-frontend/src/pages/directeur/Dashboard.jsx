import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Car, Users, Wrench, BarChart3 } from 'lucide-react';

export default function DashboardDirecteur() {
  const [stats, setStats] = useState({ total_vehicules: 0, total_mecaniciens: 0, total_clients: 0, total_reparations: 0, stats_mecaniciens: [], statuts: [] });

  useEffect(() => {
    api.get('/dashboard/directeur').then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Véhicules traités', value: stats.total_vehicules, icon: Car, color: 'bg-blue-500' },
    { label: 'Mécaniciens actifs', value: stats.total_mecaniciens, icon: Users, color: 'bg-green-500' },
    { label: 'Clients', value: stats.total_clients, icon: Users, color: 'bg-purple-500' },
    { label: 'Réparations', value: stats.total_reparations, icon: Wrench, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Directeur</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance des mécaniciens</h2>
          <div className="space-y-4">
            {stats.stats_mecaniciens.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{m.nom}</p>
                  <p className="text-sm text-gray-500">{m.en_cours} en cours</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{m.reparations}</p>
                  <p className="text-xs text-gray-400">réparations</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Statut des véhicules</h2>
          <div className="space-y-4">
            {stats.statuts.map((s) => {
              const colors = { en_attente: 'bg-yellow-500', en_cours: 'bg-blue-500', reparé: 'bg-green-500', libéré: 'bg-gray-500' };
              const labels = { en_attente: 'En attente', en_cours: 'En cours', reparé: 'Réparé', libéré: 'Libéré' };
              return (
                <div key={s.statut} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${colors[s.statut] || 'bg-gray-300'}`} />
                    <span className="text-sm font-medium">{labels[s.statut] || s.statut}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-800">{s.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
