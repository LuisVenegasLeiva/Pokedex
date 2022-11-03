let pokemonsData={}   //Pokemon data for display in list or search
let pokemonsSearch={} //Results of pokemon search

//Function used to get images individualy to avoid unnecesary loads in pokemon chain evolution
async function getPokemonImage(url){
    let promise = fetch(url)
    .then((response) => response.json())
    .then((data) => {return data.id});

    let urlGet =  async () => {
        const a = await promise;
        return a
    };
    result=await urlGet()
    return result;
}

/* This funcion displays the evolution chain for a selected pokemon */
async function loadPokemonEvolution(evolutions){
    const pokemonEvolution = document.getElementById('pokemonEvolution');

    let evolutionsIds=[]
    //This is not the best way, but if i use a loop, then i get promises, so this could be a temporal way.
    try{
        evolutionsIds.push(await getPokemonImage(evolutions[0][1]))
        evolutionsIds.push(await getPokemonImage(evolutions[1][1]))
        evolutionsIds.push(await getPokemonImage(evolutions[2][1]))
    }
    catch{
        //Nothing happens
    }

    pokemonEvolution.innerHTML=`
        <div class="title">
            <h3>Evolution Chart</h3>
        </div> 
        <div class="divEvolution">
        
        ${await evolutions.map((pokemon,index) => {
            if (index==evolutions.length-1){
                //console.log(pokemon);
                return (`
                <div class="pokemonEv">
                    <img class="pokemonIconEv" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutionsIds[index]}.png" >
                    <h3>${pokemon[0]}</h3>
                </div>
                `)
            }
            return (`
            <div class="pokemonEv">
                <img class="pokemonIconEv" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutionsIds[index]}.png" >
                <h3>${pokemon[0]}</h3>
            </div>
            <span class="arrowImg">&#8594;</span>
            `)
        }).join('')}
        </div>  
    `;
}

//Function that fetch the egg groups for a selected pokemon
async function getEggGroups(id){
    try{
        let eggGroups = fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
        .then((response) => response.json())
        .then((data) => {return data.egg_groups});
    
        let groups = async () => {
            const a = await eggGroups;
            return a
        };
        return groups();
    }
    catch{
        return []
    }
}

/*
This function display all the needed information of the selected pokemon, including data and html design
 */
async function loadPokemonData(id,name,img,height,weight,species,abilities,types){
    let eggGroups= await getEggGroups(id);

    const infoImage = document.getElementById('infoImage');
    infoImage.innerHTML=`
        <img class="pokemonIconBig" src="${img}" >
        <h3>${name}</h3>
        <div class="types">
        ${types.map(type => {
            return (`<div class="type">${type.type.name}</div>`)
        }).join('')}
    `;
    //      div line        //
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
        }
        </p>
        
        <p><b>Abilities:</b> ${
            abilities.map(ability => {
                return (" "+ability.ability.name)
            })
        }
        </p>
    `;
    getEvolutionChain(id);
}

//Gets the pokemons of the evolution chain
async function fetchEvolutionChain(url,id){
    console.log(url);
    let evolutions=[]
    await fetch(url)
    .then((response) => response.json())
    .then((data) => data.chain)
    .then((evolution) => {
        evolutions.push([evolution.species.name,evolution.species.url]);
        //console.log(evolution);
        try{
            evolutions.push([evolution.evolves_to[0].species.name,evolution.evolves_to[0].species.url]);
            evolutions.push([evolution.evolves_to[0].evolves_to[0].species.name,evolution.evolves_to[0].evolves_to[0].species.url]);
        }catch{
            //Nothing happens
        }
    })
    loadPokemonEvolution(evolutions);
}

//Get The evolution chain for a selected pokemon
async function getEvolutionChain(id){
    await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
        .then((response) => response.json())
        .then((data) => data.evolution_chain.url)
        .then((url) => fetchEvolutionChain(url,id))
}

//Add the new pokemons to the list
async function printPokemons(list){
    let pokemonList = document.getElementById('pokemonList');

    await list.map(pokemon => {
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

            let row=document.createElement('li');
            row.addEventListener('click', () => loadPokemonData(data.id,pokemon.name,imgDefault,height,weight,species,abilities,types));
            let id;
            if (data.id<100){
                id = String(data.id).padStart(3, '0');
            }else{
                id = data.id
            }
            row.innerHTML=`                
                <img class="pokemonIcon" src=${img}>
                <h3 class="pokemonName">${pokemon.name}</h3>
                <p class="stickyNumber">#${id}</p>
            `;
            pokemonList.append(row);
        });
    })   
}

//Fetch all the pokemon data from the url
async function fetchData(url){
    await fetch(url)
    .then((response) => response.json())
    .then((data) => {pokemonsSearch=data.results; urlData=data.next;})
    .then(() => printPokemons(pokemonsSearch));
};


//This funcion runs when the user open the web page and when is needed to load more elements with the infinite scroll
let range=0;
let limit=900; //This limit variable exists a lot of pokemon data after this number is incomplete
let urlData= `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20`
async function loadNext(){
    if (range<limit){
        await fetchData(urlData).then(range+=20);
    }
}


/* All the infinite scroll code */
let loading=false;
let pokemonList = document.getElementById('list');
//Add the action listener and allows the user to load more pokemon each 0.5 seconds to have a better control of the new fetchs.
function initScroll(){
    pokemonList.addEventListener('scroll',()=>{
    if (loading==false){
        if (pokemonList.scrollTop > pokemonList.scrollHeight-1000 ){
            loading=true;
            setTimeout(() => {
                loadNext();
                loading=false;
            }, 500);
        }
    }
})
}

//Clean selected pokemon info
function setInicialTitle(){
    const infoImage = document.getElementById('infoImage');
    infoImage.innerHTML=`
        <img src="./media/poke.png" >
    `;

    const infoData = document.getElementById('infoData');
    infoData.innerHTML=`
        <h1>Pokédex</h1>
        <h2>Luis Venegas</h2>
    `;
    document.getElementById('pokemonEvolution').innerHTML="";
}


/* Load all pokemons data (This load is necessary to use the searchbox)
In case that the program wouldn't have the search box, we can get rid of this function */
async function loadDataForSearch(){
    await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${limit}`)
    .then((response) => response.json())
    .then((data) =>{
        const thisData=data.results;
        pokemonsData=thisData
        });
}

/* This function is triggered when the user enter text in the search-box and press enter */
function searchPokemon(name){
    name=name.toLowerCase();
    let pokemonList = document.getElementById('pokemonList');
    pokemonList.innerHTML="";
    setInicialTitle();
    if (name==""){
        let input=document.getElementById("searchPokemon");
        input.style.display="none";
        urlData= `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20`
        loading=false
        loadNext();
    }else{
        const results=pokemonsData.filter(pokemon=> pokemon.name.includes(name));
        //Clear the actual pokemon list
        printPokemons(results);
        loading=true;
    }
}

//Init program
loadDataForSearch();
loadNext();         //Load first n pokemons
initScroll();       //Allows Infinite Scrolling
setInicialTitle();  //Put some elements in initial screen
 
