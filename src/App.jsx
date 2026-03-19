import { useState, useCallback, useRef } from "react";

const DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1PPUr-BeT1e4KrpLdfcfqXB2oFjQiCnqc?usp=drive_link";

/* ─────────────────────────────────────────
   ACCESS CODE — Change this before deploying
   Share this code privately with photographers
──────────────────────────────────────── */
const ACCESS_CODE = "ZAZI2025";

/* ─────────────────────────────────────────
   LOCATION DATA — Country → City → Region
──────────────────────────────────────── */
const LOCATIONS = {
  "South Africa": {
    flag: "🇿🇦",
    cities: {
      "Johannesburg": ["CBD","Soweto","Sandton","Maboneng Precinct","Braamfontein","Hillbrow","Alexandra Township","Yeoville","Newtown","Melville","Fordsburg","Diepsloot","Rosettenville","Orange Farm","Eldorado Park"],
      "Cape Town":    ["City Bowl","Woodstock","Khayelitsha","Mitchells Plain","Gugulethu","Observatory","Bo-Kaap","Langa","Athlone","Sea Point"],
      "Durban":       ["CBD","Umlazi","Chatsworth","Phoenix","Pinetown","Warwick","KwaMashu","Bluff"],
      "Pretoria":     ["CBD","Soshanguve","Mamelodi","Hatfield","Atteridgeville","Centurion"],
      "Port Elizabeth":["CBD","New Brighton","Motherwell","Gelvandale","Walmer"],
    }
  },
  "Nigeria": {
    flag: "🇳🇬",
    cities: {
      "Lagos":  ["Victoria Island","Surulere","Mushin","Oshodi","Ikeja","Lekki","Yaba","Agege","Apapa","Lagos Island"],
      "Abuja":  ["Garki","Wuse","Maitama","Gwarinpa","Asokoro","Kubwa"],
      "Kano":   ["Fagge","Nassarawa","Gwale","Dala","Tarauni"],
      "Ibadan": ["Bodija","Dugbe","Ring Road","Agodi","Mokola"],
    }
  },
  "Kenya": {
    flag: "🇰🇪",
    cities: {
      "Nairobi":  ["CBD","Kibera","Westlands","Eastleigh","Karen","Mathare","Kawangware","Kayole","Langata"],
      "Mombasa":  ["Old Town","Nyali","Likoni","Kisauni","Bamburi"],
      "Kisumu":   ["CBD","Kondele","Manyatta","Migosi"],
    }
  },
  "Ghana": {
    flag: "🇬🇭",
    cities: {
      "Accra":  ["Jamestown","Osu","Labadi","Nima","Tema","Adabraka","Kaneshie","Madina"],
      "Kumasi": ["Kejetia","Adum","Asafo","Suame","Manhyia"],
    }
  },
  "Ethiopia": {
    flag: "🇪🇹",
    cities: {
      "Addis Ababa": ["Piassa","Merkato","Bole","Kazanchis","Kirkos","Yeka","Arada"],
      "Dire Dawa":   ["Kezira","Legehare","Ganda Kore"],
    }
  },
  "Egypt": {
    flag: "🇪🇬",
    cities: {
      "Cairo":       ["Downtown","Zamalek","Heliopolis","Khan el-Khalili","Shubra","Imbaba","Maadi","Nasr City"],
      "Alexandria":  ["Montazah","Smouha","Miami","Sporting","El Raml"],
    }
  },
  "Senegal": {
    flag: "🇸🇳",
    cities: {
      "Dakar": ["Plateau","Medina","Yoff","Ouakam","Parcelles Assainies","Pikine","Guédiawaye"],
    }
  },
  "Tanzania": {
    flag: "🇹🇿",
    cities: {
      "Dar es Salaam": ["CBD","Kariakoo","Kinondoni","Ilala","Temeke","Kigamboni"],
      "Zanzibar":      ["Stone Town","Nungwi","Paje"],
    }
  },
  "Uganda": {
    flag: "🇺🇬",
    cities: {
      "Kampala": ["CBD","Kabalagala","Wandegeya","Makindye","Kawempe","Nakawa","Rubaga"],
    }
  },
  "Zimbabwe": {
    flag: "🇿🇼",
    cities: {
      "Harare":    ["CBD","Mbare","Avondale","Highfield","Glen View","Kuwadzana"],
      "Bulawayo":  ["CBD","Makokoba","Nkulumane","Pumula"],
    }
  },
  "Morocco": {
    flag: "🇲🇦",
    cities: {
      "Casablanca": ["Derb Sultan","Hay Mohammadi","Ain Chock","Sidi Bernoussi","Maarif","Ain Sebaa"],
      "Marrakech":  ["Medina","Gueliz","Mellah","Bab Doukkala","Hivernage"],
      "Rabat":      ["Medina","Agdal","Hassan","Akkari","Youssoufia"],
    }
  },
  "Cameroon": {
    flag: "🇨🇲",
    cities: {
      "Douala":  ["Akwa","Bali","Bonaberi","Deido","New Bell","Ndokotti"],
      "Yaoundé": ["Bastos","Mvan","Mvog-Mbi","Essos","Biyem-Assi"],
    }
  },
  "Côte d'Ivoire": {
    flag: "🇨🇮",
    cities: {
      "Abidjan": ["Plateau","Treichville","Adjamé","Yopougon","Cocody","Abobo","Marcory"],
    }
  },
  "DR Congo": {
    flag: "🇨🇩",
    cities: {
      "Kinshasa": ["Gombe","Lingwala","Kintambo","Kalamu","Lemba","Ndjili","Masina","Barumbu"],
      "Lubumbashi": ["Kamalondo","Kampemba","Katuba","Kenya","Annexe"],
    }
  },
  "Mozambique": {
    flag: "🇲🇿",
    cities: {
      "Maputo":  ["Baixa","Polana","Maxaquene","Urbanização","Malhangalene","Chamanculo"],
      "Beira":   ["Macuti","Munhava","Chipangara","Goto"],
    }
  },
  "Angola": {
    flag: "🇦🇴",
    cities: {
      "Luanda":   ["Ingombota","Maianga","Rangel","Cazenga","Viana","Cacuaco","Kilamba Kiaxi"],
      "Huambo":   ["Huambo City","Catchiungo","Ecunha"],
    }
  },
  "Rwanda": {
    flag: "🇷🇼",
    cities: {
      "Kigali": ["Nyarugenge","Gasabo","Kicukiro","Kimironko","Remera","Gikondo"],
    }
  },
  "Zambia": {
    flag: "🇿🇲",
    cities: {
      "Lusaka":     ["CBD","Kalingalinga","Chibolya","Garden","Mtendere","Chelstone","Kanyama"],
      "Livingstone": ["Dambwa","Maramba","Libuyu","Linda"],
    }
  },
};

