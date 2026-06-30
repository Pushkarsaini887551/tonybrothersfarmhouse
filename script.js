function searchTree(){

let tree = document.getElementById("searchInput").value.trim().toLowerCase();

let data = {

"नीम":{
name:"🌿 नीम",
info:"नीम एक औषधीय पेड़ है।",
image:"https://upload.wikimedia.org/wikipedia/commons/2/20/Azadirachta_indica.jpg"
},

"आम":{
name:"🥭 आम",
info:"आम भारत का सबसे लोकप्रिय फलदार पेड़ है।",
image:"https://upload.wikimedia.org/wikipedia/commons/9/90/Hapus_Mango.jpg"
},

"पीपल":{
name:"🌳 पीपल",
info:"पीपल पर्यावरण के लिए बहुत महत्वपूर्ण पेड़ है।",
image:"https://upload.wikimedia.org/wikipedia/commons/4/4f/Ficus_religiosa_tree.jpg"
}

};

let result=document.getElementById("result");

if(data[tree]){
result.innerHTML=`
<div class="card">
<img src="${data[tree].image}" style="width:100%;border-radius:10px;">
<h2>${data[tree].name}</h2>
<p>${data[tree].info}</p>
</div>`;
}else{
result.innerHTML="<h2>❌ पेड़ नहीं मिला</h2>";
}

}
