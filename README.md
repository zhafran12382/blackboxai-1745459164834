# WhatsApp Clone - Aplikasi Chat Sederhana

Aplikasi chat berbasis web yang terinspirasi dari WhatsApp, dibangun menggunakan HTML, Tailwind CSS, dan JavaScript. Aplikasi ini berjalan sebagai Single Page Application (SPA) dan menggunakan localStorage untuk penyimpanan data.

## Fitur

- 🔐 Sistem login sederhana
- 💬 Chat grup umum
- 🕒 Pesan dengan timestamp
- 💾 Penyimpanan pesan menggunakan localStorage
- 📱 Tampilan responsif untuk semua ukuran layar
- ⚡ Performa cepat tanpa backend

## Teknologi yang Digunakan

- HTML5
- Tailwind CSS (via CDN)
- JavaScript (Vanilla)
- Font Awesome untuk ikon
- Google Fonts untuk tipografi

## Cara Menjalankan Aplikasi Secara Lokal

1. Clone repository ini
```bash
git clone <url-repository>
```

2. Buka folder project
```bash
cd nama-folder
```

3. Buka file `index.html` di browser atau gunakan server lokal
```bash
# Menggunakan Python
python3 -m http.server 8000
```

4. Buka browser dan akses `http://localhost:8000`

## Cara Deploy

### Deploy ke Vercel

1. Buat akun di [Vercel](https://vercel.com) jika belum memiliki
2. Install Vercel CLI
```bash
npm install -g vercel
```

3. Login ke Vercel melalui CLI
```bash
vercel login
```

4. Deploy project
```bash
vercel
```

5. Ikuti instruksi yang muncul di terminal
6. Setelah selesai, project akan di-deploy dan URL akan diberikan

### Deploy ke Netlify

1. Buat akun di [Netlify](https://netlify.com) jika belum memiliki
2. Ada dua cara untuk deploy:

   **Cara 1: Drag & Drop**
   - Buka [Netlify](https://app.netlify.com)
   - Login ke akun Anda
   - Drag and drop folder project ke area yang ditentukan
   - Tunggu proses deploy selesai

   **Cara 2: Menggunakan Git**
   - Push project ke repository GitHub
   - Login ke Netlify
   - Klik "New site from Git"
   - Pilih repository
   - Klik "Deploy site"

## Cara Penggunaan

1. Buka aplikasi di browser
2. Masukkan username (bebas)
3. Masukkan password: `Ratubagus`
4. Setelah login berhasil, Anda akan masuk ke halaman chat
5. Mulai mengirim pesan di grup umum

## Catatan Penting

- Aplikasi ini menggunakan localStorage untuk menyimpan data, jadi data akan hilang jika localStorage dibersihkan
- Password default: `Ratubagus`
- Aplikasi ini hanya untuk demonstrasi dan pembelajaran

## Troubleshooting

1. **Pesan Error "Application Error"**
   - Pastikan semua file termasuk CSS dan JavaScript sudah ter-upload dengan benar
   - Periksa console browser untuk error detail

2. **Halaman Tidak Memuat**
   - Pastikan koneksi internet aktif untuk memuat Tailwind CSS dan Font Awesome
   - Clear cache browser dan reload halaman

3. **Login Tidak Berhasil**
   - Pastikan password yang dimasukkan: `Ratubagus`
   - Username bisa diisi bebas

## Kontribusi

Jika Anda ingin berkontribusi pada project ini:
1. Fork repository
2. Buat branch baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## Lisensi

Project ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.
