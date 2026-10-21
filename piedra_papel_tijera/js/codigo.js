let jugador = 0;
let pc = 0;
let triunfos = 0;
let perdidas = 0;

while (triunfos < 3 && perdidas < 3) {
    pc = aleatorio(1, 3);
    jugador = prompt("Elige: 1 para piedra, 2 para papel, 3 para tijera");

    alert("pc elige: " + eleccion(pc));
    alert("Tú eliges: " + eleccion(jugador));

    //combate
    if (pc == jugador) {
        alert("Empate");
    } else if (jugador == 1 && pc == 3) {
        alert("Ganaste");
        triunfos = triunfos + 1;
    } else if (jugador == 2 && pc == 1) {
        alert("Ganaste");
        triunfos = triunfos + 1;
    } else if (jugador == 3 && pc == 2) {
        alert("Ganaste");
        triunfos = triunfos + 1;
    } else {
        alert("Perdiste");
        perdidas = perdidas + 1;
    }
}

alert("Ganaste: " + triunfos + " veces y perdiste: " + perdidas + " veces");

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function eleccion(jugada) {
    let resultado = "";
    if (jugada == 1) {
        resultado = "piedra 🪨";
    } else if (jugada == 2) {
        resultado = "papel 📄";
    } else if (jugada == 3) {
        resultado = "tijera ✂️";
    } else {
        return "Opción inválida";
    }
    return resultado;
}

// 1 es piedra, 2 es papel, 3 es tijera
