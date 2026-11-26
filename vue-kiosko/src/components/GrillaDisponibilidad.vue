<script setup>
import CeldaHorario from './CeldaHorario.vue';
defineProps({ grilla: { type: Array, required: true }, horas: { type: Array, required: true } });
const emit = defineEmits(['seleccionar']);
</script>

<template>
  <div class="tabla-scroll" tabindex="0" aria-label="Disponibilidad por laboratorio y hora">
    <table>
      <caption>Bloques de una hora. Selecciona una celda para consultar sus detalles.</caption>
      <thead><tr><th scope="col">Laboratorio</th><th v-for="hora in horas" :key="hora" scope="col">{{ hora }}</th></tr></thead>
      <tbody>
        <tr v-for="fila in grilla" :key="fila[0].laboratorio.id">
          <th scope="row">{{ fila[0].laboratorio.nombre }}<small>{{ fila[0].laboratorio.sede }}</small></th>
          <td v-for="celda in fila" :key="celda.horaInicio">
            <CeldaHorario :celda="celda" @seleccionar="emit('seleccionar', $event)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
