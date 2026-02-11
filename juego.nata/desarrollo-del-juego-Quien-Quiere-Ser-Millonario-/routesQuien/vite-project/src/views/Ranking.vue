<template>
  <div class="ranking-container">
    <div class="header">
      <div class="trophy-icon">🏆</div>
      <h1>RANKING <span>TOP 10</span></h1>
      <p>LOS MEJORES DE LA SEMANA</p>
    </div>

    <table>
      <thead>
        <tr>
          <th># POSICIÓN</th>
          <th>JUGADOR</th>
          <th>PUNTAJE</th>
          <th>FECHA</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(jugador, index) in jugadores" :key="jugador.nombre + index">
          <td>
            {{ index + 1 }}
            <span v-if="index === 0" class="crown">👑</span>
          </td>
          <td>{{ jugador.nombre }}</td>
          <td>{{ jugador.puntaje }}</td>
          <td>{{ jugador.fecha }}</td>
        </tr>
      </tbody>
    </table>

    <button class="btn-volver" @click="volverInicio">
      ← VOLVER AL INICIO
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const jugadores = ref([])

onMounted(() => {
  // 1️⃣ Obtener datos recientes desde sessionStorage
  const nombreReciente = sessionStorage.getItem('nombreJugador')
  const puntajeReciente = sessionStorage.getItem('puntajeJugador')

  // 2️⃣ Cargar ranking existente desde localStorage
  const ranking = JSON.parse(localStorage.getItem('ranking') || '[]')

  // 3️⃣ Agregar jugador reciente si existe
  if (nombreReciente && puntajeReciente) {
    ranking.push({
      nombre: nombreReciente,
      puntaje: puntajeReciente,
      fecha: new Date().toLocaleDateString()
    })

    // Guardar de nuevo en localStorage
    localStorage.setItem('ranking', JSON.stringify(ranking))

    // Limpiar sessionStorage para no repetir
    sessionStorage.removeItem('nombreJugador')
    sessionStorage.removeItem('puntajeJugador')
  }

  // 4️⃣ Ordenar ranking por puntaje numérico descendente y Top 10
  jugadores.value = ranking
    .sort((a, b) => {
      const aNum = parseInt(a.puntaje.replace(/\D/g, ''))
      const bNum = parseInt(b.puntaje.replace(/\D/g, ''))
      return bNum - aNum
    })
    .slice(0, 10)
})

function volverInicio() {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.ranking-container {
  max-width: 800px;
  margin: 50px auto;
  background: #2a2200;
  border-radius: 15px;
  padding: 30px;
  color: #fff7cc;
  font-family: 'Arial Black', Arial, sans-serif;
  box-shadow: 0 0 30px #c2a600cc;
  text-align: center;
}

.header {
  margin-bottom: 25px;
}

.trophy-icon {
  font-size: 2.5rem;
  color: gold;
  margin-bottom: 10px;
}

h1 {
  font-size: 2rem;
  letter-spacing: 2px;
  margin: 0;
}

h1 span {
  color: gold;
}

p {
  font-size: 0.9rem;
  color: #d4af37;
  margin-top: 5px;
  letter-spacing: 1.5px;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-bottom: 30px;
}

thead th {
  background: gold;
  color: #0c0c2e;
  padding: 12px 15px;
  font-weight: bold;
  letter-spacing: 1.2px;
  border-radius: 12px 12px 0 0;
}

tbody tr {
  background: #443d00;
  transition: background 0.3s ease;
  border-radius: 12px;
}

tbody tr:hover {
  background: #6a5c00;
}

tbody td {
  padding: 12px 15px;
  text-align: center;
  font-weight: bold;
  border: none;
}

.crown {
  margin-left: 8px;
  font-size: 1.3rem;
}

.btn-volver {
  background: rgba(255, 217, 0, 0.89);
  color: #0c0c2e;
  padding: 15px 40px;
  font-size: 1.2rem;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-weight: bold;
  letter-spacing: 1.5px;
  transition: transform 0.2s ease;
}

.btn-volver:hover {
  transform: scale(1.05);
}
</style>
