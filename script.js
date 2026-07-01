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
<img src="${found.image}">

<h2>${found.name}</h2>

<p><b>🔬 वैज्ञानिक नाम:</b> ${found.scientific}</p>

<p><b>🌿 परिवार:</b> ${found.family}</p>

<p><b>📍 भारत में:</b> ${found.state}</p>

<p><b>🌱 उपयोग:</b> ${found.uses}</p>

<p><b>📖 जानकारी:</b> ${found.info}</p>

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
let slideIndex = 0;
showSlides();

function showSlides() {
  let slides = document.getElementsByClassName("slides");

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slideIndex++;

  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  slides[slideIndex - 1].style.display = "block";

  setTimeout(showSlides, 4000); // हर 4 सेकंड में फोटो बदलेगी
}
function showSuggestions(){

const trees = [
"नीम",
"पीपल",
"बरगद",
"आम",
"बांस",
"अर्जुन",
"शीशम",
"जामुन",
"अशोक",
"सागौन"
];

let input = document.getElementById("searchInput").value.toLowerCase();

let suggestions = document.getElementById("suggestions");

suggestions.innerHTML = "";

if(input==="") return;

trees.forEach(tree=>{

if(tree.toLowerCase().includes(input)){

suggestions.innerHTML +=
`<div onclick="selectTree('${tree}')">${tree}</div>`;

}

});

}

function selectTree(name){

document.getElementById("searchInput").value = name;

document.getElementById("suggestions").innerHTML = "";

}
document.getElementById("searchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchTree();
    }
});
