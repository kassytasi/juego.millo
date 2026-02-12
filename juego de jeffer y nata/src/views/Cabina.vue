<template>
  <div class="neon-cabina">

    <!-- JUEGO -->
    <div class="game-arena" v-if="!terminado">

      <!-- BARRA SUPERIOR -->
      <div class="neon-bar">
        <div class="user-tag">
          <span class="dot"></span>
          👤 {{ nombreJugador }}
        </div>
      <div class="lifeline-panel">
  <button class="lifeline-neon" :disabled="telefonoUsado" @click="usarTelefono">📞</button>
  <button class="lifeline-neon" :disabled="publicoUsado" @click="usarPublico">👥</button>
  <button class="lifeline-neon" :disabled="cincuentaUsado" @click="usar5050">50:50</button>
</div>

        <div class="prize-neon">
          <span class="prize-glow">${{ premioActual }}</span>
        </div>
      </div>

      <!-- PREGUNTA -->
      <div class="neon-question">
        <div class="question-content">{{ preguntaActual.texto }}</div>
      </div>

      <!-- RESPUESTAS -->
      <div class="neon-answers">
        <button
          v-for="(resp, i) in preguntaActual.respuestas"
          :key="i"
          :class="[
            'answer-neon',
            `answer-${i}`,
            claseRespuesta(i),
            respuestasOcultas.includes(i) ? 'dim-neon' : ''
          ]"
          @click="clickRespuesta(i)"
          :disabled="respondido || respuestasOcultas.includes(i)"
        >
          <span class="answer-neon-letter">{{ letras[i] }}</span>
          <span class="answer-neon-text">{{ resp }}</span>
        </button>
      </div>
    </div>

    <!-- ESCALERA -->
    <div class="neon-ladder">
      <div class="ladder-header">💰 PREMIOS</div>
      <div class="ladder-list">
        <div
          v-for="(nivel, idx) in niveles.slice().reverse()"
          :key="idx"
          :class="['ladder-neon-step', {
            'active': (niveles.length - idx - 1) === nivelActual,
            'safe': nivel.seguro
          }]">
          <span>{{ nivel.nivel }}</span>
          <span>${{ nivel.premio }}</span>
        </div>
      </div>
    </div>

    <!-- RESULTADO -->
    <div class="neon-result" v-if="terminado">
      <div class="result-glitch" :class="{ 'win': gano }">
        {{ gano ? 'VICTORIA' : 'GAME OVER' }}
      </div>
      <div class="result-prize-neon">
        ${{ gano ? premioActual : premioSeguro }}
      </div>
      <button class="neon-restart" @click="reiniciarJuego">⚡ JUGAR ⚡</button>
    </div>

    <!-- ANIMACIONES DE AYUDAS - SOLO ESTO AGREGUÉ -->
    <div v-if="mostrarAnimacionTelefono" class="animacion-ayuda telefono-anim">
      <div class="onda-llamada" v-for="i in 3" :key="i"></div>
      <div class="icono-llamada">📞</div>
      <div class="burbuja">¡LLAMANDO!</div>
    </div>

    <div v-if="mostrarAnimacionPublico" class="animacion-ayuda publico-anim">
      <div class="gente" v-for="i in 5" :key="i">👤</div>
      <div class="burbuja-publico">👥 ENCUESTA</div>
    </div>

    <div v-if="mostrarAnimacion5050" class="animacion-ayuda cincuenta-anim">
      <div class="rayo">⚡</div>
      <div class="rayo">⚡</div>
      <div class="rayo">⚡</div>
      <div class="burbuja-5050">50:50</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const letras = ['A', 'B', 'C', 'D']

// Datos jugador
const nombreJugador = localStorage.getItem('nombreJugador') || 'Jugador'
const dificultad = sessionStorage.getItem('dificultad') || 'facil'

// Estados del juego
const nivelActual = ref(0)
const respondido = ref(false)
const terminado = ref(false)
const gano = ref(false)
const respuestaElegida = ref(null)
const respuestasOcultas = ref([])

