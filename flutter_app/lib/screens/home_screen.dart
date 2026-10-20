import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/lexicon_entry.dart';
import '../services/translation_service.dart';
import '../services/gemini_service.dart';
import '../theme/app_theme.dart';

class HomeScreen extends StatefulWidget {
  final TranslationService translationService;
  const HomeScreen({super.key, required this.translationService});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _controller = TextEditingController();
  String _sourceLang = 'es';
  String _targetLang = 'guc';
  String _gender = 'masc';
  TranslationResult? _result;
  bool _isLoadingAi = false;
  String _apiKey = '';

  void _translateOffline() {
    final query = _controller.text.trim();
    if (query.isEmpty) return;

    final res = widget.translationService.translate(
      query: query,
      sourceLang: _sourceLang,
      targetLang: _targetLang,
      gender: _gender,
    );

    setState(() {
      _result = res;
    });
  }

  Future<void> _translateWithAi() async {
    final query = _controller.text.trim();
    if (query.isEmpty) return;

    setState(() {
      _isLoadingAi = true;
    });

    final gemini = GeminiService(apiKey: _apiKey);
    final res = await gemini.translateWithAi(
      text: query,
      sourceLang: _sourceLang,
      targetLang: _targetLang,
      gender: _gender,
    );

    setState(() {
      _result = res;
      _isLoadingAi = false;
    });
  }

  void _swapLanguages() {
    setState(() {
      final temp = _sourceLang;
      _sourceLang = _targetLang;
      _targetLang = temp;
      if (_result != null) {
        _controller.text = _result!.translatedText;
        _translateOffline();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.language, color: AppTheme.terracotta),
            const SizedBox(width: 8),
            Text(
              'Wayuunaiki',
              style: TextStyle(fontWeight: FontWeight.w800, color: Colors.white),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Language selector bar
            Card(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    DropdownButton<String>(
                      value: _sourceLang,
                      underline: const SizedBox(),
                      items: const [
                        DropdownMenuItem(value: 'es', child: Text('Español')),
                        DropdownMenuItem(value: 'en', child: Text('English')),
                        DropdownMenuItem(value: 'guc', child: Text('Wayuunaiki')),
                      ],
                      onChanged: (val) {
                        if (val != null) setState(() => _sourceLang = val);
                      },
                    ),
                    IconButton(
                      icon: const Icon(Icons.swap_horiz, color: AppTheme.terracotta),
                      onPressed: _swapLanguages,
                    ),
                    DropdownButton<String>(
                      value: _targetLang,
                      underline: const SizedBox(),
                      items: const [
                        DropdownMenuItem(value: 'guc', child: Text('Wayuunaiki')),
                        DropdownMenuItem(value: 'es', child: Text('Español')),
                        DropdownMenuItem(value: 'en', child: Text('English')),
                      ],
                      onChanged: (val) {
                        if (val != null) setState(() => _targetLang = val);
                      },
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Gender selector for Wayuu
            if (_targetLang == 'guc')
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppTheme.terracotta.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.terracotta.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline, size: 16, color: AppTheme.desertGold),
                    const SizedBox(width: 8),
                    const Text('Género:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    const Spacer(),
                    ChoiceChip(
                      label: const Text('Varón (-shi)'),
                      selected: _gender == 'masc',
                      onSelected: (val) {
                        setState(() => _gender = 'masc');
                        _translateOffline();
                      },
                    ),
                    const SizedBox(width: 6),
                    ChoiceChip(
                      label: const Text('Mujer (-sü)'),
                      selected: _gender == 'fem',
                      onSelected: (val) {
                        setState(() => _gender = 'fem');
                        _translateOffline();
                      },
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 12),

            // Input card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  children: [
                    TextField(
                      controller: _controller,
                      maxLines: 3,
                      decoration: const InputDecoration(
                        hintText: 'Escribe una palabra o frase...',
                        border: InputBorder.none,
                      ),
                      onSubmitted: (_) => _translateOffline(),
                    ),
                    const Divider(),
                    Row(
                      children: [
                        ActionChip(
                          label: const Text('¿Cómo estás?'),
                          onPressed: () {
                            _controller.text = '¿Cómo estás?';
                            _translateOffline();
                          },
                        ),
                        const SizedBox(width: 8),
                        ActionChip(
                          label: const Text('Gracias'),
                          onPressed: () {
                            _controller.text = 'Gracias';
                            _translateOffline();
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 14),

            // Action buttons
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: ElevatedButton.icon(
                    icon: const Icon(Icons.translate),
                    label: const Text('Traducir'),
                    onPressed: _translateOffline,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  flex: 1,
                  child: OutlinedButton.icon(
                    icon: _isLoadingAi
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Icon(Icons.auto_awesome, color: AppTheme.desertGold),
                    label: const Text('Modo IA', style: TextStyle(color: AppTheme.desertGold)),
                    onPressed: _isLoadingAi ? null : _translateWithAi,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Result Card
            if (_result != null)
              Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: const BorderSide(color: AppTheme.terracotta, width: 2),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: _result!.isVerified
                                  ? AppTheme.cactusGreen.withOpacity(0.2)
                                  : AppTheme.desertGold.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              _result!.isVerified ? '✓ Verificado' : '⚡ IA Asistida',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: _result!.isVerified ? AppTheme.cactusGreen : AppTheme.desertGold,
                              ),
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.copy, size: 18),
                            onPressed: () {
                              Clipboard.setData(ClipboardData(text: _result!.translatedText));
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('¡Copiado al portapapeles!')),
                              );
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _result!.translatedText,
                        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                      if (_result!.phonetic.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          '[${_result!.phonetic}]',
                          style: const TextStyle(fontSize: 14, color: AppTheme.turquoise, fontWeight: FontWeight.w600),
                        ),
                      ],
                      if (_result!.context.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.black26,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            _result!.context,
                            style: const TextStyle(fontSize: 12, color: Colors.white70),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
