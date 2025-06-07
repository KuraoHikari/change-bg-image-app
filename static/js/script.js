document.addEventListener("DOMContentLoaded", function () {
 // Elements
 const uploadArea = document.getElementById("uploadArea");
 const imageUpload = document.getElementById("imageUpload");
 const previewContainer = document.getElementById("previewContainer");
 const preview = document.getElementById("preview");
 const placeholder = document.getElementById("placeholder");
 const resultContainer = document.getElementById("resultContainer");
 const resultImage = document.getElementById("resultImage");
 const processBtn = document.getElementById("processBtn");
 const downloadBtn = document.getElementById("downloadBtn");
 const colorOptions = document.querySelectorAll(".color-option");
 const spinner = document.getElementById("spinner");
 const notification = document.getElementById("notification");

 // Selected color
 let selectedColor = "blue";

 // Event listeners
 uploadArea.addEventListener("click", () => imageUpload.click());
 imageUpload.addEventListener("change", handleImageUpload);
 processBtn.addEventListener("click", processImage);
 downloadBtn.addEventListener("click", downloadImage);

 // Color selection
 colorOptions.forEach((option) => {
  option.addEventListener("click", () => {
   // Remove active class from all options
   colorOptions.forEach((opt) => opt.classList.remove("active"));
   // Add active class to clicked option
   option.classList.add("active");
   selectedColor = option.dataset.color;
  });
 });

 // Handle image upload
 function handleImageUpload(e) {
  const file = e.target.files[0];
  if (file) {
   // Show file name
   const fileName = file.name.length > 20 ? file.name.substring(0, 17) + "..." : file.name;
   uploadArea.querySelector("h4").textContent = "File Terpilih";
   uploadArea.querySelector("p").textContent = fileName;
   uploadArea.querySelector("button").textContent = "Ganti File";

   // Enable process button
   processBtn.disabled = false;

   // Show preview and hide upload area
   const reader = new FileReader();
   reader.onload = function (e) {
    preview.src = e.target.result;
    previewContainer.style.display = "block";
    uploadArea.style.display = "none"; // Hide upload area
    placeholder.style.display = "none";
    resultContainer.style.display = "none";
   };
   reader.readAsDataURL(file);
  }
 }

 // Tambahkan event klik pada preview untuk kembali ke upload
 preview.addEventListener("click", function () {
  previewContainer.style.display = "none";
  uploadArea.style.display = "flex"; // Show upload area again
  imageUpload.value = "";
  preview.src = "";
  // Reset upload area text/button jika perlu
  uploadArea.querySelector("h4").textContent = "Upload Foto";
  uploadArea.querySelector("p").textContent = "Seret atau klik untuk mengunggah foto paspor Anda";
  uploadArea.querySelector("button").textContent = "Pilih File";
  processBtn.disabled = true;
 });

 // Process image
 function processImage() {
  const file = imageUpload.files[0];

  if (!file) {
   showNotification("Silakan unggah gambar terlebih dahulu", "error");
   return;
  }

  // Show loading state
  processBtn.disabled = true;
  processBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Memproses...';
  spinner.style.display = "block";

  // Create form data
  const formData = new FormData();
  formData.append("image", file);
  formData.append("color", selectedColor);

  // Send to backend
  fetch("/process", {
   method: "POST",
   body: formData,
  })
   .then((response) => {
    if (!response.ok) {
     throw new Error("Terjadi kesalahan pada server");
    }
    return response.json();
   })
   .then((data) => {
    if (data.image) {
     // Show result
     placeholder.style.display = "none";
     resultContainer.style.display = "block";
     resultImage.src = `data:image/jpeg;base64,${data.image}`;

     // Set download URL
     downloadBtn.href = data.download_url;

     showNotification("Latar belakang berhasil diganti!", "success");
    } else {
     throw new Error("Gagal memproses gambar");
    }
   })
   .catch((error) => {
    console.error("Error:", error);
    showNotification(error.message || "Terjadi kesalahan saat memproses gambar", "error");
   })
   .finally(() => {
    // Reset button
    processBtn.disabled = false;
    processBtn.innerHTML = '<i class="fas fa-sync-alt me-2"></i>Ganti Latar Belakang';
    spinner.style.display = "none";
   });
 }

 // Download image
 function downloadImage(e) {
  e.preventDefault();

  // In a real app, this would trigger actual download
  // For demo, we'll simulate download
  showNotification("Memulai download...", "info");

  // Create a temporary link to trigger download
  const link = document.createElement("a");
  link.href = downloadBtn.href;
  link.download = "paspor-baru.jpg";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
 }

 // Show notification
 function showNotification(message, type = "info") {
  notification.textContent = message;

  // Set background color based on type
  if (type === "error") {
   notification.style.backgroundColor = "#dc3545";
  } else if (type === "success") {
   notification.style.backgroundColor = "#28a745";
  } else if (type === "info") {
   notification.style.backgroundColor = "#17a2b8";
  } else {
   notification.style.backgroundColor = "#6c757d";
  }

  notification.style.display = "block";

  // Hide after 3 seconds
  setTimeout(() => {
   notification.style.display = "none";
  }, 3000);
 }
});
