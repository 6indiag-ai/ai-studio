// assets/js/studio.js
const API_BASE = "https://ai-backend-studio.onrender.com"; // ← your Render backend
let token = "demo-token"; // optional, demo token

const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const log = document.getElementById('log');
let currentBlob = null;

fileInput.addEventListener('change', (e)=>{
  const f = e.target.files[0];
  preview.innerHTML = '';
  if(!f){ preview.innerHTML = '<span class="text-gray-400">No file selected</span>'; return;}
  if(f.type.startsWith('image/')){
    const img=document.createElement('img');
    img.src=URL.createObjectURL(f);
    img.className='max-h-48 object-contain';
    preview.appendChild(img);
  } else if(f.type.startsWith('video/')){
    const v=document.createElement('video');
    v.src=URL.createObjectURL(f);
    v.controls=true;
    v.className='max-h-48';
    preview.appendChild(v);
  } else {
    preview.textContent='Unsupported file type';
  }
  log.textContent = "File ready: " + f.name;
  currentBlob = f;
});

async function callApi(action, expectBlob = true){
  if(!currentBlob){ alert("Please upload a file first"); return; }
  const fd = new FormData();
  fd.append("file", currentBlob);

  log.textContent = "Uploading & processing...";

  try{
    const res = await fetch(`${API_BASE}/api/process/${action}`, {
      method: "POST",
      headers: { "Authorization": "Bearer " + token },
      body: fd
    });

    const json = await res.json();

    if(!res.ok){
      console.error("API error:", json);
      log.textContent = "❌ Error: " + (json.message || "Server returned error");
      return;
    }

    // server returns JSON { message, result: "/results/filename" }
    const resultPath = json.result;
    const resultUrl = API_BASE + resultPath;

    // Open download link + preview
    log.innerHTML = `Done — <a href="${resultUrl}" target="_blank" class="text-blue-600 underline">Download result</a>`;

    // try to show preview by fetching as blob
    if(expectBlob){
      try{
        const bres = await fetch(resultUrl);
        if(bres.ok){
          const blob = await bres.blob();
          preview.innerHTML = '';
          if(blob.type.startsWith('image/') || action.includes('image') || action.includes('remove')){
            const img = document.createElement('img');
            img.src = URL.createObjectURL(blob);
            img.className='max-h-48 object-contain';
            preview.appendChild(img);
          } else {
            const v = document.createElement('video');
            v.src = URL.createObjectURL(blob);
            v.controls = true;
            v.className='max-h-48';
            preview.appendChild(v);
          }
        }
      }catch(e){
        // preview fetch may fail for non-file returns; ignore
        console.warn("Preview fetch failed", e);
      }
    }

  }catch(err){
    console.error(err);
    log.textContent = "❌ Network or server error — check backend";
  }
}

// connect buttons
document.getElementById('btnRemove').onclick = ()=> callApi("remove-bg", true);
document.getElementById('btnEnhance').onclick = ()=> callApi("enhance-image", true);
document.getElementById('btnUpscale').onclick = ()=> callApi("upscale-image", true);
document.getElementById('btnSubtitle').onclick = ()=> callApi("video_subtitle", false);
