'use strict';

//Variables

//Campos del formulario
const inputMascota = document.querySelector('#mascota');
const inputPropietario = document.querySelector('#propietario');
const inputTelefono = document.querySelector('#telefono');
const inputFecha = document.querySelector('#fecha');
const inputHora = document.querySelector('#hora');
const inputSintomas = document.querySelector('#sintomas');

//UI
const formularioCita = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

//Clases

class Citas {
    //Constructores de la clase
    constructor() {
        this.citas = [];
    }

    //Metodos de la clase
    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    //Metodo para eliminar la cita
    eliminarCitaArray(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    updateCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}

class UI {
    //Metodos de la clase
    mostrarErrorValidacion(message, tipo) {
        const mensaje = document.createElement('div');
        mensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        if (tipo === 'error') {
            mensaje.classList.add('alert-danger');
        } else {
            mensaje.classList.add('alert-success');
        }
        //Agregar mensaje
        mensaje.textContent = message;
        //Agregar al DOM
        document.querySelector('#contenido').insertBefore(mensaje, document.querySelector('.agregar-cita'));
        //Quitar la alerta después de 5 segundos
        setTimeout(() => {
            mensaje.remove();
        }, 3000);
    }

    //Se puede hacer destrucing de un objeto desde los parametros de las funciones
    imprimirCitas({ citas }) {
        this.limpiarHTML();
        citas.forEach(cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            //Pagina para obtener iconos https://heroicons.com/
            btnEliminar.innerHTML = 'Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>';
            //Scripting de los elementos de la cita
            divCita.innerHTML = `
                <h2 class="'card-title font-weight-bolder">${mascota}</h2>
                <p class="font-weight-bolder">Propietario:  <span class="font-weight-normal">${propietario} </span></p>
                <p class="font-weight-bolder">Teléfono: <span class="font-weight-normal">${telefono}</span></p>
                <p class="font-weight-bolder">Fecha:  <span class="font-weight-normal">${fecha} </span></p>
                <p class="font-weight-bolder">Hora: <span class="font-weight-normal">${hora}</span></p>
                <p class="font-weight-bolder">Sintomas: <span class="font-weight-normal">${sintomas}</span></p>
            `;
            //Capturar id del elemento a eliminar
            btnEliminar.onclick = () => eliminarCita(id);
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info', 'mr-2');
            btnEditar.innerHTML = 'Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>';
            btnEditar.onclick = () => editarCita(cita);
            //Agregar las citas al HTML
            contenedorCitas.appendChild(divCita);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);
        });
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const citas = new Citas();
const ui = new UI();

//Eventos
eventListner();

function eventListner() {
    inputMascota.addEventListener('input', dataCita);
    inputPropietario.addEventListener('input', dataCita);
    inputTelefono.addEventListener('input', dataCita);
    inputFecha.addEventListener('input', dataCita);
    inputHora.addEventListener('input', dataCita);
    inputSintomas.addEventListener('input', dataCita);
    formularioCita.addEventListener('submit', enviarCita);
}

//Objeto global con la información de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

//Funciones

//Agregar datos al objeto de cita
function dataCita(e) {
    citaObj[e.target.name] = e.target.value;
}

//Validar y agregar nueva cita a la clase de citas
function enviarCita(e) {
    e.preventDefault();
    //Extraer información del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj
    //Validar 
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.mostrarErrorValidacion('Todos los campos son obligatorios', 'error');
        return;
    }
    if (editando) {
        ui.mostrarErrorValidacion('¡Se edito la cita con exito!', 'editado');
        //Metodo para editar objeto del array
        citas.updateCita({...citaObj });
        //Regresar el texto del boton
        formularioCita.querySelector('button[type="submit"]').textContent = 'CREAR CITA';
        editando = false;
    } else {
        //Creando una nueva cita
        citaObj.id = Date.now();
        //Enviar solo una copia del objeto cita a el metodo
        citas.agregarCita({...citaObj });
        //Imprimir mensaje de agregado
        ui.mostrarErrorValidacion('¡Se creo la cita con exito!', 'enviado');
        //Quitar el modo edicion
    }

    //Reiniciando el objeto para la validación
    reiniciarObjeto();
    //Reiniciar formulario
    formularioCita.reset();
    //Mostrar HTML de las citas
    ui.imprimirCitas(citas);
}

function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id) {
    //Metodo para eliminar cita
    citas.eliminarCitaArray(id);

    //Metodo para mostrar mensaje
    ui.mostrarErrorValidacion('La cita se eliminó correctamente');

    //Metodo para refrescar las citas
    ui.imprimirCitas(citas);
}

function editarCita(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    //llenar los inputs
    inputMascota.value = mascota;
    inputPropietario.value = propietario;
    inputTelefono.value = telefono;
    inputFecha.value = fecha;
    inputHora.value = hora;
    inputSintomas.value = sintomas;

    //Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Cambiar el texto del botón
    formularioCita.querySelector('button[type="submit"]').textContent = 'GUARDAR CAMBIOS';
    editando = true;
}