const opciones_admin = {
    template: `
        <div class="text-center mt-4">
            <button class="btn btn-success m-2 w-75" @click="$emit('altaparking')">Alta Parking</button>
            <button class="btn btn-success m-2 w-75" @click="$emit('estadisticas')">Estadísticas</button>
        </div>
    `
};