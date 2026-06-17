import { useRef } from 'react';
import { Wrench, Printer, Download } from 'lucide-react';

export default function Receipt({ data, onClose }) {
  const printRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Reçu ${data.numero}</title>
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
            .total-row { background: #f0f4f8; margin: 12px -24px; padding: 12px 24px; display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #1e3a5f; }
            .footer { text-align: center; padding: 16px 24px; border-top: 2px solid #e0e0e0; font-size: 11px; color: #888; }
            .signature { margin-top: 16px; text-align: right; padding-top: 12px; border-top: 1px solid #ccc; }
            .signature p { margin: 2px 0; font-size: 12px; color: #444; }
            .stamp { display: inline-block; border: 2px solid #c00; color: #c00; padding: 4px 12px; border-radius: 4px; font-size: 10px; font-weight: 700; letter-spacing: 1px; margin-top: 8px; opacity: 0.6; }
            .watermark { position: absolute; font-size: 80px; color: rgba(30,58,95,0.03); font-weight: 900; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); pointer-events: none; z-index: 0; }
            .relative { position: relative; }
            @media print {
              body { background: white; }
              .receipt-bg { background: white !important; padding: 0 !important; }
              .receipt-inner { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; }
              .no-print { display: none !important; }
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
                <p>Reçu de libération N° ${data.numero}</p>
              </div>
              <div class="content">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:11px;color:#888;">
                  <span>N° ${data.numero}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:11px;color:#888;">
                  <span>Arrivée: ${new Date(data.date_entree).toLocaleDateString('fr-FR')}</span>
                  <span>Sortie: ${new Date(data.date_sortie).toLocaleDateString('fr-FR')}</span>
                </div>
                <div class="field"><span class="label">Client</span><span class="value">${data.client}</span></div>
                <div class="field"><span class="label">Tél.</span><span class="value">${data.client_tel}</span></div>
                <div class="field"><span class="label">Véhicule</span><span class="value">${data.marque} ${data.modele}</span></div>
                <div class="field"><span class="label">Immatriculation</span><span class="value">${data.immatriculation}</span></div>
                <div class="field"><span class="label">Problème</span><span class="value">${data.probleme}</span></div>
                <div class="field"><span class="label">Solution</span><span class="value">${data.solution || '-'}</span></div>
                <div class="field"><span class="label">Mécanicien</span><span class="value">${data.mecanicien}</span></div>
                <div class="total-row">
                  <span>TOTAL PAYÉ</span>
                  <span>${data.total.toFixed(2)} €</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:12px;color:#666;margin-top:4px;">
                  <span>Main-d'œuvre: ${data.main_oeuvre.toFixed(2)} €</span>
                  <span>Pièces: ${data.pieces.toFixed(2)} €</span>
                </div>
                <div class="signature">
                  <p>Le Directeur,</p>
                  <p style="font-weight:700;font-size:14px;">${data.directeur}</p>
                  <p style="font-size:20px;font-family:'Brush Script MT',cursive;margin-top:8px;">_________________</p>
                  <div class="stamp">PAYÉ</div>
                </div>
              </div>
              <div class="footer">
                <p>${data.societe} · Merci de votre confiance</p>
                <p>Ce reçu fait office de garantie</p>
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

  const handleDownloadPDF = () => {
    handlePrint();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg">Reçu de libération</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <div id="receipt-content" ref={printRef} className="bg-gradient-to-br from-gray-50 to-blue-50 p-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-[420px] mx-auto relative">
            <div className="absolute text-7xl text-gray-100 font-black top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-30 pointer-events-none select-none">GARAGEAUTO</div>

            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5f8a] text-white text-center p-6">
              <div className="flex justify-center mb-2"><Wrench className="h-10 w-10 text-blue-300" /></div>
              <h1 className="text-xl font-bold">{data.societe}</h1>
              <p className="text-xs opacity-80">Reçu de libération N° {data.numero}</p>
            </div>

            <div className="p-5 space-y-0 relative z-10">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>N° {data.numero}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mb-3">
                <span>Arrivée: {new Date(data.date_entree).toLocaleDateString('fr-FR')}</span>
                <span>Sortie: {new Date(data.date_sortie).toLocaleDateString('fr-FR')}</span>
              </div>

              <ReceiptField label="Client" value={data.client} />
              <ReceiptField label="Téléphone" value={data.client_tel} />
              <ReceiptField label="Véhicule" value={`${data.marque} ${data.modele}`} />
              <ReceiptField label="Immatriculation" value={data.immatriculation} />
              <ReceiptField label="Problème" value={data.probleme} />
              <ReceiptField label="Mécanicien" value={data.mecanicien} />

              <div className="bg-blue-50 -mx-5 px-5 py-3 flex justify-between items-center my-3">
                <span className="font-bold text-gray-800">TOTAL PAYÉ</span>
                <span className="text-xl font-bold text-[#1e3a5f]">{data.total.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Main-d'œuvre: {data.main_oeuvre.toFixed(2)} €</span>
                <span>Pièces: {data.pieces.toFixed(2)} €</span>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 text-right">
                <p className="text-xs text-gray-500">Le Directeur,</p>
                <p className="font-bold text-sm">{data.directeur}</p>
                <p className="text-lg mt-1 font-['Brush_Script_MT',cursive]">_________________</p>
                <div className="inline-block border-2 border-red-600 text-red-600 px-3 py-0.5 rounded text-xs font-bold tracking-wider mt-2 opacity-60">PAYÉ</div>
              </div>
            </div>

            <div className="text-center text-xs text-gray-400 py-3 border-t">
              <p>{data.societe} · Merci de votre confiance</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t no-print">
          <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700">
            <Printer className="h-4 w-4" /> Imprimer
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

function ReceiptField({ label, value }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-dashed border-gray-100 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-800 text-right max-w-[60%]">{value || '-'}</span>
    </div>
  );
}
