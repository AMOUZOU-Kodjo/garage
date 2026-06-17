import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, ArrowLeft, Send } from 'lucide-react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: '', prenom: '', vehicule: '', texte: '', note: 5 });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/public/testimonials')
      .then(r => r.json())
      .then(setTestimonials)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch('/api/public/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) return;
      setSubmitted(true);
      setShowForm(false);
      setForm({ nom: '', prenom: '', vehicule: '', texte: '', note: 5 });
    } finally {
      setLoading(false);
    }
  };

  const StarsInput = ({ value, onChange }) => (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button" onClick={() => onChange(i)} className="p-0.5">
          <Star className={`h-6 w-6 ${i <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-2">
              <ArrowLeft className="h-3 w-3" /> Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Avis clients</h1>
            <p className="text-gray-500">Ce que nos clients disent de nous</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-medium flex items-center gap-2">
            <Send className="h-4 w-4" /> Donner mon avis
          </button>
        </div>

        {submitted && (
          <div className="mb-8 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-center">
            Merci pour votre avis ! Il sera publié après modération par notre équipe.
          </div>
        )}

        {testimonials.length === 0 && (
          <div className="text-center py-20 text-gray-400">Aucun avis pour le moment.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm relative">
              <Quote className="h-8 w-8 text-blue-100 absolute top-4 right-4" />
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map(i => <Star key={i} className={`h-4 w-4 ${i <= t.note ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />)}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.texte}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                  {(t.prenom || t.nom).charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{t.prenom} {t.nom}</p>
                  {t.vehicule && <p className="text-xs text-gray-400">{t.vehicule}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Donner mon avis</h2>
            {submitted ? (
              <p className="text-green-600 text-center py-4">Merci ! Votre avis sera publié après modération.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <StarsInput value={form.note} onChange={(v) => setForm({ ...form, note: v })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Votre avis *</label>
                  <textarea value={form.texte} onChange={(e) => setForm({ ...form, texte: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="3" required />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
                  <button type="submit" disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
