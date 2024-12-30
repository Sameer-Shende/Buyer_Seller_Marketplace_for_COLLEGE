const slider = document.querySelector('#slider');
const slides = slider.querySelectorAll('.slide');
const prevButton = document.querySelector('#prev');
const nextButton = document.querySelector('#next');

let currentIndex = 0;

function showSlide(index) {
    const offset = -index * 100;
    slider.style.transform = `translateX(${offset}%)`;
}

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
    showSlide(currentIndex);
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
    showSlide(currentIndex);
});

// Auto-slide every 7 seconds
setInterval(() => {
    currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
    showSlide(currentIndex);
}, 7000);