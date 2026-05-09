const ajustes = {
    data() {
        return {
            fuenteActual: "mediana"
        }
    },

    // 1. Todo envuelto en un div
    // 2. Comillas simples en 'pequena', 'mediana', 'grande'
    template: `
        <div class="contenedor-ajustes">
            <h3>Tamaño de fuente</h3>
            
            <button type="button" class="btn btn-outline-secondary espaciado pequeña" v-on:click="ajustarTamano('pequena')"> aA </button>
            <button type="button" class="btn btn-outline-secondary espaciado mediana" v-on:click="ajustarTamano('mediana')"> aA </button>
            <button type="button" class="btn btn-outline-secondary espaciado grande" v-on:click="ajustarTamano('grande')"> aA </button>

            <h3> Tema de la app</h3>
            <button class="btn btn-outline-secondary espaciado" > Claro </button>
            <button class="btn btn-outline-secondary espaciado  " > Oscuro </button>
        </div>

    `,

    methods: {
        ajustarTamano(tamanoSeleccionado) {
            let pixeles;

            if (tamanoSeleccionado === "pequena") {
                pixeles = 10;
            } 
            else if (tamanoSeleccionado === "mediana") {
                pixeles = 15;
            } 
            else if (tamanoSeleccionado === "grande") {
                pixeles = 20;
            }

            document.documentElement.style.setProperty('--tamano-base', pixeles + 'px');
            
            this.fuenteActual = tamanoSeleccionado;
        }
    }
};