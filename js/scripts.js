/*!
* Start Bootstrap - Business Casual v7.0.9 (https://startbootstrap.com/theme/business-casual)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-casual/blob/master/LICENSE)
*/
// Highlights current date on contact page
window.addEventListener('DOMContentLoaded', event => {
    const listHoursArray = document.body.querySelectorAll('.list-hours li');
    listHoursArray[new Date().getDay()].classList.add(('today'));
})
document.addEventListener('DOMContentLoaded', () => {
    let visitCount = parseInt(localStorage.getItem('visitCount')) || 0;
    visitCount += 1;
    localStorage.setItem('visitCount', visitCount);
    
    const counterElement = document.getElementById('visit-counter');
    if (counterElement) {
        counterElement.textContent = visitCount;
    }

    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});