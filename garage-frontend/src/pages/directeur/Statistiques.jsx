import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

export default function Statistiques() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/directeur').then((res) => setStats(res.data)).catch(() => {});
  }, []);

  if (!stats) return <div className="text-center py-12 text-gray-500">Chargement...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Statistiques globales</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Vue d'ensemble</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total véhicules traités</span>
              <span className="text-2xl font-bold text-blue-600">{stats.total_vehicules}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total réparations effectuées</span>
              <span className="text-2xl font-bold text-green-600">{stats.total_reparations}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total clients enregistrés</span>
              <span className="text-2xl font-bold text-purple-600">{stats.total_clients}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Mécaniciens actifs</span>
              <span className="text-2xl font-bold text-orange-600">{stats.total_mecaniciens}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Performance des mécaniciens</h2>
          </div>
          <div className="space-y-4">
            {stats.stats_mecaniciens.map((m, i) => (
              <div key={m.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{m.nom}</span>
                  <span className="text-sm text-gray-500">{m.reparations} réparations</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, (m.reparations / Math.max(...stats.stats_mecaniciens.map(x => x.reparations), 1)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Répartition des statuts</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.statuts?.map((s) => {
            const colors = { en_attente: 'bg-yellow-500', en_cours: 'bg-blue-500', reparé: 'bg-green-500', libéré: 'bg-gray-500' };
            const labels = { en_attente: 'En attente', en_cours: 'En cours', reparé: 'Réparé', libéré: 'Libéré' };
            const total = stats.statuts.reduce((sum, x) => sum + parseInt(x.count), 0) || 1;
            const pct = ((parseInt(s.count) / total) * 100).toFixed(1);
            return (
              <div key={s.statut} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`w-4 h-4 rounded-full ${colors[s.statut] || 'bg-gray-300'} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-gray-800">{s.count}</p>
                <p className="text-sm text-gray-500">{labels[s.statut] || s.statut}</p>
                <p className="text-xs text-gray-400">{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
