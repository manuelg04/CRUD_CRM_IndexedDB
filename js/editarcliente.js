(function(){
    let DB;
    let idCliente;

    const nombreInput = document.querySelector("#nombre");
    const emailInput = document.querySelector("#email");
    const telefonoInput = document.querySelector("#telefono");
    const empresaInput = document.querySelector("#empresa");
    
    const formulario = document.querySelector("#formulario")
    
    document.addEventListener("DOMContentLoaded" , () => {
        
        conectarDB();
        //actualiza el registro
        
        formulario.addEventListener("submit", actualizarCliente);
        
        //verificar el ID de la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get("id");
        if(idCliente){
            setTimeout(() => {
                
                obtenerCliente(idCliente)
            }, 100);
            
        }
        
    })
    function conectarDB(){
        const abrirConexion = window.indexedDB.open("crm", 1);
        
        abrirConexion.onerror = function(){
            
            console.log("hubo un error");
        };
        
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
        }
    }
    
    function obtenerCliente(id){

        const transaction = DB.transaction("crm", "readwrite");
        const objectStore = transaction.objectStore("crm");
        
        const cliente = objectStore.openCursor();

        cliente.onsuccess = function(e){

        const cursor = e.target.result;
            if(cursor){
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);//pasarle el objeto con el registro actual para llenar los dfierentes inputs
                }
                cursor.continue();
            }
        }

    }
    function llenarFormulario(datosCliente){
        const  {nombre, email, telefono, empresa} = datosCliente //DESTRUCTURING
        nombreInput.value = nombre;
        emailInput.value = email;
        empresaInput.value = empresa;
        telefonoInput.value = telefono;

    }
    function actualizarCliente(e){
        e.preventDefault()
        
        if(nombreInput.value === "" || emailInput.value === ""|| empresaInput.value===""||telefonoInput.value===""){
            
            imprimirAlerta("Todos los campos son obligatorios", "error");
            return;
        }
        
        //actualizar cliente

        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente)

        }

        const transaction = DB.transaction("crm","readwrite");
        const objectStore = transaction.objectStore("crm");

        objectStore.put(clienteActualizado);

        transaction.oncomplete = function (){
            imprimirAlerta("editado correctamente");
            setTimeout(() => {
                window.location.href= "index.html"
                
            }, 3000);
        }

        transaction.onerror = function(error){
            imprimirAlerta("Hubo un error", "error")
        }
        
    }
    function imprimirAlerta(mensaje, tipo) {
        // Crea el div

        const divMensaje = document.createElement('div');
        divMensaje.classList.add( "px-4", "py-3", "rounded",  "max-w-lg", "mx-auto", "mt-6", "text-center" );

        if(tipo === 'error') {
           divMensaje.classList.add('bg-red-100', "border-red-400", "text-red-700");
        } else {
            divMensaje.classList.add('bg-green-100', "border-green-400", "text-green-700");
        }
        
        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
       formulario.appendChild(divMensaje);

        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
   }
    

})()