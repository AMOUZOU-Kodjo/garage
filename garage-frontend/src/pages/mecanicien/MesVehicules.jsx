import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { Eye, Wrench, Car, User } from 'lucide-react';
import { cardHover } from '../../components/AnimatedPage';

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
    return <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[statut]}`}>{labels[statut] || statut}</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mes Véhicules</h1>
        <p className="text-sm text-gray-500">Véhicules qui vous sont assignés</p>
      </div>
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
            {vehicles.filter(v => v.mecanicien?.id || v.statut === 'en_attente').map((v, i) => (
              <motion.tr key={v.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-3 font-medium">{v.immatriculation}</td>
                <td className="px-4 py-3"><span className="flex items-center gap-1"><Car className="h-3 w-3 text-gray-400" /> {v.marque} {v.modele}</span></td>
                <td className="px-4 py-3 text-sm">{v.client ? `${v.client.prenom} ${v.client.nom}` : '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-[200px]">{v.description_panne || '-'}</td>
                <td className="px-4 py-3">{statutBadge(v.statut)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setShowDetail(v)} className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors" title="Détails"><Eye className="h-4 w-4 text-blue-500" /></button>
                  <a href={`/app/mecanicien/reparations?vehicule=${v.id}`} className="p-1.5 hover:bg-blue-100 rounded-lg inline-block transition-colors" title="Voir réparations"><Wrench className="h-4 w-4 text-blue-600" /></a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {vehicles.filter(v => v.mecanicien?.id || v.statut === 'en_attente').length === 0 && <div className="text-center py-12 text-gray-400">Aucun véhicule assigné</div>}
      </div>

      {showDetail && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetail(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
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
            <button onClick={() => setShowDetail(null)} className="mt-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Fermer</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
