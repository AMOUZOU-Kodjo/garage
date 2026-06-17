import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, CheckCircle } from 'lucide-react';

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
        <h1 className="text-2xl font-bold text-gray-800">Mes Réparations</h1>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Nouvelle réparation
        </button>
      </div>

      <div className="space-y-3">
        {repairs.map((r) => (
          <div key={r.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{r.vehicule ? `${r.vehicule.marque} ${r.vehicule.modele} (${r.vehicule.immatriculation})` : 'Véhicule inconnu'}</p>
                <p className="text-sm text-gray-500 mt-1">Panne: {r.panne_constatee}</p>
                <p className="text-sm text-gray-500">Solution: {r.solution_appliquee || 'En cours...'}</p>
                {r.outils_utilises && <p className="text-sm text-gray-400">Outils: {r.outils_utilises}</p>}
                {r.cout_main_oeuvre && <p className="text-sm font-medium text-blue-600 mt-1">{r.cout_main_oeuvre} €</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{new Date(r.date_intervention).toLocaleDateString()}</span>
                {!r.solution_appliquee && (
                  <button onClick={() => handleMarquerRepare(r.id)} className="p-2 hover:bg-green-50 rounded-lg" title="Marquer comme réparé">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
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
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
