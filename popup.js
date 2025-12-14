// --- 1. KONFIGURASI API ---
<script src="config.js"></script>

async function panggilGeminiAI(nama, harga, catatan) {
    const prompt = generatePrompt(nama, harga, catatan);

    const res = await fetch("api/gemini.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
    });

    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal respon Gemini";
}



const apiKey = typeof window.apiKey !== 'undefined' ? window.apiKey : ""; 
const groqApiKey = typeof window.groqApiKey !== 'undefined' ? window.groqApiKey : "";

const NAMA_TOKO = "Indra Jaya Sakti Motor";
const ALAMAT_TOKO = "Jl. Raya Purwodadi - Semarang, Dolog, Kembangarum, Kec. Mranggen, Kabupaten Demak";

// --- 2. DATABASE (BRAND & MODEL) ---
const BRAND_LIST = [
  "Aspira Premio", "Aspira", "Takayama", "Federal", "Kayaba", "Showa",
  "Denso", "NGK", "Sakura", "Astra", "Yamalube",
  "Motul", "OEM", "Apopart", 
  "Shell", "Castrol", "Repsol", "Pertamina Enduro", "Pertamina Mesran",
  "Idemitsu", "Eneos", "Top 1", "Evalube", "BM1",
  "AHM Oil", "SGO (Suzuki)", "KGO (Kawasaki)", "Deltalube",
  "IRC", "FDR", "Maxxis", "Corsa", "Swallow", "Zeneos",
  "Michelin", "Pirelli", "Bridgestone", "Kingland", 
  "Nissin", "Brembo", "Tokico", "Bendix", "Elig", "KTC Kytaco", "RCB (Racing Boy)",
  "GS Astra", "Yuasa", "Motobatt", "Toyo", "Bosch",
  "SSS", "DID", "RK Takasago", "Sinnob", "TK Racing", "Wilwood",
  "Indoparts", "NPP", "Riko", "Fukukawa", "Choho", "Thallland", "Fukuyama",
  "Daytona", "TDR Racing", "BRT (Bintang Racing Team)", "Kawahara", "Daetona",
  "Uma Racing", "CLD", "Moto1", "Ferrox"
];

