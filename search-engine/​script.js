// 🌿 पौधों का लाइव डेटाबेस जो सीधे plants-data.json से लोड होगा
let plantDatabase = [];
let selectedCategory = 'all';
let selectedSymptom = 'all';

// 🎨 नए स्मार्ट डैशबोर्ड और ग्रिड को सुंदर बनाने के लिए CSS इंजेक्शन
const styleNode = document.createElement('style');
styleNode.innerHTML = `
    /* स्मार्ट टूल्स डैशबोर्ड का डिज़ाइन */
    .smart-dashboard {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 20px;
        margin: 20px auto;
        max-width: 1200px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
    }
    .tool-box {
        background: #f8faf9;
        border-left: 4px solid #2e7d32;
        border-radius: 8px;
        padding: 15px;
    }
    .tool-box h4 {
        margin: 0 0 10px 0;
        color: #2e7d32;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .tool-select {
        width: 100%;
        padding: 10px;
        border-radius: 6px;
        border: 1px solid #cbd5e1;
        background: white;
        font-size: 0.95em;
        color: #334155;
    }
    .weather-info {
        font-size: 0.95em;
        color: #475569;
        line-height: 1.5;
    }
    .calendar-badge {
        display: inline-block;
        background: #e8f5e9;
        color: #2e7d32;
        padding: 6px 12px;
        border-radius: 20px;
        font-weight: bold;
        margin-top: 5px;
    }

    /* ग्रिड लेआउट */
    #plantsGrid {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
        gap: 20px !important;
        padding: 15px !important;
        max-width: 1200px;
        margin: 0 auto;
    }
    .classic-plant-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s, box-shadow 0.2s;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .classic-plant-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        border-color: #4caf50;
    }
    .scientific-name {
        font-style: italic;
        color: #718096;
        margin-bottom: 12px;
        font-size: 0.9em;
    }
    .info-row {
        margin: 6px 0;
        font-size: 0.9em;
    }
    .info-label {
        font-weight: bold;
        color: #4a5568;
    }
    .description-box {
        margin-top: 12px;
        background: #f7fafc;
        padding: 10px;
        border-radius: 8px;
        font-size: 0.88em;
        color: #4a5568;
    }
`;
document.head.appendChild(styleNode);

// 🛠️ स्क्रीन पर स्मार्ट डैशबोर्ड (UI) बनाने वाला फंक्शन
function createSmartDashboard() {
    const mainContainer = document.getElementById('plantsGrid');
    if (!mainContainer || document.getElementById('tonySmartDashboard')) return;

    const dashboard = document.createElement('div');
    dashboard.id = 'tonySmartDashboard';
    dashboard.className = 'smart-dashboard';

    const months = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
    const currentMonth = months[new Date().getMonth()];

    dashboard.innerHTML = `
        <div class="tool-box">
            <h4>🧪 आयुर्वेदिक रोग-निवारक</h4>
            <select id="symptomFilter" class="tool-select" onchange="filterBySymptom(this.value)">
                <option value="all">-- कोई बीमारी/समस्या चुनें --</option>
                <option value="त्वचा">त्वचा रोग / पिंपल्स</option>
                <option value="बुखार">बुखार / डेंगू / मलेरिया</option>
                <option value="इम्युनिटी">रोग प्रतिरोधक क्षमता (Immunity)</option>
                <option value="पाचन">पाचन तंत्र / पेट की समस्या</option>
                <option value="बाल">बालों का झड़ना / रूसी</option>
                <option value="खांसी">सर्दी, खांसी और जुकाम</option>
                <option value="रक्त">रक्त शुद्धिकरण (Blood Purifier)</option>
            </select>
        </div>

        <div class="tool-box">
            <h4>🌡️ लाइव मौसम व सिंचाई गाइड</h4>
            <div id="weatherWidget" class="weather-info">मौसम का डेटा लोड हो रहा है...</div>
        </div>

        <div class="tool-box">
            <h4>📅 AI प्लांट शेड्यूलर</h4>
            <div class="weather-info">चालू महीना: <span class="calendar-badge">${currentMonth}</span></div>
            <button class="tool-select" style="margin-top:8px; background:#2e7d32; color:white; font-weight:bold; cursor:pointer;" onclick="filterByCurrentSeason()">
                इस महीने के पौधे देखें
            </button>
        </div>
    `;

    mainContainer.parentNode.insertBefore(dashboard, mainContainer);
    fetchWeatherData();
}

// 🌦️ सिंचाई सलाह लॉजिक
function fetchWeatherData() {
    const widget = document.getElementById('weatherWidget');
    if (!widget) return;

    const temp = 32; 
    let advice = "पौधों में नमी बनाए रखें। सुबह या शाम को पानी देना सबसे उत्तम है।";
    
    const hour = new Date().getHours();
    if (hour >= 10 && hour <= 16) {
        advice = "☀️ इस समय तेज धूप है, पौधों को सीधे पानी देने से बचें। शाम को पानी दें।";
    }

    widget.innerHTML = `
        <b>अनुमानित तापमान:</b> ${temp}°C (नियमित)<br>
        <b>💧 सिंचाई सलाह:</b> ${advice}
    `;
}

// 🧪 बीमारी के आधार पर फ़िल्टर
function filterBySymptom(symptom) {
    selectedSymptom = symptom;
    window.searchEngine.executeFilter();
}

// 📅 सीजन फ़िल्टर
function filterByCurrentSeason() {
    const months = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
    const currentMonth = months[new Date().getMonth()].toLowerCase();

    const results = plantDatabase.filter(plant => {
        const season = plant.season ? plant.season.toLowerCase() : '';
        return season.includes(currentMonth) || season.includes('वर्ष भर') || season.includes('सदाबहार');
    });

    renderDatabaseGrid(results);
}

