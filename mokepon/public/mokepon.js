const sectionSeleccionarAtaque = document.getElementById("seleccionar-ataque")
const botonMascotaJugador = document.getElementById("boton-mascota")
const botonReiniciar = document.getElementById("boton-reiniciar")
const sectionSeleccionarMascota = document.getElementById("seleccionar-mascota")
const sectionBotonReiniciar = document.getElementById("reiniciar")
const spanMascotaJugador = document.getElementById("mascota-jugador")
const spanMascotaEnemigo = document.getElementById("mascota-enemigo")
const spanVidasJugador = document.getElementById("vidas-jugador")
const spanVidasEnemigo = document.getElementById("vidas-enemigo")
const sectionMensajes = document.getElementById("resultado")
const ataqueDelJugador = document.getElementById("ataque-del-jugador")
const ataqueDelEnemigo = document.getElementById("ataque-del-enemigo")
const contenedorTarjetas = document.getElementById("contenedor-tarjetas")
const contenedorAtaques = document.getElementById("contenedor-ataques")
const sectionVerMapa = document.getElementById("ver-mapa")
const mapa = document.getElementById("mapa")
const lienzo = mapa.getContext("2d")

let jugadorId = null
let enemigoId = null
let mokepones = []
let ataqueJugador = []
let ataqueEnemigo = []
let mokeponesEnemigos = []
let mascotaJugador
let inputHipodoge
let inputCapipepo
let inputRatigueya
let botonTierra
let botonFuego
let botonAgua
let ataquesMokeponEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let intervalo
let intervaloEnemigos

sectionBotonReiniciar.style.display = "none"

const mapaBackground = new Image()
mapaBackground.src = "./assets/mokemap.png"

let anchoDelMapa = window.innerWidth - 20
const anchoMaximoDelMapa = 350

if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20
}

const alturaQueBuscamos = anchoDelMapa * 600 / 800

mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos

class Mokepon {
    constructor(nombre, foto, vida, fotoMapa, id = null) {
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.ancho = 40
        this.alto = 40
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadx = 0
        this.velocidady = 0
    }

