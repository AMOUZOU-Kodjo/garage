import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Wrench, Calendar, Clock, Printer, CheckCircle, XCircle, Clock3 } from 'lucide-react';

export default function PublicSuivi() {
  const { reference } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchRef, setSearchRef] = useState(reference || '');

  useEffect(() => {
    if (reference) loadReservation(reference);
    else setLoading(false);
  }, [reference]);

  const loadReservation = async (ref) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/public/reservations/${ref}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setReservation(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchRef.trim()) loadReservation(searchRef.trim());
  };

  const handlePrintReceipt = async () => {
    try {
      const res = await fetch(`/api/public/reservations/${reservation.reference}/receipt`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      printReceipt(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const printReceipt = (data) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Reçu d'accès - ${data.reference}</title>
          <style>
            @page { size: A5; margin: 10mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .receipt-bg { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); min-height: 100vh; padding: 20px; }
            .receipt-inner { background: white; max-width: 420px; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5f8a 100%); color: white; padding: 24px; text-align: center; }
            .header h1 { margin: 8px 0 0; font-size: 22px; }
            .header p { margin: 4px 0 0; opacity: 0.85; font-size: 12px; }
            .content { padding: 20px 24px; }
            .field { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e0e0e0; font-size: 13px; }
            .field:last-child { border-bottom: none; }
            .field .label { color: #666; }
            .field .value { font-weight: 600; color: #222; }
            .highlight { background: #f0f4f8; margin: 12px -24px; padding: 12px 24px; display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #1e3a5f; }
            .footer { text-align: center; padding: 16px 24px; border-top: 2px solid #e0e0e0; font-size: 11px; color: #888; }
            .stamp { display: inline-block; border: 2px solid #1e3a5f; color: #1e3a5f; padding: 4px 12px; border-radius: 4px; font-size: 10px; font-weight: 700; letter-spacing: 1px; margin-top: 8px; }
            .watermark { position: absolute; font-size: 80px; color: rgba(30,58,95,0.03); font-weight: 900; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); pointer-events: none; z-index: 0; }
            .relative { position: relative; }
            @media print {
              body { background: white; }
              .receipt-bg { background: white !important; padding: 0 !important; }
              .receipt-inner { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; }
              @page { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-bg">
            <div class="receipt-inner relative">
              <div class="watermark">GARAGEAUTO</div>
              <div class="header">
                <div style="font-size:36px;margin-bottom:4px;">🔧</div>
                <h1>${data.societe}</h1>
                <p>Reçu d'accès - Réservation N° ${data.reference}</p>
              </div>
              <div class="content">
                <div class="field"><span class="label">Client</span><span class="value">${data.client}</span></div>
                <div class="field"><span class="label">Téléphone</span><span class="value">${data.client_telephone}</span></div>
                <div class="field"><span class="label">Email</span><span class="value">${data.client_email}</span></div>
                <div class="field"><span class="label">Véhicule</span><span class="value">${data.vehicule}</span></div>
                ${data.annee ? `<div class="field"><span class="label">Année</span><span class="value">${data.vehicule_annee}</span></div>` : ''}
                ${data.immatriculation ? `<div class="field"><span class="label">Immatriculation</span><span class="value">${data.immatriculation}</span></div>` : ''}
                <div class="field"><span class="label">Problème</span><span class="value">${data.description_probleme || '-'}</span></div>
                <div class="highlight">
                  <span>Date du rendez-vous</span>
                  <span>${new Date(data.date_reservation + 'T' + data.heure_reservation).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:12px;color:#666;margin-top:4px;">
                  <span>Heure: ${data.heure_reservation}</span>
                </div>
                <div class="stamp" style="margin-top:16px;text-align:center;">CONFIRMÉ</div>
              </div>
              <div class="footer">
                <p>${data.societe} · Merci de votre confiance</p>
                <p>Présentez ce reçu lors de votre arrivée</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  const statutBadge = (statut) => {
    const colors = { en_attente: 'bg-yellow-100 text-yellow-700', confirmé: 'bg-green-100 text-green-700', terminé: 'bg-blue-100 text-blue-700', annulé: 'bg-red-100 text-red-700' };
    const icons = { en_attente: <Clock3 className="h-4 w-4" />, confirmé: <CheckCircle className="h-4 w-4" />, terminé: <CheckCircle className="h-4 w-4" />, annulé: <XCircle className="h-4 w-4" /> };
    const Icon = () => icons[statut] || null;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${colors[statut] || 'bg-gray-100'}`}>
        <Icon /> {statut}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm mb-4">
            <Wrench className="h-5 w-5" />
            <span className="font-semibold">GarageAuto</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Suivi de réservation</h1>
          <p className="text-gray-500">Consultez l'état de votre demande et imprimez votre reçu d'accès</p>
        </div>

        {!reference && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input type="text" value={searchRef} onChange={(e) => setSearchRef(e.target.value)}
                placeholder="Entrez votre référence (ex: RES-XXXXXX)" required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center font-medium" />
              <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center gap-2">
                <Search className="h-5 w-5" /> Chercher
              </button>
            </form>
          </div>
        )}

        {loading && (
          <div className="text-center py-12 text-gray-500">Chargement...</div>
        )}

        {error && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
            <p className="text-gray-600">{error}</p>
            <Link to="/reservation" className="inline-block mt-4 text-blue-600 hover:text-blue-700">
              Faire une demande de réservation
            </Link>
          </div>
        )}

        {reservation && !loading && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 text-center">
              <Wrench className="h-10 w-10 mx-auto mb-2 opacity-80" />
              <h2 className="text-xl font-bold">Réservation {reservation.reference}</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-center">
                {statutBadge(reservation.statut)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="font-semibold flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    {new Date(reservation.date_reservation + 'T' + reservation.heure_reservation).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Heure</p>
                  <p className="font-semibold flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-blue-500" />
                    {reservation.heure_reservation}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Client</h3>
                <p className="text-gray-600">{reservation.client_prenom} {reservation.client_nom}</p>
                <p className="text-sm text-gray-500">{reservation.client_telephone}</p>
                {reservation.client_email && <p className="text-sm text-gray-500">{reservation.client_email}</p>}
              </div>

              {(reservation.vehicule_marque || reservation.vehicule_immatriculation) && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Véhicule</h3>
                  <p className="text-gray-600">{reservation.vehicule_marque} {reservation.vehicule_modele}</p>
                  {reservation.vehicule_annee && <p className="text-sm text-gray-500">Année: {reservation.vehicule_annee}</p>}
                  {reservation.vehicule_immatriculation && <p className="text-sm text-gray-500">Immatriculation: {reservation.vehicule_immatriculation}</p>}
                </div>
              )}

              {reservation.description_probleme && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Problème signalé</h3>
                  <p className="text-sm text-gray-600">{reservation.description_probleme}</p>
                </div>
              )}

              {reservation.statut === 'confirmé' && (
                <button onClick={handlePrintReceipt}
                  className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-medium flex items-center justify-center gap-2 mt-4">
                  <Printer className="h-5 w-5" /> Imprimer le reçu d'accès
                </button>
              )}

              {reservation.statut === 'en_attente' && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl text-sm text-center">
                  Votre demande est en attente de validation par un réceptionniste.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <Link to="/reservation" className="text-sm text-blue-600 hover:text-blue-700">
            Faire une nouvelle demande de réservation
          </Link>
        </div>
      </div>
    </div>
  );
}
