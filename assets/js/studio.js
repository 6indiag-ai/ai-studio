const API = "https://ai-backend-studio.onrender.com/api/process";

let token = "demo"; // फिलहाल authentication ON नहीं है इसलिए dummy चल जाएगा

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

async function run(action){
  if(!currentBlob){ alert("Select a file first"); return; }
  const fd = new FormData();
  fd.append("file", currentBlob);
  log.textContent = "Processing...";

  const res = await fetch(`${API}/${action}`, {
    method: "POST",
    headers: { "Authorization": "Bearer " + token },
    body: fd
  });

  const out = await res.json();
  if(!res.ok){ alert(out.message || "Failed"); return; }

  const url = "https://ai-backend-studio.onrender.com" + out.result;
  log.innerHTML = `<a href="${url}" target="_blank" class="text-blue-500 underline">Download Result</a>`;
}

document.getElementById('btnRemove').onclick = ()=> run("remove-bg");
document.getElementById('btnEnhance').onclick = ()=> run("enhance-image");
docume
