window.addEventListener('DOMContentLoaded', () => {
    // चूंकि दोनों फाइलें मेन फोल्डर में हैं, हम '../' (एक फोल्डर बाहर) का उपयोग करेंगे 
    // क्योंकि आपकी script.js 'search-engine' फोल्डर के अंदर है।
    fetch('../plants-data.json')
        .then(response => {
            if (!response.ok) {
                // अगर फिर भी न मिले, तो रूट से ट्राई करेगा
                return fetch('./plants-data.json');
            }
            return response.json();
        })
        .then(data => {
            // डेटा को एरे में बदलना
            plantDatabase = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            
            // डैशबोर्ड और ग्रिड रेंडर करना
            if (typeof createSmartDashboard === 'function') createSmartDashboard();
            if (typeof renderDatabaseGrid === 'function') renderDatabaseGrid(plantDatabase);
            
            console.log("डेटाबेस सफलतापूर्वक लोड हुआ!");
        })
        .catch(error => {
            console.error('डेटा लोड करने में त्रुटि:', error);
            // अलर्ट तब ही आएगा अगर फाइल बिल्कुल न मिले
        });
});
