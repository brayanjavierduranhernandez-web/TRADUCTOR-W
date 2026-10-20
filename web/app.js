/**
 * Wayuunaiki Translator & Dictionary
 * Hybrid Translation Engine (Offline Lexicon + Gemini AI + Phonetic Engine)
 */

// Application State
const AppState = {
  lexicon: null,
  activeTab: 'viewTranslator',
  sourceLang: 'es',
  targetLang: 'guc',
  gender: 'masc',
  apiKey: localStorage.getItem('wayuu_gemini_api_key') || '',
  theme: localStorage.getItem('wayuu_theme') || 'dark',
  deferredPrompt: null
};

// Fallback embedded dictionary in case network fails
const FALLBACK_LEXICON = {
  phrases: [
    { id: "1", wayuunaiki: "Jamaya pia?", spanish: "¿Cómo estás?", english: "How are you?", phonetic: "Ha-ma-ya pya?", context: "Saludo cotidiano a una persona.", category: "greetings" },
    { id: "2", wayuunaiki: "Antüshi pia", spanish: "Bienvenido (a hombre)", english: "Welcome (to a man)", phonetic: "An-tü-shi pya", context: "Sufijo masculino -shi.", category: "greetings" },
    { id: "3", wayuunaiki: "Antüsü pia", spanish: "Bienvenida (a mujer)", english: "Welcome (to a woman)", phonetic: "An-tü-sü pya", context: "Sufijo femenino -sü.", category: "greetings" },
    { id: "4", wayuunaiki: "Anashi taya", spanish: "Estoy bien (hombre)", english: "I am fine (male)", phonetic: "A-na-shi ta-ya", context: "Respuesta masculina.", category: "greetings" },
    { id: "5", wayuunaiki: "Anasü taya", spanish: "Estoy bien (mujer)", english: "I am fine (female)", phonetic: "A-na-sü ta-ya", context: "Respuesta femenina.", category: "greetings" },
    { id: "6", wayuunaiki: "Anayawatsü", spanish: "Muchas gracias", english: "Thank you very much", phonetic: "A-na-ya-wat-sü", context: "Agradecimiento cordial.", category: "courtesy" },
    { id: "7", wayuunaiki: "Analü", spanish: "Gracias", english: "Thank you", phonetic: "A-na-lü", context: "Agradecimiento común.", category: "courtesy" },
    { id: "8", wayuunaiki: "Watta'a maalü", spanish: "Buenos días", english: "Good morning", phonetic: "Wat-ta-a ma-a-lü", context: "Amanecer.", category: "greetings" },
    { id: "9", wayuunaiki: "Aliika", spanish: "Buenas tardes", english: "Good afternoon", phonetic: "A-lii-ka", context: "Durante la tarde.", category: "greetings" },
    { id: "10", wayuunaiki: "Aipa'a", spanish: "Buenas noches", english: "Good night", phonetic: "Ai-pa-'a", context: "Al anochecer.", category: "greetings" },
    { id: "11", wayuunaiki: "Aa", spanish: "Sí", english: "Yes", phonetic: "A-a", context: "Afirmación.", category: "courtesy" },
    { id: "12", wayuunaiki: "Nnojo", spanish: "No", english: "No", phonetic: "Nno-ho", context: "Negación.", category: "courtesy" },
    { id: "13", wayuunaiki: "Aisü pia tapüla", spanish: "Te quiero / Te amo", english: "I love you", phonetic: "Ai-sü pya ta-pü-la", context: "Expresión de amor profundo.", category: "affection" }
  ],
  vocabulary: [
    { wayuunaiki: "wayuu", spanish: "persona, ser humano, wayuu", english: "person, Wayuu", phonetic: "wa-yuu", type: "sustantivo", category: "people" },
    { wayuunaiki: "alijuna", spanish: "persona no wayuu, forastero", english: "outsider, non-indigenous", phonetic: "a-li-hu-na", type: "sustantivo", category: "people" },
    { wayuunaiki: "jierü", spanish: "mujer", english: "woman", phonetic: "hye-rü", type: "sustantivo", category: "people" },
    { wayuunaiki: "tolü", spanish: "hombre, varón", english: "man", phonetic: "to-lü", type: "sustantivo", category: "people" },
    { wayuunaiki: "tepichi", spanish: "niño, niña", english: "child", phonetic: "te-pi-chi", type: "sustantivo", category: "people" },
    { wayuunaiki: "wüin", spanish: "agua", english: "water", phonetic: "wüin", type: "sustantivo", category: "nature" },
    { wayuunaiki: "mma", spanish: "tierra, suelo, patria", english: "earth, land", phonetic: "mma", type: "sustantivo", category: "nature" },
    { wayuunaiki: "siki", spanish: "fuego, leña", english: "fire", phonetic: "si-ki", type: "sustantivo", category: "nature" },
    { wayuunaiki: "ka'i", spanish: "sol, día", english: "sun, day", phonetic: "ka-'i", type: "sustantivo", category: "nature_time" },
    { wayuunaiki: "kashi", spanish: "luna, mes", english: "moon, month", phonetic: "ka-shi", type: "sustantivo", category: "nature_time" },
    { wayuunaiki: "shiliwala", spanish: "estrella", english: "star", phonetic: "shi-li-wa-la", type: "sustantivo", category: "nature" },
    { wayuunaiki: "miichi", spanish: "casa, hogar", english: "house, home", phonetic: "mii-chi", type: "sustantivo", category: "home" },
    { wayuunaiki: "süi", spanish: "chinchorro, hamaca", english: "hammock", phonetic: "süi", type: "sustantivo", category: "home_culture" },
    { wayuunaiki: "susu", spanish: "mochila wayuu", english: "Wayuu woven bag", phonetic: "su-su", type: "sustantivo", category: "culture" },
    { wayuunaiki: "paa'a", spanish: "vaca", english: "cow", phonetic: "pa-a-'a", type: "sustantivo", category: "animals" },
    { wayuunaiki: "kaula", spanish: "cabra, chivo", english: "goat", phonetic: "kau-la", type: "sustantivo", category: "animals" },
    { wayuunaiki: "ekawaa", spanish: "comer", english: "to eat", phonetic: "e-ka-wa-a", type: "verbo", category: "actions" },
    { wayuunaiki: "asawaa", spanish: "beber, tomar", english: "to drink", phonetic: "a-sa-wa-a", type: "verbo", category: "actions" },
    { wayuunaiki: "atunkaa", spanish: "dormir", english: "to sleep", phonetic: "a-tun-ka-a", type: "verbo", category: "actions" }
  ]
};

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadLexicon();
  setupNavigation();
  setupTranslationEvents();
  setupVocabularyView();
  setupNumbersConverter();
  setupSettings();
  setupPwa();
});

