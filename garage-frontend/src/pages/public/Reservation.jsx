import { useState } from 'react';
import { Calendar, Clock, Wrench, CheckCircle, ArrowLeft } from 'lucide-react';

export default function PublicReservation() {
  const [step, setStep] = useState('form');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    client_nom: '', client_prenom: '', client_telephone: '', client_email: '',
    vehicule_marque: '', vehicule_modele: '', vehicule_annee: '', vehicule_immatriculation: '',
    date_reservation: '', heure_reservation: '', description_probleme: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/public/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResult(data);
      setStep('success');
    } catch (err) {
      setError(err.message);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Réservation envoyée !</h2>
          <p className="text-gray-500 mb-6">Votre demande a été reçue. Un réceptionniste validera votre rendez-vous sous peu.</p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
            <p className="text-sm"><span className="text-gray-500">Référence :</span> <span className="font-bold text-blue-700">{result.reference}</span></p>
            <p className="text-sm"><span className="text-gray-500">Date :</span> {new Date(form.date_reservation + 'T' + form.heure_reservation).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-sm"><span className="text-gray-500">Heure :</span> {form.heure_reservation}</p>
            <p className="text-sm"><span className="text-gray-500">Statut :</span> <span className="text-yellow-600 font-medium">En attente de validation</span></p>
          </div>

          <p className="text-xs text-gray-400 mb-4">Notez votre référence pour suivre l'état de votre réservation.</p>

          <a href={`/reservation/${result.reference}`}
            className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-medium">
            Suivre ma réservation
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Wrench className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">GarageAuto</h1>
          </div>
          <p className="text-gray-500">Prenez rendez-vous pour votre véhicule</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                Vos informations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input type="text" value={form.client_prenom} onChange={(e) => setForm({ ...form, client_prenom: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input type="text" value={form.client_nom} onChange={(e) => setForm({ ...form, client_nom: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input type="tel" value={form.client_telephone} onChange={(e) => setForm({ ...form, client_telephone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                Votre véhicule
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                  <input type="text" value={form.vehicule_marque} onChange={(e) => setForm({ ...form, vehicule_marque: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Renault, Peugeot..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                  <input type="text" value={form.vehicule_modele} onChange={(e) => setForm({ ...form, vehicule_modele: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Clio, 308..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                  <input type="number" value={form.vehicule_annee} onChange={(e) => setForm({ ...form, vehicule_annee: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="2020" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
                  <input type="text" value={form.vehicule_immatriculation} onChange={(e) => setForm({ ...form, vehicule_immatriculation: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="AB-123-CD" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                Rendez-vous
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date souhaitée *</label>
                  <input type="date" value={form.date_reservation} onChange={(e) => setForm({ ...form, date_reservation: e.target.value })}
                    min={today}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure souhaitée *</label>
                  <input type="time" value={form.heure_reservation} onChange={(e) => setForm({ ...form, heure_reservation: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
                Description du problème
              </h2>
              <textarea value={form.description_probleme} onChange={(e) => setForm({ ...form, description_probleme: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" rows="3"
                placeholder="Décrivez le problème rencontré..." />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-medium text-lg flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5" /> Envoyer ma demande
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}
