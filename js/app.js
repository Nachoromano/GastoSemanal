//Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');



//eventos+
eventos();
function eventos(){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto)

    formulario.addEventListener('submit', agregarGastos)
}

//classes
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto);
        this.gastos = []
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total,gasto)=>total + gasto.cantidad, 0 );
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id)
        this.calcularRestante();
    }
}
class UI{//esto es solamente para poner html
    insertarPresupuesto(cantidad){
        //Extrayendo los valores
        const {presupuesto,restante} = cantidad;

        //Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta (mensaje,tipo){
        //crear el div
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('text-center','alert');

        if(tipo === 'error'){
            divAlerta.classList.add('alert-danger');
        }else{
            divAlerta.classList.add('alert-success');
        }
        //Mensaje de error
        divAlerta.textContent = mensaje;

        //insertar HTML 
        document.querySelector('.primario').insertBefore(divAlerta, formulario)

        setTimeout(()=>{
            divAlerta.remove()
        },2000)
    }

    mostrarGastos(gastos){

        this.limpiarHTML();//elimina el HTML previo 

        //iterar sobre los gastos 
        gastos.forEach(gasto => {
            const {cantidad,nombre,id} = gasto;

            //Crear un LI 
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-gruop-item d-flex justify-content-between aling-items-center';
            nuevoGasto.dataset.id = id;
            
            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = ` ${nombre} <span class="badge badge-priamry badge-pill">$ ${cantidad}</span>`;

            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto')
            btnBorrar.innerHTML = 'Borrar &times,'
            btnBorrar.onclick = ()=> eliminarGasto(id); 
            nuevoGasto.appendChild(btnBorrar)


            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        })
    }
    limpiarHTML(){
        while (gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestate(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;

        const restanteDiv = document.querySelector('.restante')
        
        //comprobar 25%
        if ((presupuesto / 4 ) > restante){ //aca estoy partiendo el presupuesto en 4 partes para poder ponerle 25%
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-danger')
        }else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
        }else{ // Este sirve para cuando tocamos borrar y tiene q hacer el rembolso que los colores tmb vuelvan a su lugar
            restanteDiv.classList.remove('alert-danger','alert-warning')
            restanteDiv.classList.add('alert-success')
        }

        //si el total es menor a 0
        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se a agotado','error')

            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}
//Instanciar
const ui = new UI();
let presupuesto;


//funciones

function preguntarPresupuesto (){
    const presupuestoUsuario = prompt('¿Cual es tu presupueto?')
    // console.log(presupuestoUsuario);

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){ //IsNaN es para q no pongan letras y solo numeros
        window.location.reload();
    }

    //presupuesto valido
    
    presupuesto = new Presupuesto(presupuestoUsuario);
    // console.log(Presupueto);

    ui.insertarPresupuesto(presupuesto);
}

//Añade gastos 
function agregarGastos(e){
    e.preventDefault();

    //leer los datos del formulario
    const nombre = document.querySelector('#gasto').value
    const cantidad = Number(document.querySelector('#cantidad').value)

    //Validar
    if (nombre === '' || cantidad === ''){
        ui.imprimirAlerta('ambos campos son obligatorios','error');
        return;
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('cantidad no valida','error')
        return;
    }

    ///generar objeto con el gasto 
    const gasto = {nombre,cantidad, id: Date.now()}

    //Añade un nuevo gasto
    presupuesto.nuevoGasto( gasto );

    //mensaje de que funciono todo bien
    ui.imprimirAlerta('gasto agregado Correctamente')

    //imprimir los gastos
    const {gastos,restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestate(restante);
    ui.comprobarPresupuesto(presupuesto);

    //Reiniciar Formulario
    formulario.reset();
}

function eliminarGasto (id){
    //Elimina del objeto
    presupuesto.eliminarGasto(id)
    //elimina los gastos del HTML
    const {gastos,restante} = presupuesto;
    ui.mostrarGastos(gastos)

    ui.actualizarRestate(restante);
    ui.comprobarPresupuesto(presupuesto);
}