// 🗂️ कार्ड्स रेंडरिंग इंजन
function renderDatabaseGrid(dataset) {
    const container = document.getElementById('plantsGrid');
    if(!container) return;
    container.innerHTML = '';

    if(dataset.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:30px; color:#4a5568;">🔍 कोई पौधा मैच नहीं हुआ।</div>`;
        return;
    }

    dataset.forEach(plant => {
        let benefitsText = 'N/A';
        if (plant.benefits) {
            benefitsText = plant.benefits;
        } else if (plant.uses) {
            benefitsText = Array.isArray(plant.uses) ? plant.uses.join(', ') : plant.uses;
        }

        const card = document.createElement('div');
        card.className = 'classic-plant-card';
        card.innerHTML = `
            <h3>🌳 ${plant.hindiName || 'बिना नाम का पौधा'}</h3>
            <div class="scientific-name">🧬 ${plant.scientificName || 'N/A'}</div>
            <div class="info-row"><span class="info-label">📍 स्थान:</span> <span>${plant.location || 'N/A'}</span></div>
            <div class="info-row"><span class="info-label">💧 सिंचाई:</span> <span>${plant.water || 'N/A'}</span></div>
            <div class="info-row"><span class="info-label">📅 सीजन:</span> <span>${plant.season || 'N/A'}</span></div>
            <div class="info-row"><span class="info-label">💊 लाभ:</span> <span style="color:#2e7d32; font-weight:bold;">${benefitsText}</span></div>
            <div class="description-box">🎯 <strong>विवरण:</strong> ${plant.description || 'कोई विवरण उपलब्ध नहीं है।'}</div>
        `;
        container.appendChild(card);
    });
}

// लाइव मुख्य सर्च इंजन ऑब्जेक्ट (ग्लोबल स्कोप)
window.searchEngine = {
    executeFilter: function() {
        const searchInput = document.getElementById('classicSearch');
        const val = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const maggBox = document.getElementById('suggestionBox');
        if(maggBox) maggBox.style.display = 'none';

        const results = plantDatabase.filter(plant => {
            const hindiName = plant.hindiName ? plant.hindiName.toLowerCase() : '';
            const scientificName = plant.scientificName ? plant.scientificName.toLowerCase() : '';
            const description = plant.description ? plant.description.toLowerCase() : '';
            const benefits = plant.benefits ? plant.benefits.toLowerCase() : '';
            const type = plant.type || '';

            const matchesSearch = hindiName.includes(val) || 
                                  scientificName.includes(val) ||
                                  description.includes(val);
            
            const matchesCat = selectedCategory === 'all' || type === selectedCategory;

            const matchesSymptom = selectedSymptom === 'all' || 
                                   hindiName.includes(selectedSymptom) || 
                                   description.includes(selectedSymptom) || 
                                   benefits.includes(selectedSymptom);

            return matchesSearch && matchesCat && matchesSymptom;
        });
        renderDatabaseGrid(results);
    },
    filterCategory: function(cat, element) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        if(element) element.classList.add('active');
        selectedCategory = cat;
        this.executeFilter();
    },
    resetAll: function() {
        const searchInput = document.getElementById('classicSearch');
        if(searchInput) searchInput.value = '';
        selectedCategory = 'all';
        selectedSymptom = 'all';
        const symptomDropdown = document.getElementById('symptomFilter');
        if(symptomDropdown) symptomDropdown.value = 'all';
        
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        const firstBtn = document.querySelectorAll('.filter-btn')[0];
        if(firstBtn) firstBtn.classList.add('active');
        this.executeFilter();
    }
};

// ऑटो-सजेशन इंजन (ग्लोबल स्कोप)
window.suggestionEngine = {
    trigger: function(input) {
        const val = input.value.toLowerCase().trim();
        const box = document.getElementById('suggestionBox');
        if(!box) return;
        if(!val) { box.style.display = 'none'; window.searchEngine.executeFilter(); return; }

        box.innerHTML = '';
        let counter = 0;

        plantDatabase.forEach(plant => {
            const hindiName = plant.hindiName || '';
            if(hindiName.toLowerCase().includes(val)) {
                const item = document.createElement('div');
                item.className = 'suggest-item';
                item.innerHTML = `<span>🌳 ${hindiName}</span>`;
                item.onclick = () => {
                    input.value = hindiName;
                    box.style.display = 'none';
                    window.searchEngine.executeFilter();
                };
                box.appendChild(item);
                counter++;
            }
        });
        box.style.display = counter > 0 ? 'block' : 'none';
        window.searchEngine.executeFilter();
    }
};

// वॉइस सर्च इंजन (ग्लोबल स्कोप)
window.voiceSearchEngine = {
    listen: function() {
        const SpeechReq = window.SpeechRecognition || window.webkitSpeechRecognition;
        if(!SpeechReq) { alert("ब्राउज़र वॉइस सपोर्ट नहीं करता।"); return; }
        const rec = new SpeechReq();
        rec.lang = 'hi-IN';
        rec.start();
        rec.onresult = (e) => {
            const searchInput = document.getElementById('classicSearch');
            if(searchInput) {
                searchInput.value = e.results[0][0].transcript;
                window.searchEngine.executeFilter();
            }
        };
    }
};

// पेज लोड होने पर इनिशियलाइज़ेशन
window.addEventListener('DOMContentLoaded', () => {
    fetch('../plants-data.json')
        .then(response => {
            if (!response.ok) throw new Error('JSON लोड एरर');
            return response.json();
        })
        .then(data => {
            plantDatabase = Object.keys(data).map(key => {
                return { id: key, ...data[key] };
            });
            createSmartDashboard();
            renderDatabaseGrid(plantDatabase);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
