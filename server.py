#!/usr/bin/env python3
"""
Wayuunaiki Translator & Dictionary Local Backend Server
Serves static PWA assets, provides REST API endpoints for lexicon and Gemini AI translation.
"""

import os
import sys
import json
import socket
import mimetypes
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.request
import urllib.error

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.join(BASE_DIR, "web")
DATA_DIR = os.path.join(BASE_DIR, "data")
LEXICON_PATH = os.path.join(DATA_DIR, "wayuunaiki_lexicon.json")

def get_local_ip():
    """Detect local LAN IPv4 address for phone connectivity."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class WayuuRequestHandler(BaseHTTPRequestHandler):
    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        url_path = self.path.split("?")[0]

        # API: Dictionary Lexicon Endpoint
        if url_path == "/api/dictionary":
            if os.path.exists(LEXICON_PATH):
                with open(LEXICON_PATH, "r", encoding="utf-8") as f:
                    data = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(data.encode("utf-8"))
            else:
                self.send_error(404, "Lexicon file not found")
            return

        # Static Web File Serving
        if url_path == "/" or url_path == "":
            file_path = os.path.join(WEB_DIR, "index.html")
        else:
            rel_path = url_path.lstrip("/")
            file_path = os.path.join(WEB_DIR, rel_path)

        # Normalize and prevent directory traversal
        file_path = os.path.normpath(file_path)
        if not file_path.startswith(os.path.normpath(WEB_DIR)):
            self.send_error(403, "Access denied")
            return

        if os.path.isfile(file_path):
            content_type, _ = mimetypes.guess_type(file_path)
            if not content_type:
                if file_path.endswith(".json"):
                    content_type = "application/json"
                elif file_path.endswith(".js"):
                    content_type = "application/javascript"
                elif file_path.endswith(".css"):
                    content_type = "text/css"
                elif file_path.endswith(".html"):
                    content_type = "text/html"
                else:
                    content_type = "application/octet-stream"

            try:
                with open(file_path, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Length", str(len(content)))
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(content)
            except Exception as e:
                self.send_error(500, f"Error reading file: {str(e)}")
        else:
            self.send_error(404, "File not found")

    def do_POST(self):
        url_path = self.path.split("?")[0]

        if url_path == "/api/translate":
            content_length = int(self.headers.get("Content-Length", 0))
            post_body = self.rfile.read(content_length)

            try:
                req_data = json.loads(post_body.decode("utf-8"))
            except Exception:
                self.send_error(400, "Invalid JSON payload")
                return

            text = req_data.get("text", "").strip()
            source_lang = req_data.get("source_lang", "es")
            target_lang = req_data.get("target_lang", "guc")
            gender = req_data.get("gender", "masc")
            api_key = req_data.get("api_key") or os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

            if not api_key:
                # Local intelligent fallback translation using lexicon
                import unicodedata
                def norm_s(s):
                    if not s: return ""
                    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn').lower().replace('¿','').replace('?','').replace('¡','').replace('!','').strip()

                with open(LEXICON_PATH, "r", encoding="utf-8") as f:
                    lex = json.load(f)
                
                lang_key_map = {"es": "spanish", "en": "english", "guc": "wayuunaiki"}
                s_key = lang_key_map.get(source_lang, source_lang)
                t_key = lang_key_map.get(target_lang, target_lang)

                clean_text = norm_s(text)
                fallback_translation = None

                # 1. Exact match in vocabulary
                for v in lex.get("vocabulary", []):
                    v_raw = v.get(s_key, "")
                    v_parts = [norm_s(x) for x in v_raw.split(",")]
                    if clean_text in v_parts:
                        word = v.get(t_key) or v.get("wayuunaiki")
                        if target_lang == "guc" and (word.endswith("shi") or word.endswith("sü")):
                            root = word[:-3]
                            word = root + ("sü" if gender == "fem" else "shi" if gender == "masc" else "shii")
                        fallback_translation = {
                            "translation": word,
                            "phonetics": v.get("phonetic", ""),
                            "explanation": f"Término verificado. Categoría: {v.get('category')}. Tipo: {v.get('type')}."
                        }
                        break

                # 2. Exact match in phrases
                if not fallback_translation:
                    for p in lex.get("phrases", []):
                        p_raw = p.get(s_key, "")
                        p_parts = [norm_s(x) for x in p_raw.split("/")]
                        if clean_text in p_parts or any(clean_text == norm_s(x) for x in p_parts):
                            tr_text = p.get(t_key) or p.get("wayuunaiki")
                            if target_lang == "guc":
                                if gender == "fem":
                                    tr_text = tr_text.replace("Anashi", "Anasü").replace("Antüshi", "Antüsü").replace("Ounushi", "Ounusü")
                                elif gender == "masc":
                                    tr_text = tr_text.replace("Anasü", "Anashi").replace("Antüsü", "Antüshi").replace("Ounusü", "Ounushi")
                            fallback_translation = {
                                "translation": tr_text,
                                "phonetics": p.get("phonetic", ""),
                                "explanation": p.get("context", "Expresión verificada en el corpus tradicional Wayuu.")
                            }
                            break

                # 3. Partial phrase match (only if phrase contains clean_text as word)
                if not fallback_translation:
                    for p in lex.get("phrases", []):
                        p_clean = norm_s(p.get(s_key, ""))
                        if clean_text in p_clean.split():
                            tr_text = p.get(t_key) or p.get("wayuunaiki")
                            fallback_translation = {
                                "translation": tr_text,
                                "phonetics": p.get("phonetic", ""),
                                "explanation": p.get("context", "Expresión relacionada encontrada en el diccionario.")
                            }
                            break

                # 4. Tokenized composite
                if not fallback_translation:
                    words = clean_text.split()
                    tokens = []
                    pho_tokens = []
                    for w in words:
                        if w in ["el", "la", "los", "las", "un", "una", "de", "del"]:
                            continue
                        w_match = None
                        for v in lex.get("vocabulary", []):
                            v_parts = [norm_s(x) for x in v.get(s_key, "").split(",")]
                            if w in v_parts:
                                w_match = v
                                break
                        if w_match:
                            val = w_match.get(t_key) or w_match.get("wayuunaiki")
                            if target_lang == "guc" and (val.endswith("shi") or val.endswith("sü")):
                                root = val[:-3]
                                val = root + ("sü" if gender == "fem" else "shi")
                            tokens.append(val)
                            pho_tokens.append(w_match.get("phonetic", val))
                        else:
                            tokens.append(w)
                    
                    fallback_translation = {
                        "translation": " ".join(tokens),
                        "phonetics": " - ".join(pho_tokens),
                        "explanation": "Traducción morfológica offline construida con el glosario base ALAWAY."
                    }

                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(fallback_translation).encode("utf-8"))
                return

            lang_names = {"es": "Español", "en": "Inglés", "guc": "Wayuunaiki"}
            gender_rule = "Masculino (-shi)" if gender == "masc" else "Femenino (-sü)" if gender == "fem" else "Plural (-shii)"

            prompt = f"""Eres un traductor y lingüista experto nativo de la lengua Wayuunaiki (familia Arawak de La Guajira, Colombia y Venezuela).
