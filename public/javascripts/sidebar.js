function activateSlider(option) {
    const buttons = ["buy", "lost", "needed"];
    buttons.forEach((btn) => {
        const element = document.getElementById(`slider-${btn}`);
        element.classList.remove("slider-active");
        element.classList.add("slider-inactive");
    });
    const activeButton = document.getElementById(`slider-${option}`);
    activeButton.classList.add("slider-active");
    activeButton.classList.remove("slider-inactive");

    fetch(`/products?type=${option}`)
    .then(response => response.json())
    .then(data => {
        const mainContentContainer = document.querySelector('.main-content-container');
        mainContentContainer.innerHTML = data.html; // Replace content dynamically
    })
    .catch(err => console.error('Error fetching products:', err));
}

// Sidebar Toggle Logic
document.getElementById('categories-filters-button').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('-translate-x-full');
});

document.getElementById('lostDate').addEventListener('change', function () {
    const selectedDate = new Date(this.value);
    const today = new Date();
    
    // Ensure the selected date is in the past
    if (selectedDate >= today) {
        alert("The lost date must be in the past.");
        this.value = ""; // Reset the input
    }
});

document.getElementById('neededBy').addEventListener('change', function () {
    const selectedDate = new Date(this.value);
    const today = new Date();

    // Ensure the selected date is in the future
    if (selectedDate <= today) {
        alert("The needed by date must be in the future.");
        this.value = ""; // Reset the input
    }
});