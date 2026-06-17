import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Search, Plus, Check, X, Calendar } from 'lucide-react';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [clients, setClients] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ date_reservation: '', heure_reservation: '', description_probleme: '', client_id: '', mecanicien_id: '' });

  useEffect(() => {
    loadReservations();
    api.get('/clients').then((r) => setClients(r.data)).catch(() => {});
    api.get('/mechanics').then((r) => setMechanics(r.data)).catch(() => {});
  }, []);

  const loadReservations = async () => {
    const res = await api.get('/reservations');
    setReservations(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/reservations', form);
    setShowModal(false);
    setForm({ date_reservation: '', heure_reservation: '', description_probleme: '', client_id: '', mecanicien_id: '' });
    loadReservations();
  };

  const handleConfirm = async (id) => {
    await api.put(`/reservations/${id}/confirmer`);
    loadReservations();
  };

  const handleCancel = async (id) => {
    if (confirm('Annuler cette réservation ?')) {
      await api.put(`/reservations/${id}/annuler`);
      loadReservations();
    }
  };

  const statutBadge = (statut) => {
    const colors = { en_attente: 'bg-yellow-100 text-yellow-700', confirmé: 'bg-blue-100 text-blue-700', terminé: 'bg-green-100 text-green-700', annulé: 'bg-red-100 text-red-700' };
    return <span className={`text-xs px-2 py-1 rounded-full ${colors[statut] || 'bg-gray-100'}`}>{statut}</span>;
  };

  const filtered = reservations.filter((r) =>
    `${r.client?.nom || ''} ${r.client?.prenom || ''} ${r.date_reservation}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Réservations</h1>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Nouvelle réservation
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{r.client ? `${r.client.prenom} ${r.client.nom}` : 'Client inconnu'}</p>
                <p className="text-sm text-gray-500">{r.date_reservation} à {r.heure_reservation}</p>
                <p className="text-sm text-gray-400 mt-1">{r.description_probleme || 'Aucune description'}</p>
                {r.mecanicien && <p className="text-xs text-gray-400 mt-1">Mécanicien: {r.mecanicien.prenom} {r.mecanicien.nom}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {statutBadge(r.statut)}
              {r.statut === 'en_attente' && (
                <>
                  <button onClick={() => handleConfirm(r.id)} className="p-2 hover:bg-green-50 rounded-lg"><Check className="h-4 w-4 text-green-600" /></button>
                  <button onClick={() => handleCancel(r.id)} className="p-2 hover:bg-red-50 rounded-lg"><X className="h-4 w-4 text-red-600" /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Nouvelle réservation</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                  <option value="">Sélectionner</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={form.date_reservation} onChange={(e) => setForm({ ...form, date_reservation: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                  <input type="time" value={form.heure_reservation} onChange={(e) => setForm({ ...form, heure_reservation: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mécanicien (optionnel)</label>
                <select value={form.mecanicien_id} onChange={(e) => setForm({ ...form, mecanicien_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Automatique</option>
                  {mechanics.map((m) => <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description du problème</label>
                <textarea value={form.description_probleme} onChange={(e) => setForm({ ...form, description_probleme: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="2" />
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
