// JS khusus Home: Animasi blob
document.addEventListener('DOMContentLoaded', () => {
    const blob = document.getElementById('home-blob');
    let posX = 0;
    setInterval(() => {
        posX += 1;
        blob.style.left = posX + 'px';
        if (posX > window.innerWidth) posX = 0;
    }, 50);
});