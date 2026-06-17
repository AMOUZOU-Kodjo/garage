import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, ArrowLeft, Wrench } from 'lucide-react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch('/api/public/testimonials')
      .then(r => r.json())
      .then(setTestimonials)
      .catch(() => {});
  }, []);

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
          <Link to="/reservation"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-medium flex items-center gap-2">
            Prendre RDV
          </Link>
        </div>

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
    </div>
  );
}