const MODEL_LIST = [
  // KATA KUNCI VARIAN
  "Injeksi", "Injection", "Karbu", "Karburator", "FI", "ESP", "POP", "Street", "Deluxe",
  "2T Panjang", "2T Pendek", "2T", "4T",
  "KRM", "KYT", "U20", "U22", "U24", "C7", "D8", "D6", "CPR6", "CPR8", "CPR9",
  
  // HONDA
  "Honda", "Supra X 125", "Supra 125", "Supra X", "Supra GTR", "Supra Fit", "Supra", 
  "Beat Karbu", "Beat FI", "Beat ESP", "Beat Street", "Beat Deluxe", "Beat Pop", "Beat",
  "Vario 110", "Vario 125", "Vario 150", "Vario 160", "Vario", 
  "Scoopy Karbu", "Scoopy FI", "Scoopy ESP", "Scoopy Prestige", "Scoopy",
  "Genio", "Spacy", "PCX 150", "PCX 160", "ADV 150", "ADV 160", "PCX", "ADV",
  "Stylo 160", "Forza", 
  "Revo Absolute", "Revo FI", "Revo Abs", "Revo", "Blade 125", "Blade",
  "Grand", "Legenda", "Prima", "Star", "Kirana", "Karisma", "Astrea", "Win 100", "Win",
  "Sonic 150R", "Sonic", "CS1", "GL 100", "GL Pro", "GL Max", "GL",
  "Megapro Hiu", "Megapro Primus", "Megapro Monoshock", "Megapro New", "Megapro", 
  "CB150 Verza", "Verza", "Tiger 2000", "Tiger Revo", "Tiger", 
  "CB150R Old", "CB150R LED", "CB150X", "CB150R", "CBR 150R", "CBR 250R", "CBR 250RR", "CBR",
  "CRF 150L", "CRF 250L", "CRF", "CT125", "Super Cub C125",
  
  // YAMAHA
  "Yamaha", "Mio Sporty", "Mio Smile", "Mio J", "Mio GT", "Mio M3", "Mio Z", "Mio S", "Mio Soul", "Mio",
  "Soul Karbu", "Soul GT 115", "Soul GT 125", "Soul GT",
  "Fino Karbu", "Fino FI", "Fino 125", "Fino",
  "X-Ride 115", "X-Ride 125", "X-Ride", "Gear 125", "FreeGo",
  "Xeon Karbu", "Xeon RC", "Xeon GT", "Xeon",
  "Aerox 155 Old", "Aerox 155 Connected", "Aerox", 
  "NMAX Old", "NMAX New", "NMAX Turbo", "NMAX",
  "Lexi LX 155", "Lexi", "XMAX 250", "XMAX", "TMAX",
  "Grand Filano", "Fazzio",
  "Jupiter Z1", "Jupiter Z", "Jupiter MX 135", "Jupiter MX King", "MX King 150", "Jupiter MX", "Jupiter", "MX King",
  "Vega R", "Vega ZR", "Vega Force", "Force 1", "F1ZR", "Vega",
  "Vixion Old", "Vixion Lightning", "Vixion Advance", "Vixion R", "Vixion New", "Vixion",
  "Byson Karbu", "Byson FI", "Byson", "Scorpio Z", "Scorpio",
  "XSR 155", "MT-15", "MT-25", "R15 V2", "R15 V3", "R15 V4", "R25", "R15",
  "RX King", "RX Z", "Touch", "Tiara", "WR 155 R",
  
  // SUZUKI
  "Suzuki", "Satria FU 150", "Satria F150 FI", "Satria 2 Tak", "Satria Hiu", "Satria Lumba", "Satria",
  "Shogun 110", "Shogun 125", "Shogun Axelo", "Shogun SP", "Shogun",
  "Smash Titan", "Smash FI", "Smash", "Spin 125", "Spin", "Skywave", "Skydrive", "Hayate",
  "Nex II", "Nex", "Address", "Lets", "Avenis", "Burgman Street",
  "Thunder 125", "Thunder 250", "Inazuma", "Thunder",
  "GSX R150", "GSX S150", "Bandit 150", "TS 125",
  
  // KAWASAKI
  "Kawasaki", "Ninja 150 RR", "Ninja 150 R", "Ninja 150 SS",
  "Ninja 250 Karbu", "Ninja 250 FI", "Ninja 250 Mono", "Ninja ZX-25R", "Ninja",
  "Z250 SL", "Z250", "KLX 150 BF", "KLX 150", "KLX 230", "KLX 250", "KLX",
  "D-Tracker 150", "D-Tracker X", "D-Tracker",
  "W175 TR", "W175", "Kaze R", "Blitz", "Athlete", "ZX130",
  
  // VESPA
  "Vespa LX", "Vespa S", "Vespa Sprint", "Vespa Primavera", "Vespa GTS",
  "Piaggio Zip", "Piaggio Liberty", "Piaggio Medley"
];

const PART_ALIASES = [
  { keywords: ["busi", "spark plug"], seoTitle: "Busi Spark Plug" },
  { keywords: ["bearing", "laher", "laker", "klaker"], seoTitle: "Bearing Laher Laker" },
  { keywords: ["kampas rem", "dispad", "discpad", "brake pad", "pad set"], seoTitle: "Kampas Rem Dispad Brake Pad" },
  { keywords: ["kampas kopling", "plat kopling", "clutch disk"], seoTitle: "Kampas Kopling Plat Clutch Disk" },
  { keywords: ["sok", "shock", "sokbreker", "shockbreaker", "suspensi", "skok"], seoTitle: "Shockbreaker Shock Sokbreker" },
  { keywords: ["aki", "accu", "baterai", "battery"], seoTitle: "Aki Accu Baterai" },
  { keywords: ["lampu", "bohlam", "bulb"], seoTitle: "Lampu Bohlam" },
  { keywords: ["spion", "kaca spion", "mirror"], seoTitle: "Kaca Spion Mirror" },
  { keywords: ["oli", "oil", "pelumas"], seoTitle: "Oli Pelumas Oil Mesin" },
  { keywords: ["master rem"], seoTitle: "Master Rem" }
];

const POSITION_WORDS = ["belakang", "depan", "kiri", "kanan", "atas", "bawah", "set", "assy", "new", "old", "lama", "baru"];

