import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Euro, TrendingUp, Wrench, Car, Medal } from 'lucide-react';

export default function Finances() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/finances/summary').then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <div className="text-center py-12 text-gray-500">Chargement...</div>;

  const cards = [
    { label: 'Revenu total', value: `${data.revenu_total.toFixed(2)} €`, icon: Euro, color: 'bg-green-500' },
    { label: 'Main-d\'œuvre', value: `${data.main_oeuvre_total.toFixed(2)} €`, icon: Wrench, color: 'bg-blue-500' },
    { label: 'Pièces détachées', value: `${data.pieces_total.toFixed(2)} €`, icon: Car, color: 'bg-purple-500' },
    { label: 'Réparations effectuées', value: data.total_repairs, icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Finances</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Medal className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-800">Top mécaniciens (revenus générés)</h2>
          </div>
          <div className="space-y-3">
            {data.top_mecaniciens.map((m, i) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-orange-300 text-orange-800' : 'bg-gray-200 text-gray-600'}`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{m.nom}</p>
                    <p className="text-xs text-gray-400">{m.reparations} réparations</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-600">{m.total_gagne.toFixed(2)} €</p>
              </div>
            ))}
            {data.top_mecaniciens.length === 0 && (
              <p className="text-gray-400 text-center py-4">Aucune donnée</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Car className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Résumé</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Véhicules libérés</span>
              <span className="text-2xl font-bold text-gray-800">{data.vehicules_libres}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total véhicules enregistrés</span>
              <span className="text-2xl font-bold text-gray-800">{data.total_vehicules}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Moyenne par réparation</span>
              <span className="text-2xl font-bold text-blue-600">
                {data.total_repairs > 0 ? (data.revenu_total / data.total_repairs).toFixed(2) : '0.00'} €
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
