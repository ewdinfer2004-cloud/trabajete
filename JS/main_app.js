const { createApp, ref, computed } = Vue;


const administracion = {

    data(){
        return{
            Usuario:"",
            Contrasena:""
        }
    }
    ,
    template: 
    `<strong><label for="usuario">Usuario</label></strong>
    <br>
    <input type="text" id="usuario" name="usuario" v-model="Usuario">
    <br>
    <strong><label for="contrasena">Contraseña</label></strong>
    <br>
    <input type="password" id="contrasena" name="contrasena" v-model="Contrasena"></input>
    <br><br>
    <button class="btn btn-primary" @click='IniciarSesion'>Iniciar sesión</Button>
    <br><br>
    `,
    methods: {
        IniciarSesion(){
            const usuarioValido = "Admin1";
            const contrasenaValida = "1234"

            if (this.Usuario == usuarioValido && this.Contrasena == contrasenaValida){
                this.$emit("sesion_iniciada");
            }
            else{
                alert("Usuario o contraseña incorrectos")
            }
        }   
    }
};

const opciones_admin = {
    template: `
        <div class="text-center mt-4">
            <button class="btn btn-success m-2 w-75" @click="$emit('altaparking')">Alta Parking</button>
            <button class="btn btn-success m-2 w-75" @click="$emit('estadisticas')">Estadísticas</button>
        </div>
    `
};

const alta_parking = {

    data(){
        return {
            fichero: null,
            archivoParking: null,
            inputDireccion: "",
            inputHorario: ""
        }
    },

    template: `
    <div>
     <form method="post" action="/send/" enctype="multipart/form-data">
     <input type="file" id="idParking" class="form-control-sm mb-2" name="inputAltaParking" @change="añadirParking"></input>
     </form>
     <p>Previsualizción</p>
     <!-- Investigar mas sobre el la clave de cada indice de la matriz-->
     <div class="parking" v-if="fichero">
        <div v-for="(fila, iFilaPlazas) in fichero" :key="'fila-'+ iFilaPlazas">
            <div v-for="(plaza, iPlaza) in fila" :key="'plaza-'+ iFilaPlazas + '-' +iPlaza">
            
                <div v-if="plaza.plaza === 'libre'" class="plaza libre"></div>

                <div v-if="plaza.plaza === 'vacia'" class="plaza vacia">
                </div>
            </div>
        </div>
     </div>
     
     <p> Dirección: </p>
     <input type="text" v-model="inputDireccion" id="idDireccion" class="mb-1">
     <p>Horario: </p>
     <input type="text" v-model="inputHorario" id="idHorario">
    <button type="button" class="btn btn-primary" @click="guardarParking">Añadir parking</button>     
    </div>
    `
    ,

    methods: {
        async añadirParking(evento){

            const ficheroParking = evento.target.files[0];
            if(!ficheroParking){
                alert("Primero adjunta un archivo, por favor.")
                return;
            }
            this.archivoParking = ficheroParking;

                let parking = [];
                let filaPlazas = [];
                let texto = await ficheroParking.text();
                texto = texto.replace(/\r/g,'');

                    for(let ind = 0; ind < texto.length; ind++){
                        let caracter = texto[ind];

                        if(caracter.toUpperCase() == 'X'){
                            filaPlazas.push({plaza: 'libre'})
                        }
                        else if(caracter == ' '){
                            filaPlazas.push({plaza: 'vacia'})
                        }
                        else if(caracter == '\n'){
                            parking.push(filaPlazas),
                            filaPlazas = [];
                        }
                    }

                    if(filaPlazas.length > 0){
                            parking.push(filaPlazas);
                        }
            
                    this.fichero = parking;
                    console.log("Parking procesado:", this.fichero);
        },

        async guardarParking(){
            if(this.fichero == null){
                alert("Para guardar un nuevo parking, debe subir el archivo .txt correspondiente.");
                return;
            }
            if(this.inputHorario == "" || this.inputDireccion == ""){
                alert("Para guardar un parkingk, debe indicar horario y dirección del parking.");
                return;
            }

            let datosEnviar = new FormData();

            datosEnviar.append("direccion", this.inputDireccion);
            datosEnviar.append("horario", this.inputHorario);
            datosEnviar.append("fichero", this.archivoParking);

            try{
                const enviar = await fetch("http://localhost:8081/parking", {
                    method: 'POST',
                    body: datosEnviar
                });

                if(enviar.ok){
                    alert("Parking añadido correctamente a la base de datos.")
                    this.fichero = null;
                    this.archivoParking = null;
                    this.inputDireccion = "";
                    this.inputHorario = "";
                }
                else{
                    alert("Error inesperado al intentar añadir el parking en la base de datos.")
                }
            }
            catch(error){
                console.error("Error: ", error);
                alert("Error al conectar.")
            }

        }
    }
}

