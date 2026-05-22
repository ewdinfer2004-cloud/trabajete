const estadisticas = {
    data() {
        return {
            listaParking: [],
            parking: [],
            menuAbierto: false,
            chartBarras: null,
            chartTarta: null
        }
    },
    template: `
    
    <h3>Seleccione un parking: </h3>
    <div class="dropdown">
        <button type="button" @click="menuAbierto = !menuAbierto" class="dropdown-toggle">Seleccionar</button>
        <div class="desplegable">
            <ul v-if="menuAbierto" style="list-style-type:none" class="dropdown-menu d-block">
                <li v-for="parking in listaParking" :key="parking.id">
                <button class="dropdown-item" @click="menuAbierto = false; obtenerEstadisticas(parking.id)">
                    <strong> {{parking.direccion}} </strong>
                </button>
                </li> 
            </ul>
        </div>
    </div>

    <div class="graficos">
        <h2 v-if="chartBarras">Semanal</h2>
        <canvas id="graficoBarras"></canvas>

        <h2 v-if="chartTarta">Tipo de vehículo</h2>
        <canvas id="graficoTarta"></canvas>
    </div>
    `,

    methods: {
        async obtenerEstadisticas(idParking) {
            this.obtenerSemanal(idParking);
            this.obtenerVehiculos(idParking);
        },

        async obtenerSemanal(idParking) {
            const usuario = localStorage.getItem('usuario');
            const contrasena = localStorage.getItem('contraseña');
            try {
                const datosDeBack = await fetch(`http://localhost:8081/registro/semanal/${idParking}?email=${usuario}&clave=${contrasena}`);

                if (datosDeBack.ok) {
                    const respuesta = await datosDeBack.json();
                    this.generarGraficoSemanal(respuesta[0]);
                }
                else {
                    console.log("Error al obtener");
                }
            }
            catch (error) {
                console.error("Error de la conexion", error);
            }
        },

        async obtenerVehiculos(idParking) {
            const usuario = localStorage.getItem('usuario');
            const contrasena = localStorage.getItem('contraseña');
            try {
                const datosDeBack = await fetch(`http://localhost:8081/registro/vehiculos/${idParking}?email=${usuario}&clave=${contrasena}`);

                if (datosDeBack.ok) {
                    const respuesta = await datosDeBack.json();
                    this.generarGraficoVehiculos(respuesta[0]);
                }
                else {
                    console.log("Error al obtener");
                }
            }
            catch (error) {
                console.error("Error de la conexion", error);
            }
        },

        async leerParkings() {
            try {
                const datosDeBack = await fetch("http://localhost:8081/parking");

                if (datosDeBack.ok) {
                    const respuesta = await datosDeBack.json();
                    this.listaParking = respuesta;
                }
                else {
                    console.log("Ya no hay mas parking en la base de datos", indice);
                }
            }
            catch (error) {
                console.error("Error de la conexion", error);
            }
        },

        generarGraficoSemanal(datos) {
            if (this.chartBarras != null) {
                this.chartBarras.destroy();
            }
            const ctxBarras = document.getElementById('graficoBarras');

            this.chartBarras = new Chart(ctxBarras, {
                type: 'bar',
                data: {
                    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                    datasets: [{
                        label: 'Número de vehículos',
                        data: [datos.lunes, datos.martes, datos.miercoles, datos.jueves, datos.viernes, datos.sabado, datos.domingo],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    size: 20
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    size: 20
                                }
                            }
                        }
                    }
                }
            });
        },

        generarGraficoVehiculos(datos) {
            if (this.chartTarta != null) {
                this.chartTarta.destroy();
            }
            const ctxTarta = document.getElementById('graficoTarta');

            this.chartTarta = new Chart(ctxTarta, {
                type: 'pie',
                data: {
                    labels: ['Furgonetas', 'Motocicletas', 'Turismos'],
                    datasets: [{
                        data: [datos.furgoneta, datos.motocicleta, datos.turismo]
                    }]
                },
                options: {
                    responsive: true
                }
            });
        }
    },

    mounted() {
        this.leerParkings();
    }
};