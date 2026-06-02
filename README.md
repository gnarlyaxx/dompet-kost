# Dompet Kost 💰🏠

**Dompet Kost** adalah aplikasi berbasis web responsive (mobile-first) yang dirancang khusus untuk membantu anak kos mengelola keuangan bulanan mereka dengan lebih mudah, terstruktur, dan disiplin. Dengan antarmuka yang bersih dan intuitif, pengguna dapat memantau saldo bersih, menetapkan batas anggaran bulanan, serta mengategorikan pengeluaran harian demi menghindari krisis keuangan di akhir bulan.

---

## ✨ Fitur Utama

1. **Dashboard / Beranda Utama**
   * **Ringkasan Saldo**: Menampilkan Saldo Bersih Bulanan hasil kalkulasi otomatis dari total uang kiriman/pemasukan dikurangi pengeluaran.
   * **Pelacak Arus Kas**: Kartu informasi instan untuk memantau total *Pemasukan* dan *Pengeluaran* yang berjalan secara real-time.
   * **Progress Bar Anggaran**: Fitur pemantauan persentase anggaran yang telah terpakai agar pengguna tidak *overspending* sebelum bulan berakhir.

2. **Manajemen Kategori Pengeluaran Anak Kos**
   * Pencatatan pengeluaran yang terbagi ke dalam berbagai kategori esensial kebutuhan harian, seperti:
     * 🍔 **Makan & Minum** (Warteg, bulanan, air galon, dll.)
     * 🚌 **Transportasi** (Bensin, ojek online, atau angkutan umum)
     * 📚 **Pendidikan** (Buku, fotokopi, atau kebutuhan kuliah/sekolah)
     * 🎮 **Hiburan** (Streaming platform, nongkrong, atau game)

3. **Riwayat Transaksi**
   * Log/catatan menyeluruh dari semua transaksi masuk dan keluar secara kronologis untuk mempermudah evaluasi pengeluaran mingguan atau bulanan.

4. **Kalender Keuangan**
   * Fitur berbasis kalender untuk melihat pola pengeluaran harian atau menjadwalkan pengingat pembayaran penting (seperti bayar tagihan kos, listrik, atau wifi).

5. **Kalkulator Finansial**
   * Alat bantu hitung cepat dengan 3 fitur utama:
     * **Kalkulator Standar & Persentase**: Memudahkan menghitung pengeluaran langsung dengan fitur persentase pintar (contoh: `500-60%` = `200`).
     * **Proyeksi Tabungan**: Menghitung bunga majemuk tabungan berkala baik dalam skema Bulanan maupun Mingguan.
     * **Bagi Anggaran (50/30/20)**: Mempermudah alokasi sisa uang saku menjadi Kebutuhan, Keinginan, dan Tabungan.

6. **AI Financial Assistant (AI Pendamping Keuangan)**
   * Fitur berbasis kecerdasan buatan (AI) yang siap memberikan rekomendasi finansial, analisis otomatis terhadap kebiasaan belanja anak kos, serta tips hemat "survival mode" di akhir bulan yang disesuaikan dengan sisa saldo pengguna.

---

## 🛠️ Teknologi yang Digunakan

### Frontend (`/client`)
* **Core:** React 19 & JavaScript (ES6+)
* **Styling:** Tailwind CSS v4 & Lucide React (Icons)
* **Router:** React Router DOM
* **Visualisasi Data:** Recharts (untuk chart pengeluaran)
* **Build Tool:** Vite

### Backend (`/server`)
* **Runtime & Framework:** Node.js & Express
* **Database & Auth:** Supabase Client JS
* **AI Integration:** Google Generative AI (Gemini SDK) & Groq SDK
* **Utility:** Axios, Cors, Dotenv

---

## 🚀 Memulai Proyek (Getting Started)

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda:

### Prasyarat
Pastikan Anda sudah menginstal:
* [Node.js](https://nodejs.org/) (versi 18+)
* Package Manager (NPM bawaan Node.js)

### Langkah Langkah Menjalankan Aplikasi

#### 1. Clone Repositori
```bash
git clone https://github.com/gnarlyaxx/dompet-kost.git
cd dompet-kost
```

#### 2. Jalankan Backend (Server)
1. Masuk ke direktori server:
   ```bash
   cd server
   ```
2. Install dependensi:
   ```bash
   npm install
   ```
3. Salin file `.env.example` ke `.env` dan isi variabel environment-nya (seperti API Key Supabase & Gemini/Groq):
   ```bash
   cp .env.example .env
   ```
4. Jalankan server dalam mode development:
   ```bash
   npm run dev
   ```
   *(Server akan berjalan di http://localhost:5000 atau port yang ditentukan)*

#### 3. Jalankan Frontend (Client)
1. Masuk ke direktori client (dari root project):
   ```bash
   cd ../client
   ```
2. Install dependensi:
   ```bash
   npm install
   ```
3. Jalankan dev server Vite:
   ```bash
   npm run dev
   ```
4. Buka http://localhost:5173 di browser Anda.

---

## 👥 Kontributor
* **[@Boby Harjuna Pangestu](https://github.com/gnarlyaxx)** (Owner & Developer)
* **[@Biaro1](https://github.com/Biaro1)** (Co-Developer)
