<template>
  <div class="neon-home">
    <!-- GRID NEON LUMINOSO -->
    <div class="neon-grid"></div>
    
    <!-- PARTÍCULAS FLOTANTES -->
    <div class="particles">
      <div v-for="i in 15" :key="i" class="particle" :style="{
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 5 + 's',
        width: Math.random() * 6 + 2 + 'px',
        height: Math.random() * 6 + 2 + 'px'
      }"></div>
    </div>

    <div class="neon-content">
      <!-- LOGO NEON PULSANTE -->
      <div class="neon-logo">
        <div class="neon-circle"></div>
        <h1>
          <span class="neon-text">¿QUIÉN QUIERE</span><br>
          <span class="neon-text gold">SER MILLONARIO?</span>
        </h1>
        <div class="neon-line"></div>
      </div>

      <!-- INPUT NEON -->
      <div class="neon-input-group">
        <input
          type="text"
          v-model="nombreJugador"
          placeholder="INGRESA TU NOMBRE"
          @keyup.enter="empezarJuego"
          class="neon-input"
        />
        <div class="input-glow"></div>
      </div>

      <!-- BOTONES NEON -->
      <div class="neon-buttons">
        <button
          class="neon-btn play"
          :disabled="!nombreValido"
          @click="empezarJuego"
        >
          <span class="btn-content">🎮 JUGAR</span>
          <span class="btn-neon"></span>
        </button>

        <button class="neon-btn rank" @click="verRanking">
          <span class="btn-content">🏆 RANKING</span>
          <span class="btn-neon"></span>
        </button>
      </div>

      <!-- STATS NEON -->
      <div class="neon-stats">
        <div class="stat-card">
          <div class="stat-value neon-cyan">1,234</div>
          <div class="stat-label">JUGADORES</div>
        </div>
        <div class="stat-card">
          <div class="stat-value neon-gold">$10K</div>
          <div class="stat-label">PREMIOS</div>
        </div>
        <div class="stat-card">
          <div class="stat-value neon-pink">85%</div>
          <div class="stat-label">VICTORIAS</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombreJugador = ref('')

onMounted(() => {
  const nombreGuardado = localStorage.getItem('nombreJugador')
  if (nombreGuardado) nombreJugador.value = nombreGuardado
})

const nombreValido = computed(() => nombreJugador.value.trim().length > 0)

function empezarJuego() {
  const nombreLimpio = nombreJugador.value.trim()
  if (!nombreLimpio) return
  localStorage.setItem('nombreJugador', nombreLimpio)
  sessionStorage.removeItem('puntajeJugador')
  router.push({ name: 'levels' })
}

function verRanking() {
  router.push({ name: 'ranking' })
}
</script>

<style scoped>
.neon-home {
  min-height: 100vh;
  background: #03050c;
  position: relative;
  overflow: hidden;
  font-family: 'Montserrat', 'Segoe UI', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* GRID NEON */
.neon-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 15s linear infinite;
  opacity: 0.3;
}

/* PARTÍCULAS */
.particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  background: cyan;
  border-radius: 50%;
  box-shadow: 0 0 20px cyan;
  animation: floatParticle 8s infinite ease-in-out;
}

.neon-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  padding: 40px;
}

/* LOGO NEON */
.neon-logo {
  position: relative;
  margin-bottom: 60px;
}

.neon-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulseCircle 4s infinite;
}

.neon-text {
  font-size: 3rem;
  font-weight: 900;
  color: white;
  text-shadow: 
    0 0 10px cyan,
    0 0 20px cyan,
    0 0 40px cyan,
    0 0 80px cyan;
  animation: flicker 3s infinite;
  letter-spacing: 4px;
}

.neon-text.gold {
  font-size: 4rem;
  text-shadow: 
    0 0 10px gold,
    0 0 20px gold,
    0 0 40px gold,
    0 0 80px gold;
}

.neon-line {
  width: 150px;
  height: 3px;
  background: cyan;
  margin: 30px auto 0;
  box-shadow: 0 0 20px cyan;
  animation: widthPulse 2s infinite;
}

