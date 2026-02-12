<template>
  <div class="average">
    <div
      v-for="(n, i) in niveles"
      :key="i"
      class="nivel"
      :class="{
        activo: i === nivelActual,
        seguro: n.seguro,
        pasado: i < nivelActual
      }"
    >
      <div class="nivel-info">
        <span class="nivel-numero">
          Nivel {{ n.nivel }}
        </span>

        <span class="nivel-premio">
          ${{ n.premio }}
        </span>
      </div>

      <span v-if="n.seguro" class="seguro-icon">
        🔒 Seguro
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  niveles: {
    type: Array,
    required: true
  },
  nivelActual: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.average {
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  padding: 10px;
}

.nivel {
  padding: 12px 15px;
  background: #1c1c2e;
  color: #ccc;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.nivel-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nivel-numero {
  font-weight: 600;
}

.nivel-premio {
  font-weight: bold;
  color: gold;
}

.nivel.activo {
  background: linear-gradient(45deg, gold, #ffed4e);
  color: black;
  font-weight: bold;
  transform: scale(1.05);
  box-shadow: 0 0 10px gold;
}

.nivel.pasado {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.nivel.seguro {
  border: 2px solid #00c3ff;
}

.seguro-icon {
  display: block;
  font-size: 0.8rem;
  margin-top: 5px;
  color: #00c3ff;
}
</style>
