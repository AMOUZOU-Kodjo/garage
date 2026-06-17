import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { Car, Calendar, Clock, CheckCircle, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cardHover } from '../../components/AnimatedPage';

export default function DashboardReceptionniste() {
  const [stats, setStats] = useState({ en_attente: 0, reservations_jour: 0, en_cours: 0, pret: 0 });

  useEffect(() => {
    api.get('/dashboard/receptionniste').then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Véhicules en attente', value: stats.en_attente, icon: Car, color: 'bg-gradient-br from-yellow-400 to-yellow-600', link: '/app/receptionniste/vehicules' },
    { label: 'Réservations du jour', value: stats.reservations_jour, icon: Calendar, color: 'bg-gradient-br from-blue-400 to-blue-600', link: '/app/receptionniste/reservations' },
    { label: 'En cours', value: stats.en_cours, icon: Clock, color: 'bg-gradient-br from-purple-400 to-purple-600', link: '/app/receptionniste/vehicules' },
    { label: 'Prêts à récupérer', value: stats.pret, icon: CheckCircle, color: 'bg-gradient-br from-green-400 to-green-600', link: '/app/receptionniste/vehicules' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Vue d'ensemble de l'activité du garage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} {...cardHover}>
              <Link to={card.link} className="block bg-white rounded-xl shadow-sm p-6 group">
                <div className="flex items-center gap-4">
                  <div className={`${card.color} p-3 rounded-xl shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                    <p className="text-sm text-gray-500">{card.label}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { to: '/app/receptionniste/clients', label: 'Nouveau client', icon: Users, color: 'bg-blue-50 hover:bg-blue-100', iconColor: 'text-blue-600', textColor: 'text-blue-700' },
            { to: '/app/receptionniste/vehicules', label: 'Enregistrer véhicule', icon: Car, color: 'bg-green-50 hover:bg-green-100', iconColor: 'text-green-600', textColor: 'text-green-700' },
            { to: '/app/receptionniste/reservations', label: 'Nouvelle réservation', icon: Calendar, color: 'bg-purple-50 hover:bg-purple-100', iconColor: 'text-purple-600', textColor: 'text-purple-700' },
            { to: '/app/receptionniste/offres', label: 'Publier une offre', icon: CheckCircle, color: 'bg-orange-50 hover:bg-orange-100', iconColor: 'text-orange-600', textColor: 'text-orange-700' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}>
                <Link to={item.to} className={`block p-4 ${item.color} rounded-xl text-center transition-all duration-200 group`}>
                  <Icon className={`h-8 w-8 ${item.iconColor} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                  <p className={`text-sm font-medium ${item.textColor}`}>{item.label}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
