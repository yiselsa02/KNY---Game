const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.static("public"))
app.use(cors())
app.use(express.json())

const jugadores = []

class Jugador {
    constructor(id) {
        this.id = id
        this.ultimaConexion = Date.now()
    }

    asignarMokepon(mokepon) {
        this.mokepon = mokepon
        this.ultimaConexion = Date.now()
    }

    actualizarPosicion(x, y) {
        this.x = x
        this.y = y
        this.ultimaConexion = Date.now()
    }

    asignarAtaques(ataques) {
        this.ataques = ataques
        this.ultimaConexion = Date.now()
    }
}

class Mokepon {
    constructor(nombre) {
        this.nombre = nombre
    }
}

app.get("/unirse", (req, res) => {
    const id = `${Math.random()}`
    const jugador = new Jugador(id)

    jugadores.push(jugador)

    console.log("Jugador conectado:", id)

    res.send(id)
})

app.post("/mokepon/:jugadorId", (req, res) => {
    const jugadorId = req.params.jugadorId
    const nombre = req.body.mokepon || ""

    const jugador = jugadores.find(
        jugador => jugador.id === jugadorId
    )

    if (jugador) {
        jugador.asignarMokepon(
            new Mokepon(nombre)
        )

        console.log(
            "Mokepon seleccionado:",
            jugadorId,
            nombre
        )
    }

    res.sendStatus(200)
})

app.post("/mokepon/:jugadorId/posicion", (req, res) => {
    const jugadorId = req.params.jugadorId
    const x = req.body.x || 0
    const y = req.body.y || 0

    const jugador = jugadores.find(
        jugador => jugador.id === jugadorId
    )

    if (jugador) {
        jugador.actualizarPosicion(x, y)
    }

    limpiarJugadores()

    res.sendStatus(200)
})

app.get("/mokepon/:jugadorId/enemigos", (req, res) => {
    const jugadorId = req.params.jugadorId

    const enemigos = jugadores.filter(jugador =>
        jugador.id !== jugadorId &&
        jugador.mokepon &&
        jugador.mokepon.nombre &&
        typeof jugador.x === "number" &&
        typeof jugador.y === "number"
    )

    res.json({ enemigos })
})

app.post("/mokepon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId
    const ataques = req.body.ataques || []

    const jugador = jugadores.find(
        jugador => jugador.id === jugadorId
    )

    if (jugador) {
        jugador.asignarAtaques(ataques)
    }

    res.sendStatus(200)
})

app.get("/mokepon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId

    const jugador = jugadores.find(
        jugador => jugador.id === jugadorId
    )

    if (!jugador) {
        return res.json({
            ataques: []
        })
    }

    res.json({
        ataques: jugador.ataques || []
    })
})

function limpiarJugadores() {
    const ahora = Date.now()

    for (let i = jugadores.length - 1; i >= 0; i--) {
        if (
            ahora - jugadores[i].ultimaConexion >
            10000
        ) {
            console.log(
                "Jugador desconectado:",
                jugadores[i].id
            )

            jugadores.splice(i, 1)
        }
    }
}

app.listen(8080, () => {
    console.log("Servidor funcionando en el puerto 8080")
})