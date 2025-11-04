// Global JS: Navigasi dan efek umum
document.addEventListener('DOMContentLoaded', () => {
    // Efek hover pada navbar
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('mouseover', () => link.style.color = '#ffeb3b');
        link.addEventListener('mouseout', () => link.style.color = 'white');
    });
});