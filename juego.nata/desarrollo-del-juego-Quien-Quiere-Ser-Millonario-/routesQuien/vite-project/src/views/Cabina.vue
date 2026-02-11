<template>
  <div class="cabina">
    <!-- Efectos de fondo -->
    <div class="stage-effects"></div>
    
    <div class="game-container" v-if="!terminado">
      <!-- Pregunta -->
      <div class="question-card">
        <div class="question-header">
          <span class="level-badge">NIVEL {{ nivelActual + 1 }}</span>
          <span class="prize-badge">${{ premioActual }}</span>
        </div>
        
        <div class="question-text">
          {{ preguntaActual.texto }}
        </div>
        
        <div class="question-timer">
          <div class="timer-bar"></div>
        </div>
      </div>

      <!-- Respuestas -->
      <div class="answers-grid">
        <button
          v-for="(resp, i) in preguntaActual.respuestas"
          :key="i"
          :class="['answer-btn', `answer-${i}`, claseRespuesta(i)]"
          @click="clickRespuesta(i)"
          :disabled="respondido"
        >
          <span class="answer-letter">{{ String.fromCharCode(65 + i) }}</span>
          <span class="answer-text">{{ resp }}</span>
        </button>
      </div>
    </div>

    <!-- Escalera de dinero -->
    <div class="money-ladder">
      <div class="ladder-title">ESCALERA DEL DINERO</div>
      <div class="ladder-levels">
        <div 
          v-for="(nivel, idx) in niveles.slice().reverse()" 
          :key="idx"
          :class="['ladder-step', { 
            'current': (niveles.length - idx - 1) === nivelActual,
            'safe': nivel.seguro,
            'passed': (niveles.length - idx - 1) < nivelActual 
          }]"
        >
          <span class="step-level">Pregunta {{ nivel.nivel }}</span>
          <span class="step-prize">${{ nivel.premio }}</span>
        </div>
      </div>
    </div>

    <!-- Pantalla de resultado -->
    <div class="result-screen" v-if="terminado">
      <div class="result-content">
        <div class="result-icon" :class="gano ? 'win' : 'lose'">
          {{ gano ? '🏆' : '💀' }}
        </div>
        
        <h1 class="result-title">
          {{ gano ? '¡FELICIDADES!' : '¡JUEGO TERMINADO!' }}
        </h1>
        
        <div class="result-message">
          <p v-if="gano">🎉 ¡Ganaste ${{ premioActual }}!</p>
          <p v-else>💀 ¡Perdiste! Te llevas ${{ premioSeguro }}</p>
        </div>
        
        <button class="result-btn" @click="reiniciarJuego">
          {{ gano ? 'JUGAR OTRA VEZ' : 'REINTENTAR' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// Eliminamos Avarage.vue y hacemos la escalera aquí mismo

// Obtener dificultad
const dificultad = sessionStorage.getItem('dificultad') || 'facil'

const nivelActual = ref(0)
const terminado = ref(false)
const gano = ref(false)
const respondido = ref(false)
const respuestaElegida = ref(null)

// Preguntas (las mismas que ya tienes)
const preguntasPorDificultad = {
  facil: [
    { texto: 'Capital de Francia?', correcta: 1, respuestas: ['Madrid','París','Roma','Berlín'] },
    { texto: '2 + 2?', correcta: 2, respuestas: ['3','5','4','6'] },
    { texto: 'Color del cielo?', correcta: 0, respuestas: ['Azul','Rojo','Verde','Negro'] },
    { texto: 'Animal que dice "miau"?', correcta: 0, respuestas: ['Gato','Perro','Vaca','Oveja'] },
    { texto: '1 + 1?', correcta: 1, respuestas: ['1','2','3','4'] },
    { texto: 'Día después del lunes?', correcta: 1, respuestas: ['Domingo','Martes','Miércoles','Viernes'] },
    { texto: 'Capital de España?', correcta: 0, respuestas: ['Madrid','Barcelona','Sevilla','Valencia'] },
    { texto: 'Número de patas de un perro?', correcta: 0, respuestas: ['4','2','6','8'] },
    { texto: 'Color de la nieve?', correcta: 2, respuestas: ['Negro','Azul','Blanco','Verde'] },
    { texto: 'Fruta roja y redonda?', correcta: 0, respuestas: ['Manzana','Banana','Uva','Naranja'] }
  ],
  medio: [
    { texto: 'Planeta conocido como el Planeta Rojo?', correcta: 0, respuestas: ['Marte','Venus','Júpiter','Mercurio'] },
    { texto: 'Capital de Alemania?', correcta: 1, respuestas: ['Múnich','Berlín','Hamburgo','Frankfurt'] },
    { texto: 'Animal que da leche?', correcta: 2, respuestas: ['Cerdo','Perro','Vaca','Oveja'] },
    { texto: 'Raíz cuadrada de 49?', correcta: 1, respuestas: ['6','7','8','9'] },
    { texto: 'Gas que respiramos?', correcta: 0, respuestas: ['Oxígeno','Dióxido de carbono','Nitrógeno','Hidrógeno'] },
    { texto: 'Color de la bandera de Japón?', correcta: 2, respuestas: ['Negro','Azul','Blanco con rojo','Verde'] },
    { texto: '5 x 5?', correcta: 0, respuestas: ['25','20','15','30'] },
    { texto: 'Primer mes del año?', correcta: 0, respuestas: ['Enero','Febrero','Marzo','Abril'] },
    { texto: 'País con la Torre Eiffel?', correcta: 0, respuestas: ['Francia','Italia','España','Alemania'] },
    { texto: 'Número de continentes en el mundo?', correcta: 1, respuestas: ['5','7','6','8'] }
  ],
  dificil: [
    { texto: 'Fórmula química del agua?', correcta: 0, respuestas: ['H2O','CO2','O2','NaCl'] },
    { texto: 'País con mayor población?', correcta: 0, respuestas: ['China','India','EEUU','Rusia'] },
    { texto: 'Capital de Australia?', correcta: 1, respuestas: ['Sydney','Canberra','Melbourne','Perth'] },
    { texto: 'Resultado de 15 x 12?', correcta: 2, respuestas: ['170','180','180','160'] },
    { texto: 'Planeta más cercano al Sol?', correcta: 0, respuestas: ['Mercurio','Venus','Tierra','Marte'] },
    { texto: 'Signo químico del oro?', correcta: 1, respuestas: ['Ag','Au','Fe','Pb'] },
    { texto: 'Número de huesos en el cuerpo humano?', correcta: 2, respuestas: ['206','201','206','210'] },
    { texto: 'Lengua oficial de Brasil?', correcta: 0, respuestas: ['Portugués','Español','Inglés','Francés'] },
    { texto: 'Distancia Tierra-Luna aprox?', correcta: 2, respuestas: ['200.000 km','300.000 km','384.400 km','400.000 km'] },
    { texto: 'Quién pintó la Mona Lisa?', correcta: 1, respuestas: ['Michelangelo','Leonardo da Vinci','Picasso','Van Gogh'] }
  ]
}

const preguntas = preguntasPorDificultad[dificultad]

// Escalera de premios integrada
const niveles = preguntas.map((p, i) => ({
  nivel: i + 1,
  premio: (i + 1) * 100,
  seguro: i === 2 || i === 5 || i === 9
}))

const preguntaActual = computed(() => preguntas[nivelActual.value])
const premioActual = computed(() => niveles[nivelActual.value]?.premio || 0)
const premioSeguro = computed(() => {
  const seguros = niveles.filter(n => n.seguro && n.nivel <= nivelActual.value + 1)
  if (seguros.length === 0) return 0
  return seguros[seguros.length - 1].premio
})

function clickRespuesta(i) {
  respondido.value = true
  respuestaElegida.value = i

  if (i === preguntaActual.value.correcta) {
    if (nivelActual.value < preguntas.length - 1) {
      setTimeout(() => {
        nivelActual.value++
        respondido.value = false
        respuestaElegida.value = null
      }, 1500)
    } else {
      gano.value = true
      terminado.value = true
    }
  } else {
    setTimeout(() => {
      terminado.value = true
    }, 1500)
  }
}

function claseRespuesta(i) {
  if (!respondido.value) return ''
  if (i === preguntaActual.value.correcta) return 'correct'
  if (i === respuestaElegida.value) return 'incorrect'
  return 'disabled'
}

function reiniciarJuego() {
  nivelActual.value = 0
  terminado.value = false
  gano.value = false
  respondido.value = false
  respuestaElegida.value = null
  sessionStorage.removeItem('dificultad')
  window.location.href = '/'
}
</script>

<style scoped>
.cabina {
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #0c0c2e 0%, #1a1a4a 100%);
  display: flex;
  padding: 20px;
  gap: 30px;
  font-family: 'Arial Black', sans-serif;
  position: relative;
  overflow: hidden;
}

.stage-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
  animation: pulse 3s infinite alternate;
}

.game-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  z-index: 2;
}

