let trees = [];

fetch("trees.json")
.then(response => response.json())
.then(data => {
    trees = data;
});

function searchTree() {

    let text = document.getElementById("searchInput").value.trim().toLowerCase();

    let found = trees.find(tree =>
        tree.name.toLowerCase() === text ||
        tree.english.toLowerCase() === text
    );

    let result = document.getElementById("result");

    if(found){

        result.innerHTML = `
        <div class="card">
            <h2>${found.name}</h2>
            <p><b>English:</b> ${found.english}</p>
            <p>${found.info}</p>
        </div>
        `;

    }else{

        result.innerHTML = `
        <div class="card">
            <h2>❌ पेड़ नहीं मिला</h2>
        </div>
        `;

    }

}