// Ayudas usadas
const telefonoUsado = ref(false)
const publicoUsado = ref(false)
const cincuentaUsado = ref(false)

// 👇 NUEVAS ANIMACIONES
const mostrarAnimacionTelefono = ref(false)
const mostrarAnimacionPublico = ref(false)
const mostrarAnimacion5050 = ref(false)

// Preguntas
const preguntasPorDificultad = {
  facil: [
    { texto: 'Capital de Francia?', correcta: 1, respuestas: ['Madrid', 'París', 'Roma', 'Berlín'] },
    { texto: 'Color del cielo despejado?', correcta: 0, respuestas: ['Azul', 'Rojo', 'Verde', 'Negro'] },
    { texto: 'Planeta más cercano al Sol?', correcta: 0, respuestas: ['Mercurio', 'Venus', 'Tierra', 'Marte'] },
    { texto: 'Cuántos días tiene un año bisiesto?', correcta: 3, respuestas: ['364', '365', '363', '366'] },
    { texto: 'Idioma oficial de Brasil?', correcta: 1, respuestas: ['Español', 'Portugués', 'Inglés', 'Francés'] },
    { texto: 'Quién escribió "Romeo y Julieta"?', correcta: 2, respuestas: ['Dante', 'Cervantes', 'Shakespeare', 'Tolstoi'] },
    { texto: 'Suma de 15 + 27?', correcta: 1, respuestas: ['41', '42', '43', '44'] },
    { texto: 'Río más largo del mundo?', correcta: 1, respuestas: ['Nilo', 'Amazonas', 'Yangtsé', 'Misisipi'] },
    { texto: 'Animal conocido como rey de la selva?', correcta: 2, respuestas: ['Tigre', 'Elefante', 'León', 'Jirafa'] },
    { texto: 'Moneda oficial de Japón?', correcta: 1, respuestas: ['Yuan', 'Yen', 'Dólar', 'Won'] },
  ],
  medio: [
    { texto: 'Quién pintó La Gioconda?', correcta: 1, respuestas: ['Van Gogh', 'Leonardo da Vinci', 'Picasso', 'Rembrandt'] },
    { texto: 'Qué país tiene más hablantes de español?', correcta: 2, respuestas: ['España', 'México', 'México', 'Argentina'] },
    { texto: 'Qué gas es necesario para respirar?', correcta: 0, respuestas: ['Oxígeno', 'Nitrógeno', 'Dióxido de carbono', 'Hidrógeno'] },
    { texto: 'Cuál es el océano más grande?', correcta: 2, respuestas: ['Atlántico', 'Índico', 'Pacífico', 'Ártico'] },
    { texto: 'En qué año llegó el hombre a la Luna?', correcta: 3, respuestas: ['1965', '1970', '1968', '1969'] },
    { texto: 'Qué país inventó la pizza?', correcta: 1, respuestas: ['Francia', 'Italia', 'Estados Unidos', 'Grecia'] },
    { texto: 'Cuál es el metal más ligero?', correcta: 0, respuestas: ['Litio', 'Aluminio', 'Hierro', 'Plomo'] },
    { texto: 'Quién escribió "Cien años de soledad"?', correcta: 2, respuestas: ['Pablo Neruda', 'Julio Cortázar', 'Gabriel García Márquez', 'Mario Vargas Llosa'] },
    { texto: 'Qué continente tiene más países?', correcta: 0, respuestas: ['África', 'Asia', 'Europa', 'América'] },
    { texto: 'Qué instrumento mide la presión atmosférica?', correcta: 1, respuestas: ['Termómetro', 'Barómetro', 'Higrómetro', 'Anemómetro'] },
  ],
  dificil: [
    { texto: 'Fórmula química del agua?', correcta: 0, respuestas: ['H2O', 'CO2', 'O2', 'NaCl'] },
    { texto: 'Quién formuló la teoría de la relatividad?', correcta: 2, respuestas: ['Isaac Newton', 'Galileo', 'Albert Einstein', 'Nikola Tesla'] },
    { texto: 'En qué año comenzó la Primera Guerra Mundial?', correcta: 3, respuestas: ['1912', '1913', '1915', '1914'] },
    { texto: 'Número primo más pequeño mayor a 50?', correcta: 0, respuestas: ['53', '51', '57', '59'] },
    { texto: 'Qué tipo de energía se obtiene del sol?', correcta: 1, respuestas: ['Nuclear', 'Solar', 'Eólica', 'Geotérmica'] },
    { texto: 'Quién escribió "Crimen y castigo"?', correcta: 0, respuestas: ['Dostoievski', 'Tolstoi', 'Pushkin', 'Gógol'] },
    { texto: 'Velocidad de la luz aprox. en km/s?', correcta: 2, respuestas: ['300.000', '150.000', '299.792', '1.000.000'] },
    { texto: 'País conocido como tierra del sol naciente?', correcta: 3, respuestas: ['China', 'Corea', 'Tailandia', 'Japón'] },
    { texto: 'Número atómico del carbono?', correcta: 1, respuestas: ['5', '6', '8', '12'] },
    { texto: 'Padre de la geometría analítica?', correcta: 2, respuestas: ['Euclides', 'Pitagoras', 'René Descartes', 'Arquímedes'] },
  ]
}

