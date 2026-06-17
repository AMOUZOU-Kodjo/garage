import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { Car, Users, Wrench, BarChart3 } from 'lucide-react';
import { cardHover } from '../../components/AnimatedPage';

export default function DashboardDirecteur() {
  const [stats, setStats] = useState({ total_vehicules: 0, total_mecaniciens: 0, total_clients: 0, total_reparations: 0, stats_mecaniciens: [], statuts: [] });

  useEffect(() => {
    api.get('/dashboard/directeur').then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Véhicules traités', value: stats.total_vehicules, icon: Car, color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { label: 'Mécaniciens actifs', value: stats.total_mecaniciens, icon: Users, color: 'bg-gradient-to-br from-green-400 to-green-600' },
    { label: 'Clients', value: stats.total_clients, icon: Users, color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
    { label: 'Réparations', value: stats.total_reparations, icon: Wrench, color: 'bg-gradient-to-br from-orange-400 to-orange-600' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Directeur</h1>
        <p className="text-gray-500 text-sm">Indicateurs clés de performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} {...cardHover}>
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 group cursor-default">
                <div className={`${card.color} p-3 rounded-xl shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance des mécaniciens</h2>
          <div className="space-y-3">
            {stats.stats_mecaniciens.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">{m.nom?.charAt(0)}{m.prenom?.charAt(0)}</div>
                  <div>
                    <p className="font-medium text-gray-800">{m.prenom} {m.nom}</p>
                    <p className="text-xs text-gray-400">{m.en_cours} en cours</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{m.reparations}</p>
                  <p className="text-xs text-gray-400">réparations</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Statut des véhicules</h2>
          <div className="space-y-3">
            {stats.statuts?.map((s, i) => {
              const colors = { en_attente: 'bg-gradient-to-br from-yellow-400 to-yellow-600', en_cours: 'bg-gradient-to-br from-blue-400 to-blue-600', reparé: 'bg-gradient-to-br from-green-400 to-green-600', libéré: 'bg-gradient-to-br from-gray-400 to-gray-600' };
              const labels = { en_attente: 'En attente', en_cours: 'En cours', reparé: 'Réparé', libéré: 'Libéré' };
              return (
                <motion.div key={s.statut} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.08 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${colors[s.statut] || 'bg-gray-300'}`} />
                    <span className="text-sm font-medium">{labels[s.statut] || s.statut}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-800">{s.count}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
