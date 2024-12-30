function showAlert(message) {
    const alertContainer = document.createElement('div');
    alertContainer.className = 'alert-container';
    alertContainer.innerHTML = `
        <div class="alert-box">
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove();" class="alert-close">Close</button>
        </div>
    `;
    document.body.appendChild(alertContainer);
    setTimeout(() => alertContainer.remove(), 5000); // Remove alert after 5 seconds
}