@echo off
TITLE e-BID PRAMAAN — CPCL Procurement Verification Platform
COLOR 0B

echo ===============================================================================
echo                               e-BID PRAMAAN
echo       AI-Powered Integrated Bid Compliance Verification Platform
echo             Organization: Chennai Petroleum Corporation Limited (CPCL)
echo ===============================================================================
echo.
echo [1/3] Initializing Python FastAPI Backend on Port 8000...
start "e-BID PRAMAAN Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/3] Initializing React Vite Frontend on Port 5173...
start "e-BID PRAMAAN Frontend (Vite)" cmd /k "cd /d "%~dp0sih 26" && npm.cmd run dev"

echo [3/3] Waiting for services to start...
timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173...
start http://localhost:5173

echo.
echo ===============================================================================
echo   Backend API Documentation: http://localhost:8000/docs
echo   Frontend Application:      http://localhost:5173
echo.
echo   Demo Officer Credentials:
echo     Officer ID: PO-1042
echo     Password:   Officer@1042
echo.
echo   Demo Vendor Credentials:
echo     Vendor ID:  VEN-PET-001
echo     Password:   Vendor@2026
echo.
echo   Demo Admin Credentials:
echo     Admin ID:   ADMIN-01
echo     Password:   Admin@2026
echo ===============================================================================
echo.
pause
