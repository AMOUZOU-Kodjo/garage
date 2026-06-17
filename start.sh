#!/bin/bash
echo "===================================="
echo "  GarageAuto - Systeme de Demarrage"
echo "===================================="
echo ""
echo "[1/2] Demarrage du backend (port 5000)..."
cd "$(dirname "$0")/garage-backend"
node src/index.js &
BACKEND_PID=$!
sleep 3

echo "[2/2] Demarrage du frontend (port 5173)..."
cd "$(dirname "$0")/garage-frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "===================================="
echo "  Application demarree avec succes !"
echo ""
echo "  Backend : http://localhost:5000"
echo "  Frontend: http://localhost:5173"
echo ""
echo "  Comptes de test:"
echo "  Directeur:     directeur@garage.com / password123"
echo "  Receptionniste: receptionniste@garage.com / password123"
echo "  Mecanicien:    mecanicien1@garage.com / password123"
echo "===================================="
echo ""
echo "Appuyez sur Ctrl+C pour arreter."
wait
