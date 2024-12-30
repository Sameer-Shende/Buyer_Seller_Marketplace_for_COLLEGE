const toggleMenu = (id) => {
    const menu = document.getElementById(id);
    menu.classList.toggle('hidden');
};

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const sidebar = document.getElementById('sidebar');
const categoriesFiltersButton = document.getElementById('categories-filters-button');

mobileMenuButton.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
});

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});



categoriesFiltersButton.addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
});

categoriesFiltersButton.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
});