/* ─────────────────────────────────────────
   DATASETS
──────────────────────────────────────── */
const DATASETS = {
  street: {
    label: "Street Photography", trigger: "streetlora",
    color: "#e8a84c", icon: "🏙",
    sections: [
      { id: "elements", label: "Street Elements", multi: true,
        chips: ["minibus taxi rank","street vendors","spaza shop","street art / murals",
                "hand-painted signage","informal traders","pedestrian crowds",
                "hawker stalls","children playing","empty street","waste / litter"] },
      { id: "lighting", label: "Lighting", required: true,
        chips: ["harsh midday sun","golden hour warm light","overcast diffused",
                "blue hour / dusk","night artificial lighting","dawn / sunrise","dusty haze backlight"] },
      { id: "mood", label: "Mood / Atmosphere",
        chips: ["vibrant and busy","quiet and still","gritty urban energy",
                "warm community feel","chaotic and dynamic","industrial and stark","hopeful","melancholic"] }
    ]
  },
  architecture: {
    label: "Architecture", trigger: "archlora",
    color: "#7eb8d4", icon: "🏛",
    sections: [
      { id: "style", label: "Architectural Style", required: true, multi: true,
        chips: ["brutalist concrete","colonial","modernist","art deco","vernacular",
                "industrial warehouse","RDP / social housing","corrugated iron",
                "glass curtain wall","heritage / Victorian"] },
      { id: "materials", label: "Primary Materials", multi: true,
        chips: ["exposed concrete","red brick","painted plaster","steel and glass",
                "corrugated iron","clay / earth","timber","stone","terracotta tiles"] },
      { id: "condition", label: "Building Condition",
        chips: ["pristine / new","well maintained","weathered patina",
                "decaying / abandoned","under construction","repurposed / adaptive reuse"] },
      { id: "lighting", label: "Lighting", required: true,
        chips: ["harsh midday sun","golden hour","soft overcast","dramatic shadow",
                "blue hour","night / artificial","interior natural light"] },
      { id: "mood", label: "Mood",
        chips: ["monumental","intimate","derelict","utopian","organic","oppressive","serene"] }
    ]
  },
  portraiture: {
    label: "Portraiture", trigger: "portraitlora",
    color: "#c47eb5", icon: "🧑",
    sections: [
      { id: "setting", label: "Setting / Environment", required: true,
        chips: ["outdoor street","market / informal","indoor natural light",
                "studio","workplace","home interior","township","urban rooftop","rural"] },
      { id: "subject", label: "Subject", multi: true,
        chips: ["elderly person","young adult","child","group of people",
                "vendor / trader","artist","community leader","worker"] },
      { id: "expression", label: "Expression / Emotion",
        chips: ["candid unaware","direct eye contact","laughing / joyful",
                "pensive / reflective","stern","intimate","proud"] },
      { id: "lighting", label: "Lighting", required: true,
        chips: ["soft window light","harsh sun","golden hour","studio strobe",
                "backlit silhouette","ambient indoor","overcast flat","mixed available"] },
      { id: "framing", label: "Framing",
        chips: ["close-up face","head and shoulders","half body","full body","environmental portrait"] },
      { id: "mood", label: "Mood",
        chips: ["intimate","powerful","documentary","editorial","raw / unpolished","dignified","playful"] }
    ]
  },
  market: {
    label: "Markets & Informal Economy", trigger: "marketlora",
    color: "#7ed49a", icon: "🛒",
    sections: [
      { id: "goods", label: "Goods / Trade", multi: true,
        chips: ["fresh produce","clothing and fabrics","street food","electronics",
                "traditional medicine / muthi","hardware","crafts and art","second-hand goods"] },
      { id: "crowd", label: "Crowd Density",
        chips: ["empty / slow","sparse","moderate","dense and busy","extremely crowded"] },
      { id: "lighting", label: "Lighting", required: true,
        chips: ["harsh midday","golden hour","overcast","artificial market lights","covered / shaded"] },
      { id: "mood", label: "Mood",
        chips: ["vibrant and colourful","chaotic energy","orderly","intimate","gritty","festive"] }
    ]
  },
  landscape: {
    label: "Landscape & Environment", trigger: "landscapelora",
    color: "#a8c47e", icon: "🌍",
    sections: [
      { id: "terrain", label: "Terrain Features", multi: true,
        chips: ["flat grassland","rocky outcrop","mine dump","informal settlement edge",
                "industrial zone","wetland","road / highway","open sky dominant",
                "coastal","mountain","desert","forest / bush"] },
      { id: "time", label: "Time of Day", required: true,
        chips: ["sunrise / dawn","morning","midday","afternoon","golden hour","sunset","blue hour","night"] },
      { id: "weather", label: "Weather / Atmosphere",
        chips: ["clear blue sky","dramatic clouds","overcast grey","haze / smog",
                "dust storm","rain / wet","storm approaching","fog / mist"] },
      { id: "mood", label: "Mood",
        chips: ["vast and open","intimate","harsh","lyrical","melancholic","hopeful","raw"] }
    ]
  }
};

/* ─────────────────────────────────────────
   HELPERS
──────────────────────────────────────── */
const emptyLocState = () => ({
  country: "", city: "", region: "",
  country_other: "", city_other: "", region_other: "",
  other_on: false
});

const emptyState = (dsKey) => {
  const ds = DATASETS[dsKey];
  const obj = { _dataset: dsKey };
  ds.sections.forEach(s => {
    obj[s.id] = s.multi ? [] : "";
    obj[`${s.id}_other`] = "";
    obj[`${s.id}_other_on`] = false;
  });
  obj.notes = "";
  return obj;
};

const assembleCaption = (state, locState) => {
  if (!state) return "";
  const ds = DATASETS[state._dataset];
  const parts = [ds.trigger];

  // Location parts
  const country = locState.other_on && locState.country_other ? locState.country_other : locState.country;
  const city    = locState.other_on && locState.city_other    ? locState.city_other    : locState.city;
  const region  = locState.other_on && locState.region_other  ? locState.region_other  : locState.region;
  if (country) parts.push(country);
  if (city && city !== country) parts.push(city);
  if (region) parts.push(region);

  ds.sections.forEach(s => {
    if (s.multi) parts.push(...(state[s.id] || []));
    else if (state[s.id]) parts.push(state[s.id]);
    if (state[`${s.id}_other_on`] && state[`${s.id}_other`]?.trim())
      parts.push(state[`${s.id}_other`].trim());
  });
  if (state.notes?.trim()) parts.push(state.notes.trim());
  return parts.filter(Boolean).join(", ");
};

const isDone = (state, locState) => {
  if (!state || !locState) return false;
  const ds = DATASETS[state._dataset];

  // Has location (minimum requirement)
  const hasLoc = !!(locState.country || (locState.other_on && locState.country_other));
  if (!hasLoc) return false;

  // Count how many fields have any value across all sections
  let filledFields = 0;
  ds.sections.forEach(s => {
    const val = state[s.id];
    const other = state[`${s.id}_other_on`] && state[`${s.id}_other`]?.trim();
    if (other) filledFields++;
    else if (s.multi && val?.length > 0) filledFields++;
    else if (!s.multi && !!val) filledFields++;
  });
  if (state.notes?.trim()) filledFields++;

  // Count as captioned if location + at least 1 other field filled
  return filledFields >= 1;
};

// Full completion check — used for ZIP quality indicator
const isFullyDone = (state, locState) => {
  if (!state || !locState) return false;
  const ds = DATASETS[state._dataset];
  const hasLoc = !!(locState.country || (locState.other_on && locState.country_other));
  const sectsDone = ds.sections.filter(s => s.required).every(s => {
    const val = state[s.id];
    const other = state[`${s.id}_other_on`] && state[`${s.id}_other`]?.trim();
    return other || (s.multi ? val?.length > 0 : !!val);
  });
  return hasLoc && sectsDone;
};