const estadisticas = {

}

const visualizarMapa = {
    data(){
        return{
            listaParking: [],
            parkingSeleccionado: null,
            menuAbierto: false,
            idPlaza: "",
            matricula: "",
            tipoCoche: "",
            selectOcupar: false,
            selectLiberar: false
        }
    },

    template: `

    <div class="">
    <h3>Seleccione un parking: </h3>
    <div class="dropdown">
    <button type="button" @click="menuAbierto = !menuAbierto" class="dropdown-toggle">Seleccionar</button>
        <ul v-if="menuAbierto" style="list-style-type:none" class="dropdown-menu d-block">
            <li v-for="(parking, index) in listaParking" :key="'item-' + index">
            <button class="dropdown-item" @click="parkingSeleccionado = parking; menuAbierto = false"">
                <strong> {{parking.direccion}} </strong>
            </button>
            </li> 
        </ul>
    </div>
    </div>

    <div v-if='parkingSeleccionado'>
    <p><strong>Horario: {{parkingSeleccionado.horario}} </strong></p>
    <p><strong>Horario: {{parkingSeleccionado.direccion}} </strong></p>
        <div class="parking" >
            <div v-for="(fila, iFilaPlazas) in parkingSeleccionado.plazas" :key="'fila-'+ iFilaPlazas">
                <div v-for="(plaza, iPlaza) in fila" :key="plaza ? 'plaza-' + plaza.idPlaza : 'nula-' + iFilaPlazas + '-' + iPlaza">
                
                    <div v-if="plaza">
                        <div v-if="plaza.libre === false">
                            <button v-on:click="idPlaza = plaza.idPlaza; selectLiberar = true" class="plaza ocupada"></button>
                        </div>

                        <div v-else>
                            <button v-on:click="idPlaza = plaza.idPlaza; selectOcupar = true" class="plaza libre"></button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        <div v-if="selectOcupar == true">
                <p>Matrícula</p>
                <input type="text" name="matricula" v-model="matricula"></input>
                <p>Tipo de vehículo:</p>
                <input type="text" name="tipoVehiculo" v-model="tipoCoche"></input>
                <button type="button" class="btn btn-primary" 
                v-on:click="ocuparPlaza(idPlaza); selectOcupar = false">Ocupar Plaza</button>
            </div>
            <div v-if="selectLiberar == true">
                <button type="button" class="btn btn-primary"
                v-on:click="liberarPlaza(idPlaza)">Liberar plaza</button>
            </div>

    </div>
    `,

    methods: {
        async leerParkings() {
            let continuar = true;
            try{
                for(let indice = 0; continuar; indice++){
                    const datosDeBack = await fetch("http://localhost:8081/parking/" + indice);

                    if(datosDeBack.ok){
                        const respuesta = await datosDeBack.text();

                        if(respuesta){    
                            const datos = JSON.parse(respuesta);
                            this.listaParking.push(datos);
                        }
                    }

                    else{
                        continuar = false;
                        console.log("Ya no hay mas parking en la base de datos", indice);
                    }
                }
            }
            catch(error){
                console.error("Error de la conexion", error);
            }
        },

        async liberarPlaza(idPlaza){
            
            try{
                const liberar = await fetch("http://localhost:8081/plaza/liberar/" + idPlaza);
                if(liberar.ok){
                    this.selectLiberar = false;
                    alert("Plaza liberada.");
                    idPlaza = "";
                }
                else{
                    alert("Error liberando la plaza");
                }
        }
        catch(error){
            console.error("Error de conexión: ", error);
            alert("Error de conexión en el servidor")
        }
        },

        async ocuparPlaza(idPlaza){

            try{
                const ocuparPlaza = await fetch(`http://localhost:8081/plaza/ocupar/${idPlaza}?matricula=${this.matricula}&idTipoVehiculo=${this.tipoCoche}`);

                    if(ocuparPlaza.ok){
                        this.selectOcupar = false;
                        alert("Has ocupado esta plaza");
                        idPlaza = "";
                        matricula = "";
                        tipoCoche = "";
                    }
                    else{
                        alert("No has podido ocupar la plaza");
                    }
            
            }
            catch(error){
                console.error("Error de conexión: ", error);
                alert("Error de conexión.")
            }
        }
    },

    mounted(){
        this.leerParkings();
    }

}

createApp({

    components:{
        "administracion" : administracion,
        "opciones_admin" : opciones_admin,
        "alta_parking" : alta_parking,
        "mapas": visualizarMapa
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
            if (vistaActual.value === 'ajustes') return 'Configuración de la App';
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