import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Brand Guajira colors
  static const Color terracotta = Color(0xFFE0533C);
  static const Color terracottaDark = Color(0xFFC84B31);
  static const Color desertGold = Color(0xFFF59E0B);
  static const Color turquoise = Color(0xFF06B6D4);
  static const Color cactusGreen = Color(0xFF10B981);
  static const Color darkBackground = Color(0xFF0B0F19);
  static const Color darkCard = Color(0xFF161E31);
  static const Color darkCardElevated = Color(0xFF1F2B45);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBackground,
      colorScheme: const ColorScheme.dark(
        primary: terracotta,
        secondary: desertGold,
        tertiary: turquoise,
        surface: darkCard,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
      appBarTheme: const AppBarTheme(
        backgroundColor: darkBackground,
        elevation: 0,
        centerTitle: true,
      ),
      cardTheme: CardTheme(
        color: darkCard,
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: terracotta,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          elevation: 4,
        ),
      ),
    );
  }
}
