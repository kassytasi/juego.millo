<template>
  <div class="neon-cabina">

    <!-- JUEGO -->
    <div class="game-arena" v-if="!terminado && !cargandoPreguntas">

      <!-- BARRA SUPERIOR CON TEMPORIZADOR MEJORADO -->
      <div class="neon-bar">
        <div class="user-tag">
          <span class="dot"></span>
          👤 {{ nombreJugador }}
        </div>
        <div class="lifeline-panel">
          <!-- TEMPORIZADOR NEON MEJORADO -->
          <div class="neon-timer">
            <div class="timer-circle">
              <svg viewBox="0 0 100 100" class="timer-svg">
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:cyan;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:magenta;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:gold;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  class="timer-bg"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  class="timer-progress"
                  :style="{
                    strokeDashoffset: 283 - (283 * tiempoRestante) / 30
                  }"
                />
              </svg>
              <span class="timer-text">{{ tiempoRestante }}s</span>
            </div>
            <span class="timer-label">TIEMPO</span>
          </div>
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
        <div class="question-content">{{ preguntaActual?.texto || 'Cargando...' }}</div>
      </div>

      <!-- RESPUESTAS -->
      <div class="neon-answers">
        <button
          v-for="(resp, i) in preguntaActual?.respuestas || []"
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

    <!-- CARGANDO PREGUNTAS - VERSIÓN MEJORADA -->
    <div v-if="cargandoPreguntas" class="neon-loading">
      <div class="loading-arena">
        <!-- Luces de escenario -->
        <div class="stage-lights">
          <div class="light left"></div>
          <div class="light right"></div>
        </div>
        
        <!-- IA Robot animado -->
        <div class="ia-robot">
          <div class="robot-head">
            <div class="robot-eyes">
              <div class="eye left"></div>
              <div class="eye right"></div>
            </div>
            <div class="robot-antenna"></div>
          </div>
          <div class="robot-body">
            <div class="screen">
              <div class="loading-bar" v-for="i in 3" :key="i"></div>
            </div>
          </div>
        </div>
        
        <!-- Texto glitch -->
        <div class="loading-glitch">
          <span class="glitch-text" data-text="GEMINI IA">GEMINI IA</span>
        </div>
        
        <div class="loading-subtext">
          <span>GENERANDO PREGUNTAS</span>
          <div class="dots">
            <span>.</span><span>.</span><span>.</span>
          </div>
        </div>
        
        <!-- Efecto de matriz -->
        <div class="matrix-rain">
          <div v-for="i in 10" :key="i" class="matrix-column"></div>
        </div>
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
    <div v-if="terminado" class="neon-result">
      <div 
        class="result-glitch" 
        :class="{ win: gano, lose: !gano }"
      >
        {{ gano ? 'VICTORIA' : 'GAME OVER' }}
      </div>

      <div class="result-prize-neon">
        ${{ gano ? premioActual : premioSeguro }}
      </div>

      <button 
        class="neon-restart" 
        @click="reiniciarJuego"
      >
        ⚡ JUGAR ⚡
      </button>
    </div>

    <!-- ANIMACIONES -->
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

    <!-- MODAL NEON -->
    <div v-if="mostrarMensaje" class="neon-modal">
      <div class="neon-modal-box">
        <div class="neon-modal-title">{{ tituloMensaje }}</div>
        <div class="neon-modal-content">{{ contenidoMensaje }}</div>
        <button class="neon-modal-btn" @click="cerrarMensaje">CONTINUAR</button>
      </div>
    </div>

    <!-- MODAL ERROR GEMINI -->
    <div v-if="mostrarError" class="neon-modal error-modal">
      <div class="neon-modal-box">
        <div class="neon-modal-title">⚠️ ERROR DE CONEXIÓN</div>
        <div class="neon-modal-content">
          No se pudieron generar preguntas con Gemini.
          {{ mensajeError }}
        </div>
        <button class="neon-modal-btn" @click="reintentarCarga">REINTENTAR</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const letras = ['A', 'B', 'C', 'D']