// PWA Service Worker Registration
function setupPwa() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registration failed:', err);
      });
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    AppState.deferredPrompt = e;
    const installBtn = document.getElementById('installPwaBtn');
    if (installBtn) installBtn.style.display = 'flex';
  });

  const installBtn = document.getElementById('installPwaBtn');
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (AppState.deferredPrompt) {
        AppState.deferredPrompt.prompt();
        const { outcome } = await AppState.deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          showToast('¡App instalada con éxito!');
        }
        AppState.deferredPrompt = null;
        installBtn.style.display = 'none';
      }
    });
  }
}

// Theme Handler
function initTheme() {
  document.body.setAttribute('data-theme', AppState.theme);
  updateThemeIcons();

  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', AppState.theme);
      localStorage.setItem('wayuu_theme', AppState.theme);
      updateThemeIcons();
    });
  }
}

function updateThemeIcons() {
  const moon = document.getElementById('moonIcon');
  const sun = document.getElementById('sunIcon');
  if (AppState.theme === 'dark') {
    if (moon) moon.style.display = 'block';
    if (sun) sun.style.display = 'none';
  } else {
    if (moon) moon.style.display = 'none';
    if (sun) sun.style.display = 'block';
  }
}

// Load Lexicon Data from API
async function loadLexicon() {
  try {
    const res = await fetch('/api/dictionary');
    if (res.ok) {
      AppState.lexicon = await res.json();
    } else {
      AppState.lexicon = FALLBACK_LEXICON;
    }
  } catch (err) {
    console.warn('Using offline fallback lexicon:', err);
    AppState.lexicon = FALLBACK_LEXICON;
  }
  renderVocabularyList();
  setDailyWord();
}

// Navigation Tabs
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.app-view');

  navItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetViewId = btn.getAttribute('data-view');
      if (!targetViewId) return;

      navItems.forEach((b) => b.classList.remove('active'));
      views.forEach((v) => v.classList.remove('active'));

      btn.classList.add('active');
      const targetView = document.getElementById(targetViewId);
      if (targetView) targetView.classList.add('active');
      AppState.activeTab = targetViewId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// Translation UI and Engine Events
