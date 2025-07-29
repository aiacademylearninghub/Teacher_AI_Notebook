@echo off
echo Starting Student Analyzer Tool...
echo.
echo This tool provides comprehensive analysis of student performance with interactive charts and visualizations.
echo.
cd /d %~dp0
call npm run dev