/* =========================
   CONFIGURACIÓN GEMINI
========================= */
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent"
const API_KEY = import.meta.env.VITE_API_KEY

/* =========================
   DATOS INICIALES
========================= */
const nombreJugador = localStorage.getItem('nombreJugador') || 'Jugador'
const dificultad = sessionStorage.getItem('dificultad') || 'facil'

const preguntas = ref([])
const cargandoPreguntas = ref(true)
const mostrarError = ref(false)
const mensajeError = ref('')

const nivelActual = ref(0)
const respondido = ref(false)
const terminado = ref(false)
const gano = ref(false)
const respuestaElegida = ref(null)
const respuestasOcultas = ref([])

const telefonoUsado = ref(false)
const publicoUsado = ref(false)
const cincuentaUsado = ref(false)

const mostrarAnimacionTelefono = ref(false)
const mostrarAnimacionPublico = ref(false)
const mostrarAnimacion5050 = ref(false)

/* =========================
   MODAL
========================= */
const mostrarMensaje = ref(false)
const tituloMensaje = ref('')
const contenidoMensaje = ref('')

function cerrarMensaje() {
  mostrarMensaje.value = false
}

function reintentarCarga() {
  mostrarError.value = false
  cargandoPreguntas.value = true
  cargarPreguntasGemini()
}

/* =========================
   AUDIO
========================= */
const sonidoTelefono = new Audio('/sounds/telefono.mp3')
const sonidoPublico = new Audio('/sounds/publico.mp3')
const sonido5050 = new Audio('/sounds/5050.mp3')

;[sonidoTelefono, sonidoPublico, sonido5050].forEach(audio => {
  audio.loop = true
  audio.volume = 1
  audio.preload = "auto"
})

function fadeOutAudio(audio, duration = 1000) {
  const steps = 20
  const stepTime = duration / steps
  const volumeStep = audio.volume / steps

  const fade = setInterval(() => {
    if (audio.volume > volumeStep) {
      audio.volume -= volumeStep
    } else {
      clearInterval(fade)
      audio.pause()
      audio.currentTime = 0
      audio.volume = 1
    }
  }, stepTime)
}

/* =========================
   TEMPORIZADOR
========================= */
const tiempoRestante = ref(30)
let temporizador = null

function iniciarTemporizador() {
  if (temporizador) clearInterval(temporizador)

  tiempoRestante.value = 30
  temporizador = setInterval(() => {
    tiempoRestante.value--
    if (tiempoRestante.value <= 0) {
      clearInterval(temporizador)
      tiempoTerminado()
    }
  }, 1000)
}

function tiempoTerminado() {
  terminado.value = true
}

function detenerTemporizador() {
  if (temporizador) {
    clearInterval(temporizador)
    temporizador = null
  }
}

/* =========================
   CARGAR PREGUNTAS GEMINI
========================= */
async function cargarPreguntasGemini() {
  try {
    const prompt = `
Genera 10 preguntas de trivia de nivel ${dificultad} en formato JSON con esta estructura exacta:

[
  {
    "texto": "Capital de Francia?",
    "correcta": 1,
    "respuestas": ["Madrid", "París", "Roma", "Berlín"]
  }
]

REGLAS IMPORTANTES:
- EXACTAMENTE 10 preguntas
- 4 opciones (0-3)
- "correcta" debe ser índice válido
- Nivel: ${dificultad}
- SOLO JSON sin texto adicional
`

    const response = await axios.post(
      API_URL,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY
        }
      }
    )

    let texto = response.data.candidates[0].content.parts[0].text
    texto = texto.replace(/```json\n?|```/g, "").trim()
    const preguntasGeneradas = JSON.parse(texto)

    if (!Array.isArray(preguntasGeneradas) || preguntasGeneradas.length !== 10) {
      throw new Error('Gemini no generó 10 preguntas')
    }

    preguntas.value = preguntasGeneradas
    iniciarTemporizador()

  } catch (error) {
    mensajeError.value = error.message
    mostrarError.value = true
    preguntas.value = []
  } finally {
    cargandoPreguntas.value = false
  }
}

