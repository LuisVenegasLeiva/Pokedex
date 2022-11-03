let input=document.getElementById("searchPokemon");

function showInput(){
    input.style.display="initial";
}

let selected=0;
function selectItem(id){
    quitActiveClass();
    let item=document.getElementById('pokemon'+id);
    item.classList.add("active");
    selected=id;
}

function quitActiveClass(){
    try{
        let item=document.getElementById('pokemon'+selected);
        item.classList.remove("active");
    }catch{
        //None item selected
    }
}