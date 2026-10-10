/*!
* Start Bootstrap - Business Casual v7.0.9 (https://startbootstrap.com/theme/business-casual)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-casual/blob/master/LICENSE)
*/
const VISIT_NAMESPACE = 'cafe-marron';
const VISIT_KEY = 'visitas';
const VISIT_SESSION = 'cafeMarronCounted';

document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    highlightToday();
    updateYear();
    updateVisitCounter();
});

function setupNav() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('#site-nav');
    if (!header || !toggle || !nav) {
        return;
    }

    toggle.addEventListener('click', () => {
        const open = header.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            header.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

function highlightToday() {
    const items = document.querySelectorAll('.list-hours li');
    if (!items.length) {
        return;
    }

    // La lista empieza en lunes. Date.getDay() usa domingo = 0.
    const index = (new Date().getDay() + 6) % 7;
    const today = items[index];
    if (!today) {
        return;
    }

    items.forEach((item) => item.classList.remove('today'));
    today.classList.add('today');
}

function updateYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = String(new Date().getFullYear());
    }
}

async function updateVisitCounter() {
    const counterElement = document.getElementById('visit-counter');
    if (!counterElement) {
        return;
    }

    const localCount = readLocalVisits();
    if (localCount > 0) {
        counterElement.textContent = String(localCount);
    }

    const action = shouldCountThisSession() ? 'hit' : 'get';

    try {
        const response = await fetch(
            `https://abacus.jasoncameron.dev/${action}/${VISIT_NAMESPACE}/${VISIT_KEY}`,
            { cache: 'no-store', signal: AbortSignal.timeout(5000) }
        );
        if (!response.ok) {
            throw new Error('No se pudo leer el contador');
        }

        const data = await response.json();
        const value = Number(data.value);
        if (!Number.isFinite(value)) {
            throw new Error('Respuesta inválida');
        }

        counterElement.textContent = String(value);
        writeLocalVisits(value);
        markSessionCounted();
    } catch (error) {
        const fallback = shouldCountThisSession() ? localCount + 1 : Math.max(localCount, 1);
        counterElement.textContent = String(fallback);
        writeLocalVisits(fallback);
        markSessionCounted();
    }
}

function shouldCountThisSession() {
    try {
        return sessionStorage.getItem(VISIT_SESSION) !== '1';
    } catch (error) {
        return true;
    }
}

function markSessionCounted() {
    try {
        sessionStorage.setItem(VISIT_SESSION, '1');
    } catch (error) {
        // El navegador bloqueó sessionStorage.
    }
}

function readLocalVisits() {
    try {
        const value = Number.parseInt(localStorage.getItem('visitCount'), 10);
        return Number.isFinite(value) && value > 0 ? value : 0;
    } catch (error) {
        return 0;
    }
}

function writeLocalVisits(value) {
    try {
        localStorage.setItem('visitCount', String(value));
    } catch (error) {
        // El navegador bloqueó localStorage.
    }
}