Traduce el siguiente texto de {lang_names.get(source_lang, source_lang)} a {lang_names.get(target_lang, target_lang)}.
Concordancia de género requerida: {gender_rule}.
Texto a traducir: "{text}"

Reglas lingüísticas obligatorias:
1. Usa el Alfabeto Único Wayuu (ALAWAY): 'ü' es la vocal central alta [ɨ], ' es el saltillo o corte glotal.
2. Respeta la estructura de orden de palabras VSO cuando corresponda.
3. Aplica los prefijos pronominales (ta-, pü-, nü-, sü-, wa-, jü-, na-) y sufijos de género (-shi, -sü, -shii).

Responde EXCLUSIVAMENTE con un objeto JSON válido con los siguientes campos:
{{
  "translation": "Traducción exacta en Wayuunaiki",
  "phonetics": "Desglose fonético silábico legible (ej: Ha-ma-ya pya?)",
  "explanation": "Breve explicación de la gramática y notas culturales"
}}"""

            gemini_payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "temperature": 0.2
                }
            }

            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            req = urllib.request.Request(
                gemini_url,
                data=json.dumps(gemini_payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )

            try:
                with urllib.request.urlopen(req, timeout=15) as response:
                    res_body = response.read().decode("utf-8")
                    gemini_json = json.loads(res_body)
                    raw_text = gemini_json["candidates"][0]["content"]["parts"][0]["text"]
                    parsed_result = json.loads(raw_text)

                    self.send_response(200)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.send_cors_headers()
                    self.end_headers()
                    self.wfile.write(json.dumps(parsed_result).encode("utf-8"))
            except urllib.error.HTTPError as e:
                err_content = e.read().decode("utf-8")
                self.send_response(e.code)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"error": "GEMINI_ERROR", "details": err_content}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"error": "SERVER_ERROR", "details": str(e)}).encode("utf-8"))
            return

        self.send_error(404, "Endpoint not found")

def run():
    local_ip = get_local_ip()
    server_address = ("0.0.0.0", PORT)
    httpd = HTTPServer(server_address, WayuuRequestHandler)
    print("=" * 60)
    print("   🚀 SERVIDOR DEL TRADUCTOR WAYUUNAIKI INICIADO")
    print("=" * 60)
    print(f" • Local en PC:          http://localhost:{PORT}")
    print(f" • En tu Celular (Wi-Fi): http://{local_ip}:{PORT}")
    print("=" * 60)
    print(" Presiona Ctrl+C para detener el servidor.\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
        httpd.server_close()

if __name__ == "__main__":
    run()
