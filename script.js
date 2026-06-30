fetch("trees.json")
.then(response => response.json())
.then(data => {

window.searchTree = function() {

let tree = document.getElementById("searchInput").value.trim().toLowerCase();

let result = document.getElementById("result");

let found = data.find(item =>
item.name.toLowerCase() === tree ||
item.english.toLowerCase() === tree
);

if(found){

result.innerHTML = `
<div class="card">
<img src="${found.image}" style="width:100%;border-radius:10px;">
<h2>${found.name}</h2>
<p>${found.info}</p>
</div>
`;

}else{

result.innerHTML = "<h2>❌ पेड़ नहीं मिला</h2>";

}

}

});