.question-card {
  background: rgba(0, 0, 30, 0.85);
  border-radius: 20px;
  padding: 30px;
  border: 3px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 0 40px rgba(0, 191, 255, 0.2);
  backdrop-filter: blur(10px);
}

.question-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.level-badge {
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  padding: 8px 20px;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.1rem;
  letter-spacing: 1px;
}

.prize-badge {
  background: linear-gradient(45deg, gold, #ffed4e);
  padding: 8px 20px;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.3rem;
  color: #0c0c2e;
}

.question-text {
  font-size: 2.2rem;
  color: white;
  text-align: center;
  margin: 40px 0;
  line-height: 1.4;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.question-timer {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.timer-bar {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, gold, #ff8e53);
  animation: timer 30s linear infinite;
}

.answers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.answer-btn {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px 30px;
  border-radius: 15px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-align: left;
}

.answer-btn:hover:not(:disabled) {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
}

.answer-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.answer-btn.correct {
  background: linear-gradient(45deg, #2ecc71, #27ae60) !important;
  animation: correctGlow 0.5s ease-out;
}

.answer-btn.incorrect {
  background: linear-gradient(45deg, #e74c3c, #c0392b) !important;
  animation: incorrectShake 0.5s ease-out;
}

.answer-btn.disabled {
  opacity: 0.5;
}

.answer-letter {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.5rem;
}

.answer-text {
  flex: 1;
  font-weight: bold;
}

/* Escalera de dinero */
.money-ladder {
  width: 350px;
  background: rgba(0, 0, 20, 0.85);
  border-radius: 20px;
  padding: 25px;
  border: 3px solid rgba(255, 215, 0, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
}

.ladder-title {
  color: gold;
  font-size: 1.4rem;
  text-align: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  letter-spacing: 2px;
}

.ladder-levels {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ladder-step {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
}

.ladder-step.current {
  background: linear-gradient(45deg, gold, #ffed4e);
  color: #0c0c2e;
  font-weight: bold;
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.ladder-step.safe {
  border-left: 5px solid #2ecc71;
}

.ladder-step.passed {
  background: rgba(46, 204, 113, 0.2);
  color: white;
}

.step-level {
  font-weight: bold;
}

.step-prize {
  color: gold;
  font-weight: bold;
  font-size: 1.2rem;
}

/* Pantalla de resultado */
.result-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 20, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  animation: fadeIn 0.5s ease;
}

.result-content {
  text-align: center;
  max-width: 600px;
  padding: 50px;
  background: rgba(0, 0, 30, 0.9);
  border-radius: 30px;
  border: 4px solid gold;
  box-shadow: 0 0 60px rgba(255, 215, 0, 0.4);
}

.result-icon {
  font-size: 8rem;
  margin-bottom: 30px;
  animation: bounce 1s ease infinite alternate;
}

.result-title {
  color: gold;
  font-size: 3.5rem;
  margin-bottom: 20px;
  letter-spacing: 3px;
}

.result-message {
  color: white;
  font-size: 2rem;
  margin: 30px 0;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.result-btn {
  padding: 18px 45px;
  font-size: 1.5rem;
  background: linear-gradient(45deg, gold, #ffed4e);
  border: none;
  border-radius: 15px;
  cursor: pointer;
  color: #0c0c2e;
  font-weight: bold;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.result-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
}

/* Animaciones */
@keyframes pulse {
  0% { opacity: 0.2; }
  100% { opacity: 0.5; }
}

@keyframes timer {
  0% { width: 100%; }
  100% { width: 0%; }
}

@keyframes correctGlow {
  0% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7); }
  100% { box-shadow: 0 0 0 20px rgba(46, 204, 113, 0); }
}

@keyframes incorrectShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

@keyframes bounce {
  0% { transform: translateY(0); }
  100% { transform: translateY(-20px); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive */
@media (max-width: 1200px) {
  .cabina {
    flex-direction: column;
    padding: 10px;
  }
  
  .money-ladder {
    width: 100%;
    order: -1;
  }
  
  .answers-grid {
    grid-template-columns: 1fr;
  }
  
  .question-text {
    font-size: 1.8rem;
  }
  
  .result-content {
    margin: 20px;
    padding: 30px;
  }
}
</style>