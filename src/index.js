const { getPokemon } = require('./utils/pokeapi')
const { guessLetter } = require('./utils/guess')


const ejs = require('ejs')
const path = require('path')

const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../views')

app.set('view engine', 'ejs')
app.set('views', viewsPath)

app.use(express.static(publicPath))

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/hangman', (req, res) => {
    res.render('hangman.ejs')
})

app.get('/pokemon', async (req, res) => {

    if (!req.query.name) {
        return res.send({
            error: 'You must provide a valid pokemon'
        })
    }

    try {
        const { name, id, stats, sprites } = await getPokemon(req.query.name)
        res.send({
            name,
            id,
            stats,
            sprites
        })

    } catch (error) {
        res.send({ error })
    }

})

/*********SOCKET IO*******/

io.on('connection', async (socket) => {
    console.log('New socket connection!')

    //Im hardcoding the numbers because i did not find the exact number...
    const randomNumber = Math.floor(Math.random() * 807)
    const { name } = await getPokemon(randomNumber)
    const game = {
        _id: socket.id,
        pokemon: name.trim(),
        guesses: 5,
        lettersGuessed: [],
        gameOver: false,
        win: false,
    }

    socket.emit('start', game)

    socket.on('guess', (letter, callback) => {
        if (!game.gameOver) {
            guessLetter(game, letter)
            socket.emit('guessLetter', game)
        }
    })

    socket.on('removeError', () => {
        if (!game.gameOver) {
            delete game.error
            socket.emit('updateGame', game)
        }
    })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`Listening port ${port}`)
})