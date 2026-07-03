// 🌿 पौधों का लाइव डेटाबेस जो अब सीधे plants-data.json से लोड होगा
let plantDatabase = [];
let selectedCategory = 'all';

// CSS को ऑटोमैटिक फिक्स करने के लिए स्टाइल ब्लॉक
const styleNode = document.createElement('style');
styleNode.innerHTML = `
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
            <div class="info-row"><span class="info-label">💊 लाभ:</span> <span style="color:#2e7d32; font-weight:bold;">${benefitsText}</span></div>
            <div class="description-box">🎯 <strong>विवरण:</strong> ${plant.description || 'कोई विवरण उपलब्ध नहीं है।'}</div>
        `;
        container.appendChild(card);
    });
}

// लाइव सर्च इंजन
const searchEngine = {
    executeFilter: function() {
        const val = document.getElementById('classicSearch').value.toLowerCase().trim();
        const maggBox = document.getElementById('suggestionBox');
        if(maggBox) maggBox.style.display = 'none';

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

// लोड फंक्शन
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
            renderDatabaseGrid(plantDatabase);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
