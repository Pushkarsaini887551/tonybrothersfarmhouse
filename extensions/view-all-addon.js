// Tony Brothers Farm - All View Add-on Engine
(function() {
    // 1. CSS को डायनामिकली इंजेक्ट करना ताकि मुख्य CSS को बदलना न पड़े
    const style = document.createElement('style');
    style.innerHTML = `
        .action-mini-btn.all-view-btn {
            background: #1b5e20 !important;
            color: #ffffff !important;
            border-color: transparent !important;
        }
        .action-mini-btn.all-view-btn:hover {
            background: #2e7d32 !important;
            transform: scale(1.05);
        }
        /* ऑल व्यू फुल स्क्रीन ओवरले स्टाइल */
        .all-view-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 2000;
            display: flex; justify-content: center; align-items: center;
            opacity: 0; pointer-events: none;
            transition: opacity 0.3s ease;
        }
        .all-view-overlay.show { opacity: 1; pointer-events: auto; }
        .all-view-modal {
            background: var(--card-bg, #ffffff);
            color: var(--text-primary, #2d3748);
            width: 90%; max-width: 650px;
            border-radius: 16px; padding: 30px;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);
            position: relative;
            border-top: 8px solid #2e7d32;
            transform: translateY(20px); transition: transform 0.3s ease;
        }
        .all-view-overlay.show .all-view-modal { transform: translateY(0); }
        .close-modal-btn {
            position: absolute; top: 15px; right: 15px;
            background: #ef4444; color: white; border: none;
            width: 32px; height: 32px; border-radius: 50%;
            font-weight: bold; cursor: pointer; font-size: 1.1rem;
        }
    `;
    document.head.appendChild(style);

    // 2. ओवरले मोडल (Popup) को स्क्रीन पर तैयार करना
    const overlay = document.createElement('div');
    overlay.className = 'all-view-overlay';
    overlay.id = 'allViewOverlay';
    overlay.innerHTML = `
        <div class="all-view-modal">
            <button class="close-modal-btn" onclick="document.getElementById('allViewOverlay').classList.remove('show')">✕</button>
            <div id="allViewContent"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 3. ग्लोबल फंक्शन बनाना जो डेटा पॉपअप में लोड करेगा
    window.openAllViewModal = function(plantId) {
        if (typeof plantDatabase !== 'undefined') {
            const plant = plantDatabase.find(p => p.id === plantId);
            if (plant) {
                const content = document.getElementById('allViewContent');
                content.innerHTML = `
                    <h2 style="color:#2e7d32; margin-bottom:15px; font-size:2rem;">🌳 ${plant.hindiName}</h2>
                    <p style="font-style:italic; color:gray; margin-bottom:20px;">🧬 ${plant.scientificName}</p>
                    <hr style="border:0; border-top:1px dashed #e2e8f0; margin-bottom:15px;">
                    <div style="font-size:1.1rem; line-height:1.8;">
                        <p style="margin-bottom:10px;"><strong>📍 प्राप्ति स्थान:</strong> ${plant.location}</p>
                        <p style="margin-bottom:10px;"><strong>💧 सिंचाई/पानी:</strong> ${plant.water}</p>
                        <p style="margin-bottom:10px;"><strong>🌸 बौर/फूल समय:</strong> ${plant.season}</p>
                        <p style="margin-bottom:15px; color:#2e7d32;"><strong>💊 औषधीय लाभ:</strong> ${plant.benefits}</p>
                        <div style="background:#e8f5e9; padding:15px; border-radius:8px; border-left:5px solid #2e7d32; color:#2d3748;">
                            <strong>🎯 पूर्ण वृत्तांत:</strong> ${plant.description}
                        </div>
                    </div>
                `;
                document.getElementById('allViewOverlay').classList.add('show');
            }
        }
    };

    // 4. मुख्य ग्रिड रेंडर होने के बाद बटन को डायनामिकली जोड़ना
    function injectAllViewButtons() {
        const actionDecks = document.querySelectorAll('.action-button-deck');
        actionDecks.forEach(deck => {
            // चेक करें कि बटन पहले से मौजूद तो नहीं है
            if (!deck.querySelector('.all-view-btn')) {
                // पैरेंट कार्ड से प्लांट आईडी निकालना
                const triggerNode = deck.closest('.classic-plant-card');
                if (triggerNode) {
                    const plantId = triggerNode.id.replace('card-', '');
                    
                    const allViewBtn = document.createElement('button');
                    allViewBtn.className = 'action-mini-btn all-view-btn';
                    allViewBtn.innerHTML = '👁️ All View';
                    allViewBtn.setAttribute('onclick', `openAllViewModal('${plantId}')`);
                    
                    // बटन को बाकी बटन्स के साथ सबसे पहले जोड़ना
                    deck.insertBefore(allViewBtn, deck.firstChild);
                }
            }
        });
    }

    // जब भी कोई सर्च या फ़िल्टर हो, तो बटन्स को इन्जेक्ट करते रहना (Mutation Observer)
    const observer = new MutationObserver(() => {
        injectAllViewButtons();
    });

    const targetGrid = document.getElementById('plantsGrid');
    if (targetGrid) {
        observer.observe(targetGrid, { childList: true });
        // पहली बार लोड होने पर ट्रिगर करें
        setTimeout(injectAllViewButtons, 500);
    }
})();