/* =========================
   INICIALIZACIÓN
========================= */
onMounted(() => {
  cargarPreguntasGemini()
})

onUnmounted(() => {
  detenerTemporizador()
})

/* =========================
   PREMIOS
========================= */
const niveles = computed(() =>
  preguntas.value.map((_, i) => ({
    nivel: i + 1,
    premio: (i + 1) * 1000,
    seguro: i === 4
  }))
)

const preguntaActual = computed(() => preguntas.value[nivelActual.value])
const premioActual = computed(() => niveles.value[nivelActual.value]?.premio || 0)
const premioSeguro = computed(() => {
  const seguros = niveles.value.filter(n => n.seguro && n.nivel <= nivelActual.value + 1)
  return seguros.length ? seguros[seguros.length - 1].premio : 0
})

/* =========================
   RESPUESTAS
========================= */
function clickRespuesta(i) {
  if (respondido.value || !preguntaActual.value) return

  detenerTemporizador()
  respondido.value = true
  respuestaElegida.value = i

  if (i === preguntaActual.value.correcta) {
    if (nivelActual.value < preguntas.value.length - 1) {
      setTimeout(() => {
        nivelActual.value++
        respondido.value = false
        respuestaElegida.value = null
        respuestasOcultas.value = []
        iniciarTemporizador()
      }, 1200)
    } else {
      gano.value = true
      terminado.value = true
    }
  } else {
    setTimeout(() => terminado.value = true, 1200)
  }
}

/* =========================
   AYUDAS
========================= */

function usarTelefono() {
  if (telefonoUsado.value || respondido.value || !preguntaActual.value) return

  telefonoUsado.value = true
  mostrarAnimacionTelefono.value = true

  sonidoTelefono.currentTime = 0
  sonidoTelefono.play().catch(() => {})

  setTimeout(() => {
    mostrarAnimacionTelefono.value = false
    fadeOutAudio(sonidoTelefono)

    tituloMensaje.value = '📞 LLAMADA'
    contenidoMensaje.value =
      `"${preguntaActual.value.respuestas[preguntaActual.value.correcta]}"`
    mostrarMensaje.value = true
  }, 2000)
}

function usarPublico() {
  if (publicoUsado.value || respondido.value || !preguntaActual.value) return

  publicoUsado.value = true
  mostrarAnimacionPublico.value = true

  sonidoPublico.currentTime = 0
  sonidoPublico.play().catch(() => {})

  setTimeout(() => {
    mostrarAnimacionPublico.value = false
    fadeOutAudio(sonidoPublico)

    tituloMensaje.value = '👥 ENCUESTA'
    contenidoMensaje.value =
      `La mayoría votó por:\n\n${letras[preguntaActual.value.correcta]}`
    mostrarMensaje.value = true
  }, 2000)
}

/* ✅ 50/50 COMPLETAMENTE FUNCIONAL */
function usar5050() {
  if (cincuentaUsado.value || respondido.value || !preguntaActual.value) return

  cincuentaUsado.value = true
  mostrarAnimacion5050.value = true

  sonido5050.currentTime = 0
  sonido5050.play().catch(() => {})

  setTimeout(() => {
    mostrarAnimacion5050.value = false
    fadeOutAudio(sonido5050)

    const incorrectas = preguntaActual.value.respuestas
      .map((_, i) => i)
      .filter(i => i !== preguntaActual.value.correcta)

    const ocultar = []
    while (ocultar.length < 2) {
      const idx = incorrectas[Math.floor(Math.random() * incorrectas.length)]
      if (!ocultar.includes(idx)) ocultar.push(idx)
    }

    respuestasOcultas.value = ocultar
  }, 2000)
}

/* =========================
   REINICIAR
========================= */
function reiniciarJuego() {
  detenerTemporizador()
  const puntajeFinal = gano.value ? premioActual.value : premioSeguro.value
  sessionStorage.setItem('nombreJugador', nombreJugador)
  sessionStorage.setItem('puntajeJugador', `$${puntajeFinal}`)
  router.push({ name: 'ranking' })
}

