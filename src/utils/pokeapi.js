const request = require('request-promise')

getPokemon = async (pokemonIndex) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`
    return await request({ url, json: true })
}

module.exports = {
    getPokemon
}