/* INPUT NEON */
.neon-input-group {
  position: relative;
  margin-bottom: 40px;
  display: inline-block;
  width: 100%;
}

.neon-input {
  width: 400px;
  max-width: 90vw;
  padding: 20px 30px;
  background: transparent;
  border: 2px solid cyan;
  border-radius: 50px;
  color: white;
  font-size: 1.3rem;
  letter-spacing: 3px;
  outline: none;
  position: relative;
  z-index: 2;
  text-align: center;
  font-weight: 600;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  transition: 0.3s;
}

.neon-input:focus {
  border-color: gold;
  box-shadow: 0 0 30px gold;
}

.neon-input::placeholder {
  color: rgba(0, 255, 255, 0.5);
  font-weight: 400;
}

.input-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50px;
  background: linear-gradient(45deg, cyan, gold, cyan);
  z-index: 1;
  filter: blur(10px);
  opacity: 0;
  transition: 0.3s;
}

.neon-input:focus + .input-glow {
  opacity: 0.8;
}

/* BOTONES NEON */
.neon-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  margin-bottom: 60px;
}

.neon-btn {
  position: relative;
  padding: 18px 60px;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 300px;
  max-width: 80vw;
}

.btn-content {
  position: relative;
  z-index: 3;
  color: white;
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: 6px;
  text-shadow: 0 0 10px currentColor;
}

.btn-neon {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 60px;
  z-index: 1;
  transition: 0.3s;
}

.play .btn-neon {
  border: 3px solid gold;
  box-shadow: 0 0 20px gold, inset 0 0 20px gold;
  animation: borderPulse 2s infinite;
}

.rank .btn-neon {
  border: 3px solid cyan;
  box-shadow: 0 0 20px cyan, inset 0 0 20px cyan;
}

.neon-btn:hover .btn-neon {
  filter: blur(5px);
  transform: scale(1.05);
}

.neon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* STATS NEON */
.neon-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 20px;
  padding: 25px 35px;
  backdrop-filter: blur(10px);
  transition: 0.3s;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-10px);
  border-color: gold;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 10px;
}

.stat-label {
  color: white;
  font-size: 1rem;
  letter-spacing: 3px;
  opacity: 0.9;
}

.neon-cyan {
  text-shadow: 0 0 10px cyan, 0 0 20px cyan;
  color: cyan;
}

.neon-gold {
  text-shadow: 0 0 10px gold, 0 0 20px gold;
  color: gold;
}

.neon-pink {
  text-shadow: 0 0 10px #ff6ec7, 0 0 20px #ff6ec7;
  color: #ff6ec7;
}

/* ANIMACIONES */
@keyframes gridMove {
  0% { transform: translateY(0); }
  100% { transform: translateY(50px); }
}

@keyframes floatParticle {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
  25% { transform: translateY(-30px) translateX(20px); opacity: 0.8; }
  50% { transform: translateY(20px) translateX(-20px); opacity: 0.5; }
  75% { transform: translateY(30px) translateX(10px); opacity: 0.7; }
}

@keyframes pulseCircle {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  2% { opacity: 0.8; }
  4% { opacity: 1; }
  19% { opacity: 1; }
  21% { opacity: 0.9; }
  23% { opacity: 1; }
}

@keyframes widthPulse {
  0%, 100% { width: 150px; opacity: 0.8; }
  50% { width: 200px; opacity: 1; }
}

@keyframes borderPulse {
  0%, 100% { box-shadow: 0 0 20px gold, inset 0 0 20px gold; }
  50% { box-shadow: 0 0 40px gold, inset 0 0 40px gold; }
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .neon-text { font-size: 2rem; }
  .neon-text.gold { font-size: 2.8rem; }
  .btn-content { font-size: 1.3rem; }
  .stat-value { font-size: 2rem; }
  .neon-stats { gap: 20px; }
  .stat-card { padding: 20px 25px; }
}
</style>