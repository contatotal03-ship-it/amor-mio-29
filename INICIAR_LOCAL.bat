@echo off
title 29 Capitulos - Servidor Local
cd /d "%~dp0"
echo ======================================================
echo   29 CAPITULOS · SERVIDOR LOCAL INICIADO
echo ======================================================
echo.
echo   Vista de ELLA:  http://localhost:8099/index.html
echo   Panel TUYO:     http://localhost:8099/admin.html
echo   (PIN inicial del Panel: 2929)
echo.
echo   Deja esta ventana abierta mientras pruebas.
echo ======================================================
start "" "http://localhost:8099/admin.html"
start "" "http://localhost:8099/index.html"
python -m http.server 8099
pause

