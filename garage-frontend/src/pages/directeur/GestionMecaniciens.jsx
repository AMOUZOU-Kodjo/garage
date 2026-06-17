import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function GestionMecaniciens() {
  const [mecaniciens, setMecaniciens] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '', telephone: '', specialite: '' });

  useEffect(() => { loadMecaniciens(); }, []);

  const loadMecaniciens = async () => {
    const res = await api.get('/mechanics');
    setMecaniciens(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/mechanics/${editing.id}`, form);
    } else {
      await api.post('/mechanics', form);
    }
    setShowModal(false);
    setEditing(null);
    setForm({ nom: '', prenom: '', email: '', password: '', telephone: '', specialite: '' });
    loadMecaniciens();
  };

  const handleEdit = (m) => {
    setEditing(m);
    setForm({ nom: m.nom, prenom: m.prenom, email: m.email, password: '', telephone: m.telephone || '', specialite: m.specialite || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer ce mécanicien ?')) {
      await api.delete(`/mechanics/${id}`);
      loadMecaniciens();
    }
  };

  const handleToggle = async (id) => {
    await api.put(`/mechanics/${id}/toggle-actif`);
    loadMecaniciens();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des mécaniciens</h1>
        <button onClick={() => { setEditing(null); setForm({ nom: '', prenom: '', email: '', password: '', telephone: '', specialite: '' }); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mecaniciens.map((m) => (
          <div key={m.id} className={`bg-white rounded-xl shadow-sm p-5 ${!m.actif ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{m.prenom} {m.nom}</h3>
                <p className="text-sm text-gray-500">{m.email}</p>
                {m.specialite && <p className="text-xs text-gray-400 mt-1">{m.specialite}</p>}
                {m.telephone && <p className="text-xs text-gray-400">{m.telephone}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleToggle(m.id)} className="p-1.5 hover:bg-gray-100 rounded" title={m.actif ? 'Désactiver' : 'Activer'}>
                  {m.actif ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4 text-gray-400" />}
                </button>
                <button onClick={() => handleEdit(m)} className="p-1.5 hover:bg-gray-100 rounded"><Pencil className="h-4 w-4 text-gray-500" /></button>
                <button onClick={() => handleDelete(m.id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4 text-red-500" /></button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${m.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {m.actif ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{editing ? 'Modifier' : 'Ajouter'} un mécanicien</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input type="text" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input type="text" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{editing ? 'Nouveau mot de passe (laisser vide pour conserver)' : 'Mot de passe'}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required={!editing} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="text" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                <input type="text" value={form.specialite} onChange={(e) => setForm({ ...form, specialite: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editing ? 'Modifier' : 'Ajouter'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
