fetch("database.json")
.then(response => response.json())
.then(data => {

window.searchTree = function(){

let tree = document.getElementById("searchInput").value.trim().toLowerCase();

let result = document.getElementById("result");

let found = data.find(item =>
item.name.toLowerCase() === tree ||
item.english.toLowerCase() === tree
);

if(found){

result.innerHTML = `
<div class="card">
<h2>${found.name}</h2>
<p><b>English:</b> ${found.english}</p>
<p><b>Scientific:</b> ${found.scientific}</p>
<p>${found.info}</p>
</div>
`;

}else{

result.innerHTML = "<h2>❌ पेड़ नहीं मिला</h2>";

}

}

});
