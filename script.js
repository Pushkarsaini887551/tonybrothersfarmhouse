async function searchTree() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultContainer = document.getElementById('resultContainer');

    // 1. खाली सर्च चेक करें
    if (!query) {
        resultContainer.innerHTML = `<p style="color: red; text-align: center; font-weight: bold; padding: 20px;">कृपया पेड़ का नाम दर्ज करें।</p>`;
        return;
    }

    try {
        // 2. डेटा फ़ाइल लोड करें
        const response = await fetch('./plants-data.json'); 
        
        if (!response.ok) {
            throw new Error("फ़ाइल लोड नहीं हो सकी");
        }

        const treesData = await response.json();

        // 3. चेक करें कि क्या डेटाबेस में सर्च किया गया पेड़ मौजूद है
        if (treesData[query]) {
            const tree = treesData[query];
            
            // usesList बनाने का लॉजिक
            let usesList = '';
            if (Array.isArray(tree.uses)) {
                tree.uses.forEach(use => {
                    usesList += `<li>${use}</li>`;
                });
            }

            // 4. रिजल्ट कार्ड रेंडर करें
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
            // 5. अगर पेड़ डेटाबेस में नहीं है
            resultContainer.innerHTML = `<p style="color: orange; text-align: center; font-weight: bold; padding: 20px;">क्षमा करें! "${query}" नाम का पेड़ अभी हमारे डेटाबेस में नहीं है।</p>`;
        }
    } catch (error) {
        console.error("Error:", error);
        resultContainer.innerHTML = `<p style="color: red; text-align: center; font-weight: bold; padding: 20px;">सर्वर या फ़ाइल लोड करने में समस्या आई। कृपया बाद में प्रयास करें।</p>`;
    }
}
