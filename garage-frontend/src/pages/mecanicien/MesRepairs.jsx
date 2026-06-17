import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { Plus, CheckCircle, Wrench, Clock, Euro, Settings } from 'lucide-react';
import { cardHover } from '../../components/AnimatedPage';

export default function MesRepairs() {
  const [repairs, setRepairs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ vehicule_id: '', panne_constatee: '', solution_appliquee: '', outils_utilises: '', duree_intervention: '', cout_main_oeuvre: '', notes: '' });

  useEffect(() => {
    loadRepairs();
    api.get('/vehicles').then((r) => setVehicles(r.data)).catch(() => {});
  }, []);

  const loadRepairs = async () => {
    const res = await api.get('/repairs');
    setRepairs(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/repairs', form);
    setShowModal(false);
    setForm({ vehicule_id: '', panne_constatee: '', solution_appliquee: '', outils_utilises: '', duree_intervention: '', cout_main_oeuvre: '', notes: '' });
    loadRepairs();
  };

  const handleMarquerRepare = async (id) => {
    await api.put(`/repairs/${id}/marquer-repare`);
    loadRepairs();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mes Réparations</h1>
          <p className="text-sm text-gray-500">{repairs.length} réparation{repairs.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg active:scale-95">
          <Plus className="h-4 w-4" /> Nouvelle réparation
        </button>
      </div>

      <div className="space-y-3">
        {repairs.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} {...cardHover}>
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-transparent hover:border-l-blue-500 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Wrench className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">{r.vehicule ? `${r.vehicule.marque} ${r.vehicule.modele} (${r.vehicule.immatriculation})` : 'Véhicule inconnu'}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1"><span className="font-medium text-gray-700">Panne:</span> {r.panne_constatee}</p>
                  <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Solution:</span> {r.solution_appliquee || 'En cours...'}</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {r.outils_utilises && <span className="text-xs text-gray-400 flex items-center gap-1"><Settings className="h-3 w-3" /> {r.outils_utilises}</span>}
                    {r.duree_intervention && <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="h-3 w-3" /> {r.duree_intervention} min</span>}
                    {r.cout_main_oeuvre && <span className="text-sm font-medium text-blue-600 flex items-center gap-1"><Euro className="h-3 w-3" /> {r.cout_main_oeuvre} €</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                    {new Date(r.date_intervention).toLocaleDateString()}
                  </span>
                  {!r.solution_appliquee && (
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleMarquerRepare(r.id)}
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors" title="Marquer comme réparé">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {repairs.length === 0 && <div className="text-center py-12 text-gray-400">Aucune réparation</div>}
      </div>

      {showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Nouvelle réparation</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Véhicule</label>
                <select value={form.vehicule_id} onChange={(e) => setForm({ ...form, vehicule_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                  <option value="">Sélectionner</option>
                  {vehicles.map((v) => <option key={v.id} value={v.id}>{v.marque} {v.modele} - {v.immatriculation}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Panne constatée</label>
                <textarea value={form.panne_constatee} onChange={(e) => setForm({ ...form, panne_constatee: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Solution appliquée</label>
                <textarea value={form.solution_appliquee} onChange={(e) => setForm({ ...form, solution_appliquee: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outils utilisés</label>
                <input type="text" value={form.outils_utilises} onChange={(e) => setForm({ ...form, outils_utilises: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
                  <input type="number" value={form.duree_intervention} onChange={(e) => setForm({ ...form, duree_intervention: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coût main d'œuvre (€)</label>
                  <input type="number" step="0.01" value={form.cout_main_oeuvre} onChange={(e) => setForm({ ...form, cout_main_oeuvre: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg active:scale-95">Créer</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