// --- 3. HELPER FUNCTIONS (TITLE LOGIC) ---
function preprocessText(rawText) {
  let text = rawText;
  BRAND_LIST.forEach(brand => {
    const regex = new RegExp(`(${brand})([^\\s\\n])`, "gi");
    text = text.replace(regex, '$1\n$2');
  });
  return text;
}

function cleanInput(text) {
  if (!text) return "";
  text = text.trim();
  
  // --- TYPO CORRECTION ---
  text = text.replace(/belkang/gi, 'belakang');
  text = text.replace(/belakng/gi, 'belakang');
  text = text.replace(/blkg/gi, 'belakang');
  text = text.replace(/dpn/gi, 'depan');
  
  // Fix Brand Typos
  // Menggunakan \b (word boundary) agar "indoparts" tidak berubah jadi "indopartss"
  text = text.replace(/indopart\b/gi, 'Indoparts'); text = text.replace(/daetona\b/gi, 'Daytona'); 

  text = text.replace(/([a-z])([A-Z])/g, '$1 $2');
  text = text.replace(/\/\s+/g, '/'); 
  text = text.replace(/\s+\/+/g, '/'); 
  return text;
}

function detectBrand(text) {
  const sortedBrands = [...BRAND_LIST].sort((a, b) => b.length - a.length);
  for (const brand of sortedBrands) {
    const regex = new RegExp(`\\b${brand}\\b`, "i");
    if (regex.test(text)) return brand;
  }
  return "Original"; 
}

