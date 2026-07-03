// 🌿 पौधों का लाइव डेटाबेस जो अब सीधे plants-data.json से लोड होगा
let plantDatabase = [];
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
        // उपयोग (uses) की लिस्ट को कॉमा से अलग करके सुंदर टेक्स्ट बनाएँ
        const usesText = Array.isArray(plant.uses) ? plant.uses.join(', ') : (plant.uses || 'N/A');

        const card = document.createElement('div');
        card.className = 'classic-plant-card';
        card.innerHTML = `
            <h3>🌳 ${plant.hindiName || 'बिना नाम का पौधा'}</h3>
            <div class="scientific-name">🧬 ${plant.scientificName || 'N/A'}</div>
            <div class="info-row"><span class="info-label">📍 स्थान:</span> <span>${plant.location || 'N/A'}</span></div>
            <div class="info-row"><span class="info-label">💧 सिंचाई:</span> <span>${plant.water || 'N/A'}</span></div>
            <div class="info-row"><span class="info-label">💊 लाभ:</span> <span style="color:var(--primary-green); font-weight:bold;">${usesText}</span></div>
            <div class="description-box">🎯 <strong>विवरण:</strong> ${plant.description || 'कोई विवरण उपलब्ध नहीं है।'}</div>
        `;
        container.appendChild(card);
    });
}

// लाइव सर्च इंजन
const searchEngine = {
    executeFilter: function() {
        const val = document.getElementById('classicSearch').value.toLowerCase().trim();
        const suggBox = document.getElementById('suggestionBox');
        if(suggBox) suggBox.style.display = 'none';

        const results = plantDatabase.filter(plant => {
            const hindiName = plant.hindiName ? plant.hindiName.toLowerCase() : '';
            const scientificName = plant.scientificName ? plant.scientificName.toLowerCase() : '';
            const description = plant.description ? plant.description.toLowerCase() : '';
            const type = plant.type || '';

            const matchesSearch = hindiName.includes(val) || 
                                  scientificName.includes(val) ||
                                  description.includes(val);
            const matchesCat = selectedCategory === 'all' || type === selectedCategory;
            return matchesSearch && matchesCat;
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
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        const firstBtn = document.querySelectorAll('.filter-btn')[0];
        if(firstBtn) firstBtn.classList.add('active');
        this.executeFilter();
    }
};

// ऑटो-सजेशन इंजन
const suggestionEngine = {
    trigger: function(input) {
        const val = input.value.toLowerCase().trim();
        const box = document.getElementById('suggestionBox');
        if(!box) return;
        if(!val) { box.style.display = 'none'; searchEngine.executeFilter(); return; }

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
            const searchInput = document.getElementById('classicSearch');
            if(searchInput) {
                searchInput.value = e.results[0][0].transcript;
                searchEngine.executeFilter();
            }
        };
    }
};

// पेज लोड होते ही plants-data.json से लाइव सारा डेटा खींचने का सिस्टम
window.addEventListener('DOMContentLoaded', () => {
    // यहाँ अपनी JSON फाइल का सही रास्ता (Path) दिया गया है
    fetch('../plants-data.json')
        .then(response => {
            if (!response.ok) throw new Error('JSON फाइल लोड करने में समस्या आई');
            return response.json();
        })
        .then(data => {
            // JSON ऑब्जेक्ट को एरे (Array) में बदलकर plantDatabase में सेव करना
            plantDatabase = Object.keys(data).map(key => {
                return {
                    id: key,
                    ...data[key]
                };
            });
            // ग्रिड में सारे पौधों को एक साथ दिखाना
            renderDatabaseGrid(plantDatabase);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const container = document.getElementById('plantsGrid');
            if(container) {
                container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:30px; color:red; font-weight:bold;">⚠️ plants-data.json फाइल लोड नहीं हो सकी। कृपया फाइल चेक करें।</div>`;
            }
        });
});