/* ─────────────────────────────────────────
   CSS
──────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .onboard {
    height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #0f0e0e; font-family: 'Syne', sans-serif;
  }
  .onboard-card {
    background: #131110; border: 1px solid #1e1c1a; border-radius: 14px;
    padding: 40px 36px; width: 420px; display: flex; flex-direction: column; gap: 20px;
  }
  .onboard-logo { font-size: 22px; font-weight: 800; color: #e8dfd4; letter-spacing: -.02em; }
  .onboard-logo span { color: #e8a84c; }
  .onboard-logo-sub { font-size: 11px; color: #403830; margin-top: -14px; letter-spacing: .08em; text-transform: uppercase; }
  .onboard-sub { font-size: 13px; color: #504840; line-height: 1.7; }
  .onboard-field { display: flex; flex-direction: column; gap: 7px; }
  .onboard-label { font-size: 10px; font-weight: 700; color: #504840; text-transform: uppercase; letter-spacing: .09em; }
  .onboard-input {
    background: #0f0e0e; border: 1px solid #1e1c1a; color: #e8dfd4;
    border-radius: 7px; font-family: 'Syne', sans-serif; font-size: 13px;
    padding: 10px 13px; outline: none; transition: border-color .15s; width: 100%;
  }
  .onboard-input:focus { border-color: #e8a84c; }
  .onboard-privacy {
    display: flex; gap: 10px; align-items: flex-start;
    background: #0f0e0e; border: 1px solid #1a1917; border-radius: 8px; padding: 12px;
  }
  .onboard-privacy-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .onboard-privacy-text { font-size: 11px; color: #403830; line-height: 1.7; }
  .onboard-btn {
    padding: 12px; background: #e8a84c; border: none; color: #111;
    border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 14px;
    font-weight: 800; cursor: pointer; transition: background .15s; margin-top: 4px;
  }
  .onboard-btn:hover:not(:disabled) { background: #f0bc6a; }
  .onboard-btn:disabled { opacity: .4; cursor: not-allowed; }

  .back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 12px; background: transparent; border: 1px solid #1e1c1a;
    color: #504840; border-radius: 6px; font-family: 'Syne', sans-serif;
    font-size: 11px; cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .back-btn:hover { border-color: #504840; color: #e8dfd4; }

  .edit-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.88);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; font-family: 'Syne', sans-serif;
  }
  .edit-card {
    background: #131110; border: 1px solid #1e1c1a; border-radius: 12px;
    padding: 28px; width: 360px; display: flex; flex-direction: column; gap: 16px;
  }
  .edit-title { font-size: 16px; font-weight: 800; color: #e8dfd4; }
  .edit-field { display: flex; flex-direction: column; gap: 7px; }
  .edit-label { font-size: 10px; font-weight: 700; color: #504840; text-transform: uppercase; letter-spacing: .09em; }
  .edit-input {
    background: #0f0e0e; border: 1px solid #1e1c1a; color: #e8dfd4;
    border-radius: 7px; font-family: 'Syne', sans-serif; font-size: 13px;
    padding: 10px 13px; outline: none; transition: border-color .15s; width: 100%;
  }
  .edit-input:focus { border-color: #e8a84c; }
  .edit-actions { display: flex; gap: 8px; }
  .edit-cancel {
    flex: 1; padding: 9px; background: transparent; border: 1px solid #1e1c1a;
    color: #504840; border-radius: 6px; font-family: 'Syne', sans-serif;
    font-size: 12px; cursor: pointer; transition: all .15s;
  }
  .edit-cancel:hover { border-color: #504840; color: #e8dfd4; }
  .edit-save {
    flex: 2; padding: 9px; background: #e8a84c; border: none; color: #111;
    border-radius: 6px; font-family: 'Syne', sans-serif; font-size: 12px;
    font-weight: 800; cursor: pointer; transition: background .15s;
  }
  .edit-save:hover:not(:disabled) { background: #f0bc6a; }
  .edit-save:disabled { opacity: .4; cursor: not-allowed; }

  .upload-screen {
    height: 100vh; display: flex; flex-direction: column;
    background: #0f0e0e; font-family: 'Syne', sans-serif; transition: background .2s;
  }
  .upload-screen.drag-over { background: #131110; }
  .upload-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 16px; border-bottom: 1px solid #1a1917; flex-shrink: 0;
  }
  .upload-topbar-name { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #504840; }
  .upload-topbar-name span { color: #e8a84c; font-weight: 700; }
  .edit-name-btn {
    padding: 3px 8px; background: transparent; border: 1px solid #1e1c1a;
    color: #403830; border-radius: 4px; font-family: 'Syne', sans-serif;
    font-size: 10px; cursor: pointer; transition: all .15s;
  }
  .edit-name-btn:hover { border-color: #504840; color: #e8dfd4; }
  .upload-body { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
  .upload-drop-zone {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    border: 2px dashed #1e1c1a; border-radius: 16px; padding: 48px 60px;
    cursor: pointer; transition: border-color .2s; text-align: center;
  }
  .upload-drop-zone:hover, .upload-screen.drag-over .upload-drop-zone { border-color: #e8a84c; }
  .upload-icon { font-size: 48px; line-height: 1; }
  .upload-title { font-size: 22px; font-weight: 800; color: #e8dfd4; }
  .upload-sub { font-size: 12px; color: #403830; }
  .upload-divider { font-size: 11px; color: #2c2820; }
  .upload-btns { display: flex; gap: 10px; }
  .upload-btn { padding: 8px 18px; border-radius: 7px; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; transition: all .15s; }
  .upload-btn-files { background: #e8a84c; border: none; color: #111; }
  .upload-btn-files:hover { background: #f0bc6a; }
  .upload-btn-folder { background: transparent; border: 1px solid #2a2825; color: #504840; }
  .upload-btn-folder:hover { border-color: #e8a84c; color: #e8a84c; }

  .app { font-family: 'Syne', sans-serif; background: #0f0e0e; color: #e8dfd4; height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 16px; border-bottom: 1px solid #1a1917;
    background: #0f0e0e; flex-shrink: 0; gap: 12px;
  }
  .logo { font-size: 14px; font-weight: 800; color: #e8dfd4; letter-spacing: -.02em; white-space: nowrap; }
  .logo span { color: #e8a84c; }
  .hdr-mid { display: flex; align-items: center; gap: 10px; flex: 1; justify-content: center; }
  .progress-text { font-size: 11px; color: #403830; white-space: nowrap; }
  .progress-bar-bg { width: 90px; height: 3px; background: #1a1917; border-radius: 3px; }
  .progress-bar-fill { height: 100%; border-radius: 3px; transition: width .3s; }
  .hdr-right { display: flex; gap: 7px; align-items: center; }
  .photographer-tag {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: #504840; padding: 4px 10px;
    border: 1px solid #1e1c1a; border-radius: 20px; white-space: nowrap; cursor: pointer; transition: all .15s;
  }
  .photographer-tag:hover { border-color: #504840; color: #e8dfd4; }
  .photographer-tag span { color: #e8a84c; font-weight: 700; }
  .photographer-tag-edit { font-size: 9px; color: #2c2820; }
  .dl-btn {
    padding: 5px 14px; background: #e8a84c; border: none; color: #111;
    border-radius: 5px; font-family: 'Syne', sans-serif; font-size: 11px;
    font-weight: 800; cursor: pointer; transition: background .15s; white-space: nowrap;
  }
  .dl-btn:hover:not(:disabled) { background: #f0bc6a; }
  .dl-btn:disabled { opacity: .4; cursor: not-allowed; }

  .body { flex: 1; min-height: 0; display: flex; overflow: hidden; }
  .img-panel { width: 52%; display: flex; flex-direction: column; border-right: 1px solid #1a1917; overflow: hidden; }
  .img-wrap { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; background: #080707; overflow: hidden; }
  .main-img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }
  .img-footer { padding: 7px 13px; border-top: 1px solid #1a1917; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .img-name { font-size: 10px; color: #2c2820; font-family: 'JetBrains Mono', monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px; }
  .img-actions { display: flex; align-items: center; gap: 7px; }
  .img-nav { display: flex; align-items: center; gap: 7px; }
  .nav-btn {
    padding: 4px 9px; background: #131110; border: 1px solid #1e1c1a;
    color: #e8dfd4; border-radius: 4px; font-family: 'Syne', sans-serif;
    font-size: 11px; cursor: pointer; transition: all .15s;
  }
  .nav-btn:hover:not(:disabled) { border-color: #e8a84c; color: #e8a84c; }
  .nav-btn:disabled { opacity: .2; cursor: default; }
  .nav-count { font-size: 11px; color: #403830; white-space: nowrap; }
  .delete-btn {
    padding: 4px 9px; background: #131110; border: 1px solid #1e1c1a;
    color: #e07070; border-radius: 4px; font-family: 'Syne', sans-serif;
    font-size: 11px; cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .delete-btn:hover { border-color: #e07070; background: rgba(224,112,112,.08); }

  .ds-bar {
    padding: 8px 13px; border-bottom: 1px solid #1a1917;
    display: flex; gap: 5px; align-items: center; flex-shrink: 0;
    overflow-x: auto; scrollbar-width: none;
  }
  .ds-bar::-webkit-scrollbar { display: none; }
  .ds-bar-label { font-size: 9px; color: #403830; white-space: nowrap; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin-right: 2px; }
  .ds-chip {
    display: flex; align-items: center; gap: 4px;
    padding: 4px 9px; background: #131110; border: 1px solid #1e1c1a;
    color: #403830; border-radius: 20px; font-family: 'Syne', sans-serif;
    font-size: 10px; cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .ds-chip:hover { border-color: #504840; color: #e8dfd4; }

  .form-panel { width: 48%; display: flex; flex-direction: column; overflow: hidden; }
  .form-scroll {
    flex: 1; min-height: 0; overflow-y: auto; padding: 14px;
    display: flex; flex-direction: column; gap: 14px;
    scrollbar-width: thin; scrollbar-color: #1e1c1a transparent;
  }
  .field { display: flex; flex-direction: column; gap: 7px; }
  .label { font-size: 9px; font-weight: 700; color: #504840; text-transform: uppercase; letter-spacing: .1em; display: flex; align-items: center; gap: 5px; }
  .req { font-size: 10px; }
  .multi-hint { font-size: 9px; color: #2c2820; font-weight: 400; text-transform: none; letter-spacing: 0; }
  .done-badge {
    margin-left: auto; display: inline-flex; align-items: center; gap: 3px;
    font-size: 9px; color: #5aaa7a; padding: 1px 6px;
    background: rgba(90,170,122,.08); border: 1px solid rgba(90,170,122,.2);
    border-radius: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
  }

  /* ── Location section ── */
  .loc-section { display: flex; flex-direction: column; gap: 8px; }
  .loc-header { display: flex; align-items: center; justify-content: space-between; }
  .loc-lock {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; color: #504840; cursor: pointer; user-select: none;
    padding: 3px 8px; border: 1px solid #1e1c1a; border-radius: 20px;
    transition: all .15s;
  }
  .loc-lock:hover { border-color: #504840; color: #e8dfd4; }
  .loc-lock.locked { border-color: #e8a84c55; color: #e8a84c; background: #e8a84c10; }
  .loc-lock-dot { width: 7px; height: 7px; border-radius: 50%; background: #2c2820; transition: background .15s; }
  .loc-lock.locked .loc-lock-dot { background: #e8a84c; }
  .loc-row { display: flex; gap: 7px; }
  .loc-select {
    flex: 1; background: #131110; border: 1px solid #1e1c1a; color: #e8dfd4;
    border-radius: 6px; font-family: 'Syne', sans-serif; font-size: 11px;
    padding: 7px 10px; outline: none; transition: border-color .15s; cursor: pointer;
    appearance: none; -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23504840'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center;
    padding-right: 28px;
  }
  .loc-select:focus { border-color: #e8a84c; }
  .loc-select:disabled { opacity: .35; cursor: not-allowed; }
  .loc-select option { background: #1a1917; }
  .loc-other-row { display: flex; gap: 7px; margin-top: 2px; }
  .loc-other-btn {
    padding: 5px 10px; background: #131110; border: 1px dashed #1e1c1a;
    color: #2c2820; border-radius: 6px; font-family: 'Syne', sans-serif;
    font-size: 10px; cursor: pointer; transition: all .15s; white-space: nowrap; flex-shrink: 0;
  }
  .loc-other-btn:hover { border-color: #504840; color: #e8dfd4; }
  .loc-other-btn.on { border-style: solid; border-color: #e8a84c55; color: #e8a84c; }
  .loc-other-input {
    flex: 1; background: #131110; border: 1px solid #1e1c1a; color: #e8dfd4;
    border-radius: 6px; font-family: 'Syne', sans-serif; font-size: 11px;
    padding: 5px 9px; outline: none; transition: border-color .15s; min-width: 0;
  }
  .loc-other-input:focus { border-color: #e8a84c; }
  .loc-locked-display {
    background: #0f0e0e; border: 1px solid #e8a84c22; border-radius: 6px;
    padding: 8px 12px; font-size: 11px; color: #e8a84c;
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
  }
  .loc-locked-display-text { display: flex; align-items: center; gap: 6px; }
  .loc-unlock-btn {
    font-size: 10px; color: #504840; background: transparent; border: none;
    cursor: pointer; padding: 0; font-family: 'Syne', sans-serif; transition: color .15s;
    white-space: nowrap;
  }
  .loc-unlock-btn:hover { color: #e8dfd4; }

  .chips { display: flex; flex-wrap: wrap; gap: 4px; }
  .chip {
    padding: 4px 9px; background: #131110; border: 1px solid #1e1c1a;
    color: #403830; border-radius: 20px; font-family: 'Syne', sans-serif;
    font-size: 10px; cursor: pointer; transition: all .15s; line-height: 1.5;
  }
  .chip:hover { border-color: #504840; color: #e8dfd4; }
  .other-row { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
  .other-toggle {
    padding: 4px 9px; background: #131110; border: 1px dashed #1e1c1a;
    color: #2c2820; border-radius: 20px; font-family: 'Syne', sans-serif;
    font-size: 10px; cursor: pointer; transition: all .15s;
    line-height: 1.5; white-space: nowrap; flex-shrink: 0;
  }
  .other-toggle:hover { border-color: #504840; color: #e8dfd4; }
  .other-input {
    flex: 1; background: #131110; border: 1px solid #1e1c1a; color: #e8dfd4;
    border-radius: 6px; font-family: 'Syne', sans-serif; font-size: 11px;
    padding: 5px 9px; outline: none; transition: border-color .15s; min-width: 0;
  }
  .other-input:focus { border-color: #e8a84c; }
  .notes-input {
    background: #131110; border: 1px solid #1a1917; color: #e8dfd4;
    border-radius: 6px; font-family: 'Syne', sans-serif; font-size: 11px;
    padding: 7px 10px; outline: none; transition: border-color .15s;
    resize: none; line-height: 1.6; width: 100%;
  }
  .notes-input:focus { border-color: #e8a84c; }
  .divider { border: none; border-top: 1px solid #1a1917; }
  .preview { background: #080707; border: 1px solid #1a1917; border-radius: 7px; padding: 11px; }
  .preview-label { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 7px; }
  .preview-text { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #605040; line-height: 1.8; word-break: break-all; }
  .preview-text .trigger { font-weight: 600; }

  .thumb-strip {
    display: flex; gap: 4px; padding: 6px 10px;
    background: #080707; border-top: 1px solid #1a1917;
    overflow-x: auto; flex-shrink: 0;
    scrollbar-width: thin; scrollbar-color: #1e1c1a transparent;
    height: 68px; align-items: center;
  }
  .thumb-wrap { position: relative; flex-shrink: 0; }
  .thumb {
    width: 50px; height: 50px; border-radius: 4px; overflow: hidden;
    border: 2px solid transparent; cursor: pointer; background: #131110;
    padding: 0; transition: border-color .15s; display: block;
  }
  .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .thumb:hover { border-color: #504840; }
  .done-dot {
    position: absolute; bottom: 2px; right: 2px; width: 13px; height: 13px;
    background: #5aaa7a; color: white; border-radius: 50%; font-size: 7px;
    display: flex; align-items: center; justify-content: center; font-weight: 900; pointer-events: none;
  }
  .thumb-delete {
    position: absolute; top: -5px; right: -5px;
    width: 16px; height: 16px; background: #e07070; border: none;
    border-radius: 50%; color: white; font-size: 9px; font-weight: 900;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity .15s; line-height: 1; padding: 0;
  }
  .thumb-wrap:hover .thumb-delete { opacity: 1; }
  .thumb-add {
    flex-shrink: 0; width: 50px; height: 50px; border-radius: 4px;
    border: 1px dashed #2a2825; background: transparent; color: #403830;
    font-size: 20px; cursor: pointer; transition: all .15s;
    display: flex; align-items: center; justify-content: center;
  }
  .thumb-add:hover { border-color: #e8a84c; color: #e8a84c; }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.88);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; font-family: 'Syne', sans-serif;
  }
  .modal {
    background: #131110; border: 1px solid #1e1c1a; border-radius: 14px;
    padding: 32px; width: 420px; display: flex; flex-direction: column; gap: 18px;
  }
  .modal-title { font-size: 18px; font-weight: 800; color: #e8dfd4; }
  .modal-stats {
    background: #0f0e0e; border: 1px solid #1a1917;
    border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; gap: 7px;
  }
  .modal-stat { display: flex; justify-content: space-between; font-size: 12px; }
  .modal-stat-label { color: #504840; }
  .modal-stat-value { color: #e8dfd4; font-weight: 700; }
  .steps { display: flex; flex-direction: column; }
  .step { display: flex; gap: 12px; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #1a1917; }
  .step:last-child { border-bottom: none; }
  .step-num {
    width: 22px; height: 22px; border-radius: 50%;
    background: #1e1c1a; color: #e8a84c; font-size: 11px;
    font-weight: 800; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 1px;
  }
  .step-num.done { background: rgba(90,170,122,.15); color: #5aaa7a; }
  .step-content { display: flex; flex-direction: column; gap: 4px; }
  .step-title { font-size: 12px; font-weight: 700; color: #e8dfd4; }
  .step-sub { font-size: 11px; color: #504840; line-height: 1.6; }
  .modal-actions { display: flex; gap: 8px; flex-direction: column; }
  .modal-cancel {
    padding: 10px; background: transparent; border: 1px solid #1e1c1a;
    color: #504840; border-radius: 7px; font-family: 'Syne', sans-serif;
    font-size: 12px; cursor: pointer; transition: all .15s;
  }
  .modal-cancel:hover { border-color: #504840; color: #e8dfd4; }
  .modal-dl-btn {
    padding: 10px; background: #e8a84c; border: none; color: #111;
    border-radius: 7px; font-family: 'Syne', sans-serif; font-size: 12px;
    font-weight: 800; cursor: pointer; transition: background .15s;
  }
  .modal-dl-btn:hover:not(:disabled) { background: #f0bc6a; }
  .modal-dl-btn:disabled { opacity: .4; cursor: not-allowed; }
  .drive-btn {
    padding: 10px; background: transparent; border: 1px solid #1e6aff44; color: #6aa3ff;
    border-radius: 7px; font-family: 'Syne', sans-serif; font-size: 12px;
    font-weight: 700; cursor: pointer; transition: all .15s;
    display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .drive-btn:hover { background: #1e6aff11; border-color: #6aa3ff; }

  .delete-confirm-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.88);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; font-family: 'Syne', sans-serif;
  }
  .delete-confirm {
    background: #131110; border: 1px solid #2a2825; border-radius: 12px;
    padding: 24px; width: 340px; display: flex; flex-direction: column; gap: 14px;
  }
  .delete-confirm-title { font-size: 15px; font-weight: 800; color: #e8dfd4; }
  .delete-confirm-sub { font-size: 12px; color: #504840; line-height: 1.6; }
  .delete-confirm-actions { display: flex; gap: 8px; }
  .delete-no {
    flex: 1; padding: 9px; background: transparent; border: 1px solid #1e1c1a;
    color: #504840; border-radius: 6px; font-family: 'Syne', sans-serif;
    font-size: 12px; cursor: pointer; transition: all .15s;
  }
  .delete-no:hover { border-color: #504840; color: #e8dfd4; }
  .delete-yes {
    flex: 1; padding: 9px; background: rgba(224,112,112,.15);
    border: 1px solid #e0707044; color: #e07070;
    border-radius: 6px; font-family: 'Syne', sans-serif;
    font-size: 12px; font-weight: 700; cursor: pointer; transition: all .15s;
  }
  .delete-yes:hover { background: rgba(224,112,112,.25); }

  .done-screen {
    height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: #0f0e0e; font-family: 'Syne', sans-serif;
    gap: 14px; text-align: center; padding: 24px;
  }
  .done-icon { font-size: 54px; line-height: 1; }
  .done-title { font-size: 26px; font-weight: 800; color: #e8dfd4; }
  .done-sub { font-size: 13px; color: #504840; max-width: 360px; line-height: 1.8; }
  .done-reminder {
    background: #131110; border: 1px solid #1e1c1a; border-radius: 10px;
    padding: 16px 20px; max-width: 360px; display: flex; flex-direction: column; gap: 8px;
  }
  .done-reminder-title { font-size: 11px; font-weight: 700; color: #e8a84c; text-transform: uppercase; letter-spacing: .08em; }
  .done-reminder-text { font-size: 12px; color: #504840; line-height: 1.7; }
  .done-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .done-drive-btn {
    padding: 12px 24px; background: transparent; border: 1px solid #1e6aff55; color: #6aa3ff;
    border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 13px;
    font-weight: 700; cursor: pointer; transition: all .15s;
  }
  .done-drive-btn:hover { background: #1e6aff11; border-color: #6aa3ff; }
  .done-back-btn {
    padding: 12px 24px; background: transparent; border: 1px solid #1e1c1a; color: #504840;
    border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 13px;
    cursor: pointer; transition: all .15s;
  }
  .done-back-btn:hover { border-color: #504840; color: #e8dfd4; }
  .watermark-footer {
    text-align: center; padding: 5px 0; font-size: 9px; color: #252320;
    font-family: 'JetBrains Mono', monospace; letter-spacing: .06em;
    border-top: 1px solid #131110; background: #0a0909; flex-shrink: 0;
    user-select: none; pointer-events: none;
  }

`;

/* ─────────────────────────────────────────
   LOCATION SECTION COMPONENT
──────────────────────────────────────── */
function LocationSection({ locState, setLocState, locLocked, setLocLocked, accent }) {
  const countries = Object.keys(LOCATIONS);
  const cities    = locState.country && LOCATIONS[locState.country]
    ? Object.keys(LOCATIONS[locState.country].cities) : [];
  const regions   = locState.country && locState.city && LOCATIONS[locState.country]?.cities[locState.city]
    ? LOCATIONS[locState.country].cities[locState.city] : [];

  const upd = (fields) => setLocState(p => ({ ...p, ...fields }));

  const hasLoc = !!(locState.country || (locState.other_on && locState.country_other));

  // When locked show a summary badge instead of the full dropdowns
  if (locLocked && hasLoc) {
    const display = [
      locState.other_on ? locState.country_other : locState.country,
      locState.other_on ? locState.city_other    : locState.city,
      locState.other_on ? locState.region_other  : locState.region,
    ].filter(Boolean).join(" · ");
    return (
      <div className="loc-section">
        <div className="loc-header">
          <label className="label">
            Location <span className="req" style={{ color: accent }}>*</span>
            <span className="done-badge">✓ locked</span>
          </label>
        </div>
        <div className="loc-locked-display">
          <div className="loc-locked-display-text">📍 {display}</div>
          <button className="loc-unlock-btn" onClick={() => setLocLocked(false)}>change</button>
        </div>
      </div>
    );
  }

  return (
    <div className="loc-section">
      <div className="loc-header">
        <label className="label">
          Location <span className="req" style={{ color: accent }}>*</span>
          {hasLoc && <span className="done-badge">✓</span>}
        </label>
        {hasLoc && (
          <div
            className={`loc-lock${locLocked ? " locked" : ""}`}
            onClick={() => setLocLocked(!locLocked)}
            title="Lock location across all images"
          >
            <div className="loc-lock-dot" />
            {locLocked ? "Locked" : "Lock for all images"}
          </div>
        )}
      </div>

      {!locState.other_on ? (
        <>
          <div className="loc-row">
            {/* Country */}
            <select className="loc-select" value={locState.country}
              onChange={e => upd({ country: e.target.value, city: "", region: "" })}>
              <option value="">Country…</option>
              {countries.map(c => (
                <option key={c} value={c}>{LOCATIONS[c].flag} {c}</option>
              ))}
            </select>

            {/* City */}
            <select className="loc-select" value={locState.city}
              disabled={!locState.country}
              onChange={e => upd({ city: e.target.value, region: "" })}>
              <option value="">City…</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Region / Neighbourhood */}
          {locState.city && regions.length > 0 && (
            <select className="loc-select" value={locState.region}
              onChange={e => upd({ region: e.target.value })}>
              <option value="">Area / Neighbourhood (optional)…</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          )}
        </>
      ) : (
        /* Other — free text for all three levels */
        <div className="loc-row" style={{ flexDirection: "column", gap: 6 }}>
          <input className="loc-other-input" placeholder="Country…"
            value={locState.country_other} onChange={e => upd({ country_other: e.target.value })} />
          <input className="loc-other-input" placeholder="City…"
            value={locState.city_other} onChange={e => upd({ city_other: e.target.value })} />
          <input className="loc-other-input" placeholder="Area / Neighbourhood (optional)…"
            value={locState.region_other} onChange={e => upd({ region_other: e.target.value })} />
        </div>
      )}

      {/* Other toggle */}
      <div className="loc-other-row">
        <button
          className={`loc-other-btn${locState.other_on ? " on" : ""}`}
          onClick={() => upd({ other_on: !locState.other_on })}
        >
          {locState.other_on ? "← Use dropdown" : "+ Not in the list? Type it"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CHIP SECTION
──────────────────────────────────────── */
function ChipSection({ section, state, update, accent }) {
  const val = state[section.id];
  const otherOn = !!state[`${section.id}_other_on`];
  const otherText = state[`${section.id}_other`] || "";
  const isOn = (chip) => section.multi ? (val || []).includes(chip) : val === chip;
  const toggle = (chip) => {
    if (section.multi) {
      const arr = val || [];
      update(section.id, arr.includes(chip) ? arr.filter(v => v !== chip) : [...arr, chip]);
    } else {
      update(section.id, val === chip ? "" : chip);
    }
  };
  const sectionDone = otherOn && otherText.trim()
    ? true : section.multi ? (val || []).length > 0 : !!val;

  return (
    <div className="field">
      <label className="label">
        {section.label}
        {section.required && <span className="req" style={{ color: accent }}>*</span>}
        {section.multi && <span className="multi-hint">— select all that apply</span>}
        {section.required && sectionDone && <span className="done-badge">✓</span>}
      </label>
      <div className="chips">
        {section.chips.map(chip => (
          <button key={chip} className="chip"
            style={isOn(chip) ? { background: accent + "20", borderColor: accent, color: accent, fontWeight: 700 } : {}}
            onClick={() => toggle(chip)}>{chip}</button>
        ))}
      </div>
      <div className="other-row">
        <button className="other-toggle"
          style={otherOn ? { borderStyle: "solid", borderColor: accent + "55", color: accent } : {}}
          onClick={() => update(`${section.id}_other_on`, !otherOn)}>+ other</button>
        {otherOn && (
          <input className="other-input"
            style={otherText ? { borderColor: accent + "50" } : {}}
            placeholder={`Describe custom ${section.label.toLowerCase()}…`}
            value={otherText}
            onChange={e => update(`${section.id}_other`, e.target.value)} />
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CAPTION PREVIEW
──────────────────────────────────────── */
function CaptionPreview({ state, locState, accent }) {
  const full = assembleCaption(state, locState);
  const trigger = DATASETS[state._dataset].trigger;
  const rest = full.slice(trigger.length);
  return (
    <div className="preview">
      <div className="preview-label" style={{ color: accent }}>Generated caption · training-ready</div>
      <div className="preview-text">
        {full && full !== trigger
          ? <><span className="trigger" style={{ color: accent }}>{trigger}</span>{rest}</>
          : <span style={{ color: "#252320" }}>Fill in the fields above…</span>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   DOWNLOAD MODAL
──────────────────────────────────────── */
function DownloadModal({ images, caps, locStates, photographerName, onClose, onDone }) {
  const [downloaded, setDownloaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const doneCount = images.filter((_, i) => isDone(caps[i], locStates[i])).length;

  const handleDownload = async () => {
    setBusy(true);
    try {
      await new Promise(res => {
        if (window.JSZip) return res();
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        s.onload = res; document.head.appendChild(s);
      });
      const zip = new window.JSZip();
      const groups = {};
      for (let i = 0; i < images.length; i++) {
        const cap = caps[i] || emptyState("street");
        const loc = locStates[i] || emptyLocState();
        const trigger = DATASETS[cap._dataset].trigger;
        if (!groups[trigger]) groups[trigger] = [];
        groups[trigger].push({ img: images[i], cap, loc });
      }
      for (const [trigger, items] of Object.entries(groups)) {
        const folder = zip.folder(`dataset/img/10_${trigger}`);
        for (const { img, cap, loc } of items) {
          const base = img.name.replace(/\.[^.]+$/, "");
          folder.file(img.name, img.file);
          folder.file(`${base}.txt`, assembleCaption(cap, loc));
        }
      }
      zip.file("SUBMISSION_INFO.txt",
        `Photographer: ${photographerName}\nSubmitted: ${new Date().toISOString()}\nTotal images: ${images.length}\nCaptioned: ${doneCount}/${images.length}\n`
      );
      const blob = await zip.generateAsync({ type: "blob" });
      Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(blob),
        download: `${photographerName.replace(/\s+/g, "_")}_zazi_dataset.zip`
      }).click();
      setDownloaded(true);
    } finally { setBusy(false); }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-title">{downloaded ? "✅ ZIP downloaded — one step left" : "Almost done!"}</div>
        <div className="modal-stats">
          <div className="modal-stat"><span className="modal-stat-label">Photographer</span><span className="modal-stat-value">{photographerName}</span></div>
          <div className="modal-stat"><span className="modal-stat-label">Images</span><span className="modal-stat-value">{images.length}</span></div>
          <div className="modal-stat"><span className="modal-stat-label">Partially captioned</span><span className="modal-stat-value" style={{ color: "#e8a84c" }}>{doneCount} / {images.length}</span></div>
          <div className="modal-stat"><span className="modal-stat-label">Fully captioned</span><span className="modal-stat-value" style={{ color: "#5aaa7a" }}>{images.filter((_, i) => isFullyDone(caps[i], locStates[i])).length} / {images.length}</span></div>
        </div>
        <div className="steps">
          <div className="step">
            <div className={`step-num${downloaded ? " done" : ""}`}>{downloaded ? "✓" : "1"}</div>
            <div className="step-content">
              <div className="step-title">Download your ZIP</div>
              <div className="step-sub">Contains all your images and captions, organised for training.</div>
            </div>
          </div>
          <div className="step">
            <div className="step-num" style={{ opacity: downloaded ? 1 : .4 }}>2</div>
            <div className="step-content" style={{ opacity: downloaded ? 1 : .4 }}>
              <div className="step-title">Upload ZIP to Google Drive</div>
              <div className="step-sub">Open your personal submission folder and drop the ZIP in.</div>
            </div>
          </div>
        </div>
        <div className="modal-actions">
          {!downloaded
            ? <button className="modal-dl-btn" onClick={handleDownload} disabled={busy}>{busy ? "Building ZIP…" : "⬇ Download ZIP"}</button>
            : <button className="drive-btn" onClick={() => { window.open(DRIVE_FOLDER_URL, "_blank"); onDone(); }}>📁 Open Google Drive folder →</button>
          }
          <button className="modal-cancel" onClick={onClose}>{downloaded ? "Close" : "Cancel"}</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   EDIT NAME MODAL
──────────────────────────────────────── */
function EditNameModal({ current, onSave, onClose }) {
  const [name, setName] = useState(current);
  return (
    <div className="edit-overlay">
      <div className="edit-card">
        <div className="edit-title">Edit your name</div>
        <div className="edit-field">
          <label className="edit-label">Full name</label>
          <input className="edit-input" value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && name.trim() && onSave(name.trim())}
            autoFocus />
        </div>
        <div className="edit-actions">
          <button className="edit-cancel" onClick={onClose}>Cancel</button>
          <button className="edit-save" disabled={!name.trim()} onClick={() => onSave(name.trim())}>Save name</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN APP
──────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState("pin");
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState(false);
  const [photographerName, setPhotographerName] = useState("");
  const [photographerNote, setPhotographerNote] = useState("");
  const [images, setImages] = useState([]);
  const [caps, setCaps] = useState({});
  const [locStates, setLocStates] = useState({});  // per-image location state
  const [locLocked, setLocLocked] = useState(false);
  const [lockedLocState, setLockedLocState] = useState(emptyLocState());
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showEditName, setShowEditName] = useState(false);
  const fileRef = useRef();
  const folderRef = useRef();
  const addMoreRef = useRef();
  const addMoreFolderRef = useRef();

  const addFiles = useCallback(files => {
    const imgs = Array.from(files).filter(f => f.type.startsWith("image/"));
    setImages(prev => {
      const names = new Set(prev.map(i => i.name));
      return [...prev, ...imgs
        .filter(f => !names.has(f.name))
        .map(f => ({ file: f, url: URL.createObjectURL(f), name: f.name }))];
    });
    setScreen("caption");
  }, []);

  const deleteImage = (i) => {
    setImages(prev => prev.filter((_, j) => j !== i));
    setCaps(prev => {
      const next = {};
      Object.entries(prev).forEach(([k, v]) => {
        const ki = parseInt(k);
        if (ki < i) next[ki] = v;
        else if (ki > i) next[ki - 1] = v;
      });
      return next;
    });
    setLocStates(prev => {
      const next = {};
      Object.entries(prev).forEach(([k, v]) => {
        const ki = parseInt(k);
        if (ki < i) next[ki] = v;
        else if (ki > i) next[ki - 1] = v;
      });
      return next;
    });
    setIdx(prev => {
      if (images.length <= 1) { setScreen("upload"); return 0; }
      return Math.min(prev, images.length - 2);
    });
    setDeleteTarget(null);
  };

  const state = caps[idx] || emptyState("street");
  const accent = DATASETS[state._dataset]?.color || "#e8a84c";
  const ds = DATASETS[state._dataset];

  // Location state for current image — if locked use the locked state
  const currentLocState = locLocked ? lockedLocState : (locStates[idx] || emptyLocState());
  const setCurrentLocState = (updater) => {
    const newVal = typeof updater === "function" ? updater(currentLocState) : updater;
    if (locLocked) {
      setLockedLocState(newVal);
      // Apply to all images
      setLocStates(prev => {
        const next = { ...prev };
        images.forEach((_, i) => { next[i] = newVal; });
        return next;
      });
    } else {
      setLocStates(prev => ({ ...prev, [idx]: newVal }));
    }
  };

  // When locking, save current image's loc state as the locked state and apply to all
  const handleSetLocLocked = (val) => {
    if (val) {
      const current = locStates[idx] || emptyLocState();
      setLockedLocState(current);
      setLocStates(prev => {
        const next = { ...prev };
        images.forEach((_, i) => { next[i] = current; });
        return next;
      });
    }
    setLocLocked(val);
  };

  const update = (field, val) =>
    setCaps(p => ({ ...p, [idx]: { ...(p[idx] || emptyState("street")), [field]: val } }));
  const setDataset = (dsKey) =>
    setCaps(p => ({ ...p, [idx]: emptyState(dsKey) }));

  const doneCount = images.filter((_, i) => isDone(caps[i], locStates[i])).length;
  const pct = images.length ? (doneCount / images.length) * 100 : 0;


  /* ── PIN screen ── */
  .pin-screen {
    height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #0f0e0e; font-family: 'Syne', sans-serif;
  }
  .pin-card {
    background: #131110; border: 1px solid #1e1c1a; border-radius: 14px;
    padding: 40px 36px; width: 360px; display: flex; flex-direction: column;
    gap: 20px; align-items: center; text-align: center;
  }
  .pin-logo { font-size: 22px; font-weight: 800; color: #e8dfd4; letter-spacing: -.02em; }
  .pin-logo span { color: #e8a84c; }
  .pin-logo-sub { font-size: 11px; color: #403830; margin-top: -14px; letter-spacing: .08em; text-transform: uppercase; }
  .pin-sub { font-size: 13px; color: #504840; line-height: 1.7; }
  .pin-input-wrap { display: flex; flex-direction: column; gap: 8px; width: 100%; }
  .pin-input {
    background: #0f0e0e; border: 1px solid #1e1c1a; color: #e8dfd4;
    border-radius: 7px; font-family: 'JetBrains Mono', monospace; font-size: 18px;
    padding: 12px 13px; outline: none; transition: border-color .15s; width: 100%;
    text-align: center; letter-spacing: .2em; text-transform: uppercase;
  }
  .pin-input:focus { border-color: #e8a84c; }
  .pin-input.error { border-color: #e07070; animation: shake .3s ease; }
  .pin-error { font-size: 11px; color: #e07070; }
  .pin-btn {
    padding: 12px; background: #e8a84c; border: none; color: #111;
    border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 14px;
    font-weight: 800; cursor: pointer; transition: background .15s; width: 100%;
  }
  .pin-btn:hover:not(:disabled) { background: #f0bc6a; }
  .pin-btn:disabled { opacity: .4; cursor: not-allowed; }
  .pin-footer { font-size: 9px; color: '#252320'; font-family: 'JetBrains Mono', monospace; letter-spacing: .06em; }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  /* ── PIN screen ── */
  if (screen === "pin") return (
    <>
      <style>{CSS}</style>
      <div className="pin-screen">
        <div className="pin-card">
          <div className="pin-logo">Zazi <span>Captioner</span></div>
          <div className="pin-logo-sub">Know yourself · Know your image</div>
          <div className="pin-sub">
            This tool is restricted to invited photographers only.
            Enter the access code you received to continue.
          </div>
          <div className="pin-input-wrap">
            <input
              className={`pin-input${pinError ? " error" : ""}`}
              placeholder="Access code"
              value={pinValue}
              maxLength={20}
              onChange={e => { setPinValue(e.target.value.toUpperCase()); setPinError(false); }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  if (pinValue.trim() === ACCESS_CODE) {
                    setScreen("onboard");
                  } else {
                    setPinError(true);
                    setPinValue("");
                  }
                }
              }}
              autoFocus
            />
            {pinError && <div className="pin-error">Incorrect code — please check with the project coordinator</div>}
          </div>
          <button className="pin-btn"
            disabled={!pinValue.trim()}
            onClick={() => {
              if (pinValue.trim() === ACCESS_CODE) {
                setScreen("onboard");
              } else {
                setPinError(true);
                setPinValue("");
              }
            }}>
            Enter →
          </button>
          <div className="pin-footer">Zazi Captioner © Evans Akanyijuka</div>
        </div>
      </div>
    </>
  );

  /* ── Onboarding ── */
  if (screen === "onboard") return (
    <>
      <style>{CSS}</style>
      <div className="onboard">
        <div className="onboard-card">
          <div className="onboard-logo">Zazi <span>Captioner</span></div>
          <div className="onboard-logo-sub">Know yourself · Know your image</div>
          <div className="onboard-sub">Welcome. Enter your name before starting — this labels your submission so we can keep everything organised.</div>
          <div className="onboard-field">
            <label className="onboard-label">Your full name <span style={{ color: "#e8a84c" }}>*</span></label>
            <input className="onboard-input" placeholder="e.g. Thabo Nkosi"
              value={photographerName} onChange={e => setPhotographerName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && photographerName.trim() && setScreen("upload")} />
          </div>
          <div className="onboard-field">
            <label className="onboard-label">Note about your images <span style={{ color: "#2c2820" }}>(optional)</span></label>
            <input className="onboard-input" placeholder="e.g. All shot in Soweto, July 2024"
              value={photographerNote} onChange={e => setPhotographerNote(e.target.value)} />
          </div>
          <div className="onboard-privacy">
            <div className="onboard-privacy-icon">🔒</div>
            <div className="onboard-privacy-text">Your images never leave your device until you download the ZIP and upload it yourself to Google Drive. Nothing is uploaded automatically.</div>
          </div>
          <button className="onboard-btn" disabled={!photographerName.trim()} onClick={() => setScreen("upload")}>Continue →</button>
          <div style={{ textAlign: 'center', fontSize: '9px', color: '#252320', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '.06em', userSelect: 'none' }}>Zazi Captioner © Evans Akanyijuka</div>
        </div>
      </div>
    </>
  );

  /* ── Upload screen ── */
  if (screen === "upload") return (
    <>
      <style>{CSS}</style>
      <div
        className={`upload-screen${drag ? " drag-over" : ""}`}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
      >
        <input ref={fileRef} type="file" multiple accept="image/*"
          style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />
        <input ref={folderRef} type="file" multiple accept="image/*" webkitdirectory=""
          style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />
        <div className="upload-topbar">
          <button className="back-btn" onClick={() => setScreen("onboard")}>← Back</button>
          <div className="upload-topbar-name">
            Uploading as <span>{photographerName}</span>
            <button className="edit-name-btn" onClick={() => setShowEditName(true)}>edit</button>
          </div>
        </div>
        <div className="upload-body">
          <div className="upload-drop-zone" onClick={() => fileRef.current.click()}>
            <div className="upload-icon">🗂</div>
            <div className="upload-title">Drop your images here</div>
            <div className="upload-sub">Street · Architecture · Portraiture · Markets · Landscape</div>
          </div>
          <div className="upload-divider">or choose how to add</div>
          <div className="upload-btns">
            <button className="upload-btn upload-btn-files" onClick={() => fileRef.current.click()}>🖼 Select images</button>
            <button className="upload-btn upload-btn-folder" onClick={e => { e.stopPropagation(); folderRef.current.click(); }}>📁 Upload a folder</button>
          </div>
        </div>
        <div className="watermark-footer">Zazi Captioner © Evans Akanyijuka · Afropean Intelligence Program</div>
        {showEditName && (
          <EditNameModal current={photographerName}
            onSave={n => { setPhotographerName(n); setShowEditName(false); }}
            onClose={() => setShowEditName(false)} />
        )}
      </div>
    </>
  );

  /* ── Done screen ── */
  if (screen === "done") return (
    <>
      <style>{CSS}</style>
      <div className="done-screen">
        <div className="done-icon">🎉</div>
        <div className="done-title">Siyabonga, {photographerName.split(" ")[0]}!</div>
        <div className="done-sub">Your ZIP has been downloaded. Upload it to the shared Google Drive folder to complete your submission.</div>
        <div className="done-reminder">
          <div className="done-reminder-title">📁 Upload your ZIP here</div>
          <div className="done-reminder-text">Open the Drive folder → click <strong style={{ color: "#e8dfd4" }}>+ New → File upload</strong> → select your ZIP. Done!</div>
        </div>
        <div className="done-actions">
          <button className="done-drive-btn" onClick={() => window.open(DRIVE_FOLDER_URL, "_blank")}>📁 Open Google Drive →</button>
          <button className="done-back-btn" onClick={() => setScreen("caption")}>← Back to captions</button>
        </div>
      </div>
    </>
  );

  /* ── Caption screen ── */
  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <input ref={addMoreRef} type="file" multiple accept="image/*"
          style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />
        <input ref={addMoreFolderRef} type="file" multiple accept="image/*" webkitdirectory=""
          style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />

        <header className="header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="back-btn" onClick={() => setScreen("upload")}>← Add more</button>
            <span className="logo">Zazi <span>Captioner</span></span>
          </div>
          <div className="hdr-mid">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${pct}%`, background: accent }} />
            </div>
            <span className="progress-text">{doneCount} / {images.length} captioned</span>
          </div>
          <div className="hdr-right">
            <div className="photographer-tag" onClick={() => setShowEditName(true)} title="Click to edit name">
              📷 <span>{photographerName}</span>
              <span className="photographer-tag-edit">✎</span>
            </div>
            <button className="dl-btn" onClick={() => setShowModal(true)}>Download ZIP ↓</button>
          </div>
        </header>

        <div className="body">
          <div className="img-panel">
            <div className="img-wrap">
              <img src={images[idx].url} alt={images[idx].name} className="main-img" />
            </div>
            <div className="img-footer">
              <span className="img-name">{images[idx].name}</span>
              <div className="img-actions">
                <button className="delete-btn" onClick={() => setDeleteTarget(idx)}>✕ Remove</button>
                <div className="img-nav">
                  <button className="nav-btn" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>← Prev</button>
                  <span className="nav-count">{idx + 1} / {images.length}</span>
                  <button className="nav-btn" onClick={() => setIdx(i => Math.min(images.length - 1, i + 1))} disabled={idx === images.length - 1}>Next →</button>
                </div>
              </div>
            </div>
          </div>

          <div className="form-panel">
            <div className="ds-bar">
              <span className="ds-bar-label">Type:</span>
              {Object.entries(DATASETS).map(([key, d]) => (
                <button key={key} className="ds-chip"
                  style={state._dataset === key ? { background: d.color + "18", borderColor: d.color, color: d.color, fontWeight: 700 } : {}}
                  onClick={() => setDataset(key)}>{d.icon} {d.label}</button>
              ))}
            </div>

            <div className="form-scroll">
              {/* Location — always first */}
              <LocationSection
                locState={currentLocState}
                setLocState={setCurrentLocState}
                locLocked={locLocked}
                setLocLocked={handleSetLocLocked}
                accent={accent}
              />

              <hr className="divider" />

              {/* Dataset-specific sections */}
              {ds.sections.map((section, i) => (
                <div key={section.id}>
                  <ChipSection section={section} state={state} update={update} accent={accent} />
                  {i < ds.sections.length - 1 && <hr className="divider" style={{ marginTop: 12 }} />}
                </div>
              ))}

              <div className="field">
                <label className="label">Additional details</label>
                <textarea className="notes-input" rows={2}
                  placeholder="Sign text, landmark names, cultural context, your own observations…"
                  value={state.notes || ""}
                  onChange={e => update("notes", e.target.value)} />
              </div>

              <CaptionPreview state={state} locState={currentLocState} accent={accent} />
            </div>
          </div>
        </div>

        <div className="thumb-strip">
          {images.map((img, i) => (
            <div key={img.name + i} className="thumb-wrap">
              <button className="thumb"
                style={i === idx ? { borderColor: accent } : {}}
                onClick={() => setIdx(i)} title={img.name}>
                <img src={img.url} alt="" />
              </button>
              {isDone(caps[i], locStates[i]) && (
                <span className="done-dot" style={{ background: isFullyDone(caps[i], locStates[i]) ? '#5aaa7a' : '#e8a84c' }}>
                  {isFullyDone(caps[i], locStates[i]) ? '✓' : '·'}
                </span>
              )}
              <button className="thumb-delete" onClick={() => setDeleteTarget(i)}>✕</button>
            </div>
          ))}
          <button className="thumb-add" title="Add more images" onClick={() => addMoreRef.current.click()}>🖼</button>
          <button className="thumb-add" title="Add a folder" onClick={() => addMoreFolderRef.current.click()}>📁</button>
        </div>

        {showModal && (
          <DownloadModal
            images={images} caps={caps} locStates={locStates}
            photographerName={photographerName}
            onClose={() => setShowModal(false)}
            onDone={() => { setShowModal(false); setScreen("done"); }}
          />
        )}

        {deleteTarget !== null && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm">
              <div className="delete-confirm-title">Remove this image?</div>
              <div className="delete-confirm-sub">
                <strong style={{ color: "#e8dfd4" }}>{images[deleteTarget]?.name}</strong> and its caption will be removed. This cannot be undone.
              </div>
              <div className="delete-confirm-actions">
                <button className="delete-no" onClick={() => setDeleteTarget(null)}>Keep it</button>
                <button className="delete-yes" onClick={() => deleteImage(deleteTarget)}>Remove</button>
              </div>
            </div>
          </div>
        )}

        <div className="watermark-footer">Zazi Captioner © Evans Akanyijuka · Afropean Intelligence Program</div>
        {showEditName && (
          <EditNameModal current={photographerName}
            onSave={n => { setPhotographerName(n); setShowEditName(false); }}
            onClose={() => setShowEditName(false)} />
        )}
      </div>
    </>
  );
}