const preguntas = preguntasPorDificultad[dificultad]

// Escalera de premios
const niveles = preguntas.map((_, i) => ({
  nivel: i + 1,
  premio: (i + 1) * 1000,
  seguro: i === 1
}))

// Computeds
const preguntaActual = computed(() => preguntas[nivelActual.value])
const premioActual = computed(() => niveles[nivelActual.value]?.premio || 0)
const premioSeguro = computed(() => {
  const seguros = niveles.filter(n => n.seguro && n.nivel <= nivelActual.value + 1)
  return seguros.length ? seguros[seguros.length - 1].premio : 0
})

// ------------------- RESPUESTAS -------------------
function clickRespuesta(i) {
  if (respondido.value) return
  respondido.value = true
  respuestaElegida.value = i

  if (i === preguntaActual.value.correcta) {
    if (nivelActual.value < preguntas.length - 1) {
      setTimeout(() => {
        nivelActual.value++
        respondido.value = false
        respuestaElegida.value = null
        respuestasOcultas.value = []
      }, 1200)
    } else {
      gano.value = true
      terminado.value = true
    }
  } else {
    setTimeout(() => terminado.value = true, 1200)
  }
}

function claseRespuesta(i) {
  if (!respondido.value) return ''
  if (i === preguntaActual.value.correcta) return 'correct-neon'
  if (i === respuestaElegida.value) return 'wrong-neon'
  if (respuestasOcultas.value.includes(i)) return 'dim-neon'
  return ''
}

// ------------------- AYUDAS CON ANIMACIONES -------------------
function usarTelefono() {
  if (telefonoUsado.value || respondido.value) return
  telefonoUsado.value = true
  
  // ANIMACIÓN TELÉFONO
  mostrarAnimacionTelefono.value = true
  setTimeout(() => { mostrarAnimacionTelefono.value = false }, 2000)
  
  const probabilidadAcertar = 0.8
  let mensaje = ''
  if (Math.random() < probabilidadAcertar) {
    mensaje = `📞 Tu amigo cree que la respuesta correcta es: "${preguntaActual.value.respuestas[preguntaActual.value.correcta]}"`
  } else {
    const incorrectas = preguntaActual.value.respuestas.map((_, i) => i).filter(i => i !== preguntaActual.value.correcta)
    const err = preguntaActual.value.respuestas[incorrectas[Math.floor(Math.random()*incorrectas.length)]]
    mensaje = `📞 Tu amigo no está seguro, pero piensa que puede ser: "${err}"`
  }
  alert(mensaje)
}

