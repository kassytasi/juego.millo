<template>
  <div class="money-ladder">
    <!-- Título -->
    <div class="ladder-title">
      <div class="money-icon">💰</div>
      <div class="title-text">ESCALERA DEL MILLÓN</div>
      <div class="current-level">NIVEL {{ nivelActual + 1 }}</div>
    </div>
    
    <!-- Niveles en escalera -->
    <div class="ladder-container">
      <div 
        v-for="(nivel, index) in niveles.slice().reverse()" 
        :key="index"
        :class="[
          'ladder-step',
          `step-${niveles.length - index}`,
          { 
            'active': (niveles.length - index - 1) === nivelActual,
            'passed': (niveles.length - index - 1) < nivelActual,
            'safe': nivel.seguro
          }
        ]"
      >
        <!-- Línea conectora -->
        <div class="step-connector" v-if="index > 0"></div>
        
        <!-- Contenido del nivel -->
        <div class="step-content">
          <div class="step-number">P{{ nivel.nivel }}</div>
          <div class="step-prize">${{ nivel.premio }}</div>
          <div class="step-safe" v-if="nivel.seguro">
            <div class="safe-icon">🔒</div>
            <div class="safe-text">SEGURO</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Indicador actual -->
    <div class="current-indicator" v-if="niveles[nivelActual]">
      <div class="indicator-text">ACTUAL: ${{ niveles[nivelActual].premio }}</div>
      <div class="indicator-bar"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  niveles: Array,
  nivelActual: Number
})
</script>

<style scoped>
.money-ladder {
  width: 320px;
  background: linear-gradient(135deg, rgba(0, 0, 30, 0.9) 0%, rgba(10, 10, 60, 0.9) 100%);
  border-radius: 20px;
  padding: 25px;
  border: 3px solid rgba(255, 215, 0, 0.4);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.6),
    inset 0 0 30px rgba(255, 215, 0, 0.1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

/* Título */
.ladder-title {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
}

.money-icon {
  font-size: 3rem;
  margin-bottom: 10px;
  animation: moneyFloat 3s ease-in-out infinite;
}

.title-text {
  color: gold;
  font-size: 1.6rem;
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  margin-bottom: 8px;
}

.current-level {
  color: #87ceeb;
  font-size: 1.1rem;
  letter-spacing: 1px;
}

/* Contenedor de escalera */
.ladder-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

/* Pasos de la escalera */
.ladder-step {
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 18px 25px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  margin-left: 40px;
}

/* Línea conectora */
.step-connector {
  position: absolute;
  top: -8px;
  left: -35px;
  width: 30px;
  height: 100%;
  border-left: 2px dashed rgba(255, 215, 0, 0.4);
  border-bottom: 2px dashed rgba(255, 215, 0, 0.4);
  z-index: 0;
}

/* Contenido del paso */
.step-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.step-number {
  font-size: 1.3rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.7);
  min-width: 50px;
}

.step-prize {
  font-size: 1.5rem;
  font-weight: bold;
  color: gold;
  flex: 1;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.step-safe {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.safe-icon {
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.safe-text {
  font-size: 0.7rem;
  color: #2ecc71;
  font-weight: bold;
  letter-spacing: 0.5px;
}

/* Estados del paso */
.ladder-step:hover {
  transform: translateX(5px);
  background: rgba(255, 255, 255, 0.12);
}

.ladder-step.passed {
  background: linear-gradient(90deg, rgba(46, 204, 113, 0.2), rgba(46, 204, 113, 0.1));
  border-color: rgba(46, 204, 113, 0.3);
}

.ladder-step.passed .step-prize {
  color: #2ecc71;
}

.ladder-step.active {
  background: linear-gradient(90deg, gold, #ffed4e);
  transform: scale(1.05) translateX(10px);
  box-shadow: 
    0 0 30px rgba(255, 215, 0, 0.6),
    inset 0 0 20px rgba(255, 255, 255, 0.3);
  border-color: gold;
  animation: activePulse 2s infinite alternate;
}

.ladder-step.active .step-number {
  color: #0c0c2e;
}

.ladder-step.active .step-prize {
  color: #0c0c2e;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.ladder-step.safe {
  border-left: 5px solid #2ecc71;
}

/* Indicador actual */
.current-indicator {
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.indicator-text {
  color: #87ceeb;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.indicator-bar {
  height: 4px;
  background: linear-gradient(90deg, gold, #ff8e53);
  border-radius: 2px;
  animation: indicatorPulse 1.5s infinite alternate;
}

/* Animaciones */
@keyframes moneyFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes activePulse {
  0% { 
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
  }
  100% { 
    box-shadow: 0 0 50px rgba(255, 215, 0, 0.8), 0 0 70px rgba(255, 215, 0, 0.4);
  }
}

@keyframes indicatorPulse {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}

/* Efecto de brillo en borde */
.money-ladder::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, gold, #ffed4e, gold);
  border-radius: 22px;
  z-index: -1;
  opacity: 0.3;
  animation: borderGlow 3s linear infinite;
}

@keyframes borderGlow {
  0% { opacity: 0.2; }
  50% { opacity: 0.5; }
  100% { opacity: 0.2; }
}

/* Responsive */
@media (max-width: 768px) {
  .money-ladder {
    width: 100%;
    margin: 0 auto;
    max-width: 400px;
  }
  
  .ladder-step {
    padding: 15px 20px;
    margin-left: 30px;
  }
  
  .step-connector {
    left: -25px;
    width: 20px;
  }
  
  .step-prize {
    font-size: 1.3rem;
  }
}
</style>