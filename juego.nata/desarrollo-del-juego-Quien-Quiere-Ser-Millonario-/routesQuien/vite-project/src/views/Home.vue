<template>
  <div class="home">
    <!-- Efecto de luces de estudio -->
    <div class="stage-lights"></div>
    
    <div class="game-container">
      <!-- Logo animado -->
      <div class="logo-container">
        <div class="logo-animation">
          <span class="logo-money">💰</span>
          <h1 class="logo-text">QUIÉN QUIERE SER <span class="highlight">MILLONARIO</span></h1>
          <span class="logo-money">💰</span>
        </div>
        <div class="logo-subtitle">El desafío definitivo</div>
      </div>
      
      <!-- Botón principal con efecto -->
      <div class="button-container">
        <button class="start-btn" @click="empezarJuego">
          <span class="btn-text">¡JUGAR AHORA!</span>
          <span class="btn-glow"></span>
        </button>
        
        <!-- Efecto de brillo dorado -->
        <div class="gold-shine"></div>
      </div>
      
      <!-- Elementos decorativos -->
      <div class="decoration left">🎯</div>
      <div class="decoration right">🏆</div>
    </div>
    
    <!-- Efecto de partículas -->
    <div class="particles"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function empezarJuego() {
  router.push({ name: 'levels' })
}
</script>


<style scoped>
.home {
  height: 100vh;
  width: 100vw;
  background: 
    radial-gradient(circle at 20% 50%, rgba(25, 25, 112, 0.8) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 0, 139, 0.6) 0%, transparent 50%),
    linear-gradient(135deg, #0c0c2e 0%, #1a1a4a 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-family: 'Arial Black', 'Arial Bold', sans-serif;
}

/* Luces de estudio */
.stage-lights {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 30% 10%, rgba(255, 215, 0, 0.1) 0%, transparent 25%),
    radial-gradient(circle at 70% 10%, rgba(255, 215, 0, 0.1) 0%, transparent 25%),
    radial-gradient(circle at 50% 90%, rgba(0, 191, 255, 0.1) 0%, transparent 25%);
  animation: pulse 4s infinite alternate;
}

.game-container {
  text-align: center;
  z-index: 10;
  position: relative;
  max-width: 900px;
  padding: 40px;
  background: rgba(0, 0, 20, 0.7);
  border-radius: 20px;
  border: 3px solid rgba(255, 215, 0, 0.3);
  box-shadow: 
    0 0 60px rgba(255, 215, 0, 0.3),
    inset 0 0 40px rgba(0, 191, 255, 0.1);
}

/* Logo con animación */
.logo-container {
  margin-bottom: 60px;
}

.logo-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
  animation: float 3s ease-in-out infinite;
}

.logo-money {
  font-size: 3.5rem;
  animation: spin 4s linear infinite;
}

.logo-text {
  font-size: 3rem;
  color: white;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 
    0 0 10px rgba(255, 215, 0, 0.7),
    0 0 20px rgba(255, 215, 0, 0.5),
    0 0 30px rgba(255, 215, 0, 0.3);
  margin: 0;
}

.logo-text .highlight {
  color: gold;
  background: linear-gradient(45deg, gold, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-subtitle {
  color: #87ceeb;
  font-size: 1.5rem;
  letter-spacing: 2px;
  margin-top: 10px;
  text-shadow: 0 0 10px rgba(135, 206, 235, 0.7);
}

/* Botón mejorado */
.button-container {
  position: relative;
  display: inline-block;
}

.start-btn {
  position: relative;
  padding: 22px 50px;
  font-size: 1.8rem;
  background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700);
  border: none;
  border-radius: 15px;
  cursor: pointer;
  color: #0c0c2e;
  font-weight: bold;
  letter-spacing: 2px;
  text-transform: uppercase;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 
    0 10px 30px rgba(255, 215, 0, 0.4),
    0 0 0 5px rgba(255, 215, 0, 0.2);
  z-index: 2;
}

.start-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 
    0 15px 40px rgba(255, 215, 0, 0.6),
    0 0 0 5px rgba(255, 215, 0, 0.3);
  background: linear-gradient(45deg, #ffed4e, #fff, #ffed4e);
}

.start-btn:active {
  transform: translateY(0) scale(0.98);
}

.btn-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle at center, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
  border-radius: 20px;
  animation: glow 2s infinite alternate;
  z-index: -1;
}

/* Efecto de brillo dorado */
.gold-shine {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  z-index: 1;
  pointer-events: none;
}

/* Decoraciones */
.decoration {
  position: absolute;
  font-size: 4rem;
  opacity: 0.4;
  animation: bounce 3s infinite alternate;
}

.decoration.left {
  top: 50px;
  left: 50px;
}

.decoration.right {
  bottom: 50px;
  right: 50px;
  animation-delay: 1.5s;
}

/* Partículas */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particles::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 90% 40%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: twinkle 5s infinite alternate;
}

/* Animaciones */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes glow {
  0% { opacity: 0.5; transform: scale(0.9); }
  100% { opacity: 0.8; transform: scale(1.1); }
}

@keyframes pulse {
  0% { opacity: 0.3; }
  100% { opacity: 0.7; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes twinkle {
  0% { opacity: 0.3; }
  100% { opacity: 0.7; }
}

/* Responsive */
@media (max-width: 768px) {
  .game-container {
    padding: 20px;
    margin: 20px;
  }
  
  .logo-animation {
    flex-direction: column;
    gap: 10px;
  }
  
  .logo-text {
    font-size: 2rem;
  }
  
  .logo-money {
    font-size: 2.5rem;
  }
  
  .start-btn {
    padding: 18px 35px;
    font-size: 1.5rem;
  }
  
  .decoration {
    font-size: 2.5rem;
  }
}
</style>