import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Gift, Percent, Calendar } from 'lucide-react';
import { cardHover } from '../../components/AnimatedPage';

export default function OffersPage() {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ titre: '', description: '', remise: '', date_debut: '', date_fin: '', actif: true });

  useEffect(() => { loadOffers(); }, []);

  const loadOffers = async () => {
    const res = await api.get('/offers');
    setOffers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/offers/${editing.id}`, form);
    } else {
      await api.post('/offers', form);
    }
    setShowModal(false);
    setEditing(null);
    setForm({ titre: '', description: '', remise: '', date_debut: '', date_fin: '', actif: true });
    loadOffers();
  };

  const handleEdit = (offer) => {
    setEditing(offer);
    setForm(offer);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer cette offre ?')) {
      try {
        await api.delete(`/offers/${id}`);
        setError('');
        loadOffers();
      } catch (err) {
        setError(err.response?.data?.message || 'Action non autorisée');
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Offres promotionnelles</h1>
          <p className="text-sm text-gray-500">{offers.length} offre{offers.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ titre: '', description: '', remise: '', date_debut: '', date_fin: '', actif: true }); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg active:scale-95">
          <Plus className="h-4 w-4" /> Nouvelle offre
        </button>
      </div>

      {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</motion.div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer, i) => (
          <motion.div key={offer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} {...cardHover}>
            <div className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${offer.actif ? 'border-l-green-500' : 'border-l-gray-300'} h-full`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${offer.actif ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Gift className={`h-5 w-5 ${offer.actif ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <h3 className="font-semibold text-gray-800">{offer.titre}</h3>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(offer)} className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Pencil className="h-4 w-4 text-gray-500" /></button>
                  {user?.role === 'directeur' && (
                    <button onClick={() => handleDelete(offer.id)} className="p-1.5 hover:bg-red-50 rounded transition-colors"><Trash2 className="h-4 w-4 text-red-500" /></button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{offer.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1 text-lg font-bold text-blue-600">
                  <Percent className="h-4 w-4" /> {offer.remise}%
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${offer.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {offer.actif ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Calendar className="h-3 w-3" /> {offer.date_debut} → {offer.date_fin}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{editing ? 'Modifier' : 'Nouvelle'} offre</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input type="text" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remise (%)</label>
                <input type="number" value={form.remise} onChange={(e) => setForm({ ...form, remise: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                  <input type="date" value={form.date_debut} onChange={(e) => setForm({ ...form, date_debut: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                  <input type="date" value={form.date_fin} onChange={(e) => setForm({ ...form, date_fin: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.actif} onChange={(e) => setForm({ ...form, actif: e.target.checked })} className="rounded" />
                <span className="text-sm">Offre active</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg active:scale-95">{editing ? 'Modifier' : 'Créer'}</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
