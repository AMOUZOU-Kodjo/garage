import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Eye, Wrench } from 'lucide-react';

export default function MesVehicules() {
  const [vehicles, setVehicles] = useState([]);
  const [showDetail, setShowDetail] = useState(null);

  useEffect(() => { loadVehicles(); }, []);

  const loadVehicles = async () => {
    const res = await api.get('/vehicles');
    setVehicles(res.data);
  };

  const statutBadge = (statut) => {
    const colors = { en_attente: 'bg-yellow-100 text-yellow-700', en_cours: 'bg-blue-100 text-blue-700', reparé: 'bg-green-100 text-green-700', libéré: 'bg-gray-100 text-gray-700' };
    const labels = { en_attente: 'En attente', en_cours: 'En cours', reparé: 'Réparé', libéré: 'Libéré' };
    return <span className={`text-xs px-2 py-1 rounded-full ${colors[statut]}`}>{labels[statut] || statut}</span>;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mes Véhicules</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Immatriculation</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Marque/Modèle</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Client</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Panne</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Statut</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {vehicles.filter(v => v.mecanicien?.id || v.statut === 'en_attente').map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{v.immatriculation}</td>
                <td className="px-4 py-3">{v.marque} {v.modele}</td>
                <td className="px-4 py-3">{v.client ? `${v.client.prenom} ${v.client.nom}` : '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-[200px]">{v.description_panne || '-'}</td>
                <td className="px-4 py-3">{statutBadge(v.statut)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setShowDetail(v)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye className="h-4 w-4 text-gray-500" /></button>
                  <a href={`/mecanicien/reparations?vehicule=${v.id}`} className="p-1.5 hover:bg-blue-50 rounded-lg inline-block"><Wrench className="h-4 w-4 text-blue-600" /></a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetail(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Détails du véhicule</h2>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-gray-500">Marque</p><p className="font-medium">{showDetail.marque}</p></div>
                <div><p className="text-gray-500">Modèle</p><p className="font-medium">{showDetail.modele}</p></div>
                <div><p className="text-gray-500">Immatriculation</p><p className="font-medium">{showDetail.immatriculation}</p></div>
                <div><p className="text-gray-500">Statut</p><p>{statutBadge(showDetail.statut)}</p></div>
              </div>
              <div><p className="text-gray-500">Panne</p><p className="font-medium">{showDetail.description_panne || 'Aucune'}</p></div>
            </div>
            <button onClick={() => setShowDetail(null)} className="mt-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
