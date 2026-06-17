import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { Car, Wrench, ClipboardList, Calendar } from 'lucide-react';
import { cardHover } from '../../components/AnimatedPage';

export default function DashboardMecanicien() {
  const [stats, setStats] = useState({ assignes: 0, en_cours: 0, historique: 0, rendezvous: 0 });

  useEffect(() => {
    api.get('/dashboard/mecanicien').then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Véhicules assignés', value: stats.assignes, icon: Car, color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { label: 'En cours', value: stats.en_cours, icon: Wrench, color: 'bg-gradient-to-br from-yellow-400 to-yellow-600' },
    { label: 'Réparations effectuées', value: stats.historique, icon: ClipboardList, color: 'bg-gradient-to-br from-green-400 to-green-600' },
    { label: 'Rendez-vous', value: stats.rendezvous, icon: Calendar, color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mon Dashboard</h1>
        <p className="text-gray-500 text-sm">Vue d'ensemble de votre activité</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>
  );
}
