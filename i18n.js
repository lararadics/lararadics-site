/**
 * i18n.js — shared EN/DE toggle used on every page.
 *
 * How it works:
 *   - Any element with data-i18n="KEY" gets its text replaced with
 *     dict[currentLang][KEY].
 *   - Any element with data-i18n-prefix="KEY" gets '← ' + dict[...][KEY]
 *     (used for the "← Architecture" back link on project.html).
 *   - The chosen language is remembered in localStorage, so it carries
 *     over as you move between pages.
 *
 * Each page calls i18nApply(...) itself, once its own content has been
 * built (see the bottom of each HTML file) — this script only defines
 * the dictionary and the two functions, it doesn't run automatically.
 */

(function () {
  const dict = {
    en: {
      nav_architecture: 'Architecture',
      nav_people: 'People',
      nav_motion: 'Motion',
      nav_info: 'Info',
      nav_reviews: 'Reviews',
      motion_empty: 'Videos coming soon.',
      info_bio: "As an architect, photography has become a natural extension of my perspective, allowing me to explore how light transforms a space, how people interact with their surroundings and how small details contribute to the experience of a place. It is also a way of preserving moments and the memories attached to them. Through photography, I explore the same questions that guide my architectural work: how spaces are perceived, experienced, and remembered.",
      info_bio_3: "Basel, Switzerland · Budapest, Hungary",
      cat_architecture: 'Architecture',
      cat_people: 'People',
      cat_motion: 'Motion',
      tagline: 'Architecture, Photography & Videography — Laura Radics, Basel'
    },
    de: {
      nav_architecture: 'Architektur',
      nav_people: 'Personen',
      nav_motion: 'Bewegtbild',
      nav_info: 'Info',
      nav_reviews: 'Referenzen',
      motion_empty: 'Videos folgen in K\u00fcrze.',
      info_bio: "Als Architektin ist die Fotografie zu einer nat\u00fcrlichen Erweiterung meiner Perspektive geworden \u2014 sie erlaubt mir zu erforschen, wie Licht einen Raum verwandelt, wie Menschen mit ihrer Umgebung interagieren und wie kleine Details die Erfahrung eines Ortes pr\u00e4gen. Sie ist auch eine Art, Momente und die damit verbundenen Erinnerungen festzuhalten. Durch die Fotografie untersuche ich dieselben Fragen, die auch meine architektonische Arbeit leiten: wie R\u00e4ume wahrgenommen, erlebt und erinnert werden.",
      info_bio_3: "Basel, Schweiz · Budapest, Ungarn",
      cat_architecture: 'Architektur',
      cat_people: 'Personen',
      cat_motion: 'Bewegtbild',
      tagline: 'Architektur, Fotografie & Videografie — Laura Radics, Basel'
    }
  };

  function applyLang(lang) {
    if (!dict[lang]) lang = 'en';
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[lang][key] !== undefined) el.textContent = dict[lang][key];
    });

    document.querySelectorAll('[data-i18n-prefix]').forEach(el => {
      const key = el.getAttribute('data-i18n-prefix');
      if (dict[lang][key] !== undefined) el.textContent = '\u2190 ' + dict[lang][key];
    });

    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = lang === 'en' ? 'DE' : 'EN';

    localStorage.setItem('site-lang', lang);
  }

  function toggleLang() {
    const current = localStorage.getItem('site-lang') || 'en';
    applyLang(current === 'en' ? 'de' : 'en');
  }

  window.i18nDict = dict;
  window.i18nApply = applyLang;
  window.i18nToggle = toggleLang;
})();
