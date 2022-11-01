let pokemonsData={}
let pokemons={}

function loadPokemonData(name,img,height,weight,species,abilities){
    const infoImage = document.getElementById('infoImage');
    infoImage.innerHTML=`
        <img class="pokemonIconBig" src="${img}" >
        <h3>${name}</h3>

    `
    const infoData = document.getElementById('infoData');
    infoData.innerHTML=`
        <h3>Information </h3>
        <p><b>Weight:</b> ${weight}</p>
        <p><b>Height:</b> ${height} </p>
        <p><b>Species:</b> ${species} </p>
        <p><b>Egg Groups:</b> </p>
        <p><b>Abilities:</b> ${
            abilities.map(ability => {
                return (" "+ability.ability.name)
            })
        } </p>
    `
}

async function printPokemons(){
    const pokemonList = document.getElementById('pokemonList');
    pokemonsData.map(pokemon => {
        fetch(pokemon.url)
        .then((response) => response.json())
        .then((data,img) => {
            img=data.sprites.front_default;
            height=data.height;
            weight=data.weight;
            species=data.species.name;
            abilities=data.abilities
            imgDefault=data.sprites.other["official-artwork"].front_default;

            param=pokemon.name,img,height,weight,species,abilities

            //console.log(img);
            pokemonList.innerHTML += `
            <li onclick=loadPokemonData('${pokemon.name}','${imgDefault}',${height},${weight},'${species}',abilities) id=${data.id}>
                <img class="pokemonIcon" src=${img}>
                ${pokemon.name}
                <p class="stickyNumber">#${data.id}</p>
            </li>`;
        });


    })   
}

async function fetchData(){
    fetch('https://pokeapi.co/api/v2/pokemon/')
    .then((response) => response.json())
    .then((data) => {pokemonsData=data.results;})
    .then(() => printPokemons());
};


async function start(){
    await fetchData();
}

start();