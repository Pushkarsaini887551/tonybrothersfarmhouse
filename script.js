// Tony Brothers Farm House V2.0 - Optimized Version

let plantDatabase = {}; // पूरे प्रोजेक्ट के लिए एक ही डेटाबेस वेरिएबल

// 1. डेटा लोड करने का एकमात्र सही तरीका
async function initializeData() {
    try {
        const response = await fetch('plants-data.json');
        if (!response.ok) throw new Error("plants-data.json लोड नहीं हुई");
        
        plantDatabase = await response.json(); // डेटा लोड हो गया
        console.log("डेटाबेस तैयार है:", plantDatabase);
        
        if (typeof showSuggestions === "function") showSuggestions();
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("resultContainer").innerHTML = 
            "<h2 style='text-align:center; color:red;'>❌ डेटा लोड करने में समस्या!</h2>";
    }
}

// 2. सर्च फंक्शन (जो अब ऊपर वाले plantDatabase का इस्तेमाल करेगा)
function searchTree() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultContainer = document.getElementById('resultContainer');

    if (!query) {
        resultContainer.innerHTML = `<p style="color: red; text-align: center;">कृपया पेड़ का नाम दर्ज करें।</p>`;
        return;
    }

    // चेक करें कि डेटा लोड हुआ है या नहीं
    if (!plantDatabase[query]) {
        resultContainer.innerHTML = `<p style="color: orange; text-align: center;">"${query}" डेटाबेस में नहीं मिला।</p>`;
        return;
    }

    const tree = plantDatabase[query];
    let usesList = (tree.uses && Array.isArray(tree.uses)) ? 
                   tree.uses.map(u => `<li>${u}</li>`).join('') : '<li>कोई जानकारी नहीं</li>';

    resultContainer.innerHTML = `
        <div class="tree-details-card">
            <h2>🌳 ${tree.hindiName} (${query})</h2>
            <p>🔬 <i>${tree.scientificName}</i></p>
            <div class="info-grid">
                <div><strong>🌍 English:</strong> ${tree.englishName}</div>
                <div><strong>🌿 Family:</strong> ${tree.family}</div>
                <div><strong>🌳 ऊँचाई:</strong> ${tree.height}</div>
                <div><strong>☀️ जलवायु:</strong> ${tree.climate}</div>
            </div>
            <h3>🌱 प्रमुख उपयोग</h3>
            <ul>${usesList}</ul>
        </div>
    `;
}

// पेज लोड होते ही डेटा लोड करें
window.addEventListener('DOMContentLoaded', initializeData);
