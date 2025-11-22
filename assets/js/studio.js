// assets/js/studio.js
const API_BASE = "https://ai-backend-studio.onrender.com";  // Render backend
let token = "demo-token"; // optional

const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const log = document.getElementById('log');
let currentBlob = null;

fileInput.addEventListener('change', (e)=>{
  const f = e.target.files[0];
  preview.innerHTML = '';
  if (!f) { preview.innerHTML = 'No file selected'; return; }

  if (f.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(f);
    img.className = 'max-h-48 object-contain';
    preview.appendChild(img);
  } 
  else if (f.type.startsWith('video/')) {
    const v = document.createElement('video');
    v.src = URL.createObjectURL(f);
    v.controls = true;
    v.className = 'max-h-48';
    preview.appendChild(v);
  } 
  else {
    preview.textContent = 'Unsupported file';
  }
  currentBlob = f;
  log.textContent = "File selected: " + f.name;
});

async function callApi(action){
  if (!currentBlob) return alert("Please upload a file");

  const fd = new FormData();
  fd.append("file", currentBlob);

  log.textContent = "Processing... please wait";

  try {
    const res = await fetch(`${API_BASE}/api/process/${action}`, {
      method: "POST",
      headers: { "Authorization": "Bearer " + token },
      body: fd
    });

    const data = await res.json();
    if (!res.ok) {
      log.textContent = "❌ Error: " + (data.message || "Server error");
      return;
    }

    const resultUrl = API_BASE + data.result;
    log.innerHTML = `✔ Done — <a href="${resultUrl}" target="_blank" class="text-blue-600 underline">Download Result</a>`;

    // Show preview
    const blobRes = await fetch(resultUrl);
    const blob = await blobRes.blob();
    preview.innerHTML = '';

    if (blob.type.startsWith("image/")) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(blob);
      img.className = 'max-h-48 object-contain';
      preview.appendChild(img);
    } else {
      const v = document.createElement('video');
      v.src = URL.createObjectURL(blob);
      v.controls = true;
      v.className = 'max-h-48';
      preview.appendChild(v);
    }

  } catch (e) {
    log.textContent = "❌ Network / Backend error";
    console.error(e);
  }
}

// buttons
document.getElementById('btnRemove').onclick   = ()=> callApi("remove-bg");
document.getElementById('btnEnhance').onclick  = ()=> callApi("enhance-image");
document.getElementById('btnUpscale').onclick  = ()=> callApi("upscale-image");
document.getElementById('btnSubtitle').onclick = ()=> callApi("video_subtitle");
