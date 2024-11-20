document.addEventListener('DOMContentLoaded', function () {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    const menuButtons = document.querySelectorAll('.menu-button');
    const contentSections = document.querySelectorAll('.content-section');

    // Toggle sidebar
    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    // Click on the mask layer to close the sidebar
    overlay.addEventListener('click', function () {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Handle menu click events
    menuButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Get the ID of the content area to be displayed
            const targetId = this.dataset.content;

            // Remove all active status
            menuButtons.forEach(btn => btn.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            // Add new activity status
            this.classList.add('active');
            document.getElementById(targetId).classList.add('active');

            // Close sidebar
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    });

    // The first menu item and content area are activated by default
    if (menuButtons.length > 0 && contentSections.length > 0) {
        menuButtons[0].classList.add('active');
        contentSections[0].classList.add('active');
    }
});