function claseRespuesta(i) {
  if (!preguntaActual.value) return ""

  // Si aún no respondió, no aplicar estilos
  if (!respondido.value) return ""

  // Correcta → verde
  if (i === preguntaActual.value.correcta) {
    return "correcta"
  }

  // Elegida pero incorrecta → roja
  if (i === respuestaElegida.value) {
    return "incorrecta"
  }

  return ""
}
</script>


<style>
/* NEON CABINA - VERSIÓN MEJORADA CON COLORES NEON */

.neon-cabina {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a2a 0%, #1a0033 100%);
  display: flex;
  position: relative;
  overflow: hidden;
  font-family: 'Arial Black', sans-serif;
}

.neon-cabina::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255,0,255,0.1), transparent 70%);
  pointer-events: none;
}

.game-arena {
  flex: 3;
  padding: 30px;
  display: flex;
  flex-direction: column;
}

/* BARRA SUPERIOR MÁS RADIACTIVA */
.neon-bar {
  background: rgba(10, 10, 30, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid #ff00ff;
  border-radius: 50px;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  box-shadow: 0 0 30px #ff00ff, 0 0 60px #00ffff, inset 0 0 20px #ff00ff;
  animation: barPulse 3s infinite;
}

@keyframes barPulse {
  0%, 100% { border-color: #ff00ff; box-shadow: 0 0 30px #ff00ff, 0 0 60px #00ffff; }
  50% { border-color: #00ffff; box-shadow: 0 0 30px #00ffff, 0 0 60px #ff00ff; }
}

.user-tag {
  color: #fff;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
  text-shadow: 0 0 10px cyan, 0 0 20px magenta;
}

.dot {
  width: 15px;
  height: 15px;
  background: #0f0;
  border-radius: 50%;
  box-shadow: 0 0 20px #0f0, 0 0 40px #ff0;
  animation: dotPulse 1s infinite;
}

@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.lifeline-panel {
  display: flex;
  gap: 15px;
  align-items: center;
}

/* TEMPORIZADOR NEON MEJORADO */
.neon-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  position: relative;
}

.timer-circle {
  width: 60px;
  height: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.timer-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 8;
}

.timer-progress {
  fill: none;
  stroke: url(#timerGradient);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 283;
  stroke-dashoffset: 283;
  transition: stroke-dashoffset 0.3s linear;
  filter: drop-shadow(0 0 8px cyan);
}

.timer-text {
  position: absolute;
  font-size: 1.4rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 0 15px cyan, 0 0 30px magenta;
  animation: timerPulse 1s infinite;
}

.timer-label {
  font-size: 0.7rem;
  color: cyan;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 5px;
  text-shadow: 0 0 10px cyan;
  font-weight: bold;
}

@keyframes timerPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); text-shadow: 0 0 25px cyan, 0 0 50px magenta; }
}

.lifeline-neon {
  background: transparent;
  border: 3px solid gold;
  color: gold;
  font-size: 2rem;
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 0 20px gold;
  font-weight: bold;
}

.lifeline-neon:hover:not(:disabled) {
  transform: scale(1.1);
  background: rgba(255, 215, 0, 0.2);
  box-shadow: 0 0 40px gold, 0 0 80px orange;
}

.lifeline-neon:disabled {
  opacity: 0.3;
  filter: grayscale(1);
  cursor: not-allowed;
}

.prize-neon {
  font-size: 2.2rem;
  font-weight: 900;
}

.prize-glow {
  color: gold;
  text-shadow: 0 0 20px gold, 0 0 40px orange, 0 0 60px red;
  animation: prizeGlow 2s infinite;
}

@keyframes prizeGlow {
  0%, 100% { text-shadow: 0 0 20px gold, 0 0 40px orange; }
  50% { text-shadow: 0 0 40px gold, 0 0 80px red, 0 0 120px magenta; }
}

