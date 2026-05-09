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