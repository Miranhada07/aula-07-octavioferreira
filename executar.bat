@echo off
chcp 65001 > nul
echo ========================================================
echo   🍔 BurguerSync Ourinhos - Servidor de Desenvolvimento
echo   Google Antigravity & SENAI Ourinhos Edition
echo ========================================================
echo.
echo Iniciando servidor HTTP local na porta 3000...
echo Abra no seu navegador: http://localhost:3000
echo.
node execution/server.mjs
pause