function setupTranslationEvents() {
  const sourceLangSelect = document.getElementById('sourceLangSelect');
  const targetLangSelect = document.getElementById('targetLangSelect');
  const swapBtn = document.getElementById('swapLangBtn');
  const sourceText = document.getElementById('sourceText');
  const translateBtn = document.getElementById('translateBtn');
  const aiTranslateBtn = document.getElementById('aiTranslateBtn');
  const clearInputBtn = document.getElementById('clearInputBtn');
  const copyResultBtn = document.getElementById('copyResultBtn');
  const speakResultBtn = document.getElementById('speakResultBtn');
  const genderChips = document.querySelectorAll('.chip-gender');
  const quickChips = document.querySelectorAll('.quick-chip');

  sourceLangSelect.addEventListener('change', () => {
    AppState.sourceLang = sourceLangSelect.value;
    updateLanguageTags();
    toggleGenderBar();
  });

  targetLangSelect.addEventListener('change', () => {
    AppState.targetLang = targetLangSelect.value;
    updateLanguageTags();
    toggleGenderBar();
  });

  swapBtn.addEventListener('click', () => {
    const temp = sourceLangSelect.value;
    sourceLangSelect.value = targetLangSelect.value;
    targetLangSelect.value = temp;
    AppState.sourceLang = sourceLangSelect.value;
    AppState.targetLang = targetLangSelect.value;
    updateLanguageTags();
    toggleGenderBar();

    const resultText = document.getElementById('resultText').textContent.trim();
    if (resultText) {
      sourceText.value = resultText;
      performOfflineTranslation();
    }
  });

  // Gender Context Selector
  genderChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      genderChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.gender = chip.getAttribute('data-gender');
      if (sourceText.value.trim()) {
        performOfflineTranslation();
      }
    });
  });

  let inputDebounceTimer = null;
  sourceText.addEventListener('input', () => {
    if (clearInputBtn) {
      clearInputBtn.style.display = sourceText.value.trim() ? 'block' : 'none';
    }
    clearTimeout(inputDebounceTimer);
    if (sourceText.value.trim().length >= 2) {
      inputDebounceTimer = setTimeout(() => {
        performOfflineTranslation(false);
      }, 300);
    }
  });

  if (clearInputBtn) {
    clearInputBtn.addEventListener('click', () => {
      sourceText.value = '';
      clearInputBtn.style.display = 'none';
      document.getElementById('resultCard').style.display = 'none';
      sourceText.focus();
    });
  }

  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      sourceText.value = chip.textContent.trim();
      clearInputBtn.style.display = 'block';
      performOfflineTranslation();
    });
  });

  translateBtn.addEventListener('click', () => {
    performOfflineTranslation();
  });

  aiTranslateBtn.addEventListener('click', () => {
    performAiTranslation();
  });

  sourceText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      performOfflineTranslation();
    }
  });

  if (copyResultBtn) {
    copyResultBtn.addEventListener('click', () => {
      const text = document.getElementById('resultText').textContent;
      if (text) {
        navigator.clipboard.writeText(text).then(() => {
          const copyIcon = document.getElementById('copyIcon');
          const copiedIcon = document.getElementById('copiedIcon');
          copyIcon.style.display = 'none';
          copiedIcon.style.display = 'block';
          showToast('¡Texto copiado!');
          setTimeout(() => {
            copyIcon.style.display = 'block';
            copiedIcon.style.display = 'none';
          }, 1800);
        });
      }
    });
  }

  if (speakResultBtn) {
    speakResultBtn.addEventListener('click', () => {
      const text = document.getElementById('resultText').textContent;
      const phonetic = document.getElementById('phoneticText').textContent;
      speakWayuu(text, phonetic);
    });
  }
}

function updateLanguageTags() {
  const langNames = { es: 'Español', en: 'English', guc: 'Wayuunaiki' };
  document.getElementById('inputLanguageTag').textContent = langNames[AppState.sourceLang];
  document.getElementById('targetLanguageTag').textContent = langNames[AppState.targetLang];
}

function toggleGenderBar() {
  const genderBar = document.getElementById('genderBar');
  if (AppState.targetLang === 'guc') {
    genderBar.style.display = 'flex';
  } else {
    genderBar.style.display = 'none';
  }
}

// Normalizer utility for matching
function normalizeText(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:"]/g, '')
    .trim();
}

