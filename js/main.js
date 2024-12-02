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

    // Function to handle activating menu and content by ID
    function activateContentById(targetId) {
        // Remove all active status
        menuButtons.forEach(btn => btn.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));

        // Add active status to the matching menu button and content section
        const targetButton = Array.from(menuButtons).find(btn => btn.dataset.content === targetId);
        const targetSection = document.getElementById(targetId);

        if (targetButton && targetSection) {
            targetButton.classList.add('active');
            targetSection.classList.add('active');
        }
    }

    // Handle menu click events
    menuButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.dataset.content;

            // Update URL hash
            window.location.hash = targetId;

            // Activate corresponding menu and content
            activateContentById(targetId);

            // Close sidebar
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    });

    // Activate content based on current hash in the URL
    function handleHashChange() {
        const hash = window.location.hash.slice(1); // Remove the '#' from the hash
        if (hash) {
            activateContentById(hash);
        } else if (menuButtons.length > 0 && contentSections.length > 0) {
            // If no hash, activate the first menu and content by default
            activateContentById(menuButtons[0].dataset.content);
        }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Initialize based on current hash on page load
    handleHashChange();
});
