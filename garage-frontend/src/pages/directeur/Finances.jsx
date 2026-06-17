import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { Euro, TrendingUp, Wrench, Car, Medal, BarChart3 } from 'lucide-react';
import { cardHover } from '../../components/AnimatedPage';

export default function Finances() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/finances/summary').then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  const cards = [
    { label: 'Revenu total', value: `${data.revenu_total.toFixed(2)} €`, icon: Euro, color: 'bg-gradient-to-br from-green-400 to-green-600' },
    { label: 'Main-d\'œuvre', value: `${data.main_oeuvre_total.toFixed(2)} €`, icon: Wrench, color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { label: 'Pièces détachées', value: `${data.pieces_total.toFixed(2)} €`, icon: Car, color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
    { label: 'Réparations effectuées', value: data.total_repairs, icon: TrendingUp, color: 'bg-gradient-to-br from-orange-400 to-orange-600' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Finances</h1>
        <p className="text-sm text-gray-500">Synthèse financière du garage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} {...cardHover}>
              <div className="bg-white rounded-xl shadow-sm p-6 group cursor-default">
                <div className="flex items-center gap-4">
                  <div className={`${card.color} p-3 rounded-xl shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                    <p className="text-sm text-gray-500">{card.label}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Medal className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-800">Top mécaniciens (revenus générés)</h2>
          </div>
          <div className="space-y-3">
            {data.top_mecaniciens.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-orange-300 text-orange-800' : 'bg-gray-200 text-gray-600'}`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{m.nom}</p>
                    <p className="text-xs text-gray-400">{m.reparations} réparations</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-600">{m.total_gagne.toFixed(2)} €</p>
              </motion.div>
            ))}
            {data.top_mecaniciens.length === 0 && (
              <p className="text-gray-400 text-center py-4">Aucune donnée</p>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Résumé</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Véhicules libérés', value: data.vehicules_libres, color: 'text-gray-800' },
              { label: 'Total véhicules enregistrés', value: data.total_vehicules, color: 'text-gray-800' },
              { label: 'Moyenne par réparation', value: `${data.total_repairs > 0 ? (data.revenu_total / data.total_repairs).toFixed(2) : '0.00'} €`, color: 'text-blue-600' },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-600">{item.label}</span>
                <span className={`text-2xl font-bold ${item.color}`}>{item.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