// Offline Translation Engine
function performOfflineTranslation(showToastOnEmpty = true) {
  const query = document.getElementById('sourceText').value.trim();
  if (!query) {
    if (showToastOnEmpty) showToast('Por favor escribe una palabra o frase');
    return;
  }

  const lexicon = AppState.lexicon || FALLBACK_LEXICON;
  const sLang = AppState.sourceLang;
  const tLang = AppState.targetLang;
  const gender = AppState.gender;
  const normQuery = normalizeText(query);

  let match = null;
  let alternatives = [];

  // A. Check if query is numeric (e.g. "7", "12")
  const numCheck = parseInt(query.trim(), 10);
  if (!isNaN(numCheck) && numCheck >= 1 && numCheck <= 100 && tLang === 'guc') {
    const numData = getWayuuNumber(numCheck);
    displayResult({
      translated: numData.word,
      phonetic: numData.phonetic,
      context: `Número ${numCheck} en sistema decimal y vigesimal wayuu.`,
      isVerified: true
    });
    return;
  }

  // B. Specific greeting and conversation high-priority map
  const quickConversations = {
    "hola": {
      masc: { wayuu: "Jamaya pia, tatünajutshi", pho: "Ha-ma-ya pya, ta-tü-na-hut-shi", ctx: "Saludo cordial a un hombre (amigo)." },
      fem: { wayuu: "Jamaya pia, tatünajutsü", pho: "Ha-ma-ya pya, ta-tü-na-hut-sü", ctx: "Saludo cordial a una mujer (amiga)." },
      plural: { wayuu: "¡Jamüshii jia!", pho: "Ha-mü-shii hya!", ctx: "Saludo a un grupo de personas." }
    },
    "hola amigo": {
      masc: { wayuu: "Jamaya pia, tatünajutshi", pho: "Ha-ma-ya pya, ta-tü-na-hut-shi", ctx: "Saludo tradicional a un amigo varón." },
      fem: { wayuu: "Jamaya pia, tatünajutsü", pho: "Ha-ma-ya pya, ta-tü-na-hut-sü", ctx: "Saludo a una amiga mujer." }
    },
    "hola hermano": {
      all: { wayuu: "Jamaya pia, tawala", pho: "Ha-ma-ya pya, ta-wa-la", ctx: "Saludo fraternal a un hermano." }
    },
    "buenos dias": {
      all: { wayuu: "Watta'a maalü", pho: "Wat-ta-a ma-a-lü", ctx: "Saludo matutino tradicional wayuu." }
    },
    "buenas tardes": {
      all: { wayuu: "Aliika", pho: "A-lii-ka", ctx: "Saludo tradicional para la tarde." }
    },
    "buenas noches": {
      all: { wayuu: "Aipa'a", pho: "Ai-pa-'a", ctx: "Saludo o despedida al caer la noche." }
    },
    "como estas": {
      all: { wayuu: "Jamaya pia?", pho: "Ha-ma-ya pya?", ctx: "Pregunta común de cortesía y bienestar." }
    },
    "bien": {
      masc: { wayuu: "Anashi taya", pho: "A-na-shi ta-ya", ctx: "Respuesta masculina: 'estoy bien'." },
      fem: { wayuu: "Anasü taya", pho: "A-na-sü ta-ya", ctx: "Respuesta femenina: 'estoy bien'." },
      plural: { wayuu: "Anashii waya", pho: "A-na-shii wa-ya", ctx: "Respuesta plural: 'estamos bien'." }
    },
    "muy bien": {
      masc: { wayuu: "Anashaanashi taya", pho: "A-na-shaa-na-shi ta-ya", ctx: "El infijo -shaana- intensifica la cualidad (excelente)." },
      fem: { wayuu: "Anashaanasü taya", pho: "A-na-shaa-na-sü ta-ya", ctx: "Respuesta femenina muy positiva." }
    },
    "gracias": {
      all: { wayuu: "Anayawatsü", pho: "A-na-ya-wat-sü", ctx: "Agradecimiento cordial y sincero." }
    },
    "muchas gracias": {
      all: { wayuu: "Anayawatsü", pho: "A-na-ya-wat-sü", ctx: "Expresión formal de agradecimiento." }
    },
    "de nada": {
      all: { wayuu: "Nnojo kasa", pho: "Nno-ho ka-sa", ctx: "Literalmente 'no es nada', respuesta cordial." }
    },
    "adios": {
      all: { wayuu: "Ateetshii waya waneemüin", pho: "A-teet-shii wa-ya wa-nee-müin", ctx: "Despedida fraternal que augura el reencuentro." }
    },
    "chao": {
      masc: { wayuu: "Ounushi taya", pho: "Ou-nu-shi ta-ya", ctx: "Despedida dicha por un hombre." },
      fem: { wayuu: "Ounusü taya", pho: "Ou-nu-sü ta-ya", ctx: "Despedida dicha por una mujer." },
      plural: { wayuu: "Ounushii waya", pho: "Ou-nu-shii wa-ya", ctx: "Despedida de un grupo." }
    },
    "te amo": {
      all: { wayuu: "Aisü pia tapüla", pho: "Ai-sü pya ta-pü-la", ctx: "Expresión profunda de amor y afecto." }
    },
    "te quiero": {
      all: { wayuu: "Aisü pia tapüla", pho: "Ai-sü pya ta-pü-la", ctx: "Expresión de cariño familiar o de pareja." }
    },
    "por favor": {
      all: { wayuu: "Püsülaja tamüin", pho: "Pü-sü-la-ha ta-müin", ctx: "Petición respetuosa." }
    },
    "si": {
      all: { wayuu: "Aa", pho: "A-a", ctx: "Afirmación estándar." }
    },
    "no": {
      all: { wayuu: "Nnojo", pho: "Nno-ho", ctx: "Negación estándar." }
    }
  };

  if (sLang === 'es' && tLang === 'guc' && quickConversations[normQuery]) {
    const qItem = quickConversations[normQuery];
    const picked = qItem[gender] || qItem.all || qItem.masc;
    displayResult({
      translated: picked.wayuu,
      phonetic: picked.pho,
      context: picked.ctx,
      isVerified: true
    });
    return;
  }

  const langKeyMap = { es: 'spanish', en: 'english', guc: 'wayuunaiki' };
  const sKey = langKeyMap[sLang] || sLang;
  const tKey = langKeyMap[tLang] || tLang;

  // C. Full exact or substring match in Phrases
  const allPhrases = lexicon.phrases || [];
  for (const p of allPhrases) {
    const sText = p[sKey] ? normalizeText(p[sKey]) : '';
    const wText = normalizeText(p.wayuunaiki || '');

    if (sLang === 'guc' && (wText === normQuery || wText.includes(normQuery))) {
      match = {
        translated: p[tKey] || p.spanish,
        phonetic: p.phonetic || '',
        context: p.context || 'Expresión tradicional Wayuu.',
        isVerified: true
      };
      break;
    } else if (sText === normQuery || sText.split('/').some(part => normalizeText(part) === normQuery) || (sText.length > 3 && sText.includes(normQuery))) {
      let trText = p.wayuunaiki;
      let phoText = p.phonetic;

      if (tLang === 'guc') {
        if (gender === 'fem' && (trText.includes('-shi') || p.id.includes('masc') || trText.includes('Anashi'))) {
          trText = trText.replace('Anashi', 'Anasü').replace('Antüshi', 'Antüsü').replace('Ounushi', 'Ounusü');
          if (phoText) phoText = phoText.replace('-shi', '-sü');
        } else if (gender === 'masc') {
          trText = trText.replace('Anasü', 'Anashi').replace('Antüsü', 'Antüshi').replace('Ounusü', 'Ounushi');
          if (phoText) phoText = phoText.replace('-sü', '-shi');
        }
      } else {
        trText = p[tKey] || p.spanish;
      }

      match = {
        translated: trText,
        phonetic: phoText,
        context: p.context || 'Expresión verificada en el corpus tradicional Wayuu.',
        isVerified: true
      };
      break;
    }
  }

  // D. Search in Vocabulary
  if (!match && lexicon.vocabulary) {
    for (const v of lexicon.vocabulary) {
      const sVal = v[sKey] ? normalizeText(v[sKey]) : '';
      const wVal = normalizeText(v.wayuunaiki || '');

      if (sLang === 'guc' && (wVal === normQuery || wVal.startsWith(normQuery))) {
        match = {
          translated: v[tKey] || v.spanish,
          phonetic: v.phonetic || '',
          context: `Categoría: ${v.category || 'General'}. Tipo: ${v.type || 'Sustantivo'}.`,
          isVerified: true
        };
        break;
      }

      const sParts = sVal.split(/[,;/]/).map(x => normalizeText(x));
      if (sParts.includes(normQuery) || sParts.some(p => p === normQuery)) {
        let word = v.wayuunaiki;
        if (tLang === 'guc' && (word.endsWith('shi') || word.endsWith('sü'))) {
          const root = word.slice(0, -3);
          if (gender === 'fem') word = root + 'sü';
          else if (gender === 'masc') word = root + 'shi';
          else if (gender === 'plural') word = root + 'shii';
        } else if (tLang !== 'guc') {
          word = v[tKey] || v.spanish;
        }

        match = {
          translated: word,
          phonetic: v.phonetic,
          context: `Palabra verificada: "${v.wayuunaiki}". Categoría: ${v.category || 'General'}.`,
          isVerified: true
        };
        break;
      } else if (sParts.some(p => p.includes(normQuery) || normQuery.includes(p))) {
        alternatives.push(v);
      }
    }
  }

  // E. Multi-word tokenizer & sentence composer
  if (!match && query.includes(' ')) {
    const words = query.split(/\s+/);
    const translatedTokens = [];
    const phoneticTokens = [];

    for (const w of words) {
      const nw = normalizeText(w);
      if (!nw || ['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'the', 'a', 'an'].includes(nw)) {
        continue;
      }

      if (quickConversations[nw]) {
        const item = quickConversations[nw];
        const p = item[gender] || item.all || item.masc;
        translatedTokens.push(p.wayuu);
        phoneticTokens.push(p.pho);
        continue;
      }

      let foundWord = null;
      for (const v of (lexicon.vocabulary || [])) {
        const parts = (v[sKey] || '').split(/[,;/]/).map(x => normalizeText(x));
        if (parts.includes(nw)) {
          foundWord = v;
          break;
        }
      }

      if (foundWord) {
        let val = (tLang === 'guc') ? foundWord.wayuunaiki : (foundWord[tKey] || foundWord.spanish);
        if (tLang === 'guc' && (val.endsWith('shi') || val.endsWith('sü'))) {
          const root = val.slice(0, -3);
          if (gender === 'fem') val = root + 'sü';
          else if (gender === 'masc') val = root + 'shi';
        }
        translatedTokens.push(val);
        phoneticTokens.push(foundWord.phonetic || val);
      } else {
        translatedTokens.push(w);
      }
    }

    if (translatedTokens.length > 0) {
      match = {
        translated: translatedTokens.join(' '),
        phonetic: phoneticTokens.join(' - '),
        context: 'Traducción compuesta por términos verificados en el diccionario.',
        isVerified: true
      };
    }
  }

  // F. Fallback or suggested match
  if (!match) {
    if (alternatives.length > 0) {
      const firstAlt = alternatives[0];
      displayResult({
        translated: firstAlt.wayuunaiki,
        phonetic: firstAlt.phonetic,
        context: `Término más cercano para "${query}": ${firstAlt.spanish}.`,
        isVerified: true,
        alternatives: alternatives.slice(1, 4)
      });
    } else {
      displayResult({
        translated: `"${query}"`,
        phonetic: 'Término no registrado en el diccionario offline',
        context: 'Puedes pulsar el botón "Modo IA" para que Gemini traduzca la oración completa con contexto cultural.',
        isVerified: false,
        alternatives: []
      });
    }
  } else {
    displayResult({
      ...match,
      alternatives: alternatives.slice(0, 3)
    });
  }
}

// Display Result Card
function displayResult({ translated, phonetic, context, isVerified, alternatives }) {
  const resultCard = document.getElementById('resultCard');
  const resultText = document.getElementById('resultText');
  const phoneticText = document.getElementById('phoneticText');
  const contextSection = document.getElementById('contextSection');
  const contextText = document.getElementById('contextText');
  const engineBadge = document.getElementById('engineBadge');
  const engineBadgeText = document.getElementById('engineBadgeText');
  const alternativesContainer = document.getElementById('alternativesContainer');
  const alternativesList = document.getElementById('alternativesList');

  resultCard.style.display = 'block';
  resultText.textContent = translated;
  phoneticText.textContent = phonetic ? `[${phonetic}]` : '';

  if (isVerified) {
    engineBadge.className = 'engine-badge verified';
    engineBadgeText.textContent = 'Diccionario Verificado';
  } else {
    engineBadge.className = 'engine-badge ai';
    engineBadgeText.textContent = 'Traducción Asistida';
  }

  if (context) {
    contextSection.style.display = 'block';
    contextText.textContent = context;
  } else {
    contextSection.style.display = 'none';
  }

  if (alternatives && alternatives.length > 0) {
    alternativesContainer.style.display = 'block';
    alternativesList.innerHTML = '';
    alternatives.forEach((alt) => {
      const chip = document.createElement('span');
      chip.className = 'alt-chip';
      chip.textContent = `${alt.wayuunaiki} (${alt.spanish.split(',')[0]})`;
      chip.addEventListener('click', () => {
        document.getElementById('sourceText').value = alt.spanish.split(',')[0];
        performOfflineTranslation();
      });
      alternativesList.appendChild(chip);
    });
  } else {
    alternativesContainer.style.display = 'none';
  }

  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// AI Translation (Gemini Integration)
async function performAiTranslation() {
  const query = document.getElementById('sourceText').value.trim();
  if (!query) {
    showToast('Ingresa un texto para traducir con IA');
    return;
  }

  const sLang = AppState.sourceLang;
  const tLang = AppState.targetLang;
  const gender = AppState.gender;
  const langNames = { es: 'Español', en: 'Inglés', guc: 'Wayuunaiki' };

  showToast('Consultando Inteligencia Artificial...');

  // Prepare result card with loading skeleton
  displayResult({
    translated: 'Traduciendo con IA Gemini...',
    phonetic: 'Analizando gramática y fonética wayuu...',
    context: 'Conectando con el modelo...',
    isVerified: false
  });

  const prompt = `Eres un lingüista y traductor experto en Wayuunaiki (lengua indígena de la familia Arawak hablada por el pueblo Wayuu en La Guajira, Colombia y Venezuela).
Traduce el siguiente texto de ${langNames[sLang]} a ${langNames[tLang]}.
Contexto de género gramatical requerido: ${gender === 'masc' ? 'Masculino (-shi)' : gender === 'fem' ? 'Femenino (-sü)' : 'Plural (-shii)'}.
Texto a traducir: "${query}".

IMPORTANTE: Responde ÚNICAMENTE en formato JSON con la siguiente estructura exacta:
{
  "translation": "Traducción exacta en el Alfabeto Único Wayuu (ALAWAY)",
  "phonetics": "Desglose fonético silábico legible (ej: Ha-ma-ya pya?)",
  "explanation": "Explicación breve de la gramática, concordancia de género (-shi/-sü) y contexto cultural wayuu"
}`;

  try {
    let resultJson = null;

    // First attempt: Server backend proxy `/api/translate`
    const backendRes = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: query,
        source_lang: sLang,
        target_lang: tLang,
        gender: gender,
        api_key: AppState.apiKey
      })
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      resultJson = data;
    } else if (AppState.apiKey) {
      // Direct call to Gemini REST API if user configured their own key in settings
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${AppState.apiKey}`;
      const geminiRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const rawText = geminiData.candidates[0].content.parts[0].text;
        resultJson = JSON.parse(rawText);
      }
    }

    if (resultJson) {
      displayResult({
        translated: resultJson.translation || resultJson.translated || 'Error en formato',
        phonetic: resultJson.phonetics || resultJson.phonetic || '',
        context: resultJson.explanation || resultJson.context || 'Traducción asistida por Gemini IA.',
        isVerified: false
      });
      showToast('¡Traducción IA completada!');
    } else {
      // If no API key is provided and server has no key
      displayResult({
        translated: 'Modo IA requiere clave API de Gemini',
        phonetic: 'Configúrala en la pestaña de Ajustes (es 100% gratuita)',
        context: 'Para traducciones automáticas de oraciones completas, ve a la pestaña "Ajustes" e ingresa tu clave de Google AI Studio.',
        isVerified: false
      });
      showToast('Clave de Gemini requerida');
    }
  } catch (err) {
    console.error('AI translation error:', err);
    displayResult({
      translated: 'No se pudo conectar con el servicio IA.',
      phonetic: 'Verifica tu conexión a internet o tu clave en Ajustes.',
      context: err.message,
      isVerified: false
    });
  }
}

// Phonetic Pronunciation using Web Speech API
function speakWayuu(text, phoneticGuide) {
  if (!('speechSynthesis' in window)) {
    showToast('Tu navegador no soporta síntesis de voz');
    return;
  }

  window.speechSynthesis.cancel();

  // Clean phonetic for utterance (approximate phonetic pronunciation using Spanish voice)
  const phonetic = phoneticGuide ? phoneticGuide.replace(/[[\]]/g, '') : text;
  const utterance = new SpeechSynthesisUtterance(phonetic);
  utterance.lang = 'es-CO'; // Colombian Spanish voice fits Wayuu acoustics best
  utterance.rate = 0.82; // Slower rate so long vowels and syllables are clear
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
  showToast('Reproduciendo pronunciación...');
}

// TAB 2: Vocabulary Glossary Renderer
function setupVocabularyView() {
  const searchInput = document.getElementById('vocabSearchInput');
  const catPills = document.querySelectorAll('.cat-pill');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderVocabularyList(searchInput.value.trim());
    });
  }

  catPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      catPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      renderVocabularyList(searchInput ? searchInput.value.trim() : '', pill.getAttribute('data-category'));
    });
  });
}

function renderVocabularyList(searchQuery = '', filterCategory = 'all') {
  const container = document.getElementById('vocabListContainer');
  if (!container) return;

  const lexicon = AppState.lexicon || FALLBACK_LEXICON;
  const items = [...(lexicon.vocabulary || []), ...(lexicon.phrases || [])];

  const normQuery = normalizeText(searchQuery);

  const filtered = items.filter((item) => {
    const matchCat = filterCategory === 'all' || item.category === filterCategory;
    if (!matchCat) return false;

    if (!normQuery) return true;

    const w = normalizeText(item.wayuunaiki || '');
    const es = normalizeText(item.spanish || '');
    const en = normalizeText(item.english || '');
    return w.includes(normQuery) || es.includes(normQuery) || en.includes(normQuery);
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 30px; color: var(--text-muted);">
        <p>No se encontraron términos para "${searchQuery}".</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map((item) => `
    <div class="vocab-item-card" data-word="${escapeHtml(item.wayuunaiki)}" data-spanish="${escapeHtml(item.spanish)}">
      <div class="vocab-card-top">
        <span class="vocab-word-wayuu">${escapeHtml(item.wayuunaiki)}</span>
        <span class="vocab-type-badge">${escapeHtml(item.category || item.type || 'Léxico')}</span>
      </div>
      <div class="vocab-phonetic">[${escapeHtml(item.phonetic || item.wayuunaiki)}]</div>
      <div class="vocab-meaning-es"><strong>ES:</strong> ${escapeHtml(item.spanish)}</div>
      <div class="vocab-meaning-en"><strong>EN:</strong> ${escapeHtml(item.english || '')}</div>
    </div>
  `).join('');

  // Add click to load into translator
  container.querySelectorAll('.vocab-item-card').forEach((card) => {
    card.addEventListener('click', () => {
      const word = card.getAttribute('data-word');
      const spanish = card.getAttribute('data-spanish');

      document.getElementById('sourceText').value = word;
      document.getElementById('sourceLangSelect').value = 'guc';
      document.getElementById('targetLangSelect').value = 'es';
      AppState.sourceLang = 'guc';
      AppState.targetLang = 'es';
      updateLanguageTags();
      toggleGenderBar();

      // Switch to translator tab
      document.querySelector('[data-view="viewTranslator"]').click();
      performOfflineTranslation();
    });
  });
}

// TAB 3: Wayuu Number Converter
function setupNumbersConverter() {
  const numInput = document.getElementById('numberInput');
  const convertBtn = document.getElementById('convertNumberBtn');
  const speakBtn = document.getElementById('speakNumberBtn');
  const fastItems = document.querySelectorAll('.num-grid-item');

  function convertCurrent() {
    const n = parseInt(numInput.value, 10);
    if (isNaN(n) || n < 1 || n > 100) {
      showToast('Ingresa un número entre 1 y 100');
      return;
    }
    const info = getWayuuNumber(n);
    document.getElementById('numResultDigit').textContent = n;
    document.getElementById('numResultWord').textContent = info.word;
    document.getElementById('numResultPhonetic').textContent = `Pronunciación: [${info.phonetic}]`;
  }

  if (convertBtn) convertBtn.addEventListener('click', convertCurrent);
  if (numInput) {
    numInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') convertCurrent();
    });
  }

  if (speakBtn) {
    speakBtn.addEventListener('click', () => {
      const word = document.getElementById('numResultWord').textContent;
      const phonetic = document.getElementById('numResultPhonetic').textContent.replace('Pronunciación: ', '');
      speakWayuu(word, phonetic);
    });
  }

  fastItems.forEach((item) => {
    item.addEventListener('click', () => {
      numInput.value = item.getAttribute('data-num');
      convertCurrent();
    });
  });

  convertCurrent();
}

// Algorithm to generate Wayuu numbers (1 to 100)
function getWayuuNumber(n) {
  const base = {
    1: { word: "Waneshi", phonetic: "wa-ne-shi" },
    2: { word: "Piama", phonetic: "pya-ma" },
    3: { word: "Apünüin", phonetic: "a-pü-nüin" },
    4: { word: "Pienchi", phonetic: "pyen-chi" },
    5: { word: "Jarai", phonetic: "ha-rai" },
    6: { word: "Aippirua", phonetic: "aip-pi-ru-a" },
    7: { word: "Akaraishi", phonetic: "a-ka-rai-shi" },
    8: { word: "Mekiisat", phonetic: "me-kii-sat" },
    9: { word: "Makkirai", phonetic: "mak-ki-rai" },
    10: { word: "Poloo", phonetic: "po-loo" }
  };

  if (base[n]) return base[n];

  if (n > 10 && n < 20) {
    const unit = n - 10;
    const unitWord = base[unit].word.toLowerCase();
    return {
      word: `Poloo ${unitWord}müin`,
      phonetic: `po-loo ${base[unit].phonetic}-müin`
    };
  }

  if (n === 20) return { word: "Piama polooshii", phonetic: "pya-ma po-loo-shii" };
  if (n === 30) return { word: "Apünüin polooshii", phonetic: "a-pü-nüin po-loo-shii" };
  if (n === 40) return { word: "Pienchi polooshii", phonetic: "pyen-chi po-loo-shii" };
  if (n === 50) return { word: "Jarai polooshii", phonetic: "ha-rai po-loo-shii" };
  if (n === 60) return { word: "Aippirua polooshii", phonetic: "aip-pi-ru-a po-loo-shii" };
  if (n === 70) return { word: "Akaraishi polooshii", phonetic: "a-ka-rai-shi po-loo-shii" };
  if (n === 80) return { word: "Mekiisat polooshii", phonetic: "me-kii-sat po-loo-shii" };
  if (n === 90) return { word: "Makkirai polooshii", phonetic: "mak-ki-rai po-loo-shii" };
  if (n === 100) return { word: "Poloo polooshii (Waneshi sianta)", phonetic: "po-loo po-loo-shii" };

  const tens = Math.floor(n / 10) * 10;
  const rem = n % 10;
  const tensInfo = getWayuuNumber(tens);
  const remInfo = base[rem];

  return {
    word: `${tensInfo.word} akato'u ${remInfo.word.toLowerCase()}`,
    phonetic: `${tensInfo.phonetic} a-ka-to-'u ${remInfo.phonetic}`
  };
}

