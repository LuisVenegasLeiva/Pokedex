let pokemonsData={}
let pokemonImgs={}
let pokemons={}

function loadPokemonEvolution(evolutions){
    const pokemonEvolution = document.getElementById('pokemonEvolution');
    pokemonEvolution.innerHTML=`
        <div class="title">
            <h3>Evolution Chart</h3>
        </div> 

        <div class="divEvolution">
        ${evolutions.map((pokemon,index) => {
            if (index==evolutions.length-1){
                return (`
                <div class="pokemon">
                    <img class="pokemonIconEv" src="${pokemonImgs[pokemon]}" >
                    <h3>${pokemon}</h3>
                </div>
                `)
            }
            return (`
            <div class="pokemon">
                <img class="pokemonIconEv" src="${pokemonImgs[pokemon]}" >
                <h3>${pokemon}</h3>
            </div>
            <span class="arrowImg">&#8594;</span>
            `)
            
        }).join('')}
        </div>  
    `;
}

async function getEggGroups(id){
    let eggGroups = fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
    .then((response) => response.json())
    .then((data) => {return data.egg_groups});

    let printAddress = async () => {
        const a = await eggGroups;
        return a
    };
    return printAddress();
}

/*
This function display all the needed information of the selected pokemon 
 */
async function loadPokemonData(id,name,img,height,weight,species,abilities,types){
    let eggGroups= await getEggGroups(id);
    console.log(eggGroups);

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
        <p><b>Egg Groups:</b> ${
            eggGroups.map((eggGroup,index) => {
                if (index == eggGroups.length-1 && index>0){
                    return (" and "+eggGroup.name)
                }
                return (" "+eggGroup.name)
            }).join(" ")
        }</p>
        <p><b>Abilities:</b> ${
            abilities.map(ability => {
                return (" "+ability.ability.name)
            })
        } </p>
    `;

    getEvolutionChain(id);
}

async function fetchEvolutionChain(url,id){
    let evolutions=[]
    await fetch(url)
    .then((response) => response.json())
    .then((data) => data.chain)
    .then((evolution) => {
        evolutions.push(evolution.species.name);
        console.log(evolution);
        try{
            evolutions.push(evolution.evolves_to[0].species.name);
            evolutions.push(evolution.evolves_to[0].evolves_to[0].species.name);
        }catch{

        }
    })
    loadPokemonEvolution(evolutions);
}

async function getEvolutionChain(id){
    await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
        .then((response) => response.json())
        .then((data) => data.evolution_chain.url)
        .then((url) => fetchEvolutionChain(url,id))

}

async function printPokemons(){
    let pokemonList = document.getElementById('pokemonList');

    await pokemonsData.map(pokemon => {
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

            pokemonImgs[pokemon.name]=imgDefault;

            let row=document.createElement('li');
            row.addEventListener('click', () => loadPokemonData(data.id,pokemon.name,imgDefault,height,weight,species,abilities,types));
            row.innerHTML=`                
                <img class="pokemonIcon" src=${img}>
                ${pokemon.name}
                <p class="stickyNumber">#${data.id}</p>
            `;
            pokemonList.append(row);

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