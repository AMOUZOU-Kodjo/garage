import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Car, Calendar, Clock, CheckCircle, Users } from 'lucide-react';

export default function DashboardReceptionniste() {
  const [stats, setStats] = useState({ en_attente: 0, reservations_jour: 0, en_cours: 0, pret: 0 });

  useEffect(() => {
    api.get('/dashboard/receptionniste').then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Véhicules en attente', value: stats.en_attente, icon: Car, color: 'bg-yellow-500' },
    { label: 'Réservations du jour', value: stats.reservations_jour, icon: Calendar, color: 'bg-blue-500' },
    { label: 'En cours', value: stats.en_cours, icon: Clock, color: 'bg-purple-500' },
    { label: 'Prêts à récupérer', value: stats.pret, icon: CheckCircle, color: 'bg-green-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Réceptionniste</h1>
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
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/receptionniste/clients" className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-700">Nouveau client</p>
          </a>
          <a href="/receptionniste/vehicules" className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors">
            <Car className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-700">Enregistrer véhicule</p>
          </a>
          <a href="/receptionniste/reservations" className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-700">Nouvelle réservation</p>
          </a>
          <a href="/receptionniste/offres" className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors">
            <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-orange-700">Publier une offre</p>
          </a>
        </div>
      </div>
    </div>
  );
}
