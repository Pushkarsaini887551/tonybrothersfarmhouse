// पेड़ों का डेटा (Data)
const treeData = [
    { name: "नीम", scientific: "Azadirachta indica", category: "औषधीय", benefits: "त्वचा रोग और इन्फेक्शन में फायदेमंद।" },
    { name: "बरगद", scientific: "Ficus benghalensis", category: "धार्मिक / छायादार", benefits: "भारत का राष्ट्रीय वृक्ष, घनी छाया देता है।" },
    { name: "पीपल", scientific: "Ficus religiosa", category: "धार्मिक", benefits: "24 घंटे ऑक्सीजन देता है और पूजनीय है।" },
    { name: "आम", scientific: "Mangifera indica", category: "फलदार", benefits: "फलों का राजा, विटामिन्स से भरपूर।" }
];

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// सर्च फंक्शन
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    searchResults.innerHTML = ''; // पुराना रिजल्ट साफ करें

    if (query === '') return;

    // डेटा में मैच खोजना
    const filteredTrees = treeData.filter(tree => 
        tree.name.toLowerCase().includes(query) || 
        tree.scientific.toLowerCase().includes(query) ||
        tree.category.toLowerCase().includes(query)
    );

    // रिजल्ट को स्क्रीन पर दिखाना
    if (filteredTrees.length > 0) {
        filteredTrees.forEach(tree => {
            const div = document.createElement('div');
            div.className = 'tree-card';
            div.innerHTML = `
                <h3>${tree.name} <i>(${tree.scientific})</i></h3>
                <p><strong>श्रेणी:</strong> ${tree.category}</p>
                <p><strong>लाभ:</strong> ${tree.benefits}</p>
            `;
            searchResults.appendChild(div);
        });
    } else {
        searchResults.innerHTML = '<p class="no-result">कोई पेड़ नहीं मिला!</p>';
    }
});

