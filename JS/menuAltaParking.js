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