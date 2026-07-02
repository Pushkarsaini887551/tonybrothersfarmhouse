async function searchTree() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultContainer = document.getElementById('resultContainer');

    if (!query) {
        resultContainer.innerHTML = `<p style="color: red; text-align: center; font-weight: bold; padding: 20px;">कृपया पेड़ का नाम दर्ज करें।</p>`;
        return;
    }

    try {
        // अब यह सिर्फ एक ही मुख्य फ़ाइल trees.json से डेटा लोड करेगा
        const response = await fetch('./trees.json');
        
        if (!response.ok) {
            throw new Error("trees.json file not found");
        }

        const treesData = await response.json();

        // चेक करना कि पेड़ डेटा में है या नहीं
        if (treesData[query]) {
            const tree = treesData[query];
            
            let usesList = '';
            tree.uses.forEach(use => {
                usesList += `<li>${use}</li>`;
            });

            // वेबसाइट पर रिजल्ट दिखाना
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
            resultContainer.innerHTML = `<p style="color: orange; text-align: center; font-weight: bold; padding: 20px;">क्षमा करें! इस पेड़ की जानकारी अभी डेटाबेस में नहीं है।</p>`;
        }

    } catch (error) {
        console.error("Error:", error);
        resultContainer.innerHTML = `<p style="color: red; text-align: center; font-weight: bold; padding: 20px;">डेटा लोड करने में समस्या आई या फ़ाइल मौजूद नहीं है।</p>`;
    }
}
