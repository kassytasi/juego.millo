<template>
  <div class="neon-ranking">
    <!-- BACKGROUND NEON -->
    <div class="cyber-grid"></div>
    <div class="neon-aura"></div>
    
    <!-- PARTÍCULAS DE LUZ -->
    <div class="light-particles">
      <div v-for="i in 12" :key="i" class="particle" :style="{
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 5 + 's',
        background: `hsl(${Math.random() * 60 + 40}, 100%, 60%)`
      }"></div>
    </div>

    <!-- HEADER NEON -->
    <div class="ranking-neon">
      <div class="glitch-title">
        <span class="glitch-layer" data-text="🏆 RANKING">🏆 RANKING</span>
        <span class="glitch-layer" data-text="🏆 RANKING">🏆 RANKING</span>
        <span class="glitch-layer" data-text="🏆 RANKING">🏆 RANKING</span>
      </div>
      <div class="neon-sub">TOP 10 · MILLONARIOS</div>
    </div>

    <!-- TABLA NEON -->
    <div class="table-container">
      <div class="table-header">
        <div class="header-cell">#</div>
        <div class="header-cell">JUGADOR</div>
        <div class="header-cell">💰 PREMIO</div>
        <div class="header-cell">📅 FECHA</div>
      </div>

      <div class="table-body">
        <div v-for="(jugador, index) in jugadores" :key="index"
             :class="['table-row', { 'gold-row': index === 0, 'silver-row': index === 1, 'bronze-row': index === 2 }]"
             :style="{ animationDelay: index * 0.1 + 's' }">
          
          <div class="row-cell position">
            <span class="position-number">{{ index + 1 }}</span>
            <span v-if="index === 0" class="crown-neon">👑</span>
          </div>
          
          <div class="row-cell player">
            <span class="player-dot"></span>
            {{ jugador.nombre }}
          </div>
          
          <div class="row-cell prize">
            <span class="prize-glow">{{ jugador.puntaje }}</span>
          </div>
          
          <div class="row-cell date">
            {{ jugador.fecha }}
          </div>
        </div>
        <div v-if="jugadores.length === 0" class="empty-message">
          🎮 Aún no hay jugadores en el ranking
        </div>
      </div>
    </div>

    <!-- BOTÓN NEON -->
    <button class="neon-button" @click="volverInicio">
      <span class="btn-text">⚡ VOLVER AL INICIO ⚡</span>
      <span class="btn-glow"></span>
    </button>

    <!-- SCANLINES -->
    <div class="scanline"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const jugadores = ref([])

onMounted(() => {
  // Obtener datos del jugador actual
  const nombreReciente = sessionStorage.getItem('nombreJugador')
  const puntajeReciente = sessionStorage.getItem('puntajeJugador')
  
  // Cargar ranking existente
  let ranking = JSON.parse(localStorage.getItem('ranking') || '[]')
  
  // Limpiar datos previos para evitar duplicados
  if (nombreReciente && puntajeReciente) {
    // Verificar si ya existe una entrada igual hoy
    const hoy = new Date().toLocaleDateString('es-ES')
    const existeDuplicado = ranking.some(j => 
      j.nombre === nombreReciente && 
      j.puntaje === puntajeReciente && 
      j.fecha === hoy
    )
    
    if (!existeDuplicado) {
      ranking.push({
        nombre: nombreReciente,
        puntaje: puntajeReciente,
        fecha: hoy
      })
    }
    
    // Guardar ranking actualizado
    localStorage.setItem('ranking', JSON.stringify(ranking))
    
    // Limpiar sessionStorage
    sessionStorage.removeItem('nombreJugador')
    sessionStorage.removeItem('puntajeJugador')
  }
  
  // Ordenar y mostrar top 10
  jugadores.value = ranking
    .map(j => ({ ...j })) // Crear copia para no mutar original
    .sort((a, b) => {
      const aNum = parseInt(String(a.puntaje).replace(/\D/g, '')) || 0
      const bNum = parseInt(String(b.puntaje).replace(/\D/g, '')) || 0
      return bNum - aNum
    })
    .slice(0, 10)
})

function volverInicio() {
  router.push({ name: 'home' })
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.neon-ranking {
  min-height: 100vh;
  background: #03050f;
  position: relative;
  overflow: hidden;
  font-family: 'Montserrat', 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

/* CYBER GRID */
.cyber-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.15) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: gridMove 20s linear infinite;
  pointer-events: none;
}

/* AURAS NEON */
.neon-aura {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.2) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(0, 255, 255, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.1) 0%, transparent 50%);
  animation: auraPulse 8s ease infinite;
  pointer-events: none;
}

/* PARTÍCULAS */
.light-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  box-shadow: 0 0 20px currentColor;
  animation: particleFloat 8s infinite;
  opacity: 0.6;
  pointer-events: none;
}

/* TÍTULO GLITCH */
.ranking-neon {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 10;
  width: 100%;
}

