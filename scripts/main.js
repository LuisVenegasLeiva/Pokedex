let pokemonsData={}
let pokemons={}

function loadPokemonData(name,img,height,weight,species,abilities,types){
    const infoImage = document.getElementById('infoImage');
    infoImage.innerHTML=`
        <img class="pokemonIconBig" src="${img}" >
        <h3>${name}</h3>
        <div class="types">
        ${types.map(type => {
            return (`<div class="type">${type.type.name}</div>`)
        }).join('')}
    `;

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
    `;
}

let evolutions={}
async function fetchEvolutionChain(url,id){
    if(evolutions[id] === undefined){
        await fetch(url)
        .then((response) => response.json())
        .then((data) => data.chain)
        .then((evolution) => {
            evolutions[id]=[evolution.species.name];
            try{
                evolutions[id].push(evolution.evolves_to[0].species.name);
                evolutions[id].push(evolution.evolves_to[0].evolves_to[0].species.name);
            }catch{

            }


        })
        Object.keys(evolutions).forEach(function(key, index) {
            console.log(key, evolutions[key]);
          });


    }
}


async function getEvolutionChain(id){
    await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
        .then((response) => response.json())
        .then((data) => data.evolution_chain.url)
        .then((url) => fetchEvolutionChain(url,id))


    const evolution = document.getElementById('pokemonEvolution');
    evolution.innerHTML="hola";  
}

async function printPokemons(){
    let pokemonList = document.getElementById('pokemonList');

    pokemonsData.map(pokemon => {
        fetch(pokemon.url)
        .then((response) => response.json())
        .then((data) => {
            let img=data.sprites.front_default;
            let height=data.height;
            let weight=data.weight;
            let species=data.species.name;
            let abilities=data.abilities
            let imgDefault=data.sprites.other["official-artwork"].front_default;
            let types=data.types;

            console.log(data);

            let row=document.createElement('li');
            row.addEventListener('click', () => loadPokemonData(pokemon.name,imgDefault,height,weight,species,abilities,types));
            row.innerHTML=`                
                <img class="pokemonIcon" src=${img}>
                ${pokemon.name}
                <p class="stickyNumber">#${data.id}</p>
            `;
            pokemonList.append(row);

            getEvolutionChain(data.id);
        });
    })   
}

async function fetchData(){
    await fetch('https://pokeapi.co/api/v2/pokemon/')
    .then((response) => response.json())
    .then((data) => {pokemonsData=data.results;})
    .then(() => printPokemons());
};


async function start(){
    await fetchData();
}

start();