// पेज लोड होने पर इनिशियलाइज़ेशन
window.addEventListener('DOMContentLoaded', () => {
    // यहाँ हमने पाथ को './' कर दिया है ताकि यह आपकी साइट के रूट से फाइल को ढूँढे
    fetch('./plants-data.json')
        .then(response => {
            if (!response.ok) {
                // अगर फाइल नहीं मिलती, तो एक बार दूसरा रास्ता ट्राई करें
                return fetch('../plants-data.json');
            }
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
            console.error('डेटा लोड करने में त्रुटि:', error);
            alert("डेटा फाइल नहीं मिल रही है, कृपया फाइल का नाम चेक करें!");
        });
});
