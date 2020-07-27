const { format } = require("path")


const repeatedLetter = (game, letter) => {
    const alreadyGuessed = game.lettersGuessed.find((tempLetter) => tempLetter === letter)

    if (alreadyGuessed) {
        return {
            game,
            error: `You already guessed letter ${letter}`
        }
    }

    return game
}

const badGuess = (game) => {
    game.guesses -= 1
    if (game.guesses <= 0) {
        game.gameOver = true
        game.error = `Game is already over!`
    }

    return game
}

const goodGuess = (game, letter) => {
    const pokemonNameArray = Array.from(game.pokemon)
    let indexes = []

    for (let i = 0; i < pokemonNameArray.length; i++) {

        if (pokemonNameArray[i] === letter) {
            indexes.push(i)
        }
    }

    return indexes
}

const checkForWin = (game, letter) => {


    const minimumPoints = game.pokemon.length
    let points = 0

    Array.from(game.pokemon).forEach(element => {
        
        game.lettersGuessed.forEach((letter) => {
            if (letter === element) {
                points++
            }
        }) 
    })

    if (points >= minimumPoints){
        game.win = true
        game.gameOver = true
        game.error = `Game is already over!`
        
        return game
    }

    return game
}

const guessLetter = (game, letter) => {

    const { error } = repeatedLetter(game, letter)

    if (error) {
        game.error = error
        return game;
    }

    game.lettersGuessed.push(letter)
    const isGoodGuess = goodGuess(game, letter)

    if (isGoodGuess.length > 0) {
        return checkForWin(game)

    } else {
        return badGuess(game)
    }
}

module.exports = {
    guessLetter
}


