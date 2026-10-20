import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/lexicon_entry.dart';

class GeminiService {
  final String? apiKey;

  GeminiService({this.apiKey});

  Future<TranslationResult> translateWithAi({
    required String text,
    required String sourceLang,
    required String targetLang,
    required String gender,
  }) async {
    if (apiKey == null || apiKey!.isEmpty) {
      return TranslationResult(
        translatedText: 'Se requiere una API Key de Gemini',
        phonetic: 'Configura tu clave en Ajustes',
        context: 'Consigue tu clave gratuita en https://aistudio.google.com',
        isVerified: false,
      );
    }

    final langNames = {'es': 'Español', 'en': 'Inglés', 'guc': 'Wayuunaiki'};
    final genderRule = gender == 'fem'
        ? 'Femenino (-sü)'
        : gender == 'masc'
            ? 'Masculino (-shi)'
            : 'Plural (-shii)';

    final prompt = '''Eres un lingüista y traductor experto en la lengua Wayuunaiki (Arawak, La Guajira).
Traduce de ${langNames[sourceLang]} a ${langNames[targetLang]}.
Concordancia de género requerida: $genderRule.
Texto: "$text"

Responde EXCLUSIVAMENTE con un JSON con los campos:
{
  "translation": "Traducción exacta en Alfabeto Único Wayuu (ALAWAY)",
  "phonetics": "Desglose fonético silábico legible",
  "explanation": "Explicación breve de la gramática y notas culturales"
}''';

    final url = Uri.parse(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey',
    );

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'contents': [
            {
              'parts': [
                {'text': prompt}
              ]
            }
          ],
          'generationConfig': {'responseMimeType': 'application/json'},
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final rawJson = data['candidates'][0]['content']['parts'][0]['text'];
        final parsed = json.decode(rawJson);

        return TranslationResult(
          translatedText: parsed['translation'] ?? '',
          phonetic: parsed['phonetics'] ?? '',
          context: parsed['explanation'] ?? '',
          isVerified: false,
        );
      } else {
        return TranslationResult(
          translatedText: 'Error en la llamada a la API',
          phonetic: 'Código HTTP: ${response.statusCode}',
          context: response.body,
          isVerified: false,
        );
      }
    } catch (e) {
      return TranslationResult(
        translatedText: 'Error de conexión',
        phonetic: 'Verifica tu conexión a internet',
        context: e.toString(),
        isVerified: false,
      );
    }
  }
}
