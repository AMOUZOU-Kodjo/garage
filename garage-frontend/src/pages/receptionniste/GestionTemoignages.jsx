import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Star, Plus, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function GestionTemoignages() {
  const [testimonials, setTestimonials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: '', prenom: '', vehicule: '', texte: '', note: 5 });
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const r = await api.get('/testimonials/admin');
    setTestimonials(r.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/testimonials', form);
      setShowModal(false);
      setForm({ nom: '', prenom: '', vehicule: '', texte: '', note: 5 });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur');
    }
  };

  const handleToggle = async (id) => {
    await api.put(`/testimonials/${id}/toggle-actif`);
    load();
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer ce témoignage ?')) {
      await api.delete(`/testimonials/${id}`);
      load();
    }
  };

  const filtered = filter === 'all' ? testimonials : testimonials.filter(t => filter === 'pending' ? !t.actif : t.actif);
  const pending = testimonials.filter(t => !t.actif).length;

  const Stars = ({ note, onChange }) => (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button" onClick={() => onChange?.(i)} className="p-0.5">
          <Star className={`h-5 w-5 ${i <= note ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Témoignages clients</h1>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {pending > 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {pending} avis en attente de modération
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {['all', 'pending', 'approved'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-lg ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f === 'all' ? 'Tous' : f === 'pending' ? `En attente (${pending})` : 'Approuvés'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((t) => (
          <div key={t.id} className={`bg-white rounded-xl shadow-sm p-4 flex items-start justify-between gap-4 border-l-4 ${t.actif ? 'border-l-green-500' : 'border-l-amber-400'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                  {(t.prenom || t.nom).charAt(0)}
                </div>
                <p className="font-medium text-gray-800">{t.prenom} {t.nom}</p>
                {t.vehicule && <span className="text-xs text-gray-400">— {t.vehicule}</span>}
                {!t.actif && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">En attente</span>}
              </div>
              <Stars note={t.note} />
              <p className="text-sm text-gray-600 mt-1 italic">"{t.texte}"</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!t.actif ? (
                <button onClick={() => handleToggle(t.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium">
                  <CheckCircle className="h-4 w-4" /> Approuver
                </button>
              ) : (
                <button onClick={() => handleToggle(t.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg" title="Désactiver">
                  <XCircle className="h-4 w-4 text-gray-400" />
                </button>
              )}
              <button onClick={() => handleDelete(t.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4 text-red-500" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center py-8 text-gray-400">Aucun témoignage</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Nouveau témoignage</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input type="text" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input type="text" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Véhicule</label>
                <input type="text" value={form.vehicule} onChange={(e) => setForm({ ...form, vehicule: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Renault Clio..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <Stars note={form.note} onChange={(v) => setForm({ ...form, note: v })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Témoignage *</label>
                <textarea value={form.texte} onChange={(e) => setForm({ ...form, texte: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="3" required />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
