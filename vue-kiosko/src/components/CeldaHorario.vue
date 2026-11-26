<script setup>
defineProps({ celda: { type: Object, required: true } });
// El hijo avisa al padre qué celda se seleccionó sin modificar sus datos.
const emit = defineEmits(['seleccionar']);
</script>

<template>
  <button
    class="celda"
    :class="celda.estado"
    @click="emit('seleccionar', celda)"
    :aria-label="`${celda.laboratorio.nombre}, ${celda.horaInicio} a ${celda.horaFin}, ${celda.estado}`"
  >
    {{ celda.estado }}
    <small v-if="celda.laboratorio.estado === 'mantenimiento'">En mant.</small>
  </button>
</template>
