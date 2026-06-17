import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Search, Plus, Eye, LogOut, Receipt } from 'lucide-react';
import ReceiptComponent from './Receipt';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [clients, setClients] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [showLibererModal, setShowLibererModal] = useState(null);
  const [showReceipt, setShowReceipt] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ marque: '', modele: '', annee: '', immatriculation: '', vin: '', kilometrage: '', description_panne: '', client_id: '' });
  const [libererForm, setLibererForm] = useState({ cout_main_oeuvre: '', montant_pieces: '', montant_total: '' });

  useEffect(() => {
    const mo = parseFloat(libererForm.cout_main_oeuvre) || 0;
    const pieces = parseFloat(libererForm.montant_pieces) || 0;
    const total = mo + pieces;
    setLibererForm(f => ({ ...f, montant_total: total > 0 ? total.toString() : '' }));
  }, [libererForm.cout_main_oeuvre, libererForm.montant_pieces]);

  useEffect(() => {
    loadVehicles();
    api.get('/clients').then((r) => setClients(r.data)).catch(() => {});
    api.get('/mechanics').then((r) => setMechanics(r.data)).catch(() => {});
  }, []);

  const loadVehicles = async () => {
    const res = await api.get('/vehicles');
    setVehicles(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/vehicles', form);
    setShowModal(false);
    setForm({ marque: '', modele: '', annee: '', immatriculation: '', vin: '', kilometrage: '', description_panne: '', client_id: '' });
    loadVehicles();
  };

  const handleAssign = async (id, mecanicien_id) => {
    await api.put(`/vehicles/${id}/assign`, { mecanicien_id });
    loadVehicles();
  };

  const openLiberer = async (vehicle) => {
    try {
      const res = await api.get(`/vehicles/${vehicle.id}`);
      const v = res.data;
      const repair = v.reparation || {};
      setLibererForm({
        cout_main_oeuvre: repair.cout_main_oeuvre || '',
        montant_pieces: repair.montant_pieces || '',
        montant_total: repair.montant_total || '',
      });
      setShowLibererModal(v);
    } catch {
      setLibererForm({ cout_main_oeuvre: '', montant_pieces: '', montant_total: '' });
      setShowLibererModal(vehicle);
    }
  };

  const handleLiberer = async (e) => {
    e.preventDefault();
    const v = showLibererModal;
    const mo = parseFloat(libererForm.cout_main_oeuvre) || 0;
    const pieces = parseFloat(libererForm.montant_pieces) || 0;
    const total = parseFloat(libererForm.montant_total) || (mo + pieces);

    await api.put(`/vehicles/${v.id}/liberer`, {
      cout_main_oeuvre: mo,
      montant_pieces: pieces,
      montant_total: total,
    });

    const res = await api.get(`/vehicles/${v.id}/receipt`);
    setShowLibererModal(null);
    setShowReceipt(res.data);
    loadVehicles();
  };

  const statutBadge = (statut) => {
    const colors = { en_attente: 'bg-yellow-100 text-yellow-700', en_cours: 'bg-blue-100 text-blue-700', reparé: 'bg-green-100 text-green-700', libéré: 'bg-gray-100 text-gray-700' };
    const labels = { en_attente: 'En attente', en_cours: 'En cours', reparé: 'Réparé', libéré: 'Libéré' };
    return <span className={`text-xs px-2 py-1 rounded-full ${colors[statut]}`}>{labels[statut] || statut}</span>;
  };

  const filtered = vehicles.filter((v) =>
    `${v.immatriculation} ${v.marque} ${v.modele}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Véhicules</h1>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Nouveau véhicule
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input type="text" placeholder="Rechercher par immatriculation, marque..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Immatriculation</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Marque/Modèle</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Client</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Mécanicien</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Statut</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{v.immatriculation}</td>
                <td className="px-4 py-3">{v.marque} {v.modele}</td>
                <td className="px-4 py-3">{v.client ? `${v.client.prenom} ${v.client.nom}` : '-'}</td>
                <td className="px-4 py-3">{v.mecanicien ? `${v.mecanicien.prenom} ${v.mecanicien.nom}` : '-'}</td>
                <td className="px-4 py-3">{statutBadge(v.statut)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setShowDetail(v)} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Détails"><Eye className="h-4 w-4 text-gray-500" /></button>
                  {v.statut === 'en_attente' && (
                    <select onChange={(e) => e.target.value && handleAssign(v.id, parseInt(e.target.value))}
                      className="ml-1 text-xs border rounded px-2 py-1" defaultValue="">
                      <option value="" disabled>Assigner...</option>
                      {mechanics.map((m) => <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>)}
                    </select>
                  )}
                  {v.statut === 'reparé' && (
                    <button onClick={() => openLiberer(v)} className="p-1.5 hover:bg-green-50 rounded-lg" title="Libérer avec reçu">
                      <LogOut className="h-4 w-4 text-green-600" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Nouveau véhicule</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                  <input type="text" value={form.marque} onChange={(e) => setForm({ ...form, marque: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                  <input type="text" value={form.modele} onChange={(e) => setForm({ ...form, modele: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                  <input type="number" value={form.annee} onChange={(e) => setForm({ ...form, annee: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
                  <input type="text" value={form.immatriculation} onChange={(e) => setForm({ ...form, immatriculation: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                  <option value="">Sélectionner un client</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description de la panne</label>
                <textarea value={form.description_panne} onChange={(e) => setForm({ ...form, description_panne: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="2" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLibererModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowLibererModal(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-2">Libérer le véhicule</h2>
            <p className="text-sm text-gray-500 mb-4">{showLibererModal.marque} {showLibererModal.modele} - {showLibererModal.immatriculation}</p>
            <form onSubmit={handleLiberer} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Main-d'œuvre (€)</label>
                  <input type="number" step="0.01" value={libererForm.cout_main_oeuvre} onChange={(e) => setLibererForm({ ...libererForm, cout_main_oeuvre: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pièces (€)</label>
                  <input type="number" step="0.01" value={libererForm.montant_pieces} onChange={(e) => setLibererForm({ ...libererForm, montant_pieces: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total (€)</label>
                <input type="number" step="0.01" value={libererForm.montant_total} readOnly
                  className="w-full px-3 py-2 border bg-gray-50 rounded-lg outline-none text-green-700 font-bold" placeholder="0.00" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowLibererModal(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Receipt className="h-4 w-4" /> Libérer & Reçu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetail(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Détails du véhicule</h2>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-gray-500">Marque</p><p className="font-medium">{showDetail.marque}</p></div>
                <div><p className="text-gray-500">Modèle</p><p className="font-medium">{showDetail.modele}</p></div>
                <div><p className="text-gray-500">Année</p><p className="font-medium">{showDetail.annee || '-'}</p></div>
                <div><p className="text-gray-500">Immatriculation</p><p className="font-medium">{showDetail.immatriculation}</p></div>
                <div><p className="text-gray-500">Kilométrage</p><p className="font-medium">{showDetail.kilometrage ? `${showDetail.kilometrage} km` : '-'}</p></div>
                <div><p className="text-gray-500">Statut</p><p>{statutBadge(showDetail.statut)}</p></div>
              </div>
              <div>
                <p className="text-gray-500">Client</p>
                <p className="font-medium">{showDetail.client ? `${showDetail.client.prenom} ${showDetail.client.nom}` : '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Panne décrite</p>
                <p className="font-medium">{showDetail.description_panne || 'Aucune description'}</p>
              </div>
            </div>
            <button onClick={() => setShowDetail(null)} className="mt-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Fermer</button>
          </div>
        </div>
      )}

      {showReceipt && (
        <ReceiptComponent data={showReceipt} onClose={() => setShowReceipt(null)} />
      )}
    </div>
  );
}
