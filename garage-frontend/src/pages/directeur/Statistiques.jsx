import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Activity, Car, Users, Wrench } from 'lucide-react';
import { cardHover } from '../../components/AnimatedPage';

export default function Statistiques() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/directeur').then((res) => setStats(res.data)).catch(() => {});
  }, []);

  if (!stats) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  const overviewCards = [
    { label: 'Total véhicules traités', value: stats.total_vehicules, icon: Car, color: 'text-blue-600' },
    { label: 'Total réparations effectuées', value: stats.total_reparations, icon: Wrench, color: 'text-green-600' },
    { label: 'Total clients enregistrés', value: stats.total_clients, icon: Users, color: 'text-purple-600' },
    { label: 'Mécaniciens actifs', value: stats.total_mecaniciens, icon: Activity, color: 'text-orange-600' },
  ];

  const maxRepairs = Math.max(...(stats.stats_mecaniciens?.map(x => x.reparations) || [1]), 1);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Statistiques globales</h1>
        <p className="text-sm text-gray-500">Indicateurs de performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Vue d'ensemble</h2>
          </div>
          <div className="space-y-4">
            {overviewCards.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${item.color}`} />
                    <span className="text-gray-600">{item.label}</span>
                  </div>
                  <span className={`text-2xl font-bold ${item.color}`}>{item.value}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Performance des mécaniciens</h2>
          </div>
          <div className="space-y-4">
            {stats.stats_mecaniciens?.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {m.nom?.charAt(0)}{m.prenom?.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-800">{m.prenom} {m.nom}</span>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{m.reparations} réparations</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(m.reparations / maxRepairs) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Répartition des statuts</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.statuts?.map((s, i) => {
            const colors = { en_attente: 'from-yellow-400 to-yellow-600', en_cours: 'from-blue-400 to-blue-600', reparé: 'from-green-400 to-green-600', libéré: 'from-gray-400 to-gray-600' };
            const dotColors = { en_attente: 'bg-yellow-500', en_cours: 'bg-blue-500', reparé: 'bg-green-500', libéré: 'bg-gray-500' };
            const labels = { en_attente: 'En attente', en_cours: 'En cours', reparé: 'Réparé', libéré: 'Libéré' };
            const total = stats.statuts.reduce((sum, x) => sum + parseInt(x.count), 0) || 1;
            const pct = ((parseInt(s.count) / total) * 100).toFixed(1);
            return (
              <motion.div key={s.statut} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.08 }}>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors[s.statut] || 'from-gray-300 to-gray-400'} mx-auto mb-2 flex items-center justify-center`}>
                    <div className={`w-4 h-4 rounded-full ${dotColors[s.statut] || 'bg-gray-300'}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{s.count}</p>
                  <p className="text-sm text-gray-500">{labels[s.statut] || s.statut}</p>
                  <p className="text-xs text-gray-400">{pct}%</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