// TAB 5: Settings & Wi-Fi
function setupSettings() {
  const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
  const apiKeyInput = document.getElementById('geminiApiKeyInput');
  const apiStatusBadge = document.getElementById('apiStatusBadge');
  const apiStatusText = document.getElementById('apiStatusText');
  const copyIpBtn = document.getElementById('copyIpBtn');

  if (AppState.apiKey && apiKeyInput) {
    apiKeyInput.value = AppState.apiKey;
    updateApiStatus(true);
  }

  if (saveApiKeyBtn && apiKeyInput) {
    saveApiKeyBtn.addEventListener('click', () => {
      const key = apiKeyInput.value.trim();
      AppState.apiKey = key;
      localStorage.setItem('wayuu_gemini_api_key', key);
      updateApiStatus(!!key);
      showToast(key ? '¡Clave de Gemini guardada!' : 'Clave eliminada. Modo Offline activo.');
    });
  }

  if (copyIpBtn) {
    copyIpBtn.addEventListener('click', () => {
      const ip = document.getElementById('mobileUrlDisplay').textContent;
      navigator.clipboard.writeText(ip).then(() => {
        showToast('¡Dirección copiada!');
      });
    });
  }
}

function updateApiStatus(hasKey) {
  const badge = document.getElementById('apiStatusBadge');
  const text = document.getElementById('apiStatusText');
  if (hasKey) {
    badge.className = 'status-indicator active';
    text.textContent = 'IA Gemini Conectada (Traducción inteligente activa)';
  } else {
    badge.className = 'status-indicator inactive';
    text.textContent = 'Modo Offline Activo (Diccionario local verificado)';
  }
}

// Daily Word
function setDailyWord() {
  const lexicon = AppState.lexicon || FALLBACK_LEXICON;
  const phrases = lexicon.phrases || [];
  if (phrases.length > 0) {
    const todayIndex = new Date().getDate() % phrases.length;
    const item = phrases[todayIndex];
    document.getElementById('dailyWordTitle').textContent = item.wayuunaiki;
    document.getElementById('dailyWordMeaning').textContent = `"${item.spanish}" — ${item.context || ''}`;
  }
}

// Toast Notification Utility
function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
