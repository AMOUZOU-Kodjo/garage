import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Wrench, Calendar, Search, Star, Clock, Shield, ChevronRight, Phone, Mail, MapPin, Quote, Car, Users, Award, CheckCircle } from 'lucide-react';

const services = [
  { icon: Wrench, label: 'Mécanique générale', desc: 'Moteur, boîte, courroie, freins, embrayage… Nous prenons soin de tous les organes de votre véhicule.' },
  { icon: Car, label: 'Carrosserie & Peinture', desc: 'Réparation de carrosserie, peinture, débosselage, rénovation optiques.' },
  { icon: Shield, label: 'Diagnostic électronique', desc: 'Valise diagnostic dernière génération pour identifier rapidement les pannes.' },
  { icon: Clock, label: 'Entretien & Révision', desc: 'Vidange, filtres, pneus, climatisation — respectez le carnet d\'entretien.' },
];

const stats = [
  { value: '15+', label: 'Années d\'expérience' },
  { value: '8500+', label: 'Véhicules réparés' },
  { value: '98%', label: 'Clients satisfaits' },
  { value: '4.9/5', label: 'Note moyenne' },
];

export default function Accueil() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch('/api/public/testimonials')
      .then(r => r.json())
      .then(setTestimonials)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ===== NAV ===== */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">GarageAuto</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/reservation" className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 text-sm font-medium">
              Prendre RDV
            </Link>
            <Link to="/login" className="text-gray-500 hover:text-gray-700 text-sm px-3 py-2">
              Personnel
            </Link>
            <Link to="/testimonials" className="text-gray-500 hover:text-gray-700 text-sm px-3 py-2">
              Testimonials
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-[200px] font-bold text-white">G</div>
          <div className="absolute bottom-10 right-10 text-[200px] font-bold text-white">A</div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-blue-200 text-sm mb-6">
              <Award className="h-4 w-4" />
              <span>Garage agréé — 15 ans d'expérience</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Votre garage de confiance<br />
              <span className="text-blue-200">à Lomé - TOGO</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Fort de 15 années d'expertise, GarageAuto vous accueille du lundi au samedi 
              pour l'entretien et la réparation de tous les véhicules. 
              Mécanique, carrosserie, diagnostic — nous traitons chaque voiture 
              avec le même soin que s'il s'agissait de la nôtre.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/reservation"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 shadow-lg">
                <Calendar className="h-5 w-5" /> Prendre rendez-vous <ChevronRight className="h-4 w-4" />
              </Link>
              <Link to="/suivi"
                className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl font-medium hover:bg-white/20 backdrop-blur-sm">
                <Search className="h-5 w-5" /> Suivre ma réservation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-blue-600">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Nos services</h2>
            <p className="text-gray-500 max-w-xl mx-auto">De la simple vidange à la réparation complexe, nous intervenons sur toutes les marques.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{s.label}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ENGAGEMENTS ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Pourquoi nous choisir ?</h2>
              <div className="space-y-4">
                {[
                  { icon: CheckCircle, text: 'Devis gratuit et transparent, aucune surprise sur la facture' },
                  { icon: CheckCircle, text: 'Garantie 12 mois sur toutes les réparations' },
                  { icon: CheckCircle, text: 'Véhicule de courtoisie disponible sur demande' },
                  { icon: CheckCircle, text: 'Pièces d\'origine ou de qualité équivalente' },
                  { icon: CheckCircle, text: 'Prise en charge rapide — souvent sous 48h' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <p className="text-gray-600">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" /> Horaires d'ouverture
              </h3>
              <div className="space-y-3">
                {[
                  { day: 'Lundi – Vendredi', hours: '08h00 – 12h00 · 14h00 – 18h00' },
                  { day: 'Samedi', hours: '09h00 – 12h00 · 14h00 – 17h00' },
                  { day: 'Dimanche', hours: 'Fermé' },
                ].map((h) => (
                  <div key={h.day} className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                    <span className="font-medium text-gray-700">{h.day}</span>
                    <span className="text-sm text-gray-500">{h.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 flex items-center gap-2"><Phone className="h-4 w-4 text-blue-600" /> 04 91 00 00 00</p>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-2"><Mail className="h-4 w-4 text-blue-600" /> contact@garageauto.fr</p>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-2"><MapPin className="h-4 w-4 text-blue-600" /> 12 Avenue de la Gare, 13001 Marseille</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Ce que disent nos clients</h2>
            <p className="text-gray-500 max-w-xl mx-auto">La satisfaction de nos clients est notre meilleure publicité.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.slice(0, 4).map((t) => (
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
                    <p className="text-xs text-gray-400">{t.vehicule}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {testimonials.length > 4 && (
            <div className="text-center mt-8">
              <Link to="/testimonials" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Voir tous les avis ({testimonials.length})
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Prêt à nous confier votre véhicule ?</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">Réservez votre créance en ligne en 2 minutes. Un réceptionniste vous confirmera le rendez-vous.</p>
          <Link to="/reservation"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 shadow-xl">
            <Calendar className="h-5 w-5" /> Prendre rendez-vous <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">GarageAuto</span>
              </div>
              <p className="text-sm leading-relaxed">Votre garage de confiance depuis 2011. Mécanique, carrosserie, entretien et diagnostic pour toutes marques.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Liens rapides</h4>
              <div className="space-y-2 text-sm">
                <Link to="/reservation" className="block hover:text-blue-400">Prendre rendez-vous</Link>
                <Link to="/suivi" className="block hover:text-blue-400">Suivre ma réservation</Link>
                <Link to="/avis" className="block hover:text-blue-400">Avis clients</Link>
                <Link to="/login" className="block hover:text-blue-400">Espace personnel</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-400" /> 04 91 00 00 00</p>
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-400" /> contact@garageauto.fr</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-400" /> 12 Avenue de la Gare, 13001 Marseille</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-xs">
            <p>&copy; 2026 GarageAuto. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
