<template>
  <div class="neon-levels">
    <!-- BACKGROUND NEON -->
    <div class="neon-background">
      <div class="neon-grid"></div>
      <div class="neon-blur cyan"></div>
      <div class="neon-blur pink"></div>
      <div class="neon-blur gold"></div>
    </div>

    <!-- TÍTULO NEON -->
    <div class="neon-header">
      <div class="glitch-text" data-text="E L I G E">E L I G E</div>
      <div class="glitch-text gold" data-text="T U N I V E L">T U N I V E L</div>
    </div>

    <!-- TARJETAS NEON -->
    <div class="neon-cards">
      <div class="neon-card easy" @click="elegirNivel('facil')">
        <div class="card-glow"></div>
        <div class="card-icon">🎮</div>
        <h2>FÁCIL</h2>
        <div class="card-prize">$1K</div>
        <div class="card-lines"></div>
      </div>

      <div class="neon-card medium" @click="elegirNivel('medio')">
        <div class="card-glow"></div>
        <div class="card-icon">⚡</div>
        <h2>MEDIO</h2>
        <div class="card-prize">$10K</div>
        <div class="card-lines"></div>
      </div>

      <div class="neon-card hard" @click="elegirNivel('dificil')">
        <div class="card-glow"></div>
        <div class="card-icon">💀</div>
        <h2>DIFÍCIL</h2>
        <div class="card-prize">$100K</div>
        <div class="card-lines"></div>
      </div>
    </div>

    <!-- EFECTO SCANLINE -->
    <div class="scanline"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function elegirNivel(dificultad) {
  sessionStorage.setItem('dificultad', dificultad)
  router.push({ name: 'cabina' })
}
</script>

<style scoped>
.neon-levels {
  min-height: 100vh;
  background: #050510;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Montserrat', 'Arial Black', sans-serif;
}

/* BACKGROUND NEON */
.neon-background {
  position: absolute;
  inset: 0;
}

.neon-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(cyan 1px, transparent 1px),
    linear-gradient(90deg, cyan 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.1;
  animation: gridMove 20s linear infinite;
}

.neon-blur {
  position: absolute;
  width: 80vh;
  height: 80vh;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.15;
  animation: floatBlur 20s infinite alternate;
}

.neon-blur.cyan {
  background: cyan;
  top: -20vh;
  left: -20vh;
}

.neon-blur.pink {
  background: #ff00ff;
  bottom: -20vh;
  right: -20vh;
}

.neon-blur.gold {
  background: gold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60vh;
  height: 60vh;
  opacity: 0.1;
}

/* TÍTULO GLITCH */
.neon-header {
  text-align: center;
  z-index: 10;
  margin-bottom: 60px;
}

.glitch-text {
  font-size: 5rem;
  font-weight: 900;
  color: white;
  text-shadow: 
    0 0 10px cyan,
    0 0 20px cyan,
    0 0 40px cyan;
  letter-spacing: 15px;
  position: relative;
  animation: glitch 3s infinite;
}

.glitch-text.gold {
  font-size: 4rem;
  text-shadow: 
    0 0 10px gold,
    0 0 20px gold,
    0 0 40px gold;
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
  text-shadow: 2px 0 #ff00ff;
  animation: glitchLeft 0.3s infinite linear alternate-reverse;
}

.glitch-text::after {
  text-shadow: -2px 0 cyan;
  animation: glitchRight 0.3s infinite linear alternate-reverse;
}

/* TARJETAS NEON */
.neon-cards {
  display: flex;
  gap: 50px;
  z-index: 10;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
}

.neon-card {
  width: 280px;
  height: 380px;
  background: #0a0a20;
  border-radius: 30px;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  border: 1px solid rgba(255,255,255,0.1);
}

/* BORDES NEON */
.easy {
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
  border-bottom: 4px solid cyan;
}

.medium {
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
  border-bottom: 4px solid gold;
}

.hard {
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.3);
  border-bottom: 4px solid #ff00ff;
}

.card-glow {
  position: absolute;
  inset: 0;
  border-radius: 30px;
  opacity: 0;
  transition: 0.3s;
}

.easy .card-glow {
  box-shadow: 0 0 80px cyan;
}

.medium .card-glow {
  box-shadow: 0 0 80px gold;
}

.hard .card-glow {
  box-shadow: 0 0 80px #ff00ff;
}

.neon-card:hover {
  transform: translateY(-20px) scale(1.05);
}

.neon-card:hover .card-glow {
  opacity: 0.5;
}

.card-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  animation: iconFloat 3s ease-in-out infinite;
}

.neon-card h2 {
  font-size: 2.8rem;
  color: white;
  margin-bottom: 20px;
  letter-spacing: 6px;
}

.easy h2 {
  text-shadow: 0 0 15px cyan;
}

.medium h2 {
  text-shadow: 0 0 15px gold;
}

.hard h2 {
  text-shadow: 0 0 15px #ff00ff;
}

.card-prize {
  font-size: 2rem;
  font-weight: 900;
  padding: 10px 30px;
  background: rgba(0,0,0,0.5);
  border-radius: 50px;
  backdrop-filter: blur(5px);
}

.easy .card-prize {
  color: cyan;
  border: 2px solid cyan;
  box-shadow: 0 0 20px cyan;
}

.medium .card-prize {
  color: gold;
  border: 2px solid gold;
  box-shadow: 0 0 20px gold;
}

.hard .card-prize {
  color: #ff00ff;
  border: 2px solid #ff00ff;
  box-shadow: 0 0 20px #ff00ff;
}

.card-lines {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  pointer-events: none;
}

/* EFECTO SCANLINE */
.scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    transparent 50%,
    rgba(0, 255, 255, 0.02) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 100;
  animation: scanline 8s linear infinite;
}

/* ANIMACIONES */
@keyframes gridMove {
  0% { transform: translateY(0); }
  100% { transform: translateY(40px); }
}

@keyframes floatBlur {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes glitch {
  0%, 100% { opacity: 1; }
  7% { opacity: 0.8; }
  10% { opacity: 1; }
  20% { opacity: 0.9; }
  23% { opacity: 1; }
}

@keyframes glitchLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-3px); }
}

@keyframes glitchRight {
  0% { transform: translateX(0); }
  100% { transform: translateX(3px); }
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

/* RESPONSIVE */
@media (max-width: 1000px) {
  .glitch-text { font-size: 3.5rem; letter-spacing: 10px; }
  .glitch-text.gold { font-size: 3rem; }
  .neon-cards { gap: 30px; }
  .neon-card { width: 240px; height: 340px; }
}

@media (max-width: 700px) {
  .glitch-text { font-size: 2.5rem; letter-spacing: 8px; }
  .glitch-text.gold { font-size: 2.2rem; }
  .neon-card { width: 300px; height: 280px; }
  .neon-card h2 { font-size: 2.2rem; }
}
</style>