/* PREGUNTA CON MÁS ESTILO */
.neon-question {
  background: linear-gradient(145deg, #1a0033, #000a1a);
  border: 3px solid cyan;
  border-radius: 40px;
  padding: 40px;
  margin-bottom: 40px;
  text-align: center;
  box-shadow: 0 0 50px cyan, 0 0 100px magenta, inset 0 0 30px cyan;
  transform: perspective(1000px) rotateX(2deg);
}

.question-content {
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 0 10px cyan, 0 0 20px magenta, 0 0 30px blue;
  letter-spacing: 2px;
}

/* RESPUESTAS CON COLORES ÚNICOS */
.neon-answers {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
}

.answer-neon {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  border: 3px solid;
  border-radius: 30px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.4rem;
  color: white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.5);
}

.answer-0 { border-color: #ff00ff; box-shadow: 0 0 30px #ff00ff; }
.answer-1 { border-color: #00ffff; box-shadow: 0 0 30px #00ffff; }
.answer-2 { border-color: #ffff00; box-shadow: 0 0 30px #ffff00; }
.answer-3 { border-color: #ff6600; box-shadow: 0 0 30px #ff6600; }

.answer-neon:hover:not(:disabled) {
  transform: scale(1.05) translateY(-5px);
  filter: brightness(1.3);
}

.answer-0:hover { background: rgba(255, 0, 255, 0.2); }
.answer-1:hover { background: rgba(0, 255, 255, 0.2); }
.answer-2:hover { background: rgba(255, 255, 0, 0.2); }
.answer-3:hover { background: rgba(255, 102, 0, 0.2); }

.answer-neon-letter {
  font-size: 2rem;
  font-weight: 900;
  color: inherit;
  text-shadow: 0 0 10px currentColor;
}

.answer-neon-text {
  flex: 1;
  text-align: left;
}

/* ESTADOS DE RESPUESTA */
.correct-neon {
  background: rgba(0, 255, 0, 0.3) !important;
  border-color: #0f0 !important;
  box-shadow: 0 0 50px #0f0, 0 0 100px #0f0 !important;
  animation: correctFlash 0.5s;
}

.wrong-neon {
  background: rgba(255, 0, 0, 0.3) !important;
  border-color: #f00 !important;
  box-shadow: 0 0 50px #f00, 0 0 100px #f00 !important;
  animation: wrongFlash 0.5s;
}

@keyframes correctFlash {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.5); background: rgba(0, 255, 0, 0.5); }
}

@keyframes wrongFlash {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.5); background: rgba(255, 0, 0, 0.5); }
}

.dim-neon {
  opacity: 0.3 !important;
  filter: grayscale(1) !important;
  pointer-events: none !important;
}

/* ESCALERA DE PREMIOS MEJORADA */
.neon-ladder {
  width: 300px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-left: 3px solid gold;
  padding: 30px 0;
  position: relative;
  overflow-y: auto;
  box-shadow: -20px 0 30px rgba(255, 215, 0, 0.3);
}

.ladder-header {
  font-size: 2rem;
  font-weight: 900;
  color: gold;
  text-align: center;
  padding: 20px;
  text-shadow: 0 0 20px gold, 0 0 40px orange;
  border-bottom: 2px solid gold;
  margin-bottom: 20px;
}

.ladder-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ladder-neon-step {
  padding: 15px 25px;
  margin: 5px 20px;
  border-radius: 30px;
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  color: #fff;
  border: 2px solid rgba(255,255,255,0.2);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.ladder-neon-step::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: 0.5s;
}

.ladder-neon-step:hover::before {
  left: 100%;
}

.ladder-neon-step.active {
  border-color: cyan;
  background: rgba(0, 255, 255, 0.2);
  box-shadow: 0 0 30px cyan;
  transform: scale(1.05);
  font-weight: 900;
  color: cyan;
  text-shadow: 0 0 10px cyan;
}

.ladder-neon-step.safe {
  border-color: gold;
  box-shadow: 0 0 20px gold;
  background: rgba(255, 215, 0, 0.1);
}

