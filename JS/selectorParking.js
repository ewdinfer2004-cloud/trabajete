let suscripcionActiva = null;

const visualizarMapa = {
    data() {
        return {
            listaParking: [],
            parkingSeleccionado: null,
            parking: [],
            menuAbierto: false,
            idPlaza: "",
            matricula: "",
            tipoCoche: "",
            selectOcupar: false,
            selectLiberar: false,
            idParking: "",
            stompClient: null
        }
    },

    template: `
    <h3>Seleccione un parking: </h3>
    <div class="dropdown">
    <button type="button" @click="menuAbierto = !menuAbierto" class="dropdown-toggle">Seleccionar</button>
    <div class="desplegable">
        <ul v-if="menuAbierto" style="list-style-type:none" class="dropdown-menu d-block">
            <li v-for="parking in listaParking" :key="parking.id">
            <button class="dropdown-item" @click="menuAbierto = false; dibujarParking(parking.id)">
                <strong> {{parking.direccion}} </strong>
            </button>
            </li> 
        </ul>
    </div>
    </div>

    <div v-if='parking.direccion'>
    <p><strong>Horario: {{parking.horario}} </strong></p>
    <p><strong>Dirección: {{parking.direccion}} </strong></p>
        <div class="parking" >
            <div v-for="(fila, iFilaPlazas) in parking.plazas" :key="'fila-'+ iFilaPlazas">
                <div v-for="(plaza, iPlaza) in fila" :key="plaza ? 'plaza-' + plaza.idPlaza : 'nula-' + iFilaPlazas + '-' + iPlaza">
                
                    <div v-if="plaza">
                        <div v-if="plaza.libre === false">
                            <button v-on:click="idPlaza = plaza.idPlaza; selectLiberar = true; selectOcupar = false" class="plaza ocupada"></button>
                        </div>

                        <div v-else-if="plaza.libre === true">
                            <button v-on:click="idPlaza = plaza.idPlaza; selectOcupar = true; selectLiberar = false" class="plaza libre"></button>
                        </div>
                    </div>
                    <div v-else-if="plaza === null">
                            <div class="plaza"></div>
                    </div>
                </div>
            </div>
            
        </div>

    </div>
    `,

    methods: {

        conectarWebSocket() {
            const self = this;

            var socket = new SockJS('http://localhost:8081/ws');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/parking/' + self.idParking, (respuesta) => {
                    console.log("holaaa")
                    const parkingActualizado = JSON.parse(respuesta.body);
                    console.log("¡Datos recibidos por WebSocket!", parkingActualizado);
                    self.parking = parkingActualizado;
                });
            });

        },

        async leerParkings() {
            let continuar = true;
            try {
                const datosDeBack = await fetch("http://localhost:8081/parking");

                if (datosDeBack.ok) {
                    const respuesta = await datosDeBack.json();
                    this.listaParking = respuesta;
                }
                else {
                    continuar = false;
                    console.log("Ya no hay mas parking en la base de datos", indice);
                }
            }
            catch (error) {
                console.error("Error de la conexion", error);
            }
        },

        async dibujarParking(idParking) {

            try {
                const obtenerParking = await fetch("http://localhost:8081/parking/" + idParking);
                if (obtenerParking.ok) {
                    const parkingJson = await obtenerParking.json();
                    this.parking = parkingJson;
                    this.idParking = idParking;

                    this.conectarWebSocket();
                }
                else {
                    alert("Error mostrando parking.")
                }
            }
            catch (error) {
                console.error("Error de conexión: ", error);
                alert("Error de conexión en el servidor")
            }
        },

    },

    mounted() {
        this.leerParkings();
    }

}