    pintarMokepon() {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}

const hipodoge = new Mokepon(
    "Hipodoge",
    "./assets/mokepons_mokepon_hipodoge_attack.png",
    5,
    "./assets/hipodoge.png"
)

const capipepo = new Mokepon(
    "Capipepo",
    "./assets/mokepons_mokepon_capipepo_attack.png",
    5,
    "./assets/capipepo.png"
)

const ratigueya = new Mokepon(
    "Ratigueya",
    "./assets/mokepons_mokepon_ratigueya_attack.png",
    5,
    "./assets/ratigueya.png"
)

const HIPODOGE_ATAQUES = [
    { nombre: "💧", id: "boton-agua" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🌱", id: "boton-tierra" }
]

const CAPIPEPO_ATAQUES = [
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🔥", id: "boton-fuego" }
]

const RATIGUEYA_ATAQUES = [
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🌱", id: "boton-tierra" }
]

hipodoge.ataques.push(...HIPODOGE_ATAQUES)
capipepo.ataques.push(...CAPIPEPO_ATAQUES)
ratigueya.ataques.push(...RATIGUEYA_ATAQUES)

mokepones.push(
    hipodoge,
    capipepo,
    ratigueya
)

function iniciarJuego() {
    sectionSeleccionarAtaque.style.display = "none"
    sectionVerMapa.style.display = "none"

    mokepones.forEach(mokepon => {
        contenedorTarjetas.innerHTML += `
            <input type="radio" name="mascota" id="${mokepon.nombre}">
            <label class="tarjeta-de-mokepon" for="${mokepon.nombre}">
                <p>${mokepon.nombre}</p>
                <img src="${mokepon.foto}" alt="${mokepon.nombre}">
            </label>
        `
    })

    inputHipodoge = document.getElementById("Hipodoge")
    inputCapipepo = document.getElementById("Capipepo")
    inputRatigueya = document.getElementById("Ratigueya")

    botonMascotaJugador.addEventListener(
        "click",
        seleccionarMascotaJugador
    )

    unirseAlJuego()
}

function unirseAlJuego() {
    fetch("http://192.168.40.37:8080/unirse")
        .then(res => {
            if (!res.ok) {
                throw new Error("No se pudo conectar al servidor")
            }

            return res.text()
        })
        .then(id => {
            jugadorId = id
            console.log("Jugador conectado:", jugadorId)
        })
        .catch(error => {
            console.error(
                "Error conectando al servidor:",
                error
            )
        })
}

function seleccionarMascotaJugador() {
    if (!jugadorId) {
        alert("Espera un momento mientras te conectas al juego")
        return
    }

    if (inputHipodoge.checked) {
        spanMascotaJugador.innerHTML = inputHipodoge.id
        mascotaJugador = inputHipodoge.id
    } else if (inputCapipepo.checked) {
        spanMascotaJugador.innerHTML = inputCapipepo.id
        mascotaJugador = inputCapipepo.id
    } else if (inputRatigueya.checked) {
        spanMascotaJugador.innerHTML = inputRatigueya.id
        mascotaJugador = inputRatigueya.id
    } else {
        alert("Selecciona una mascota")
        return
    }

    sectionSeleccionarMascota.style.display = "none"
    seleccionarMokepon(mascotaJugador)
    extraerAtaques(mascotaJugador)
    sectionVerMapa.style.display = "flex"
    iniciarMapa()
}

function seleccionarMokepon(mascotaJugador) {
    fetch(`http://192.168.40.37:8080/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        })
    }).catch(error => {
        console.error(
            "Error seleccionando mokepon:",
            error
        )
    })
}

function extraerAtaques(mascotaJugador) {
    let ataques

    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            ataques = mokepones[i].ataques
        }
    }

    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques) {
    ataques.forEach(ataque => {
        contenedorAtaques.innerHTML += `
            <button id="${ataque.id}" class="boton-ataque BAtaque">
                ${ataque.nombre}
            </button>
        `
    })

    botonTierra = document.getElementById("boton-tierra")
    botonFuego = document.getElementById("boton-fuego")
    botonAgua = document.getElementById("boton-agua")
    botones = document.querySelectorAll(".BAtaque")
}

function secuenciaAtaque() {
    botones.forEach(boton => {
        boton.addEventListener("click", e => {
            const ataque = e.target.textContent.trim()

            if (ataque === "🔥") {
                ataqueJugador.push("FUEGO")
            } else if (ataque === "💧") {
                ataqueJugador.push("AGUA")
            } else {
                ataqueJugador.push("TIERRA")
            }

            boton.style.background = "#6f1317"
            boton.disabled = true

            if (ataqueJugador.length === 5) {
                enviarAtaques()
            }
        })
    })
}

function enviarAtaques() {
    fetch(`http://192.168.40.37:8080/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques() {
    if (!enemigoId) {
        return
    }

    fetch(
        `http://192.168.40.37:8080/mokepon/${enemigoId}/ataques`
    )
        .then(res => {
            if (!res.ok) {
                throw new Error("Error obteniendo ataques")
            }

            return res.json()
        })
        .then(({ ataques }) => {
            if (ataques.length === 5) {
                ataqueEnemigo = ataques
                combate()
            }
        })
        .catch(error => {
            console.error(
                "Error obteniendo ataques:",
                error
            )
        })
}

function seleccionarMascotaEnemigo() {
    const mascotaAleatoria = aleatorio(
        0,
        mokepones.length - 1
    )

    spanMascotaEnemigo.innerHTML =
        mokepones[mascotaAleatoria].nombre

    ataquesMokeponEnemigo =
        mokepones[mascotaAleatoria].ataques

    secuenciaAtaque()
}

function ataqueAleatorioEnemigo() {
    const ataqueAleatorio = aleatorio(
        0,
        ataquesMokeponEnemigo.length - 1
    )

    if (
        ataqueAleatorio === 0 ||
        ataqueAleatorio === 1
    ) {
        ataqueEnemigo.push("FUEGO")
    } else if (
        ataqueAleatorio === 3 ||
        ataqueAleatorio === 4
    ) {
        ataqueEnemigo.push("AGUA")
    } else {
        ataqueEnemigo.push("TIERRA")
    }

    iniciarPelea()
}

function iniciarPelea() {
    if (ataqueJugador.length === 5) {
        combate()
    }
}

function indexAmbosOponente(jugador, enemigo) {
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function combate() {
    clearInterval(intervalo)

    for (
        let index = 0;
        index < ataqueJugador.length;
        index++
    ) {
        if (
            ataqueJugador[index] ===
            ataqueEnemigo[index]
        ) {
            indexAmbosOponente(index, index)
            crearMensaje("EMPATE")
        } else if (
            ataqueJugador[index] === "FUEGO" &&
            ataqueEnemigo[index] === "TIERRA"
        ) {
            indexAmbosOponente(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML =
                victoriasJugador
        } else if (
            ataqueJugador[index] === "AGUA" &&
            ataqueEnemigo[index] === "FUEGO"
        ) {
            indexAmbosOponente(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML =
                victoriasJugador
        } else if (
            ataqueJugador[index] === "TIERRA" &&
            ataqueEnemigo[index] === "AGUA"
        ) {
            indexAmbosOponente(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML =
                victoriasJugador
        } else {
            indexAmbosOponente(index, index)
            crearMensaje("PERDISTE")
            victoriasEnemigo++
            spanVidasEnemigo.innerHTML =
                victoriasEnemigo
        }
    }

    revisarVidas()
}

function revisarVidas() {
    if (victoriasJugador === victoriasEnemigo) {
        crearMensajeFinal("Esto fue un empate!!")
    } else if (victoriasJugador > victoriasEnemigo) {
        crearMensajeFinal("FELICIDADES! Ganaste :D")
    } else {
        crearMensajeFinal("Lo siento, perdiste :c")
    }
}

function crearMensaje(resultado) {
    const nuevoAtaqueDelJugador =
        document.createElement("p")

    const nuevoAtaqueDelEnemigo =
        document.createElement("p")

    sectionMensajes.innerHTML = resultado

    nuevoAtaqueDelJugador.innerHTML =
        indexAtaqueJugador

    nuevoAtaqueDelEnemigo.innerHTML =
        indexAtaqueEnemigo

    ataqueDelJugador.appendChild(
        nuevoAtaqueDelJugador
    )

    ataqueDelEnemigo.appendChild(
        nuevoAtaqueDelEnemigo
    )
}

function crearMensajeFinal(resultadoFinal) {
    sectionMensajes.innerHTML = resultadoFinal
    sectionBotonReiniciar.style.display = "flex"
}

function reiniciarJuego() {
    location.reload()
}

function aleatorio(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

function pintarCanvas() {
    mascotaJugadorObjeto.x +=
        mascotaJugadorObjeto.velocidadx

    mascotaJugadorObjeto.y +=
        mascotaJugadorObjeto.velocidady

    if (mascotaJugadorObjeto.x < 0) {
        mascotaJugadorObjeto.x = 0
    }

    if (mascotaJugadorObjeto.y < 0) {
        mascotaJugadorObjeto.y = 0
    }

    if (
        mascotaJugadorObjeto.x >
        mapa.width - mascotaJugadorObjeto.ancho
    ) {
        mascotaJugadorObjeto.x =
            mapa.width - mascotaJugadorObjeto.ancho
    }

    if (
        mascotaJugadorObjeto.y >
        mapa.height - mascotaJugadorObjeto.alto
    ) {
        mascotaJugadorObjeto.y =
            mapa.height - mascotaJugadorObjeto.alto
    }

    lienzo.clearRect(
        0,
        0,
        mapa.width,
        mapa.height
    )

    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )

    mascotaJugadorObjeto.pintarMokepon()

    enviarPosicion(
        mascotaJugadorObjeto.x,
        mascotaJugadorObjeto.y
    )

    mokeponesEnemigos.forEach(mokepon => {
        mokepon.pintarMokepon()
        revisarColision(mokepon)
    })
}

function enviarPosicion(x, y) {
    fetch(
        `http://192.168.40.37:8080/mokepon/${jugadorId}/posicion`,
        {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                x,
                y
            })
        }
    ).catch(error => {
        console.error(
            "Error enviando posición:",
            error
        )
    })
}

function obtenerEnemigos() {
    if (!jugadorId) {
        return
    }

    fetch(
        `http://192.168.40.37:8080/mokepon/${jugadorId}/enemigos`
    )
        .then(res => {
            if (!res.ok) {
                throw new Error(
                    "Error obteniendo enemigos"
                )
            }

            return res.json()
        })
        .then(({ enemigos }) => {
            actualizarEnemigos(enemigos)
        })
        .catch(error => {
            console.error(
                "Error obteniendo enemigos:",
                error
            )
        })
}

function actualizarEnemigos(enemigos) {
    const enemigosActuales = []

    enemigos.forEach(enemigo => {
        if (
            !enemigo.mokepon ||
            !enemigo.mokepon.nombre
        ) {
            return
        }

        let mokeponEnemigo =
            mokeponesEnemigos.find(
                mokepon =>
                    mokepon.id === enemigo.id
            )

        if (!mokeponEnemigo) {
            const nombre =
                enemigo.mokepon.nombre

            if (nombre === "Hipodoge") {
                mokeponEnemigo = new Mokepon(
                    "Hipodoge",
                    "./assets/mokepons_mokepon_hipodoge_attack.png",
                    5,
                    "./assets/hipodoge.png",
                    enemigo.id
                )
            } else if (nombre === "Capipepo") {
                mokeponEnemigo = new Mokepon(
                    "Capipepo",
                    "./assets/mokepons_mokepon_capipepo_attack.png",
                    5,
                    "./assets/capipepo.png",
                    enemigo.id
                )
            } else if (nombre === "Ratigueya") {
                mokeponEnemigo = new Mokepon(
                    "Ratigueya",
                    "./assets/mokepons_mokepon_ratigueya_attack.png",
                    5,
                    "./assets/ratigueya.png",
                    enemigo.id
                )
            }
        }

        if (mokeponEnemigo) {
            mokeponEnemigo.x = enemigo.x
            mokeponEnemigo.y = enemigo.y

            enemigosActuales.push(
                mokeponEnemigo
            )
        }
    })

    mokeponesEnemigos = enemigosActuales
}

function moverDerecha() {
    mascotaJugadorObjeto.velocidadx = 5
}

function moverIzquierda() {
    mascotaJugadorObjeto.velocidadx = -5
}

function moverAbajo() {
    mascotaJugadorObjeto.velocidady = 5
}

function moverArriba() {
    mascotaJugadorObjeto.velocidady = -5
}

function detenerMovimiento() {
    mascotaJugadorObjeto.velocidadx = 0
    mascotaJugadorObjeto.velocidady = 0
}

function sePresionoUnaTecla(event) {
    switch (event.key) {
        case "w":
            moverArriba()
            break
        case "s":
            moverAbajo()
            break
        case "a":
            moverIzquierda()
            break
        case "d":
            moverDerecha()
            break
    }
}

function iniciarMapa() {
    mascotaJugadorObjeto =
        optenerObjetoMascota(mascotaJugador)

    intervalo = setInterval(
        pintarCanvas,
        50
    )

    intervaloEnemigos = setInterval(
        obtenerEnemigos,
        100
    )

    window.addEventListener(
        "keydown",
        sePresionoUnaTecla
    )

    window.addEventListener(
        "keyup",
        detenerMovimiento
    )
}

function optenerObjetoMascota() {
    for (let i = 0; i < mokepones.length; i++) {
        if (
            mascotaJugador ===
            mokepones[i].nombre
        ) {
            return mokepones[i]
        }
    }
}

function revisarColision(enemigo) {
    const margen = 8

    const izquierdaMascota =
        mascotaJugadorObjeto.x + margen

    const derechaMascota =
        mascotaJugadorObjeto.x +
        mascotaJugadorObjeto.ancho -
        margen

    const arribaMascota =
        mascotaJugadorObjeto.y + margen

    const abajoMascota =
        mascotaJugadorObjeto.y +
        mascotaJugadorObjeto.alto -
        margen

    const izquierdaEnemigo =
        enemigo.x + margen

    const derechaEnemigo =
        enemigo.x +
        enemigo.ancho -
        margen

    const arribaEnemigo =
        enemigo.y + margen

    const abajoEnemigo =
        enemigo.y +
        enemigo.alto -
        margen

    if (
        abajoMascota <= arribaEnemigo ||
        arribaMascota >= abajoEnemigo ||
        derechaMascota <= izquierdaEnemigo ||
        izquierdaMascota >= derechaEnemigo
    ) {
        return
    }

    detenerMovimiento()

    clearInterval(intervalo)
    clearInterval(intervaloEnemigos)

    console.log("se detecto una colision")

    enemigoId = enemigo.id

    sectionSeleccionarAtaque.style.display =
        "flex"

    sectionVerMapa.style.display =
        "none"

    seleccionarMascotaEnemigo(enemigo)
}

window.addEventListener(
    "load",
    iniciarJuego
)