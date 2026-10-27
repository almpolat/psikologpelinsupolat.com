// ===== LANGUAGE TOGGLE (FR default, TR secondary — no English) =====
const LANG_STORAGE_KEY = 'ppp_lang';
const currentLang = { value: 'fr' };

function getStoredLang() {
    try {
        return localStorage.getItem(LANG_STORAGE_KEY);
    } catch (e) {
        return null;
    }
}

function storeLang(lang) {
    try {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
        // ignore storage errors — site still works, just won't remember the choice
    }
}

function setLanguage(lang) {
    if (lang !== 'fr' && lang !== 'tr') lang = 'fr';
    currentLang.value = lang;

    // Update all translatable elements (text content)
    document.querySelectorAll('[data-fr][data-tr]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text !== null) {
            el.textContent = text;
        }
    });

    // Update translatable image alt text
    document.querySelectorAll('[data-fr-alt][data-tr-alt]').forEach(el => {
        const alt = el.getAttribute(`data-${lang}-alt`);
        if (alt !== null) {
            el.alt = alt;
        }
    });

    // Update page title and meta description
    const titles = {
        fr: 'Pelinsu Polat | Psychologue Clinicienne',
        tr: 'Pelinsu Polat | Klinik Psikolog'
    };
    const descs = {
        fr: "Pelinsu Polat - Psychologue clinicienne à Bordeaux. Vieillissement, bilan cognitif, soutien aux aidants, accompagnement interculturel, deuil, anxiété et dépression.",
        tr: "Pelinsu Polat - Bordeaux'da klinik psikolog. Yaşlılık, bilişsel değerlendirme, bakım verenlere destek, kültürlerarası destek, yas, kaygı ve depresyon."
    };
    document.title = titles[lang];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = descs[lang];

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update html lang attribute
    document.documentElement.lang = lang;

    storeLang(lang);
}

// Language button listeners
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
    });
});

// Initial language: respect a previously stored choice, otherwise default to FR.
// If localStorage is unavailable, getStoredLang() returns null and we still get FR.
const storedLang = getStoredLang();
setLanguage(storedLang === 'tr' ? 'tr' : 'fr');

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        // Close mobile nav if open
        const overlay = document.querySelector('.mobile-nav-overlay');
        if (overlay) overlay.classList.remove('show');
    });
});

// ===== DOT NAVIGATION + NAV ACTIVE STATE =====
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.dot');
const navLinks = document.querySelectorAll('#main-nav .nav-link');

const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;

            // Update dots
            dots.forEach(dot => {
                dot.classList.toggle('active', dot.dataset.section === id);
            });

            // Update nav links
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// ===== FADE IN ON SCROLL =====
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
});

fadeElements.forEach(el => {
    fadeObserver.observe(el);
});

// ===== MOBILE MENU =====
const mobileMenuBtn = document.getElementById('mobile-menu-btn');

// Create mobile overlay
const overlay = document.createElement('div');
overlay.classList.add('mobile-nav-overlay');
const navLinksClone = document.querySelector('.nav-links').cloneNode(true);
navLinksClone.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        overlay.classList.remove('show');
    });
});
overlay.appendChild(navLinksClone);
overlay.querySelector('.nav-links').style.display = 'flex';
overlay.querySelector('.nav-links').style.flexDirection = 'column';
overlay.querySelector('.nav-links').style.alignItems = 'center';
document.body.appendChild(overlay);

mobileMenuBtn.addEventListener('click', () => {
    overlay.classList.toggle('show');
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    const scrollPos = window.scrollY;

    if (scrollPos > 100) {
        nav.style.padding = '12px 40px';
        nav.style.background = 'rgba(243, 241, 251, 0.97)';
    } else {
        nav.style.padding = '18px 40px';
        nav.style.background = 'rgba(243, 241, 251, 0.92)';
    }
});

// ===== SERVICE CARDS STAGGER ANIMATION =====
const serviceCards = document.querySelectorAll('.service-card-new');
serviceCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.08}s`;
});

// ===== SERVICE MODAL ("En savoir plus" — card 1 only) =====
const serviceModal = document.getElementById('service-modal');
const serviceModalOpenBtn = document.getElementById('service-modal-open');
const serviceModalCloseBtn = document.getElementById('service-modal-close');

function openServiceModal() {
    serviceModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
    serviceModal.classList.remove('show');
    document.body.style.overflow = '';
}

if (serviceModalOpenBtn) serviceModalOpenBtn.addEventListener('click', openServiceModal);
if (serviceModalCloseBtn) serviceModalCloseBtn.addEventListener('click', closeServiceModal);

if (serviceModal) {
    serviceModal.addEventListener('click', (e) => {
        if (e.target === serviceModal) closeServiceModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal && serviceModal.classList.contains('show')) {
        closeServiceModal();
    }
});