function usarPublico() {
  if (publicoUsado.value || respondido.value) return
  publicoUsado.value = true
  
  // ANIMACIÓN PÚBLICO
  mostrarAnimacionPublico.value = true
  setTimeout(() => { mostrarAnimacionPublico.value = false }, 2000)
  
  const total = 100
  const porcentajeCorrecto = 60 + Math.floor(Math.random()*20)
  const restante = total - porcentajeCorrecto
  const incorrectas = preguntaActual.value.respuestas.map((_, i) => i).filter(i => i !== preguntaActual.value.correcta)
  const distribucion = []
  let resto = restante
  for (let i=0;i<incorrectas.length-1;i++){
    const val = Math.floor(Math.random()*resto)
    distribucion.push(val)
    resto-=val
  }
  distribucion.push(resto)
  let mensaje = '👥 Resultado de la encuesta del público:\n'
  incorrectas.forEach((idx,i)=>{ mensaje += `${letras[idx]}: ${distribucion[i]}%\n` })
  mensaje += `${letras[preguntaActual.value.correcta]}: ${porcentajeCorrecto}%`
  alert(mensaje)
}

function usar5050() {
  if (cincuentaUsado.value || respondido.value) return
  cincuentaUsado.value = true
  
  // ANIMACIÓN 50/50
  mostrarAnimacion5050.value = true
  setTimeout(() => { mostrarAnimacion5050.value = false }, 2000)
  
  const incorrectas = preguntaActual.value.respuestas.map((_,i)=>i).filter(i=>i!==preguntaActual.value.correcta)
  const ocultar = []
  while(ocultar.length<2){
    const idx = incorrectas[Math.floor(Math.random()*incorrectas.length)]
    if(!ocultar.includes(idx)) ocultar.push(idx)
  }
  respuestasOcultas.value = ocultar
}

// ------------------- REINICIAR -------------------
function reiniciarJuego() {
  const puntajeFinal = gano.value ? premioActual.value : premioSeguro.value
  sessionStorage.setItem('nombreJugador', nombreJugador)
  sessionStorage.setItem('puntajeJugador', `$${puntajeFinal}`)
  router.push({ name: 'ranking' })
}
</script>



<style>
/* ------------------- BASE ------------------- */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Montserrat', sans-serif; background: #03050f; }

/* ------------------- CABINA ------------------- */
.neon-cabina {
  min-height: 100vh;
  display: flex;
  gap: 30px;
  padding: 30px;
  position: relative;
  overflow: hidden;
}

/* ------------------- BACKGROUND NEON ------------------- */
.cyber-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(cyan 1px, transparent 1px),
                    linear-gradient(90deg, cyan 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.1;
  animation: gridMove 20s linear infinite;
}
.neon-haze { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.1; animation: floatHaze 20s infinite alternate; }
.neon-haze.cyan { background: cyan; top: -20vh; left: -20vh; width:80vh;height:80vh; }
.neon-haze.pink { background: #ff00ff; bottom: -20vh; right: -20vh; width:80vh;height:80vh; }
.neon-haze.gold { background: gold; top:50%;left:50%; transform:translate(-50%,-50%); width:60vh;height:60vh; }

.scanlines {
  position: fixed; inset:0;
  background: repeating-linear-gradient(0deg, rgba(0,255,255,0.03) 0px, rgba(0,255,255,0.03) 2px, transparent 2px, transparent 4px);
  pointer-events: none; z-index:100;
}

/* ------------------- ARENA ------------------- */
.game-arena { flex:1; display:flex; flex-direction:column; gap:30px; max-width:900px; z-index:10; }

/* ------------------- BARRA ------------------- */
.neon-bar {
  background: rgba(0,0,0,0.7); backdrop-filter: blur(10px);
  border: 2px solid cyan; border-radius: 60px; padding: 15px 25px;
  display:flex; justify-content:space-between; align-items:center;
  box-shadow:0 0 30px rgba(0,255,255,0.3);
}
.user-tag { color:cyan; font-size:1.3rem; font-weight:900; display:flex; align-items:center; gap:10px; text-shadow:0 0 10px cyan; }
.dot { width:10px;height:10px;background:cyan;border-radius:50%; box-shadow:0 0 15px cyan; animation:pulseDot 1s infinite; }

.lifeline-panel { display:flex; gap:15px; }
.lifeline-neon {
  background:transparent; border:2px solid cyan; color:cyan;
  font-size:1.5rem; padding:8px 15px; border-radius:30px; cursor:pointer; transition:0.3s;
  text-shadow:0 0 10px cyan;
}
.lifeline-neon:hover { background:cyan; color:black; box-shadow:0 0 30px cyan; }

.prize-neon { color:gold; font-size:1.8rem; font-weight:900; text-shadow:0 0 20px gold; }

/* ------------------- PREGUNTA ------------------- */
.neon-question { background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); border:2px solid cyan; padding:40px; border-radius:20px; box-shadow:0 0 50px rgba(0,255,255,0.2); position:relative; }
.question-content { color:white; font-size:2.2rem; text-align:center; font-weight:900; letter-spacing:3px; text-shadow:0 0 15px cyan,0 0 30px cyan; }
.question-corner { position:absolute;width:20px;height:20px;border-color:cyan; }
.top-left { top:10px; left:10px; border-top:3px solid cyan; border-left:3px solid cyan; }
.top-right { top:10px; right:10px; border-top:3px solid cyan; border-right:3px solid cyan; }
.bottom-left { bottom:10px; left:10px; border-bottom:3px solid cyan; border-left:3px solid cyan; }
.bottom-right { bottom:10px; right:10px; border-bottom:3px solid cyan; border-right:3px solid cyan; }