function detectModels(text) {
  const found = [];
  const sortedModels = [...MODEL_LIST].sort((a, b) => b.length - a.length);
  
  for (const model of sortedModels) {
    const safeModel = model.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${safeModel}\\b`, "i");
    if (regex.test(text)) {
      found.push(model);
    }
  }
  return [...new Set(found)];
}

function processProducts(inputText) {
  const processedInput = preprocessText(inputText);
  const lines = processedInput.split('\n');
  const groups = {};

  lines.forEach(line => {
    let cleanLine = cleanInput(line);
    if (cleanLine.length === 0) return;

    const brand = detectBrand(cleanLine);
    const models = detectModels(cleanLine);
    
    // Cleaning
    let tempName = cleanLine.replace(new RegExp(`\\b${brand}\\b`, "ig"), "");
    models.forEach(m => { 
      const safeModel = m.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      tempName = tempName.replace(new RegExp(`\\b${safeModel}\\b`, "ig"), ""); 
    });
    
    tempName = tempName.replace(/\/+/g, ' ').replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

    // Synonyms
    let displayName = tempName;
    PART_ALIASES.forEach(group => {
      const hasKeyword = group.keywords.some(k => new RegExp(`\\b${k}\\b`, "i").test(displayName));
      if (hasKeyword) {
        group.keywords.forEach(k => { displayName = displayName.replace(new RegExp(`\\b${k}\\b`, "gi"), ""); });
        displayName = `${group.seoTitle} ${displayName}`;
      }
    });
    
    // Clean numbers & spaces
    displayName = displayName.replace(/\b\d+\b/g, ''); 
    displayName = displayName.replace(/\s+/g, ' ').trim();

    // Grouping Key
    let groupingName = displayName.toLowerCase();
    POSITION_WORDS.forEach(word => { 
      groupingName = groupingName.replace(new RegExp(`\\b${word}\\b`, "gi"), ""); 
    });
    groupingName = groupingName.replace(/\d+/g, '').replace(/\s+/g, ' ').trim();

    const groupKey = brand + "___" + groupingName;

    if (!groups[groupKey]) {
      groups[groupKey] = {
        brand: brand,
        displayName: displayName, 
        models: new Set()
      };
    }
    models.forEach(m => groups[groupKey].models.add(m));
  });

  // Output formatting
  const resultList = [];
  for (const key in groups) {
    const data = groups[key];
    const modelArray = [...data.models];
    modelArray.sort();

    let modelText = "";
    if (modelArray.length > 0) {
      modelText = modelArray.join(' / ');
    } else {
      modelText = "Universal / Semua Motor";
    }

    const finalTitle = `${data.displayName} ${modelText} - ${data.brand}`;
    resultList.push(finalTitle);
  }

  return resultList;
}

// --- 4. MAIN UI LOGIC ---

document.addEventListener("DOMContentLoaded", () => {
    const btnGenerate = document.getElementById("btnGenerate");
    const outputContainer = document.getElementById("hasilDeskripsi"); 
    
    // Ubah Textarea output menjadi container Div jika masih textarea (Fallback)
    if (outputContainer && outputContainer.tagName === 'TEXTAREA') {
        const parent = outputContainer.parentNode;
        const newContainer = document.createElement('div');
        newContainer.id = "outputList";
        newContainer.className = "w-full space-y-4 mt-4";
        parent.replaceChild(newContainer, outputContainer);
    }
    
    const outputList = document.getElementById("outputList") || document.getElementById("hasilDeskripsi");

    if (btnGenerate) {
        btnGenerate.addEventListener("click", async () => {
            const rawInput = document.getElementById("namaProduk").value.trim();
            const catatanPentingCustom = document.getElementById("catatanPenting").value.trim();

            if (!rawInput) {
                showToast("Harap isi nama produk terlebih dahulu.", true);
                return;
            }

            // 1. GENERATE TITLES FIRST
            setLoading(true);
            try {
                const optimizedTitles = processProducts(rawInput);
                
                // Clear previous Output
                if(outputList) outputList.innerHTML = "";

                // 2. RENDER ROWS & QUEUE AI GENERATION
                if (optimizedTitles.length === 0) {
                    showToast("Tidak ada judul yang berhasil diproses.", true);
                    return;
                }

                // Create UI for each title
                for (const title of optimizedTitles) {
                    createResultCard(title, outputList);
                }

                // 3. START AI GENERATION SEQUENTIALLY
                // Kita gunakan loop for..of dengan await agar tidak terkena Rate Limit 
                const cards = document.querySelectorAll('.result-card');
                for (const card of cards) {
                    const title = card.dataset.title;
                    const descArea = card.querySelector('.desc-area');
                    const loader = card.querySelector('.row-loader');
                    
                    try {
                        // Tampilkan loading di baris ini
                        if(loader) loader.classList.remove('hidden');
                        
                        // Coba Gemini dulu
                        try {
                            const desc = await panggilGeminiAI(title, catatanPentingCustom);
                            descArea.value = desc;
                        } catch (geminiError) {
                            console.warn("Switching to Groq for:", title);
                            const finalGroqKey = manualGroqApiKey || groqApiKey;
                            if(finalGroqKey) {
                                const descGroq = await panggilGroqAI(title, catatanPentingCustom);
                                descArea.value = descGroq;
                            } else {
                                throw geminiError;
                            }
                        }
                    } catch (err) {
                        descArea.value = `Gagal generate: ${err.message}`;
                    } finally {
                        if(loader) loader.classList.add('hidden');
                    }
                    
                    // Delay kecil antar request agar aman
                    await new Promise(r => setTimeout(r, 1000));
                }

            } catch (error) {
                console.error(error);
                showToast("Terjadi kesalahan sistem: " + error.message, true);
            } finally {
                setLoading(false);
            }
        });
    }
});

function createResultCard(title, container) {
    const div = document.createElement('div');
    // Styling card disesuaikan dengan popup.html terbaru
    div.className = "result-card bg-white p-4 rounded shadow border border-gray-200 mb-4";
    div.dataset.title = title;
    
    div.innerHTML = `
        <div class="flex flex-col gap-2">
            <div class="flex justify-between items-start">
                <div class="w-full">
                    <label class="text-xs font-bold text-gray-500 uppercase">Judul Hasil Optimasi</label>
                    <div class="flex gap-2">
                        <input type="text" value="${title}" class="w-full p-2 border rounded bg-gray-50 text-sm font-semibold text-gray-800" readonly>
                        <button class="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 font-bold" onclick="copyText(this)">Copy</button>
                    </div>
                </div>
            </div>
            
            <div class="mt-2 relative">
                <label class="text-xs font-bold text-gray-500 uppercase flex justify-between">
                    <span>Deskripsi AI</span>
                    <span class="row-loader hidden text-blue-600 text-[10px]"><i class="fa-solid fa-spinner fa-spin"></i> Sedang menulis...</span>
                </label>
                <!-- Textarea untuk deskripsi (Lainnya) -->
                <textarea class="desc-area w-full h-40 p-2 border rounded text-sm mt-1 focus:ring-2 focus:ring-blue-500 bg-slate-50" placeholder="Menunggu antrian AI..."></textarea>
                <button class="absolute bottom-2 right-2 bg-slate-800 text-white px-3 py-1 rounded text-xs hover:bg-black opacity-90 hover:opacity-100 font-bold" onclick="copyTextArea(this)">Copy Deskripsi</button>
            </div>
        </div>
    `;
    container.appendChild(div);
}

// Global functions for inline onclick events (Fallback jika event delegation gagal)
window.copyText = function(btn) {
    const input = btn.previousElementSibling;
    input.select();
    document.execCommand("copy");
    const originalText = btn.innerText;
    btn.innerText = "Copied!";
    setTimeout(() => btn.innerText = originalText, 1500);
};

window.copyTextArea = function(btn) {
    const textarea = btn.previousElementSibling;
    textarea.select();
    document.execCommand("copy");
    const originalText = btn.innerText;
    btn.innerText = "Disalin!";
    setTimeout(() => btn.innerText = originalText, 1500);
};

// --- 5. AI LOGIC & HELPERS ---

function setLoading(isLoading) {
    const btnGenerate = document.getElementById("btnGenerate");
    const loadingOverlay = document.getElementById("loadingOverlay");
    
    if (isLoading) {
        if (btnGenerate) {
            btnGenerate.disabled = true;
            btnGenerate.innerHTML = `<div class="loader mr-2" style="display:inline-block; border: 3px solid #f3f3f3; border-radius: 50%; border-top: 3px solid #ffffff; width: 16px; height: 16px; animation: spin 1s linear infinite;"></div> Memproses...`;
            btnGenerate.classList.add('opacity-75', 'cursor-not-allowed');
        }
        if (loadingOverlay) loadingOverlay.classList.add("flex"); // Use flex to show
        if (loadingOverlay) loadingOverlay.classList.remove("hidden");
    } else {
        if (btnGenerate) {
            btnGenerate.disabled = false;
            btnGenerate.innerHTML = `<span>Proses & Generate</span> <i class="fa-solid fa-wand-magic-sparkles"></i>`;
            btnGenerate.classList.remove('opacity-75', 'cursor-not-allowed');
        }
        if (loadingOverlay) loadingOverlay.classList.remove("flex");
        if (loadingOverlay) loadingOverlay.classList.add("hidden");
    }
}

function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toastMsg");
    if (!toast || !toastMsg) return; 
    
    toastMsg.textContent = message;
    
    // Reset classes
    toast.className = "fixed bottom-16 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-xs font-medium transition-all duration-300 z-50 flex items-center gap-2 w-max";
    
    if(isError) {
        toast.classList.add("bg-red-600", "text-white");
    } else {
        toast.classList.add("bg-slate-800", "text-white");
    }
    
    // Show (remove hidden classes logic, use CSS class toggle)
    // Sesuai CSS di popup.html: opacity-0 translate-y-20 untuk hide
    toast.classList.remove("translate-y-20", "opacity-0");
    
    setTimeout(() => {
        toast.classList.add("translate-y-20", "opacity-0");
    }, 3000);
}

// Fungsi Fetch dengan Retry
async function fetchWithRetry(url, options, retries = 3, backoff = 1000) {
    try {
        const response = await fetch(url, options);
        if (response.status === 429 || response.status === 503) throw new Error(response.status.toString());
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
        return response;
    } catch (error) {
        const isRateLimit = error.message.includes("429") || error.message.includes("503");
        if (retries > 0 && isRateLimit) {
            console.warn(`Limit hit, retrying in ${backoff}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
        throw error;
    }
}

