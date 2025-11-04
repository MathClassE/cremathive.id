blob.mathspark.cmh/
│
├── index.html                # Halaman utama (redirect ke Pages/home.html)
├── README.md                 # Dokumentasi singkat proyek
│
├── Pages/
│   ├── home.html             # Halaman utama (beranda)
│   │
│   └── Subjects/             # Folder semua mata pelajaran
│       ├── trigonometri.html # Series Trigonometri
│       ├── geometri.html     # Series Geometri
│       ├── aljabar.html      # Series Aljabar
│       └── statistika.html   # Series Statistika
│
└── Assets/
    ├── Animate/              # Animasi blob, shape, efek visual per halaman
    │   ├── trigonometri/
    │   ├── geometri/
    │   ├── aljabar/
    │   └── statistika/
    │
    ├── CSS/                  
    │   ├── global.css        # Style global (navbar, layout umum)
    │   ├── home.css          # Warna & layout khusus halaman Home
    │   ├── trigono.css       # Tema warna Trigonometri
    │   ├── geo.css           # Tema warna Geometri
    │   ├── aljabar.css       # Tema warna Aljabar
    │   └── statistika.css    # Tema warna Statistika
    │
    ├── Data/
    │   ├── trigonometri/
    │   ├── geometri/
    │   ├── aljabar/
    │   └── statistika/
    │
    ├── Images/
    │   ├── common/           # Logo & gambar umum (CREMATHIVE, favicon, dsb)
    │   │   ├── logo.webp
    │   │   ├── fav.png
    │   │   └── cover.webp
    │   │
    │   ├── trigonometri/
    │   ├── geometri/
    │   ├── aljabar/
    │   └── statistika/
    │
    ├── Icon/
    │   ├── arrow.svg
    │   ├── quiz.svg
    │   └── pdf.svg
    │
    └── JS/
        ├── main.js           # Navigasi, efek umum, animasi blob global
        ├── home.js           # Script khusus halaman Home
        ├── trigono.js
        ├── geo.js
        ├── aljabar.js
        └── statistika.js