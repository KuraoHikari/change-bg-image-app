# BGChanger – Aplikasi Pengganti Latar Foto Paspor

BGChanger adalah aplikasi web berbasis Flask yang memungkinkan Anda **mengganti latar belakang foto paspor** secara otomatis dengan berbagai pilihan warna hanya dalam beberapa klik. Aplikasi ini memanfaatkan teknologi segmentasi gambar berbasis deep learning untuk memisahkan objek (wajah) dari latar belakang, sehingga hasilnya rapi dan siap pakai.

---

## Screenshot Aplikasi

![Tampilan BGChanger](static/screenshoot/WhatsApp%20Image%202025-06-07%20at%201.26.22%20PM.jpeg)
![Tampilan BGChanger](static/screenshoot/WhatsApp%20Image%202025-06-07%20at%201.26.40%20PM.jpeg)
![Tampilan BGChanger](static/screenshoot/WhatsApp%20Image%202025-06-07%20at%201.26.56%20PM.jpeg)
![Tampilan BGChanger](static/screenshoot/WhatsApp%20Image%202025-06-07%20at%201.27.36%20PM.jpeg)

> _Contoh tampilan utama aplikasi BGChanger._

---

## Fitur Utama

- **Upload Foto Paspor**: Mendukung format JPG dan PNG.
- **Preview Instan**: Lihat hasil foto sebelum diproses.
- **Pilih Warna Latar**: Tersedia 7 warna standar paspor (biru, merah, putih, hijau, biru muda, kuning, oranye).
- **Proses Otomatis**: Latar belakang diganti otomatis menggunakan model AI.
- **Download Hasil**: Unduh foto paspor dengan latar belakang baru.
- **Notifikasi Interaktif**: Informasi proses dan error tampil secara real-time.

---

## Requirement & Instalasi

### 1. Requirement Sistem

- Python 3.8+
- pip

### 2. Paket Python yang Dibutuhkan

Tercantum di `requirements.txt`:

- flask
- opencv-python-headless
- torch
- torchvision
- pillow
- numpy

### 3. Instalasi

```bash
git clone https://github.com/username/change-bg-image-app.git
cd change-bg-image-app
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## Cara Menjalankan Aplikasi

1. **Aktifkan virtual environment** (jika belum):
   ```bash
   source venv/bin/activate
   ```
2. **Jalankan aplikasi Flask:**
   ```bash
   python app.py
   ```
3. **Buka browser** dan akses [http://localhost:5000](http://localhost:5000)

---

## Dokumentasi API

### Endpoint: `/process`

**Method:** `POST`  
**Deskripsi:** Proses penggantian latar belakang foto.

#### Request

- **Form Data:**
  - `image` (file): File gambar paspor (JPG/PNG)
  - `color` (string): Pilihan warna latar (`blue`, `red`, `white`, `green`, `lightblue`, `yellow`, `orange`)

#### Response (JSON)

```json
{
 "image": "<base64-encoded-jpeg>",
 "download_url": "/download?color=blue"
}
```

### Endpoint: `/download`

**Method:** `GET`  
**Deskripsi:** Mengunduh hasil foto paspor yang sudah diproses.

---

## Struktur Direktori

```
change-bg-image-app/
├── app.py
├── requirements.txt
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── templates/
│   └── index.html
└── README.md
```

---

## Paket yang Digunakan

- **Flask** – Web framework Python
- **OpenCV** – Pengolahan gambar
- **Torch & Torchvision** – Model segmentasi DeepLabV3
- **Pillow** – Manipulasi gambar
- **NumPy** – Operasi array
- **Bootstrap** – Tampilan responsif (CDN)
- **FontAwesome** – Ikon (CDN)

---

## Acknowledgement

- Model segmentasi: [PyTorch DeepLabV3](https://pytorch.org/vision/stable/models/generated/torchvision.models.deeplabv3_resnet101.html)
- Template UI: Bootstrap 5
- Ikon: FontAwesome

---

## Author

- **GitHub:** [github.com/KuraoHikari](https://github.com/KuraoHikari)
- **Email:** dewaindra705@gmail.com

---

> **Lisensi:** MIT License (atau sesuai kebutuhan Anda)