function generatePrompt(namaProduk, catatanCustom) {
    const catatanStandar = `
Catatan Penting (Mohon Dibaca)

• Harap periksa kembali kesesuaian produk dengan motor Anda. Kesalahan pembelian karena ketidakcocokan tipe motor di luar tanggung jawab kami.
• Kami selalu melakukan pengecekan kualitas sebelum barang dikirim.
• Wajib menyertakan Video Unboxing tanpa jeda (tanpa putus dari awal paket dibuka) jika ingin mengajukan komplain atau retur barang yang cacat atau tidak sesuai.
• Membeli berarti setuju dengan seluruh ketentuan dan kebijakan toko ${NAMA_TOKO}.

Terima kasih telah berbelanja di toko kami. Selamat berkendara dengan aman.
`;

    return `
Role: Anda adalah asisten toko online profesional untuk toko sparepart motor "${NAMA_TOKO}".
Tugas: Buatkan konten deskripsi produk Shopee.

Data Produk:
Nama Produk: ${namaProduk}
Toko: ${NAMA_TOKO}
Alamat: ${ALAMAT_TOKO}
Catatan Tambahan User: ${catatanCustom || "-"}

Instruksi Format PENTING:
1. JANGAN gunakan emoji apapun.
2. Gunakan bullet point "•" untuk daftar.
3. KUNCI: JANGAN MENULISKAN JUDUL PRODUK LAGI DI DALAM DESKRIPSI. Langsung mulai dengan "TENTANG PRODUK". Judul sudah ada di kolom terpisah.
4. JANGAN gunakan format Markdown (### untuk judul atau ** untuk tebal). Gunakan teks biasa. Gunakan HURUF KAPITAL untuk Judul Bagian.
5. PENTING: JANGAN BERI JARAK/SPASI BARIS KOSONG antara Judul Bagian dengan isi (bullet point). Rapatkan barisnya.

Struktur Deskripsi yang diminta (HANYA ISI DESKRIPSI):
1. TENTANG PRODUK
(Jelaskan definisi lengkap produk ini, fungsinya untuk apa, dan cara kerjanya secara detail dalam 1 paragraf yang informatif dan edukatif. Contoh gaya bahasa: "${namaProduk} adalah komponen yang berfungsi untuk...")

2. SPESIFIKASI DETAIL PRODUK (PENTING)
(Cari data teknis nyata produk ini. WAJIB mencantumkan detail ukuran/dimensi dengan angka. JANGAN GUNAKAN KALIMAT UMUM SEPERTI "Sesuai Standar").
Format:
• Model / Type: (Misal: MTX9 / CPR6EA-9)
• Voltase / Kapasitas: (Isi jika ada, Misal: 12V - 9Ah)
• Ukuran / Dimensi: (WAJIB CARI DATA ANGKA P x L x T dalam cm/mm. Contoh: 14cm x 8cm x 13.5cm)
• Part Number / Referensi: (Jika ada)

3. KECOCOKAN MOTOR
(Analisis dari nama produk, sebutkan daftar motor yang cocok secara spesifik. Jika tertulis Universal, tulis Universal).

4. KONDISI & KUALITAS
• Kondisi: Baru 100%
• Kualitas: OEM/Original Quality (Presisi)
• Material awet dan tahan lama

5. KEUNGGULAN BELANJA DI ${NAMA_TOKO}
• Stok Ready Siap Kirim
• Packing Aman (Bubble Wrap/Kardus Tebal)
• Pengiriman Cepat Setiap Hari

${catatanStandar}
`;
}

async function panggilGeminiAI(namaProduk, catatanCustom) {
    const finalKey = manualApiKey || apiKey; 
    if (!finalKey) throw new Error("API Key Gemini belum diset.");
    
    const prompt = generatePrompt(namaProduk, catatanCustom);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${finalKey}`;
    
    const response = await fetchWithRetry(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const json = await response.json();
    if (json.candidates?.[0]?.content?.parts?.[0]?.text) {
        return json.candidates[0].content.parts[0].text;
    }
    throw new Error("Respon Gemini kosong.");
}

async function panggilGroqAI(namaProduk, catatanCustom) {
    const finalKey = manualGroqApiKey || groqApiKey;
    if (!finalKey) throw new Error("API Key Groq belum diset.");

    const prompt = generatePrompt(namaProduk, catatanCustom);
    const url = "https://api.groq.com/openai/v1/chat/completions";

    const response = await fetchWithRetry(url, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${finalKey}`
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        })
    });

    const json = await response.json();
    if (json.choices?.[0]?.message?.content) {
        return json.choices[0].message.content;
    }
    throw new Error("Respon Groq kosong.");
}
