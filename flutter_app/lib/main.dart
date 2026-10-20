import 'package:flutter/material.dart';
import 'services/translation_service.dart';
import 'theme/app_theme.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final translationService = TranslationService();
  await translationService.loadLexicon();

  runApp(WayuuTranslatorApp(translationService: translationService));
}

class WayuuTranslatorApp extends StatelessWidget {
  final TranslationService translationService;
  const WayuuTranslatorApp({super.key, required this.translationService});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Wayuunaiki Translator',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: MainNavigationScaffold(translationService: translationService),
    );
  }
}

class MainNavigationScaffold extends StatefulWidget {
  final TranslationService translationService;
  const MainNavigationScaffold({super.key, required this.translationService});

  @override
  State<MainNavigationScaffold> createState() => _MainNavigationScaffoldState();
}

class _MainNavigationScaffoldState extends State<MainNavigationScaffold> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(translationService: widget.translationService),
      _PlaceholderScreen(
        title: 'Glosario Wayuu',
        icon: Icons.menu_book,
        description: 'Explora más de 50 palabras y expresiones verificadas en categorías: Saludos, Familia, Naturaleza, Verbos y Animales.',
      ),
      _PlaceholderScreen(
        title: 'Números en Wayuu',
        icon: Icons.pin,
        description: 'Sistema numérico decimal y vigesimal: 1=Waneshi, 2=Piama, 3=Apünüin... 10=Poloo.',
      ),
      _PlaceholderScreen(
        title: 'Guía y Fonética',
        icon: Icons.lightbulb,
        description: 'Aprende la pronunciación de la vocal central ü [ɨ], el saltillo glotal y las reglas de género -shi / -sü.',
      ),
    ];

    return Scaffold(
      body: screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.translate), label: 'Traductor'),
          NavigationDestination(icon: Icon(Icons.menu_book), label: 'Glosario'),
          NavigationDestination(icon: Icon(Icons.pin), label: 'Números'),
          NavigationDestination(icon: Icon(Icons.lightbulb_outline), label: 'Guía'),
        ],
      ),
    );
  }
}

class _PlaceholderScreen extends StatelessWidget {
  final String title;
  final IconData icon;
  final String description;

  const _PlaceholderScreen({
    required this.title,
    required this.icon,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 64, color: AppTheme.terracotta),
              const SizedBox(height: 16),
              Text(
                title,
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              Text(
                description,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white70),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
