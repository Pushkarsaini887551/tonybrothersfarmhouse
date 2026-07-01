// Tony Brothers Farm House V2.0

let trees = [];
let slideIndex = 0;

// Load Database
fetch("trees.json")
.then(res => res.json())
.then(data=>{
    trees = data;
})
.catch(()=>{
    document.getElementById("result").innerHTML =
    "<h2 style='text-align:center'>❌ trees.json लोड नहीं हुई</h2>";
});

// ----------------------
// Search
// ----------------------

function searchTree(){

let text=document.getElementById("searchInput").value.trim().toLowerCase();

if(text=="") return;

let found=trees.find(tree=>

tree.name.toLowerCase()==text ||

tree.english.toLowerCase()==text

);

let result=document.getElementById("result");

if(found){

result.innerHTML=`

<div class="card">

<img src="${found.image}" onerror="this.src='profile.jpg'">

<h2>${found.name}</h2>

<p><b>English :</b> ${found.english}</p>

<p><b>Scientific :</b> ${found.scientific}</p>

<p><b>Family :</b> ${found.family}</p>

<p><b>Category :</b> ${found.category}</p>

<p><b>State :</b> ${found.state}</p>

<p><b>Uses :</b> ${found.uses}</p>

<p>${found.info}</p>

<button class="fav-btn" onclick="addFavourite(${found.id})">

❤️ Favourite

</button>

</div>

`;

}else{

result.innerHTML=`

<div class="card">

<h2>❌ पेड़ नहीं मिला</h2>

</div>

`;

}

}

// ----------------------
// Suggestions
// ----------------------

function showSuggestions(){

let input=document.getElementById("searchInput").value.toLowerCase();

let box=document.getElementById("suggestions");

box.innerHTML="";

if(input=="") return;

trees.forEach(tree=>{

if(

tree.name.toLowerCase().includes(input)

||

tree.english.toLowerCase().includes(input)

){

box.innerHTML+=`

<div onclick="selectTree('${tree.name}')">

${tree.name}

</div>

`;

}

});

}

function selectTree(name){

document.getElementById("searchInput").value=name;

document.getElementById("suggestions").innerHTML="";

searchTree();

}

// ----------------------
// Slider
// ----------------------

showSlides();

function showSlides(){

let slides=document.getElementsByClassName("slides");

for(let i=0;i<slides.length;i++){

slides[i].style.display="none";

}

slideIndex++;

if(slideIndex>slides.length){

slideIndex=1;

}

slides[slideIndex-1].style.display="block";

setTimeout(showSlides,4000);

}

// ----------------------
// Category Filter
// ----------------------

function filterTrees(category){

let result=document.getElementById("result");

result.innerHTML="";

let filtered=trees;

if(category!="all"){

filtered=trees.filter(tree=>tree.category==category);

}

filtered.forEach(tree=>{

result.innerHTML+=`

<div class="card">

<img src="${tree.image}" onerror="this.src='profile.jpg'">

<h2>${tree.name}</h2>

<p>${tree.info}</p>

<button class="fav-btn"

onclick="addFavourite(${tree.id})">

❤️ Favourite

</button>

</div>

`;

});

}

// ----------------------
// Favourite
// ----------------------

let favourites=[];

function addFavourite(id){

if(!favourites.includes(id)){

favourites.push(id);

alert("❤️ Favourite Added");

}else{

alert("पहले से Favourite में है");

}

}
