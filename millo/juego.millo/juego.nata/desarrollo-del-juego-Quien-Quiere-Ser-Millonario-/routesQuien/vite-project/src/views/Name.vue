
<template>
  <div class="player-name-container">
    <h2>Ingresa tu nombre para jugar</h2>
    <input v-model="nombreJugador" placeholder="Tu nombre..." />
    <button @click="empezarConNombre" :disabled="!nombreJugador">
      Empezar
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombreJugador = ref('')

function empezarConNombre() {
  localStorage.setItem('jugador', nombreJugador.value)
  router.push({ name: 'levels' })  // aquí comienza el juego
}
</script>

<style scoped>
.player-name-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 100%);
  color: white;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
  gap: 20px;
}

input {
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  font-size: 1.2rem;
  min-width: 250px;
}

button {
  padding: 12px 25px;
  font-size: 1.2rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background: gold;
  color: #0a0a2a;
  transition: 0.2s;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  transform: scale(1.05);
}
</style>
