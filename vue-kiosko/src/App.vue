<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { crearGrilla, crearHoras, fechaPeru } from '../../core-js/disponibilidad.js';
import { sedesUnicas } from '../../core-js/estadisticas.js';
import GrillaDisponibilidad from './components/GrillaDisponibilidad.vue';

const laboratorios = ref([]);
const reservas = ref([]);
const sede = ref('');
const fecha = ref(fechaPeru());
const cargando = ref(true);
const error = ref('');
const actualizado = ref('');
const seleccion = ref(null);
const horas = crearHoras();
const sedes = computed(() => sedesUnicas(laboratorios.value));
const visibles = computed(() =>
  laboratorios.value.filter((lab) => !sede.value || lab.sede === sede.value),
);
const grilla = computed(() => crearGrilla(visibles.value, reservas.value, fecha.value));
let intervalo;
let controlador;
const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function consultar(ruta, signal) {
  const respuesta = await fetch(`${base}${ruta}`, { signal, cache: 'no-store' });
  if (!respuesta.ok)
    throw new Error(`No se pudo cargar la disponibilidad (HTTP ${respuesta.status}).`);
  return respuesta.json();
}

async function cargar() {
  controlador?.abort();
  const actual = new AbortController();
  controlador = actual;
  cargando.value = true;
  error.value = '';
  fecha.value = fechaPeru(); // Actualiza el día si el kiosko sigue abierto después de medianoche.
  try {
    const [labs, solicitudes] = await Promise.all([
      consultar('/laboratorios', actual.signal),
      consultar(`/reservas?fecha=${fecha.value}`, actual.signal),
    ]);
    laboratorios.value = labs;
    reservas.value = solicitudes;
    seleccion.value = null;
    actualizado.value = new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });
  } catch (fallo) {
    if (!actual.signal.aborted)
      error.value = 'No se pudo actualizar. Comprueba que la API esté activa e intenta nuevamente.';
  } finally {
    if (!actual.signal.aborted) cargando.value = false;
  }
}

onMounted(() => {
  cargar();
  intervalo = setInterval(cargar, 30000);
});
onUnmounted(() => {
  clearInterval(intervalo);
  controlador?.abort();
});
</script>

<template>
  <header class="barra">
    <a href="/" class="marca">CampusHub <span>KIOSKO</span></a
    ><span>Disponibilidad del campus</span>
  </header>
  <main>
    <p class="etiqueta">TU ESPACIO, A TIEMPO</p>
    <h1>Un vistazo a tu día.</h1>
    <p class="intro">Laboratorios y horarios de hoy, {{ fecha }} · Hora de Perú · 07:00–22:00.</p>
    <section class="filtros">
      <div class="filtro-sede">
        <label for="sede">Sede</label>
        <select id="sede" v-model="sede" @change="seleccion = null">
          <option value="">Todas las sedes</option>
          <option v-for="opcion in sedes" :key="opcion">{{ opcion }}</option>
        </select>
      </div>
      <button @click="cargar" :disabled="cargando">
        {{ cargando ? 'Actualizando...' : 'Actualizar ahora' }}
      </button>
      <p>
        Consulta automática cada 30 s.<br /><small v-if="actualizado"
          >Última actualización: {{ actualizado }}</small
        >
      </p>
    </section>
    <div class="leyenda">
      <span class="libre">Libre</span><span class="pendiente">Pendiente</span
      ><span class="ocupada">Ocupada</span>
    </div>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="cargando" role="status">Cargando disponibilidad...</p>
    <p v-else-if="!error && !visibles.length" class="panel">No hay laboratorios para esta sede.</p>
    <GrillaDisponibilidad
      v-else-if="!error"
      :grilla="grilla"
      :horas="horas"
      @seleccionar="seleccion = $event"
    />
    <section v-if="seleccion && !error" class="panel detalle" aria-live="polite">
      <button class="cerrar" @click="seleccion = null" aria-label="Cerrar detalle">×</button>
      <p class="etiqueta">DETALLE DEL HORARIO</p>
      <h2>
        {{ seleccion.laboratorio.nombre }} · {{ seleccion.horaInicio }}–{{ seleccion.horaFin }}
      </h2>
      <p>
        Estado: <strong>{{ seleccion.estado }}</strong
        >.
      </p>
      <p v-if="seleccion.laboratorio.estado === 'mantenimiento'">
        Este laboratorio está en mantenimiento.
      </p>
      <ul v-else-if="seleccion.reservas.length">
        <li v-for="reserva in seleccion.reservas" :key="reserva.id">
          {{ reserva.codigo }} · {{ reserva.horaInicio }}–{{ reserva.horaFin }} ·
          {{ reserva.estado }}
        </li>
      </ul>
      <p v-else>Este bloque está libre. Puedes solicitarlo en el portal del estudiante.</p>
    </section>
  </main>
  <footer>CampusHub Labs · Espacios para aprender y crear.</footer>
</template>
