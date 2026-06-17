import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';

export default function ClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', adresse: '' });
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { loadClients(); }, []);

  const loadClients = async () => {
    const res = await api.get('/clients');
    setClients(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/clients/${editing.id}`, form);
    } else {
      await api.post('/clients', form);
    }
    setShowModal(false);
    setEditing(null);
    setForm({ nom: '', prenom: '', email: '', telephone: '', adresse: '' });
    loadClients();
  };

  const handleEdit = (client) => {
    setEditing(client);
    setForm(client);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer ce client ?')) {
      try {
        await api.delete(`/clients/${id}`);
        setError('');
        loadClients();
      } catch (err) {
        setError(err.response?.data?.message || 'Action non autorisée');
      }
    }
  };

  const filtered = clients.filter((c) =>
    `${c.nom} ${c.prenom} ${c.email} ${c.telephone}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <button onClick={() => { setEditing(null); setForm({ nom: '', prenom: '', email: '', telephone: '', adresse: '' }); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" /> Nouveau client
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Nom</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Prénom</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Téléphone</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Email</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Véhicules</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{client.nom}</td>
                <td className="px-4 py-3">{client.prenom}</td>
                <td className="px-4 py-3">{client.telephone}</td>
                <td className="px-4 py-3 text-gray-500">{client.email || '-'}</td>
                <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{client.vehicules?.length || 0}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleEdit(client)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="h-4 w-4 text-gray-500" /></button>
                  {user?.role === 'directeur' && (
                    <button onClick={() => handleDelete(client.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4 text-red-500" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{editing ? 'Modifier' : 'Nouveau'} client</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="text" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <textarea value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="2" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editing ? 'Modifier' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
