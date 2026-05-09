const visualizarMapa = {
    data(){
        return{
            listaParking: [],
            parkingSeleccionado: null,
            parking: [],
            menuAbierto: false,
            idPlaza: "",
            matricula: "",
            tipoCoche: "",
            selectOcupar: false,
            selectLiberar: false,
            idParking: ""
        }
    },

    template: `

    <div class="">
    <h3>Seleccione un parking: </h3>
    <div class="dropdown">
    <button type="button" @click="menuAbierto = !menuAbierto" class="dropdown-toggle">Seleccionar</button>
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
    <p><strong>Horario: {{parking.direccion}} </strong></p>
        <div class="parking" >
            <div v-for="(fila, iFilaPlazas) in parking.plazas" :key="'fila-'+ iFilaPlazas">
                <div v-for="(plaza, iPlaza) in fila" :key="plaza ? 'plaza-' + plaza.idPlaza : 'nula-' + iFilaPlazas + '-' + iPlaza">
                
                    <div v-if="plaza">
                        <div v-if="plaza.libre === false">
                            <button v-on:click="idPlaza = plaza.idPlaza; selectLiberar = true" class="plaza ocupada"></button>
                        </div>

                        <div v-else-if="plaza.libre === true">
                            <button v-on:click="idPlaza = plaza.idPlaza; selectOcupar = true" class="plaza libre"></button>
                        </div>
                    </div>
                    <div v-else-if="plaza === null">
                            <div class="plaza"></div>
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
                    const datosDeBack = await fetch("http://localhost:8081/parking");

                    if(datosDeBack.ok){
                        const respuesta = await datosDeBack.json();
                        this.listaParking = respuesta;
                    }
                    else{
                        continuar = false;
                        console.log("Ya no hay mas parking en la base de datos", indice);
                    }
            }
            catch(error){
                console.error("Error de la conexion", error);
            }
        },

        async dibujarParking(idParking){

            try{
                const obtenerParking = await fetch("http://localhost:8081/parking/" + idParking);
                if(obtenerParking.ok){
                    const parkingJson = await obtenerParking.json();
                    this.parking = parkingJson;
                }
                else{
                    alert("Error mostrando parking.")
                }
            }
            catch(error){
                console.error("Error de conexión: ", error);
                alert("Error de conexión en el servidor")
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