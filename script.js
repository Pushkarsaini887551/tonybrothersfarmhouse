// Tony Brothers Farm House V2.0 - पूरा कोड

let trees = [];
let slideIndex = 0;

// डेटा लोड करने का मुख्य फंक्शन
fetch("plants-data.json")
.then(response => {
    if (!response.ok) {
        throw new Error("plants-data.json लोड नहीं हुई");
    }
    return response.json();
})
.then(data => {
    trees = data; // पूरा डेटा लोड हो गया
    if (typeof showSuggestions === "function") showSuggestions();
})
.catch(error => {
    console.error("Error loading plants-data:", error);
    document.getElementById("resultContainer").innerHTML = 
    "<h2 style='text-align:center; color:red;'>❌ plants-data.json लोड नहीं हुई</h2>";
});

// ----------------------
// विस्तृत सर्च फंक्शन
// ----------------------
async function searchTree() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultContainer = document.getElementById('resultContainer');

    if (!query) {
        resultContainer.innerHTML = `<p style="color: red; text-align: center; font-weight: bold; padding: 20px;">कृपया पेड़ का नाम दर्ज करें।</p>`;
        return;
    }

    try {
        const response = await fetch('./plants-data.json');
        if (!response.ok) throw new Error("फ़ाइल लोड नहीं हो सकी");

        const treesData = await response.json();

        if (treesData[query]) {
            const tree = treesData[query];
            
            let usesList = '';
            if (tree.uses && Array.isArray(tree.uses)) {
                tree.uses.forEach(use => {
                    usesList += `<li>${use}</li>`;
                });
            }

            resultContainer.innerHTML = `
                <div class="tree-details-card">
                    <div class="card-header">
                        <h2>🌳 ${tree.hindiName} (${query.charAt(0).toUpperCase() + query.slice(1)})</h2>
                        <span class="scientific-name">🔬 <i>${tree.scientificName}</i></span>
                    </div>
                    <hr class="divider">
                    <div class="info-grid">
                        <div class="info-item"><strong>🌍 English Name:</strong> ${tree.englishName}</div>
                        <div class="info-item"><strong>🌿 Family:</strong> ${tree.family}</div>
                        <div class="info-item"><strong>🌳 ऊँचाई:</strong> ${tree.height}</div>
                        <div class="info-item"><strong>📍 भारत में कहाँ मिलता है:</strong> ${tree.location}</div>
                        <div class="info-item"><strong>☀️ जलवायु:</strong> ${tree.climate}</div>
                        <div class="info-item"><strong>💧 पानी की आवश्यकता:</strong> ${tree.water}</div>
                        <div class="info-item"><strong>🌸 फूल आने का समय:</strong> ${tree.flowers}</div>
                        <div class="info-item"><strong>🍎 फल आने का समय:</strong> ${tree.fruits}</div>
                    </div>
                    <hr class="divider">
                    <div class="description-section">
                        <h3>🌱 प्रमुख उपयोग</h3>
                        <ul>${usesList}</ul>
                    </div>
                    <hr class="divider">
                    <div class="description-section">
                        <h3>📖 पूरा विवरण</h3>
                        <p>${tree.description}</p>
                    </div>
                </div>
            `;
        } else {
            resultContainer.innerHTML = `<p style="color: orange; text-align: center; font-weight: bold; padding: 20px;">क्षमा करें! "${query}" की जानकारी अभी डेटाबेस में नहीं है।</p>`;
        }
    } catch (error) {
        console.error("Error:", error);
        resultContainer.innerHTML = `<p style="color: red; text-align: center; font-weight: bold; padding: 20px;">डेटा लोड करने में समस्या आई।</p>`;
    }
}

// बाकी के आपके ओरिजिनल फंक्शन (Slider, Suggestions, Filter आदि) यहाँ वैसे ही रहने दें...