/* ------------------- RESPUESTAS ------------------- */
.neon-answers { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
.answer-neon { background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); border:2px solid cyan; padding:20px 25px; display:flex; align-items:center; gap:20px; cursor:pointer; position:relative; overflow:hidden; border-radius:15px; transition:0.3s; }
.answer-neon:hover:not(:disabled) { border-color:gold; box-shadow:0 0 30px cyan; transform:translateY(-3px); }
.answer-neon-letter { width:50px;height:50px;background:cyan;color:black;font-size:1.8rem;font-weight:900;display:flex;align-items:center;justify-content:center;border-radius:50%;box-shadow:0 0 20px cyan; }
.answer-neon-text { color:white; font-size:1.3rem; font-weight:600; letter-spacing:2px; }

.correct-neon { background: rgba(0,255,0,0.2); border-color:#00ff00; box-shadow:0 0 50px #00ff00; }
.correct-neon .answer-neon-letter { background:#00ff00; }
.wrong-neon { background: rgba(255,0,0,0.2); border-color:#ff0000; box-shadow:0 0 50px #ff0000; }
.wrong-neon .answer-neon-letter { background:#ff0000; }
.dim-neon { opacity:0.4; }

/* ------------------- ESCALERA ------------------- */
.neon-ladder { width:200px; background:rgba(0,0,0,0.6); border:2px solid cyan; border-radius:20px; padding:15px; box-shadow:0 0 30px cyan; color:white; display:flex; flex-direction:column; }
.ladder-header { text-align:center; font-size:1.3rem; font-weight:900; text-shadow:0 0 10px cyan; margin-bottom:15px; }
.ladder-list { display:flex; flex-direction:column-reverse; gap:10px; }
.ladder-neon-step { display:flex; justify-content:space-between; padding:8px 10px; border-radius:10px; border:1px solid cyan; transition:0.3s; text-shadow:0 0 5px cyan; }
.ladder-neon-step.active { background:rgba(0,255,255,0.3); border-color:gold; text-shadow:0 0 20px gold; }
.ladder-neon-step.safe { border-color:#00ff00; }

/* ------------------- RESULTADO ------------------- */
.neon-result { position:absolute; inset:0; background:rgba(0,0,0,0.8); display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:20; }
.result-glitch { font-size:5rem; font-weight:900; color:cyan; text-shadow:0 0 20px cyan; margin-bottom:20px; }
.result-glitch.win { color:gold; text-shadow:0 0 30px gold,0 0 60px gold; }
.result-prize-neon { font-size:3rem; font-weight:900; color:gold; text-shadow:0 0 20px gold,0 0 50px gold; margin-bottom:30px; }
.neon-restart { background:transparent; border:2px solid cyan; padding:15px 30px; border-radius:30px; font-size:1.5rem; font-weight:900; color:cyan; cursor:pointer; text-shadow:0 0 15px cyan; }
.neon-restart:hover { background:cyan; color:black; box-shadow:0 0 50px cyan; }

/* ------------------- ANIMACIONES DE AYUDAS (SOLO ESTO AGREGUE) ------------------- */
.animacion-ayuda {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  pointer-events: none;
}

/* ANIMACIÓN TELÉFONO */
.telefono-anim {
  animation: apareceAnimacion 0.3s ease;
}

.onda-llamada {
  position: absolute;
  width: 150px;
  height: 150px;
  border: 4px solid cyan;
  border-radius: 50%;
  animation: onda 2s infinite;
  box-shadow: 0 0 30px cyan;
}

.onda-llamada:nth-child(2) {
  animation-delay: 0.6s;
  width: 200px;
  height: 200px;
}

.onda-llamada:nth-child(3) {
  animation-delay: 1.2s;
  width: 250px;
  height: 250px;
}

.icono-llamada {
  position: relative;
  font-size: 5rem;
  animation: vibracion 0.3s infinite;
  text-shadow: 0 0 40px cyan;
}

.burbuja {
  position: absolute;
  top: -60px;
  background: cyan;
  color: black;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.3rem;
  animation: flotar 1s infinite;
  box-shadow: 0 0 30px cyan;
}

/* ANIMACIÓN PÚBLICO */
.publico-anim {
  animation: apareceAnimacion 0.3s ease;
}

.gente {
  position: absolute;
  font-size: 3rem;
  animation: genteAparece 1s infinite;
  text-shadow: 0 0 30px gold;
}

.gente:nth-child(1) { top: -100px; left: -100px; animation-delay: 0s; }
.gente:nth-child(2) { top: -80px; right: -100px; animation-delay: 0.2s; }
.gente:nth-child(3) { bottom: -100px; left: -80px; animation-delay: 0.4s; }
.gente:nth-child(4) { bottom: -80px; right: -80px; animation-delay: 0.6s; }
.gente:nth-child(5) { top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 4rem; animation-delay: 0.8s; }

.burbuja-publico {
  position: absolute;
  top: -100px;
  background: gold;
  color: black;
  padding: 15px 30px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.5rem;
  animation: flotar 1s infinite;
  box-shadow: 0 0 40px gold;
}

/* ANIMACIÓN 50/50 */
.cincuenta-anim {
  animation: apareceAnimacion 0.3s ease;
}

.rayo {
  position: absolute;
  font-size: 4rem;
  animation: rayoBrilla 0.5s infinite;
  text-shadow: 0 0 50px yellow, 0 0 100px orange;
}

.rayo:nth-child(1) { transform: rotate(-20deg); top: -80px; left: -80px; animation-delay: 0s; }
.rayo:nth-child(2) { transform: rotate(0deg); top: 50%; left: 50%; transform: translate(-50%, -50%) scale(2); animation-delay: 0.2s; }
.rayo:nth-child(3) { transform: rotate(20deg); bottom: -80px; right: -80px; animation-delay: 0.4s; }

.burbuja-5050 {
  position: absolute;
  top: -120px;
  background: linear-gradient(45deg, yellow, orange);
  color: black;
  padding: 15px 35px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.8rem;
  animation: flotar 1s infinite;
  box-shadow: 0 0 50px yellow;
}

/* ANIMACIONES GLOBALES */
@keyframes onda {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

@keyframes vibracion {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
}

@keyframes flotar {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes genteAparece {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes rayoBrilla {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

@keyframes apareceAnimacion {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes gridMove { from{background-position:0 0} to{background-position:0 -300px} }
@keyframes floatHaze { 0%{transform:translateY(0)} 100%{transform:translateY(-50px)} }
@keyframes pulseDot { 0%,100%{transform:scale(1)}50%{transform:scale(1.5)} }
</style>