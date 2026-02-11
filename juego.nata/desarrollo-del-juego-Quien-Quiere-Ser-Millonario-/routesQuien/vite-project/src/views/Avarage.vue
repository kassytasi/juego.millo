<template>
  <div class="average">
    <div
      v-for="(n, i) in niveles"
      :key="i"
      class="nivel"
      :class="{ activo: i === nivelActual, seguro: n.seguro }"
    >
      Nivel {{ n.nivel }} - ${{ n.premio }} <span v-if="n.seguro">🔒</span>
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
.average {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  margin-left: 20px;
}

.nivel {
  padding: 8px 12px;
  margin: 4px 0;
  background: #222;
  color: white;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nivel.activo {
  background: gold;
  color: black;
  font-weight: bold;
  transform: scale(1.1);
}

.nivel.seguro {
  border: 2px solid #0af;
  color: #0af;
}
</style>
