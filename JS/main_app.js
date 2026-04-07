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

                        if(caracter.toLowerCase() == 'x'){
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

createApp({

    components:{
        "administracion" : administracion,
        "opciones_admin" : opciones_admin,
        "alta_parking" : alta_parking
    },

    setup() {
        
        const vistaActual = ref('inicio');

        
        const cambiarVista = (nuevaVista) => {
            vistaActual.value = nuevaVista;
        };

        
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