class PhraseEntry {
  final String id;
  final String wayuunaiki;
  final String spanish;
  final String english;
  final String phonetic;
  final String context;
  final String category;

  PhraseEntry({
    required this.id,
    required this.wayuunaiki,
    required this.spanish,
    required this.english,
    required this.phonetic,
    required this.context,
    required this.category,
  });

  factory PhraseEntry.fromJson(Map<String, dynamic> json) {
    return PhraseEntry(
      id: json['id'] ?? '',
      wayuunaiki: json['wayuunaiki'] ?? '',
      spanish: json['spanish'] ?? '',
      english: json['english'] ?? '',
      phonetic: json['phonetic'] ?? '',
      context: json['context'] ?? '',
      category: json['category'] ?? '',
    );
  }
}

class VocabEntry {
  final String wayuunaiki;
  final String spanish;
  final String english;
  final String phonetic;
  final String type;
  final String category;

  VocabEntry({
    required this.wayuunaiki,
    required this.spanish,
    required this.english,
    required this.phonetic,
    required this.type,
    required this.category,
  });

  factory VocabEntry.fromJson(Map<String, dynamic> json) {
    return VocabEntry(
      wayuunaiki: json['wayuunaiki'] ?? '',
      spanish: json['spanish'] ?? '',
      english: json['english'] ?? '',
      phonetic: json['phonetic'] ?? '',
      type: json['type'] ?? '',
      category: json['category'] ?? '',
    );
  }
}

class TranslationResult {
  final String translatedText;
  final String phonetic;
  final String context;
  final bool isVerified;

  TranslationResult({
    required this.translatedText,
    required this.phonetic,
    required this.context,
    required this.isVerified,
  });
}
