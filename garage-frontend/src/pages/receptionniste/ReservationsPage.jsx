import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { Search, Plus, Check, X, Calendar, Clock, User, Wrench, ArrowRight, Users, Car } from 'lucide-react';
import { cardHover } from '../../components/AnimatedPage';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [clients, setClients] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [showConvertModal, setShowConvertModal] = useState(null);
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
    return <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[statut] || 'bg-gray-100'}`}>{statut}</span>;
  };

  const filtered = reservations.filter((r) => {
    const clientName = r.client ? `${r.client.nom} ${r.client.prenom}` : `${r.client_nom || ''} ${r.client_prenom || ''}`;
    return `${clientName} ${r.date_reservation} ${r.reference || ''}`.toLowerCase().includes(search.toLowerCase());
  });

  const clientName = (r) => {
    if (r.client) return `${r.client.prenom} ${r.client.nom}`;
    if (r.client_prenom || r.client_nom) return `${r.client_prenom || ''} ${r.client_nom || ''}`;
    return 'Client inconnu';
  };

  const clientInfo = (r) => {
    if (r.client) return null;
    if (r.client_telephone) return r.client_telephone;
    return null;
  };

  const sourceBadge = (source) => {
    if (source === 'public') return <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded ml-1 font-medium">WEB</span>;
    return null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Réservations</h1>
          <p className="text-sm text-gray-500">{reservations.length} réservation{reservations.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg active:scale-95">
          <Plus className="h-4 w-4" /> Nouvelle réservation
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input type="text" placeholder="Rechercher par client, date, référence..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
      </div>

      <div className="space-y-3">
        {filtered.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} {...cardHover}>
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-transparent hover:border-l-blue-500 transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-xl shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium flex items-center gap-1">
                    <User className="h-4 w-4 text-gray-400" /> {clientName(r)}{sourceBadge(r.source)}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3 w-3" /> {r.date_reservation} <Clock className="h-3 w-3 ml-1" /> {r.heure_reservation}
                  </p>
                  {clientInfo(r) && <p className="text-xs text-gray-400">{clientInfo(r)}</p>}
                  <p className="text-sm text-gray-400 mt-1">{r.description_probleme || 'Aucune description'}</p>
                  {r.mecanicien && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Wrench className="h-3 w-3" /> Mécanicien: {r.mecanicien.prenom} {r.mecanicien.nom}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {statutBadge(r.statut)}
                {r.statut === 'en_attente' && (
                  <>
                    {r.source === 'public' ? (
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowConvertModal(r)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium transition-colors">
                        <ArrowRight className="h-3.5 w-3.5" /> Traiter
                      </motion.button>
                    ) : (
                      <>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleConfirm(r.id)}
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors"><Check className="h-4 w-4 text-green-600" /></motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleCancel(r.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"><X className="h-4 w-4 text-red-600" /></motion.button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">Aucune réservation trouvée</div>}
      </div>

      {showConvertModal && (
        <ConvertModal
          reservation={showConvertModal}
          clients={clients}
          mechanics={mechanics}
          onClose={() => setShowConvertModal(null)}
          onDone={() => { setShowConvertModal(null); loadReservations(); }}
        />
      )}

      {showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
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
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg active:scale-95">Créer</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function ConvertModal({ reservation, clients, mechanics, onClose, onDone }) {
  const [clientOption, setClientOption] = useState('new');
  const [clientId, setClientId] = useState('');
  const [mecanicienId, setMecanicienId] = useState('');
  const [vehicleImmat, setVehicleImmat] = useState(reservation.vehicule_immatriculation || '');
  const [vehicleMarque, setVehicleMarque] = useState(reservation.vehicule_marque || '');
  const [vehicleModele, setVehicleModele] = useState(reservation.vehicule_modele || '');
  const [vehicleAnnee, setVehicleAnnee] = useState(reservation.vehicule_annee || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        mecanicien_id: mecanicienId || null,
        create_vehicle: true,
      };
      if (clientOption === 'existing') {
        if (!clientId) { setError('Sélectionnez un client'); setLoading(false); return; }
        payload.client_id = parseInt(clientId);
      } else {
        payload.create_client = true;
      }
      await api.put(`/reservations/${reservation.id}/convert`, payload);
      onDone();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la conversion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-1">Traiter la réservation</h2>
        <p className="text-sm text-gray-500 mb-4">Réservation {reservation.reference}</p>

        <div className="bg-blue-50 rounded-xl p-3 mb-4 text-sm space-y-1">
          <p><span className="font-medium">Client:</span> {reservation.client_prenom} {reservation.client_nom}</p>
          <p><span className="font-medium">Tél:</span> {reservation.client_telephone}</p>
          {reservation.client_email && <p><span className="font-medium">Email:</span> {reservation.client_email}</p>}
          <p><span className="font-medium">Date:</span> {reservation.date_reservation} à {reservation.heure_reservation}</p>
          {reservation.description_probleme && <p><span className="font-medium">Problème:</span> {reservation.description_probleme}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <div className="flex gap-2 mb-2">
              <button type="button" onClick={() => setClientOption('new')}
                className={`flex-1 py-1.5 text-sm rounded-lg transition-colors ${clientOption === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <User className="h-3.5 w-3.5 inline mr-1" /> Nouveau
              </button>
              <button type="button" onClick={() => setClientOption('existing')}
                className={`flex-1 py-1.5 text-sm rounded-lg transition-colors ${clientOption === 'existing' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <Users className="h-3.5 w-3.5 inline mr-1" /> Existant
              </button>
            </div>
            {clientOption === 'existing' && (
              <select value={clientId} onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                <option value="">Sélectionner un client</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.prenom} {c.nom} - {c.telephone}</option>)}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mécanicien</label>
            <select value={mecanicienId} onChange={(e) => setMecanicienId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">Non assigné</option>
              {mechanics.map((m) => <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>)}
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg active:scale-95 disabled:opacity-50">
              {loading ? 'Traitement...' : 'Confirmer & créer'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
