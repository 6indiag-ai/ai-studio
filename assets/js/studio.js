const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const log = document.getElementById('log');
let currentBlob = null;

fileInput.addEventListener('change', (e) => {
  const f = e.target.files[0];
  preview.innerHTML = '';
  if (!f) {
    preview.innerHTML = '<span class="text-gray-400">No file selected</span>';
    return;
  }

  if (f.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(f);
    img.className = 'max-h-48 object-contain';
    preview.appendChild(img);
  } else if (f.type.startsWith('video/')) {
    const v = document.createElement('video');
    v.src = URL.createObjectURL(f);
    v.controls = true;
    v.className = 'max-h-48';
    preview.appendChild(v);
  } else {
    preview.textContent = 'Unsupported file type';
  }

  log.textContent = 'File ready: ' + f.name;
  currentBlob = f;
});

// 🔥 Universal function to send request
async function processMedia(endpoint) {
  if (!currentBlob) return log.textContent = "⚠ First upload a file";

  log.textContent = "⏳ Processing...";
  const formData = new FormData();
  formData.append("file", currentBlob);

  try {
    const res = await fetch(`https://ai-backend-studio.onrender.com${endpoint}`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Backend error");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    // show processed file preview
   preview.innerHTML = '';
    if (endpoint.includes('video')) {
      const video = document.createElement('video');
      video.src = url;
      video.controls = true;
      video.className = 'max-h-48';
      preview.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = url;
      img.className = 'max-h-48 object-contain';
      preview.appendChild(img);
    }

    log.textContent = "✅ Done";

  } catch (e) {
    log.textContent = "❌ Failed — check backend";
  }
}

// 🔌 Buttons connected to backend
document.getElementById('btnRemove').onclick = () => processMedia('/api/process/remove-bg');
document.getElementById('btnEnhance').onclick = () => processMedia('/api/process/enhance-image');
document.getElementById('btnUpscale').onclick = () => processMedia('/api/process/upscale-image');
document.getElementById('btnSubtitle').onclick = () => processMedia('/api/process/video_subtitle');
