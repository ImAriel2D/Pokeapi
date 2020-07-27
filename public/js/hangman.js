const socket = io()

const pokemonName = document.getElementById('pokemon-holder')
const lives = document.getElementById('lives')
const finalMessage = document.getElementById('final-message')
const guessButton = document.getElementById('guessButton')
const letters = document.getElementById('letters')
const error = document.getElementById('error')

const playAgainButton = document.getElementById('play-again')



guessButton.addEventListener('click', (e) => {
    e.preventDefault()

    const guessInput = document.getElementById('guessInput')
    const guess = guessInput.value
    guessInput.value = ''
    if (guess === '') return;

    socket.emit('guess', guess, () => {
        // console.log('Letter guessed!')
    })

})

playAgainButton.addEventListener('click', (e) => {
    location.reload(); 
})

const getGuessedLetters = (lettersArray) => {
    let letters = ''
    lettersArray.forEach((letter) => {
        letters += ('[' + letter + '] ')
    })

    return letters
}
const guessRandomLetter = (game) => {
    const pokemonNameLength = game.pokemon.length
    const randomNumber = Math.floor(Math.random() * pokemonNameLength)

    const randomLetter = game.pokemon[randomNumber]
    socket.emit('guess', randomLetter, () => {
        // console.log('Letter guessed!')
    })
}

const hideName = (name, lettersGuessed) => {
    const tempName = Array.from(name)
    let newNameHolder = '';

    tempName.forEach((element) => {
        const found = lettersGuessed.find((letter) => letter === element)

        if (found) {
            newNameHolder += element
            console.log(lettersGuessed)

        } else {
            newNameHolder += ' _ '
        }
    })

    return newNameHolder
}

const renderInformation = (game) => {
    //Render pokemon to the screen
    pokemonName.textContent = hideName(game.pokemon, game.lettersGuessed)
    //Render guesses left
    lives.textContent = game.guesses
    //Render letters
    letters.textContent = getGuessedLetters(game.lettersGuessed)
}

socket.on('start', (game) => {
    // console.log(game)
    guessRandomLetter(game)
    renderInformation(game)
})

socket.on('guessLetter', (game) => {
    // console.log(game)
    renderInformation(game)

    if (game.error !== '') {
        if (game.gameOver) {
            error.textContent = game.error
        } else {
            error.textContent = game.error
            socket.emit('removeError')
        }
    }

    if (game.gameOver) {
        if (game.win) {
            //You won
            finalMessage.textContent = `You have won!\n the answer was ${game.pokemon}`
        } else {
            //You lost
            finalMessage.textContent = `You have lost...\n the answer was ${game.pokemon}`
        }

        playAgainButton.setAttribute('style', 'display: inherit')
        finalMessage.setAttribute('style', 'display: inherit')
    }
})

