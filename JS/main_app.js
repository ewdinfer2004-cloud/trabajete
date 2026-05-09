const { createApp, ref, computed } = Vue;

const estadisticas = {

}



createApp({

    components:{
        "administracion" : administracion,
        "opciones_admin" : opciones_admin,
        "alta_parking" : alta_parking,
        "mapas": visualizarMapa,
        "ajustes" : ajustes
    },

    setup() {
        // 1. Estado: Le decimos a Vue que la app empieza en 'inicio'
        const vistaActual = ref('inicio');

        // 2. Función para cambiar la vista cuando se hace clic en el menú
        const cambiarVista = (nuevaVista) => {
            vistaActual.value = nuevaVista;
        };

        // 3. Título dinámico: Vue calcula automáticamente qué título mostrar
        const tituloActual = computed(() => {
            if (vistaActual.value === 'inicio') return 'Visualizar mapa';
            if (vistaActual.value === 'Administración') return 'Acceso administración';
            if (vistaActual.value === 'ajustes') return 'Configuración';
            if (vistaActual.value === 'sesion iniciada') return 'Menú Administración';
            if (vistaActual.value === 'alta parking') return 'Alta parking';
            if (vistaActual.value === 'estadisticas') return 'Estadísticas';

            return 'Mi App';
        });

        return {
            vistaActual,
            cambiarVista,
            tituloActual
        };
    }
}).mount('#app');