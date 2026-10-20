# 🌿 Wayuunaiki Translator & Dictionary (Traductor Español / English ⇄ Wayuunaiki)

Una aplicación bilingüe y multiplataforma diseñada para la traducción, aprendizaje y preservación del idioma **Wayuunaiki** (familia lingüística Arawak, hablado por el pueblo Wayuu en La Guajira, Colombia y Venezuela).

![Wayuunaiki Translator Icon](/icons/icon-512.jpg)

---

## 📱 Modos de Uso Disponibles

### 1. Progressive Web App (PWA) Mobile-First (¡Listo para usar de inmediato!)
No requiere descargas de SDKs pesados. Se ejecuta localmente y se instala directamente en tu celular como una app nativa:
- **En la computadora:**
  ```bash
  python server.py
  ```
- **En tu teléfono celular (conectado al mismo Wi-Fi):**
  Abre el navegador y entra a:
  ```text
  http://192.168.100.5:8080
  ```
  - **Android (Chrome):** Toca los tres puntos o el botón *"Instalar"* en la barra superior.
  - **iPhone (Safari):** Toca el botón *"Compartir"* y selecciona *"Añadir a la pantalla de inicio"*.

### 2. Proyecto Nativo en Flutter (`flutter_app/`)
Incluye la arquitectura completa de código en Dart/Flutter lista para compilar en Android Studio o VS Code:
```bash
cd flutter_app
flutter pub get
flutter run
# O para generar el archivo instalador APK:
flutter build apk --release
```

---

## 🚀 Características Principales

1. **Traducción Híbrida Inteligente**:
   - **Diccionario Verificado Offline:** Coincidencia instantánea con pronunciación fonética y notas culturales sin consumir datos ni internet.
   - **Modo IA Asistido (Gemini API):** Traducción de oraciones complejas respetando la gramática aglutinante VSO y la concordancia morfológica.

2. **Concordancia de Género Wayuu**:
   - En Wayuunaiki, los saludos, verbos y adjetivos cambian según el género:
     - Varón: sufijo `-shi` (ej. *Antüshi pia* = Bienvenido).
     - Mujer: sufijo `-sü` (ej. *Antüsü pia* = Bienvenida).
     - Grupo: sufijo `-shii` (ej. *Antüshii jia* = Bienvenidos).
   - Selector interactivo en la interfaz para elegir el contexto.

3. **Guía Fonética y Síntesis de Audio**:
   - Explicación de la vocal central alta **ü** `[ɨ]`, el apóstrofe / saltillo `'` (corte glotal) y las vocales geminadas (`aa`, `ee`, `ii`, `oo`, `uu`, `üü`).
   - Botón para escuchar la pronunciación aproximada.

4. **Conversor Numérico Interactivo**:
   - Convierte cualquier número del 1 al 100 a su forma en Wayuunaiki escrita y fonética.

5. **Glosario Explorador**:
   - Filtro por categorías: Saludos, Cortesía, Personas, Familia y Clanes, Naturaleza, Animales, Comida y Verbos.

---

## 📂 Estructura del Proyecto

```text
wayuunaiki_translator/
├── data/
│   └── wayuunaiki_lexicon.json       # Base de datos léxica estructurada
├── web/                              # Progressive Web App (PWA)
│   ├── index.html                    # Interfaz Mobile-First
│   ├── style.css                     # Estilos inspirados en tejidos Wayuu
│   ├── app.js                        # Motor de traducción y fonética
│   ├── sw.js                         # Service Worker para soporte offline
│   ├── manifest.json                 # Configuración de instalación móvil
│   └── icons/                        # Íconos y gráfica cultural
├── flutter_app/                      # Código fuente Flutter nativo
│   ├── pubspec.yaml
│   ├── assets/data/
│   └── lib/
│       ├── main.dart
│       ├── models/
│       ├── services/
│       ├── screens/
│       └── theme/
├── server.py                         # Servidor local con API y soporte Wi-Fi
└── README.md
```
