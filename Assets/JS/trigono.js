document.addEventListener('DOMContentLoaded', function() {
    
    const aSlider = document.getElementById('aSlider');
    const bSlider = document.getElementById('bSlider');
    const cSlider = document.getElementById('cSlider');
    const dSlider = document.getElementById('dSlider');

    const aValue = document.getElementById('aValue');
    const bValue = document.getElementById('bValue');
    const cValue = document.getElementById('cValue');
    const dValue = document.getElementById('dValue');

    if (typeof Plotly === 'undefined') {
        console.error("Plotly library not found. Make sure it's loaded before this script.");
        document.getElementById('graph').textContent = 'Error: Gagal memuat library grafik.';
        return;
    }

    function updateGraph() {
        const a = parseFloat(aSlider.value);
        const b = parseFloat(bSlider.value);
        const c = parseFloat(cSlider.value);
        const d = parseFloat(dSlider.value);

        aValue.textContent = a.toFixed(1);
        bValue.textContent = b.toFixed(1);
        cValue.textContent = c.toFixed(1);
        dValue.textContent = d.toFixed(1);

        const x_points = [];
        const y_points = [];
        for (let x = -2 * Math.PI; x <= 2 * Math.PI; x += 0.02) {
            x_points.push(x);
            y_points.push(a * Math.sin(b * x + c) + d);
        }

        const layout = {
            title: {
                text: 'y = ' + a.toFixed(1) + ' sin(' + b.toFixed(1) + 'x + ' + c.toFixed(1) + ') + ' + d.toFixed(1),
                font: {
                    size: 16
                }
            },
            xaxis: { title: 'x (radian)', zeroline: true },
            yaxis: { title: 'y', range: [-10, 10], zeroline: true },
            margin: { l: 50, r: 20, b: 40, t: 50 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: '#f8f9fa'
        };
        
        const config = {responsive: true};

        Plotly.newPlot('graph', [{ x: x_points, y: y_points, type: 'scatter', mode: 'lines', line: {color: '#007bff', width: 3} }], layout, config);
    }

    aSlider.addEventListener('input', updateGraph);
    bSlider.addEventListener('input', updateGraph);
    cSlider.addEventListener('input', updateGraph);
    dSlider.addEventListener('input', updateGraph);

    updateGraph();

});

document.addEventListener('DOMContentLoaded', () => {

    const bukaKuisBtn = document.getElementById('bukaKuisBtn');
    const tutupKuisBtn = document.getElementById('tutupKuisBtn');
    const kuisModal = document.getElementById('kuisModal');
    const frameKuis = document.getElementById('frameKuis');

    const urlKuis = "https://wayground.com/join/quiz/5ecda14e4b37f9001b80d978/start?studentShare=true";

    const bukaModal = () => {
        frameKuis.src = urlKuis;
        kuisModal.style.display = 'flex';
    };

    const tutupModal = () => {
        kuisModal.style.display = 'none';
        frameKuis.src = '';
    };
    bukaKuisBtn.addEventListener('click', bukaModal);
    tutupKuisBtn.addEventListener('click', tutupModal);

    kuisModal.addEventListener('click', (event) => {
        if (event.target === kuisModal) {
            tutupModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            tutupModal();
        }
    });

});


document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('a[href^="#"]');
    // const header = document.getElementById('header');
    // const Links = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll('main section[id]');

    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('slide');
        menuToggle.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('slide');
            menuToggle.classList.remove('active');
        });
    });

    const highlightNavLink = () => {
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 90; 
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink);

    highlightNavLink();
    const navbarHeight = navbar ? navbar.offsetHeight : 85;

    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const targetPosition = targetElement.offsetTop - navbarHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
});