/* PANTALLA DE CARGA MEJORADA */
.neon-loading {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #03050c 0%, #1a0033 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.loading-arena {
  position: relative;
  width: 600px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Luces de escenario */
.stage-lights {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
}

.light {
  width: 100px;
  height: 200px;
  background: radial-gradient(ellipse at top, rgba(255, 0, 255, 0.3), transparent 70%);
  animation: lightSwing 3s infinite alternate;
  filter: blur(20px);
}

.light.right {
  background: radial-gradient(ellipse at top, rgba(0, 255, 255, 0.3), transparent 70%);
  animation-delay: 1.5s;
}

@keyframes lightSwing {
  0% { transform: rotate(-10deg) scale(1); }
  100% { transform: rotate(10deg) scale(1.2); }
}

/* Robot IA */
.ia-robot {
  position: relative;
  margin-bottom: 40px;
  animation: robotFloat 3s infinite ease-in-out;
}

@keyframes robotFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.robot-head {
  width: 150px;
  height: 150px;
  background: linear-gradient(145deg, #00ffff22, #ff00ff22);
  border: 4px solid cyan;
  border-radius: 50% 50% 30% 30%;
  position: relative;
  box-shadow: 0 0 50px cyan, inset 0 0 30px magenta;
  backdrop-filter: blur(10px);
  animation: headGlow 2s infinite;
}

@keyframes headGlow {
  0%, 100% { border-color: cyan; box-shadow: 0 0 50px cyan; }
  50% { border-color: magenta; box-shadow: 0 0 80px magenta, 0 0 120px cyan; }
}

.robot-eyes {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding-top: 40px;
}

.eye {
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  position: relative;
  animation: eyeBlink 3s infinite;
}

.eye::after {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  width: 10px;
  height: 10px;
  background: black;
  border-radius: 50%;
}

.eye.left { animation-delay: 0s; }
.eye.right { animation-delay: 0.2s; }

@keyframes eyeBlink {
  0%, 48%, 52%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.1); }
}

.robot-antenna {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 30px;
  background: linear-gradient(to top, cyan, magenta);
  box-shadow: 0 0 20px cyan;
  animation: antennaPulse 1s infinite;
}

@keyframes antennaPulse {
  0%, 100% { height: 30px; opacity: 1; }
  50% { height: 40px; opacity: 0.8; }
}

.robot-body {
  width: 180px;
  height: 120px;
  background: linear-gradient(145deg, #00ffff11, #ff00ff11);
  border: 3px solid magenta;
  border-radius: 20px;
  margin-top: -20px;
  position: relative;
  left: -15px;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 40px magenta;
}

.screen {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.loading-bar {
  height: 15px;
  background: linear-gradient(90deg, cyan, magenta, cyan);
  border-radius: 10px;
  animation: loadingBar 1.5s infinite;
  background-size: 200% 100%;
}

.loading-bar:nth-child(1) { animation-delay: 0s; width: 80%; }
.loading-bar:nth-child(2) { animation-delay: 0.3s; width: 60%; }
.loading-bar:nth-child(3) { animation-delay: 0.6s; width: 90%; }

@keyframes loadingBar {
  0% { background-position: 0% 0; opacity: 0.5; }
  50% { background-position: 100% 0; opacity: 1; }
  100% { background-position: 200% 0; opacity: 0.5; }
}

/* Texto glitch */
.loading-glitch {
  margin: 30px 0;
}

.glitch-text {
  font-size: 3rem;
  font-weight: 900;
  color: white;
  position: relative;
  text-shadow: 0.05em 0 0 cyan, -0.05em -0.025em 0 magenta;
  animation: glitchText 3s infinite;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  animation: glitchTop 1s infinite;
  color: cyan;
  z-index: -1;
}

.glitch-text::after {
  animation: glitchBottom 1.5s infinite;
  color: magenta;
  z-index: -2;
}

@keyframes glitchTop {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, -2px); }
  40% { transform: translate(2px, 2px); }
  60% { transform: translate(-1px, -1px); }
  80% { transform: translate(1px, 1px); }
}

