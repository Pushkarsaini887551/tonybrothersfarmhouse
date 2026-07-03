// 🌿 पौधों का विस्तारित मास्टर डेटाबेस
const plantDatabase = [
    {
        id: "neem",
        hindiName: "नीम",
        scientificName: "Azadirachta indica",
        type: "medicinal",
        location: "पूरे भारत के मैदानी भागों में",
        water: "बहुत कम (सूखा सहनशील)",
        season: "मार्च - मई",
        benefits: "रक्त साफ करने, एंटी-बैक्टीरियल सुरक्षा और त्वचा रोगों में उपयोगी।",
        description: "नीम आयुर्वेद और ग्रामीण चिकित्सा का मुख्य आधार स्तंभ है। इसके पत्ते, फल और छाल औषधीय गुणों से समृद्ध होते हैं।"
    },
    {
        id: "mango",
        hindiName: "आम",
        scientificName: "Mangifera indica",
        type: "fruit",
        location: "संपूर्ण भारत वर्ष",
        water: "मध्यम से नियमित सिंचाई",
        season: "जनवरी - जून",
        benefits: "विटामिन ए और सी का मुख्य स्रोत, स्वादिष्ट फल और धार्मिक महत्व।",
        description: "आम भारत का राष्ट्रीय फल है। इसका विशालकाय पेड़ गर्मियों के दिनों में मीठे और रसीले फल देता है।"
    },
    {
        id: "tulsi",
        hindiName: "तुलसी",
        scientificName: "Ocimum sanctum",
        type: "medicinal",
        location: "प्रत्येक भारतीय घर के पवित्र आंगन में",
        water: "नियमित सिंचाई",
        season: "वर्ष भर (सदाबहार)",
        benefits: "इम्युनिटी बढ़ाने, सर्दी, खांसी और जुकाम को जड़ से मिटाने में असरदार।",
        description: "तुलसी को 'जड़ी-बूटियों की रानी' कहा जाता है। इसमें प्रचुर मात्रा में एंटी-ऑक्सीडेंट पाए जाते हैं।"
    },
    {
        id: "lemon",
        hindiName: "नींबू",
        scientificName: "Citrus limon",
        type: "fruit",
        location: "गर्म व आर्द्र क्षेत्रों में",
        water: "नियमित मध्यम पानी",
        season: "वर्ष भर (मुख्यतः गर्मियों में)",
        benefits: "विटामिन सी का सर्वोत्तम स्रोत, इम्युनिटी बूस्टर और पाचन तंत्र के लिए हितकारी।",
        description: "नींबू का छोटा पेड़ काँटेदार होता है। इसके रसीले फल का उपयोग सलाद, आचार और शिकंजी में बहुतायत से किया जाता है।"
    },
    {
        id: "giloy",
        hindiName: "गिलोय",
        scientificName: "Tinospora cordifolia",
        type: "medicinal",
        location: "खेतों की बाड़ और जंगलों में",
        water: "बहुत कम पानी",
        season: "सदाबहार बेल",
        benefits: "पुराने बुखार, डेंगू में प्लेटलेट्स बढ़ाने और रोग प्रतिरोधक क्षमता को तीव्र करने में सहायक।",
        description: "गिलोय एक दिव्य लता है जिसे आयुर्वेद में 'अमृता' भी कहा जाता है। नीम के पेड़ पर चढ़ी हुई गिलोय सर्वोत्तम मानी जाती है।"
    }
];

let selectedCategory = 'all';

// कार्ड्स रेंडरिंग इंजन
function renderDatabaseGrid(dataset) {
    const container = document.getElementById('plantsGrid');
    if(!container) return;
    container.innerHTML = '';

    if(dataset.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:30px; color:var(--text-secondary);">🔍 कोई पौधा मैच नहीं हुआ।</div>`;
        return;
    }

    dataset.forEach(plant => {
        const card = document.createElement('div');
        card.className = 'classic-plant-card';
        card.innerHTML = `
            <h3>🌳 ${plant.hindiName}</h3>
            <div class="scientific-name">🧬 ${plant.scientificName}</div>
            <div class="info-row"><span class="info-label">📍 स्थान:</span> <span>${plant.location}</span></div>
            <div class="info-row"><span class="info-label">💧 सिंचाई:</span> <span>${plant.water}</span></div>
            <div class="info-row"><span class="info-label">💊 लाभ:</span> <span style="color:var(--primary-green); font-weight:bold;">${plant.benefits}</span></div>
            <div class="description-box">🎯 <strong>विवरण:</strong> ${plant.description}</div>
        `;
        container.appendChild(card);
    });
}

// लाइव सर्च इंजन
const searchEngine = {
    executeFilter: function() {
        const val = document.getElementById('classicSearch').value.toLowerCase().trim();
        document.getElementById('suggestionBox').style.display = 'none';

        const results = plantDatabase.filter(plant => {
            const matchesSearch = plant.hindiName.toLowerCase().includes(val) || 
                                  plant.scientificName.toLowerCase().includes(val) ||
                                  plant.benefits.toLowerCase().includes(val);
            const matchesCat = selectedCategory === 'all' || plant.type === selectedCategory;
            return matchesSearch && matchesCat;
        });
        renderDatabaseGrid(results);
    },
    filterCategory: function(cat, element) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        element.classList.add('active');
        selectedCategory = cat;
        this.executeFilter();
    },
    resetAll: function() {
        document.getElementById('classicSearch').value = '';
        selectedCategory = 'all';
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.filter-btn')[0].classList.add('active');
        this.executeFilter();
    }
};

// ऑटो-सजेशन इंजन
const suggestionEngine = {
    trigger: function(input) {
        const val = input.value.toLowerCase().trim();
        const box = document.getElementById('suggestionBox');
        if(!val) { box.style.display = 'none'; searchEngine.executeFilter(); return; }

        box.innerHTML = '';
        let counter = 0;

        plantDatabase.forEach(plant => {
            if(plant.hindiName.toLowerCase().includes(val)) {
                const item = document.createElement('div');
                item.className = 'suggest-item';
                item.innerHTML = `<span>🌳 ${plant.hindiName}</span>`;
                item.onclick = () => {
                    input.value = plant.hindiName;
                    box.style.display = 'none';
                    searchEngine.executeFilter();
                };
                box.appendChild(item);
                counter++;
            }
        });
        box.style.display = counter > 0 ? 'block' : 'none';
        searchEngine.executeFilter();
    }
};

// वॉइस सर्च इंजन
const voiceSearchEngine = {
    listen: function() {
        const SpeechReq = window.SpeechRecognition || window.webkitSpeechRecognition;
        if(!SpeechReq) { alert("ब्राउज़र वॉइस सपोर्ट नहीं करता।"); return; }
        const rec = new SpeechReq();
        rec.lang = 'hi-IN';
        rec.start();
        rec.onresult = (e) => {
            document.getElementById('classicSearch').value = e.results[0][0].transcript;
            searchEngine.executeFilter();
        };
    }
};

window.addEventListener('DOMContentLoaded', () => {
    renderDatabaseGrid(plantDatabase);
});
