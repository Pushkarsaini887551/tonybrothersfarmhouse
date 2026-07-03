async function searchTree() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultContainer = document.getElementById('resultContainer');

    if (!query) {
        resultContainer.innerHTML = `<p style="color: red; text-align: center; font-weight: bold; padding: 20px;">कृपया पेड़ का नाम दर्ज करें।</p>`;
        return;
    }

    try {
        // यहाँ फाइल का नाम सही कर दिया है
        const response = await fetch('./plants-data.json'); 
        
        if (!response.ok) throw new Error("File not found");

        const treesData = await response.json();

        // यहाँ चेक करें कि क्या डेटा में पेड़ का नाम मौजूद है
        if (treesData[query]) {
            const tree = treesData[query];
            
            // usesList बनाने का छोटा तरीका
            const usesList = tree.uses.map(u => `<li>${u}</li>`).join('');

            resultContainer.innerHTML = `
                <div class="tree-details-card">
                    <div class="card-header">
                        <h2>🌳 ${tree.hindiName} (${query.charAt(0).toUpperCase() + query.slice(1)})</h2>
                        <span class="scientific-name">🔬 <i>${tree.scientificName}</i></span>
                    </div>
                    <hr class="divider">
                    <div class="info-grid">
                        <div class="info-item"><strong>🌍 English:</strong> ${tree.englishName}</div>
                        <div class="info-item"><strong>🌿 Family:</strong> ${tree.family}</div>
                        <div class="info-item"><strong>🌳 Height:</strong> ${tree.height}</div>
                        <div class="info-item"><strong>📍 Location:</strong> ${tree.location}</div>
                        <div class="info-item"><strong>☀️ Climate:</strong> ${tree.climate}</div>
                        <div class="info-item"><strong>💧 Water:</strong> ${tree.water}</div>
                        <div class="info-item"><strong>🌸 Flowers:</strong> ${tree.flowers}</div>
                        <div class="info-item"><strong>🍎 Fruits:</strong> ${tree.fruits}</div>
                    </div>
                    <hr class="divider">
                    <div class="description-section">
                        <h3>🌱 प्रमुख उपयोग</h3>
                        <ul>${usesList}</ul>
                    </div>
                    <hr class="divider">
                    <div class="description-section">
                        <h3>📖 विवरण</h3>
                        <p>${tree.description}</p>
                    </div>
                </div>
            `;
        } else {
            resultContainer.innerHTML = `<p style="color: orange; text-align: center; font-weight: bold; padding: 20px;">क्षमा करें! यह पेड़ डेटाबेस में नहीं है।</p>`;
        }
    } catch (error) {
        resultContainer.innerHTML = `<p style="color: red; text-align: center; font-weight: bold; padding: 20px;">डेटा लोड करने में त्रुटि!</p>`;
    }
}
