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
    <button class="btn btn-primary" @click='iniciarSesion'>Iniciar sesión</Button>
    <br><br>
    `,
    methods: {
        async iniciarSesion(){
            try {
                const datosDeBack = await fetch(`http://localhost:8081/login?email=${this.Usuario}&clave=${this.Contrasena}`);

                if (datosDeBack.ok) {
                    this.$emit("sesion_iniciada");
                }
                else {
                    alert("Usuario o contraseña incorrectos")
                }
            }
            catch (error) {
                console.error("Error de la conexion", error);
            }
            localStorage.setItem('usuario', this.Usuario);
            localStorage.setItem('contraseña', this.Contrasena);
        }   
    }
};