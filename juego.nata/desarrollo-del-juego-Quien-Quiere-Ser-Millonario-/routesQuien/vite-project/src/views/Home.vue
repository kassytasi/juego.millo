<template>
  <div class="game-home">
    <!-- Fondo animado sutil -->
    <div class="bg-animation"></div>

    <!-- Contenedor principal -->
    <div class="main-content">
      <!-- Logo principal -->
      <div class="game-logo">
        <div class="money-symbol">💎</div>
        <h1>¿QUIÉN QUIERE SER<br><span class="million">MILLONARIO?</span></h1>
        <div class="money-symbol">💰</div>
      </div>

      <!-- Input para nombre -->
      <div class="name-input-container">
        <input
          type="text"
          v-model="nombreJugador"
          placeholder="Ingresa tu nombre para jugar"
        />
      </div>

      <!-- Botones de acción -->
      <div class="action-buttons">
        <button
          class="play-btn"
          :disabled="!nombreJugador"
          @click="empezarJuego"
        >
          <span class="pulse-effect"></span>
          🎮 JUGAR AHORA
        </button>

        <button class="rank-btn" @click="verRanking">
          🏆 VER RANKING
        </button>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="quick-stats">
        <div class="stat">
          <div class="stat-value">1,234</div>
          <div class="stat-label">Jugadores hoy</div>
        </div>
        <div class="stat">
          <div class="stat-value">$10,450</div>
          <div class="stat-label">Premio mayor</div>
        </div>
        <div class="stat">
          <div class="stat-value">85%</div>
          <div class="stat-label">Ganan en Fácil</div>
        </div>
      </div>
    </div>

    <!-- Efecto de brillo móvil -->
    <div class="light-sweep"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombreJugador = ref('')

function empezarJuego() {
  // Guardar el nombre en sessionStorage
  sessionStorage.setItem('nombreJugador', nombreJugador.value.trim())
  router.push({ name: 'levels' })
}

function verRanking() {
  router.push({ name: 'ranking' })
}
</script>

<style scoped>
.game-home {
  height: 100vh;
  background: linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
}

/* Fondo animado */
.bg-animation {
  position: absolute;
  width: 200%;
  height: 200%;
  background:
    radial-gradient(circle at 20% 30%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(0, 191, 255, 0.08) 0%, transparent 50%);
  animation: rotateBg 30s linear infinite;
}

.main-content {
  text-align: center;
  z-index: 10;
  padding: 40px;
  max-width: 800px;
}

/* Logo */
.game-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
  animation: logoFloat 6s ease-in-out infinite;
}

.money-symbol {
  font-size: 4rem;
  animation: spin 8s linear infinite;
}

.game-logo h1 {
  font-size: 3.5rem;
  color: white;
  line-height: 1.2;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.million {
  background: linear-gradient(45deg, gold, #fff, gold);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 4rem;
  display: block;
  margin-top: 10px;
}

/* Input de nombre */
.name-input-container {
  margin-bottom: 30px;
}

.name-input-container input {
  padding: 15px 20px;
  font-size: 1.2rem;
  border-radius: 12px;
  border: none;
  outline: none;
  width: 300px;
  max-width: 80vw;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

/* Botones */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  margin-bottom: 50px;
}

.play-btn, .rank-btn {
  padding: 20px 50px;
  font-size: 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-width: 300px;
}

.play-btn {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: #0a0a2a;
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.4);
}

.play-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(255, 215, 0, 0.6);
}

.rank-btn {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.rank-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.pulse-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  animation: pulse 2s infinite;
  pointer-events: none;
}

/* Estadísticas */
.quick-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
}

.stat {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px 30px;
  border-radius: 15px;
  min-width: 140px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
}

.stat:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: gold;
  margin-bottom: 5px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

/* Luz móvil */
.light-sweep {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 50%,
    transparent 100%);
  animation: sweep 6s ease-in-out infinite;
  pointer-events: none;
}

/* Animaciones */
@keyframes rotateBg { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes logoFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulse { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0; transform: scale(1.2); } }
@keyframes sweep { 0% { left: -100%; } 100% { left: 100%; } }

/* Responsive */
@media (max-width: 768px) {
  .game-logo { flex-direction: column; gap: 20px; }
  .game-logo h1 { font-size: 2.5rem; }
  .million { font-size: 3rem; }
  .money-symbol { font-size: 3rem; }
  .play-btn, .rank-btn { min-width: 250px; padding: 18px 40px; font-size: 1.3rem; }
  .quick-stats { flex-direction: column; align-items: center; gap: 20px; }
  .stat { min-width: 200px; }
}
</style>