.glitch-title {
  font-size: 4.5rem;
  font-weight: 900;
  position: relative;
  margin-bottom: 15px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.glitch-layer {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: gold;
  text-shadow: 0 0 20px gold, 0 0 40px gold, 0 0 60px cyan;
  animation: glitch 3s infinite;
}

.glitch-layer:nth-child(1) { 
  transform: none; 
  color: gold; 
}
.glitch-layer:nth-child(2) { 
  animation: glitchLeft 0.3s infinite;
  color: cyan; 
  text-shadow: 0 0 20px cyan;
  opacity: 0.8;
}
.glitch-layer:nth-child(3) { 
  animation: glitchRight 0.3s infinite;
  color: #ff00ff; 
  text-shadow: 0 0 20px #ff00ff;
  opacity: 0.8;
}

.neon-sub {
  color: white;
  font-size: 1.3rem;
  letter-spacing: 8px;
  text-shadow: 0 0 10px cyan;
  margin-top: 20px;
}

/* TABLA NEON */
.table-container {
  width: 100%;
  max-width: 1000px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(15px);
  border: 2px solid gold;
  border-radius: 30px;
  padding: 25px;
  box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
  margin-bottom: 40px;
  position: relative;
  z-index: 10;
}

.table-header {
  display: grid;
  grid-template-columns: 0.5fr 1.5fr 1fr 1fr;
  padding: 15px 20px;
  border-bottom: 2px solid cyan;
  margin-bottom: 15px;
}

.header-cell {
  color: cyan;
  font-weight: 900;
  font-size: 1.2rem;
  letter-spacing: 3px;
  text-shadow: 0 0 10px cyan;
}

.table-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.table-row {
  display: grid;
  grid-template-columns: 0.5fr 1.5fr 1fr 1fr;
  padding: 15px 20px;
  background: rgba(0, 255, 255, 0.05);
  border-radius: 15px;
  transition: 0.3s;
  border: 1px solid rgba(0, 255, 255, 0.3);
  animation: rowAppear 0.5s ease backwards;
}

.table-row:hover {
  background: rgba(0, 255, 255, 0.15);
  transform: translateX(10px);
  border-color: cyan;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
}

/* POSICIONES ESPECIALES */
.gold-row {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.2), transparent);
  border-left: 6px solid gold;
}
.gold-row .prize-glow { 
  color: gold; 
  text-shadow: 0 0 20px gold; 
}

.silver-row {
  border-left: 6px solid #c0c0c0;
}
.silver-row .prize-glow { 
  color: #c0c0c0; 
  text-shadow: 0 0 20px #c0c0c0; 
}

.bronze-row {
  border-left: 6px solid #cd7f32;
}
.bronze-row .prize-glow { 
  color: #cd7f32; 
  text-shadow: 0 0 20px #cd7f32; 
}

.row-cell {
  display: flex;
  align-items: center;
  color: white;
  font-weight: 600;
  gap: 10px;
}

.position-number {
  font-size: 1.3rem;
  font-weight: 900;
  color: cyan;
  text-shadow: 0 0 10px cyan;
}

.crown-neon {
  font-size: 1.5rem;
  animation: crownFloat 2s infinite;
}

.player-dot {
  width: 8px;
  height: 8px;
  background: cyan;
  border-radius: 50%;
  box-shadow: 0 0 15px cyan;
  display: inline-block;
}

.prize-glow {
  font-weight: 900;
  font-size: 1.2rem;
  color: gold;
  text-shadow: 0 0 15px gold;
}

.date {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.empty-message {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.3rem;
  text-align: center;
  padding: 40px;
  font-style: italic;
  text-shadow: 0 0 10px cyan;
}

/* BOTÓN NEON */
.neon-button {
  position: relative;
  padding: 18px 50px;
  background: transparent;
  border: 3px solid gold;
  border-radius: 60px;
  cursor: pointer;
  overflow: hidden;
  transition: 0.3s;
  box-shadow: 0 0 30px gold;
  z-index: 10;
}

.btn-text {
  position: relative;
  color: white;
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: 6px;
  text-shadow: 0 0 15px gold;
  z-index: 2;
}

.btn-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: gold;
  opacity: 0;
  transition: 0.3s;
}

.neon-button:hover {
  transform: scale(1.1);
  box-shadow: 0 0 60px gold;
}

.neon-button:hover .btn-glow {
  opacity: 0.2;
}

/* SCANLINE */
.scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 255, 255, 0.03) 0px,
    rgba(0, 255, 255, 0.03) 2px,
    transparent 2px,
    transparent 4px
  );
  pointer-events: none;
  z-index: 100;
  animation: scanline 8s linear infinite;
}

/* ANIMACIONES */
@keyframes gridMove {
  0% { transform: translateY(0); }
  100% { transform: translateY(40px); }
}

@keyframes auraPulse {
  0%,100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

@keyframes particleFloat {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  50% { transform: translateY(-100px) translateX(50px); opacity: 0.8; }
  100% { transform: translateY(0) translateX(0); opacity: 0; }
}

@keyframes glitch {
  0%,100% { opacity: 1; }
  5% { opacity: 0.8; }
  10% { opacity: 1; }
  15% { opacity: 0.9; }
  20% { opacity: 1; }
}

@keyframes glitchLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-5px); }
}

@keyframes glitchRight {
  0% { transform: translateX(0); }
  100% { transform: translateX(5px); }
}

@keyframes rowAppear {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes crownFloat {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

/* RESPONSIVE */
@media (max-width: 700px) {
  .glitch-title { font-size: 2.8rem; height: 80px; }
  .table-header, .table-row {
    grid-template-columns: 0.8fr 1.5fr 1fr 1fr;
    font-size: 0.9rem;
  }
  .btn-text { font-size: 1.1rem; }
}

@media (max-width: 500px) {
  .date { display: none; }
  .table-header, .table-row {
    grid-template-columns: 0.8fr 1.5fr 1fr;
  }
  .glitch-title { font-size: 2rem; }
}
</style>