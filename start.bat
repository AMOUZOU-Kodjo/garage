@echo off
echo =====================================================
echo   GarageAuto - Systeme de Demarrage
echo =====================================================
echo.

:: Verifier si DATABASE_URL est configure dans .env
findstr /C:"DATABASE_URL=postgres" ..\garage-backend\.env > nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Utilisation de PostgreSQL (Neon.tech)
) else (
    echo [INFO] Utilisation de SQLite (local)
)

echo.
echo [1/2] Demarrage du backend (port 5000)...
start "GarageAuto Backend" cmd /c "cd /d %~dp0garage-backend && node src/index.js"
timeout /t 3 /nobreak > nul

echo [2/2] Demarrage du frontend (port 5173)...
start "GarageAuto Frontend" cmd /c "cd /d %~dp0garage-frontend && npm run dev"

echo.
echo =====================================================
echo   Application demarree avec succes !
echo.
echo   Backend : http://localhost:5000
echo   Frontend: http://localhost:5173
echo.
echo   Comptes de test:
echo   Directeur:      directeur@garage.com / password123
echo   Receptionniste: receptionniste@garage.com / password123
echo   Mecanicien 1:   mecanicien1@garage.com / password123
echo   Mecanicien 2:   mecanicien2@garage.com / password123
echo =====================================================
echo.
echo   Pour utiliser Neon.tech :
echo   1. Creez un projet sur https://neon.tech
echo   2. Copiez la chaîne de connexion Postgres
echo   3. Modifiez .env : DATABASE_URL=votre_chain
echo   4. Re-executez : cd garage-backend ^&^& npm run seed
echo =====================================================
echo.
pause
