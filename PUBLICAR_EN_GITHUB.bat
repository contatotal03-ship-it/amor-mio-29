@echo off
title Publicar 29 Capitulos en GitHub (100%% en la Nube)
cd /d "%~dp0"
echo ============================================================
echo   SUBIR 29 CAPITULOS A GITHUB (NUBE 24/7 SIN TU PC PRENDIDO)
echo ============================================================
echo.

if not exist ".git" (
    echo Inicializando repositorio Git propio para esta sorpresa...
    git init -b main
)

git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo Crea un repositorio vacio en: https://github.com/new
    echo Ejemplo: https://github.com/contatotal03-ship-it/29-capitulos.git
    echo.
    set /p REPO_URL=Pega aqui la URL .git de tu nuevo repositorio: 
    if "%REPO_URL%"=="" (
        echo Cancelado: no ingresaste URL.
        pause
        exit /b 1
    )
    git remote add origin "%REPO_URL%"
)

git add .
git commit -m "Actualizar plataforma 29 Capitulos en la nube"
git branch -M main
git push -u origin main

echo.
echo ============================================================
echo   LISTO! Ahora en tu repositorio de GitHub ve a:
echo   Settings -^> Pages -^> Branch: main / (root) -^> Save
echo   En ~1 minuto tendras tu link HTTPS 24/7 para el QR y Admin!
echo ============================================================
pause

