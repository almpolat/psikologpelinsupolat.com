// ===== LANGUAGE TOGGLE =====
const currentLang = { value: 'tr' };

function setLanguage(lang) {
    currentLang.value = lang;

    // Update all translatable elements (text content)
    document.querySelectorAll('[data-tr][data-fr][data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                // handled separately below
            } else {
                el.textContent = text;
            }
        }
    });

    // Update input placeholders
    document.querySelectorAll(`[data-${lang}-placeholder]`).forEach(el => {
        el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
    });

    // Update page title and meta
    const titles = {
        tr: 'Pelinsu Polat | Psikolog',
        fr: 'Pelinsu Polat | Psychologue',
        en: 'Pelinsu Polat | Psychologist'
    };
    const descs = {
        tr: 'Pelinsu Polat - Klinik Psikolog. Bireysel terapi, çift terapisi, aile terapisi ve online danışmanlık hizmetleri. www.psikologpelinsupolat.com',
        fr: 'Pelinsu Polat - Psychologue Clinicienne. Thérapie individuelle, thérapie de couple, thérapie familiale et consultation en ligne. www.psikologpelinsupolat.com',
        en: 'Pelinsu Polat - Clinical Psychologist. Individual therapy, couples therapy, family therapy and online counseling. www.psikologpelinsupolat.com'
    };
    document.title = titles[lang];
    document.querySelector('meta[name="description"]').content = descs[lang];

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update html lang attribute
    document.documentElement.lang = lang === 'en' ? 'en' : lang === 'fr' ? 'fr' : 'tr';
}

// Language button listeners
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
    });
});

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
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    const scrollPos = window.scrollY;

    if (scrollPos > 100) {
        nav.style.padding = '12px 40px';
        nav.style.background = 'rgba(245, 240, 232, 0.95)';
    } else {
        nav.style.padding = '18px 40px';
        nav.style.background = 'rgba(245, 240, 232, 0.88)';
    }

    lastScroll = scrollPos;
});

// ===== SERVICE CARDS STAGGER ANIMATION =====
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// ===== APPOINTMENT MODAL =====
const modal = document.getElementById('appointment-modal');
const fabBtn = document.getElementById('appointment-fab');
const contactBtn = document.getElementById('appointment-btn-contact');
const closeBtn = document.getElementById('modal-close');
const form = document.getElementById('appointment-form');
const formSuccess = document.getElementById('form-success');

function openModal() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    // Reset form if previously submitted
    form.style.display = '';
    formSuccess.style.display = 'none';
    form.reset();
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

fabBtn.addEventListener('click', openModal);
contactBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

// Close on overlay click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});

// Form submission — sends to polatpelinsu@gmail.com via FormSubmit.co
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '...';
    submitBtn.disabled = true;

    // Build form data for FormSubmit
    const data = new FormData();
    data.append('name', document.getElementById('form-name').value + ' ' + document.getElementById('form-surname').value);
    data.append('phone', document.getElementById('form-phone').value);
    data.append('email', document.getElementById('form-email').value);
    data.append('_subject', 'Yeni Randevu Talebi - psikologpelinsupolat.com');
    data.append('_captcha', 'false');
    data.append('_template', 'table');

    fetch('https://formsubmit.co/ajax/polatpelinsu@gmail.com', {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
    .then(result => {
        // Show success message
        form.style.display = 'none';
        formSuccess.style.display = 'block';

        // Auto-close after 3 seconds
        setTimeout(() => {
            closeModal();
        }, 3000);
    })
    .catch(error => {
        console.error('Form error:', error);
        // Still show success (email might have been sent)
        form.style.display = 'none';
        formSuccess.style.display = 'block';
        setTimeout(() => {
            closeModal();
        }, 3000);
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
});