@keyframes glitchBottom {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(1px, -1px); }
  80% { transform: translate(-1px, 1px); }
}

.loading-subtext {
  font-size: 1.2rem;
  color: cyan;
  display: flex;
  gap: 5px;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: 0 0 10px cyan;
}

.dots {
  display: flex;
  gap: 2px;
}

.dots span {
  animation: dots 1.4s infinite;
  font-size: 1.5rem;
}

.dots span:nth-child(2) { animation-delay: 0.2s; }
.dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dots {
  0%, 100% { opacity: 0.3; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-5px); }
}

/* Matrix rain effect */
.matrix-rain {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.1;
}

.matrix-column {
  position: absolute;
  top: -100%;
  width: 1px;
  height: 100%;
  background: linear-gradient(to bottom, cyan, magenta, gold);
  animation: matrixFall 3s linear infinite;
}

.matrix-column:nth-child(1) { left: 10%; animation-delay: 0s; }
.matrix-column:nth-child(2) { left: 20%; animation-delay: 0.3s; }
.matrix-column:nth-child(3) { left: 30%; animation-delay: 0.6s; }
.matrix-column:nth-child(4) { left: 40%; animation-delay: 0.9s; }
.matrix-column:nth-child(5) { left: 50%; animation-delay: 1.2s; }
.matrix-column:nth-child(6) { left: 60%; animation-delay: 1.5s; }
.matrix-column:nth-child(7) { left: 70%; animation-delay: 1.8s; }
.matrix-column:nth-child(8) { left: 80%; animation-delay: 2.1s; }
.matrix-column:nth-child(9) { left: 90%; animation-delay: 2.4s; }
.matrix-column:nth-child(10) { left: 95%; animation-delay: 2.7s; }

@keyframes matrixFall {
  0% { top: -100%; }
  100% { top: 100%; }
}

/* RESULTADO FINAL GLITCH */
.neon-result {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(20px);
}

.result-glitch {
  font-size: 6rem;
  font-weight: 900;
  text-transform: uppercase;
  animation: glitch 1s infinite;
}

.result-glitch.win {
  color: gold;
  text-shadow: -10px 0 cyan, 10px 0 magenta;
}

@keyframes glitch {
  0%, 100% { transform: skew(0deg, 0deg); opacity: 1; }
  95% { transform: skew(5deg, -5deg); opacity: 0.8; text-shadow: -5px 0 red, 5px 0 blue; }
  96% { transform: skew(-5deg, 5deg); opacity: 0.9; text-shadow: 5px 0 blue, -5px 0 red; }
}

.result-prize-neon {
  font-size: 4rem;
  color: gold;
  text-shadow: 0 0 30px gold, 0 0 60px orange, 0 0 90px red;
  margin: 40px 0;
  animation: prizePulse 1.5s infinite;
}

@keyframes prizePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); text-shadow: 0 0 50px gold, 0 0 100px red; }
}

.neon-restart {
  background: transparent;
  border: 4px solid cyan;
  color: cyan;
  font-size: 2.5rem;
  padding: 20px 60px;
  border-radius: 60px;
  cursor: pointer;
  box-shadow: 0 0 50px cyan;
  transition: all 0.3s;
  font-weight: 900;
}

.neon-restart:hover {
  transform: scale(1.1);
  background: rgba(0, 255, 255, 0.2);
  box-shadow: 0 0 80px cyan, 0 0 150px magenta;
  border-color: magenta;
  color: magenta;
}

/* ANIMACIONES DE AYUDAS MÁS COLORIDAS */
.animacion-ayuda {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
  pointer-events: none;
}

.telefono-anim {
  position: relative;
}

.onda-llamada {
  position: absolute;
  border: 4px solid cyan;
  border-radius: 50%;
  animation: onda 2s infinite;
  box-shadow: 0 0 50px cyan, inset 0 0 30px cyan;
}

