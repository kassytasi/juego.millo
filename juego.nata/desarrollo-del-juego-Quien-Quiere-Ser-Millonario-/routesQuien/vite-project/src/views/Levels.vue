<template>
  <div class="levels" @click="crearDinero">
    <!-- Efecto de luces -->
    <div class="stage-lights"></div>
    
    <!-- Título con efecto -->
    <div class="title-container">
      <h1 class="main-title">SELECCIONA TU</h1>
      <h1 class="highlight-title">DESAFÍO</h1>
      <div class="title-sub">¿Cuánto te atreves a ganar?</div>
    </div>
    
    <!-- Niveles con diseño de juego -->
    <div class="levels-container">
      <div class="level-card" 
           :class="['level-facil', { 'hover': hoverFacil }]"
           @mouseenter="hoverFacil = true"
           @mouseleave="hoverFacil = false"
           @click="elegirNivel('facil')">
        <div class="level-emoji">🎮</div>
        <div class="level-name">FÁCIL</div>
        <div class="level-description">Preguntas básicas</div>
        <div class="level-prize">Hasta $1,000</div>
        <div class="level-glow"></div>
      </div>
      
      <div class="level-card" 
           :class="['level-medio', { 'hover': hoverMedio }]"
           @mouseenter="hoverMedio = true"
           @mouseleave="hoverMedio = false"
           @click="elegirNivel('medio')">
        <div class="level-emoji">🔥</div>
        <div class="level-name">MEDIO</div>
        <div class="level-description">Desafío moderado</div>
        <div class="level-prize">Hasta $10,000</div>
        <div class="level-glow"></div>
      </div>
      
      <div class="level-card" 
           :class="['level-dificil', { 'hover': hoverDificil }]"
           @mouseenter="hoverDificil = true"
           @mouseleave="hoverDificil = false"
           @click="elegirNivel('dificil')">
        <div class="level-emoji">💎</div>
        <div class="level-name">DIFÍCIL</div>
        <div class="level-description">Para expertos</div>
        <div class="level-prize">Hasta $100,000</div>
        <div class="level-glow"></div>
      </div>
    </div>
    
    <!-- Indicador -->
    <div class="instruction">
      Toca cualquier nivel para comenzar tu camino al millón
    </div>
    
    <!-- Efecto de dinero -->
    <div class="money-fall">
      <div v-for="(money, index) in moneyParticles" 
           :key="index"
           class="money"
           :style="{
             left: money.x + 'px',
             top: money.y + 'px',
             transform: `rotate(${money.rotation}deg)`,
             animationDuration: money.duration + 's'
           }">
        {{ money.symbol }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const hoverFacil = ref(false)
const hoverMedio = ref(false)
const hoverDificil = ref(false)
const moneyParticles = ref([])

function elegirNivel(dificultad) {
  sessionStorage.setItem('dificultad', dificultad)
  router.push({ name: 'cabina' })
}

function crearDinero(event) {
  const x = event.clientX
  const y = event.clientY
  
  const symbols = ['💰', '💵', '💎', '🪙', '$']
  
  for (let i = 0; i < 3; i++) {
    moneyParticles.value.push({
      x: x + Math.random() * 50 - 25,
      y: y,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      rotation: Math.random() * 360,
      duration: 1 + Math.random() * 2
    })
  }
  
  // Limitar cantidad
  if (moneyParticles.value.length > 30) {
    moneyParticles.value = moneyParticles.value.slice(-30)
  }
}

onMounted(() => {
  // Crear dinero inicial
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      crearDinero({
        clientX: Math.random() * window.innerWidth,
        clientY: Math.random() * window.innerHeight
      })
    }, i * 300)
  }
})
</script>

<style scoped>
.levels {
  height: 100vh;
  background: linear-gradient(135deg, #0c0c2e 0%, #1a1a4a 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-family: 'Arial Black', sans-serif;
  cursor: pointer;
}

.stage-lights {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 40%);
  animation: pulse 3s infinite alternate;
}

.title-container {
  text-align: center;
  margin-bottom: 60px;
  z-index: 2;
}

.main-title {
  font-size: 3.5rem;
  color: white;
  margin: 0;
  text-shadow: 0 0 20px rgba(0, 191, 255, 0.5);
  letter-spacing: 4px;
}

.highlight-title {
  font-size: 4.5rem;
  color: gold;
  margin: 10px 0;
  text-shadow: 
    0 0 30px rgba(255, 215, 0, 0.8),
    0 0 60px rgba(255, 215, 0, 0.4);
  letter-spacing: 5px;
  animation: titleGlow 2s infinite alternate;
}

.title-sub {
  font-size: 1.2rem;
  color: #87ceeb;
  margin-top: 10px;
  letter-spacing: 2px;
}

.levels-container {
  display: flex;
  gap: 40px;
  z-index: 2;
  margin-bottom: 40px;
}

.level-card {
  width: 280px;
  height: 350px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  padding: 20px;
}

.level-card:hover {
  transform: translateY(-20px) scale(1.05);
}

.level-facil {
  background: linear-gradient(145deg, #2ecc71, #27ae60);
  border: 3px solid #27ae60;
  box-shadow: 0 10px 30px rgba(46, 204, 113, 0.4);
}

.level-medio {
  background: linear-gradient(145deg, #3498db, #2980b9);
  border: 3px solid #2980b9;
  box-shadow: 0 10px 30px rgba(52, 152, 219, 0.4);
}

.level-dificil {
  background: linear-gradient(145deg, #e74c3c, #c0392b);
  border: 3px solid #c0392b;
  box-shadow: 0 10px 30px rgba(231, 76, 60, 0.4);
}

.level-emoji {
  font-size: 4.5rem;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.level-name {
  font-size: 2.8rem;
  font-weight: bold;
  color: white;
  margin-bottom: 15px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 3px;
}

.level-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20px;
  text-align: center;
}

.level-prize {
  font-size: 1.4rem;
  color: gold;
  font-weight: bold;
  padding: 8px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50px;
  margin-top: 10px;
  border: 2px solid rgba(255, 215, 0, 0.5);
}

.level-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.level-card.hover .level-glow {
  opacity: 1;
}

.instruction {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  text-align: center;
  max-width: 600px;
  line-height: 1.6;
  z-index: 2;
  margin-top: 20px;
  animation: fadeInOut 2s infinite alternate;
}

/* Efecto de dinero */
.money-fall {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.money {
  position: absolute;
  font-size: 2rem;
  animation: fall linear forwards;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  pointer-events: none;
}

/* Animaciones */
@keyframes pulse {
  0% { opacity: 0.3; }
  100% { opacity: 0.6; }
}

@keyframes titleGlow {
  0% { text-shadow: 0 0 30px rgba(255, 215, 0, 0.8); }
  100% { text-shadow: 0 0 50px rgba(255, 215, 0, 1), 0 0 80px rgba(255, 215, 0, 0.5); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

@keyframes fall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .levels-container {
    gap: 20px;
  }
  
  .level-card {
    width: 220px;
    height: 300px;
  }
  
  .level-name {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .levels-container {
    flex-direction: column;
    gap: 30px;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .highlight-title {
    font-size: 3rem;
  }
  
  .level-card {
    width: 300px;
    height: 250px;
  }
  
  .level-emoji {
    font-size: 3.5rem;
  }
}
</style>