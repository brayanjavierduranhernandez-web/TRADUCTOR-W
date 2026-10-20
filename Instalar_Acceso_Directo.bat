@echo off
chcp 65001 > nul
echo ========================================================
echo    🌿 INSTALADOR DE ACCESO DIRECTO - WAYUUNAIKI
echo ========================================================
echo.
echo Creando acceso directo en tu Escritorio de Windows...

set "DESKTOP=%USERPROFILE%\Desktop"
set "APP_URL=https://bible-approaches-ability-gospel.trycloudflare.com"

powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\Wayuunaiki Translator.lnk'); $Shortcut.TargetPath = 'msedge.exe'; $Shortcut.Arguments = '--app=%APP_URL%'; $Shortcut.IconLocation = 'msedge.exe,0'; $Shortcut.Description = 'Traductor y Diccionario Wayuunaiki'; $Shortcut.Save()"

echo.
echo ¡Listo! Se ha creado el acceso directo "Wayuunaiki Translator" en tu Escritorio.
echo Puedes hacer doble clic en él para abrir la aplicación como un programa nativo.
echo.
pause