.onda-llamada:nth-child(1) { animation-delay: 0s; }
.onda-llamada:nth-child(2) { animation-delay: 0.5s; }
.onda-llamada:nth-child(3) { animation-delay: 1s; }

@keyframes onda {
  0% { width: 100px; height: 100px; opacity: 1; }
  100% { width: 500px; height: 500px; opacity: 0; }
}

.icono-llamada {
  font-size: 5rem;
  position: relative;
  z-index: 10;
  animation: llamadaPulse 1s infinite;
  filter: drop-shadow(0 0 30px cyan);
}

@keyframes llamadaPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.publico-anim {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.gente {
  font-size: 4rem;
  margin: 10px;
  animation: genteBounce 0.5s infinite alternate;
  filter: drop-shadow(0 0 20px gold);
}

.gente:nth-child(1) { animation-delay: 0s; }
.gente:nth-child(2) { animation-delay: 0.1s; }
.gente:nth-child(3) { animation-delay: 0.2s; }
.gente:nth-child(4) { animation-delay: 0.3s; }
.gente:nth-child(5) { animation-delay: 0.4s; }

@keyframes genteBounce {
  0% { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(-50px) rotate(10deg); }
}

.cincuenta-anim {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rayo {
  font-size: 8rem;
  position: absolute;
  animation: rayoFlash 0.3s infinite;
  filter: drop-shadow(0 0 50px cyan) drop-shadow(0 0 100px magenta);
}

.rayo:nth-child(1) { animation-delay: 0s; left: 30%; }
.rayo:nth-child(2) { animation-delay: 0.1s; right: 30%; }
.rayo:nth-child(3) { animation-delay: 0.2s; transform: rotate(180deg); }

@keyframes rayoFlash {
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.5); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.5); }
}

.burbuja, .burbuja-publico, .burbuja-5050 {
  background: rgba(0,0,0,0.9);
  padding: 30px 60px;
  border-radius: 60px;
  font-size: 3rem;
  font-weight: 900;
  border: 4px solid;
  box-shadow: 0 0 100px;
  backdrop-filter: blur(20px);
  z-index: 100;
  position: relative;
}

.burbuja { border-color: cyan; color: cyan; box-shadow: 0 0 100px cyan; }
.burbuja-publico { border-color: gold; color: gold; box-shadow: 0 0 100px gold; }
.burbuja-5050 { border-color: magenta; color: magenta; box-shadow: 0 0 100px magenta; }

/* MODAL MEJORADO */
.neon-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(20px);
}

.neon-modal-box {
  background: linear-gradient(145deg, #000a1a, #1a0033);
  border: 4px solid cyan;
  border-radius: 40px;
  padding: 50px;
  width: 600px;
  text-align: center;
  box-shadow: 0 0 100px cyan, 0 0 200px magenta, inset 0 0 50px cyan;
  animation: modalAppear 0.5s;
}

@keyframes modalAppear {
  0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.neon-modal-title {
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(45deg, cyan, magenta, gold);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 30px;
  text-shadow: 0 0 30px cyan;
}

.neon-modal-content {
  white-space: pre-line;
  font-size: 1.5rem;
  color: white;
  margin-bottom: 40px;
  text-shadow: 0 0 10px cyan;
  padding: 20px;
  border: 2px dashed rgba(0, 255, 255, 0.3);
  border-radius: 30px;
}

.neon-modal-btn {
  background: transparent;
  border: 4px solid gold;
  padding: 15px 50px;
  border-radius: 50px;
  color: gold;
  font-size: 1.5rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 0 40px gold;
  transition: all 0.3s;
}

.neon-modal-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 215, 0, 0.2);
  box-shadow: 0 0 80px gold, 0 0 150px orange;
  border-color: orange;
  color: orange;
}

/* Scrollbar personalizada */
.neon-ladder::-webkit-scrollbar {
  width: 8px;
}

.neon-ladder::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.5);
}

.neon-ladder::-webkit-scrollbar-thumb {
  background: linear-gradient(cyan, magenta);
  border-radius: 4px;
}

.neon-ladder::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(magenta, gold);
}
</style>