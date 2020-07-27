const pokemonForm = document.getElementById('pokemonForm')
const pokemonInput = document.getElementById('pokemonInput')

const pokemonPlaceHolder = document.getElementById('pokemonPlaceHolder')
const pokemonSprite = document.getElementById('pokemon-sprite')
const pokemonId = document.getElementById('pokemon-id')
const pokemonHp = document.getElementById('pokemon-hp')
const pokemonAttack = document.getElementById('pokemon-attack')
const pokemonDefense = document.getElementById('pokemon-defense')

const loading = document.querySelector('.loading')
const foundPokemon = document.querySelector('#found-pokemon') 

const setPokemon = (pokemon) => {   
    const name = pokemon.name
    const url = pokemon.sprites.front_default
    const id = pokemon.id
    const hp = pokemon.stats[0].base_stat
    const attack = pokemon.stats[1].base_stat
    const defense = pokemon.stats[2].base_stat

    pokemonPlaceHolder.textContent = name
    pokemonSprite.src = url
    pokemonId.textContent = id
    pokemonHp.textContent = hp
    pokemonAttack.textContent = attack
    pokemonDefense.textContent = defense
}

pokemonForm.addEventListener('submit', (e) => {
    e.preventDefault()
    loading.textContent = 'Loading...'
    
    loading.setAttribute('style', 'display: inherit;')
    foundPokemon.setAttribute('style', 'display: none;')

    const pokemon = pokemonInput.value.trim().toLowerCase()
    if (pokemon === '') {
        loading.textContent = `Please entera valid pokemon...`
        return;
    };

    fetch('/pokemon?name=' + pokemon).then((response) => {
        response.json().then((pokemon) => {

            if (pokemon.error) {
                pokemonPlaceHolder.textContent = `Pokemon not found...`
                loading.textContent = `Pokemon not found...`
            } else {
                loading.setAttribute('style', 'display: none;')
                foundPokemon.setAttribute('style', 'display: flex;')
                setPokemon(pokemon)
            }
        })
    })
})
