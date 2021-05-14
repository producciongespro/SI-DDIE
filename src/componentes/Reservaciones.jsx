import React, { useState, useEffect, useRef, useContext } from "react";
import ContTabla from "./Tabla/ContTabla";
import SalaReuniones from "./SalaReuniones";
import FormReservacion from "./FormReservacion";
import GModal from "./Modal/GModal";
import { fecha } from 'gespro-utils/fecha';

// import ContForm from "./Form/ContForm";
// import { useForm } from 'react-hook-form';

import MyContext from '../modulos/MyContext';

import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.min.css';
import 'alertifyjs/build/css/themes/default.min.css';

import obtener from '../modulos/obtener';
import { sendData } from 'gespro-utils/akiri';
import { filtrarKey } from "gespro-utils/filtrar_array";

import referenciasJson from '../data/referencias.json';
import horasInicio from "../data/horas-inicio.json";
import horasFin from "../data/horas-fin.json";

const referencias = referenciasJson[0];

var consulta = referencias.consultareserva,
  valoresDefault = {},
  registro = {},
  objHorasInicio = [],
  objHorasFin = [],
  jsxFormModal = null,
  horas = ["06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00"],
  horasInicioVC = ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
  horasFinVC = ["07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

let idMes;

export default function Reservaciones() {

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   setError,
  //   clearError,
  //   reset
  //   // } = useForm();
  // } = useForm();


  // const onSubmit = (data, e) => {
  //   alert(JSON.stringify(data));
  //   e.target.reset();
  // };

  //Estados para la navegación
  const [vistaMes, setVistaMes] = useState(null);
  const { usuario, setUsuario } = useContext(MyContext);
  const [cargado, setCargado] = useState(false);
  const [actualizado, setActualizado] = useState(false);
  const [data, setData] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const obtenerIdMes = (mes) => {
    idMes = mes;
    // console.log("idMes", idMes);
  };

  const handleReservaciones = () => {
    setVistaMes(false);
  };

  const handleMes = () => {
    setVistaMes(true);
  }

  useEffect(() => {
    obtener(consulta, function (datos) {
      setCargado(true);
    })
  }, []);

  // useEffect(() => {
  //   obtener(consulta, function (datos) {
  //     setData(datos);
  //   })
  // }, [cargado]);

  useEffect(() => {
    // console.log("vistaMes", vistaMes);
    obtener(consulta, function (datos) {
      // for (let index = 0; index < datos.length; index++) {
      //   const element = array[index];

      // }
      setData(datos);

      // console.log("data", data);
      // console.log("propiedades",Object.keys(datos[0])); 
    })
  }, [vistaMes]);

  /*
    useEffect(() => {
      if (formState.isSubmitSuccessful) {
        reset({ something: '' });
      }
    }, [formState, submittedData, reset]);
    */

  const editarRegistro = (itemEditar) => {
    setActualizado(false);
    // console.log("Item editar", itemEditar);
    registro = itemEditar;
    // console.log("todos los datos", data);
    // var  objHorasInicio = {},
    //      objHorasFin = {};
    for (let index = 0; index < horasInicio.length; index++) {
      const element1 = horasInicio[index],
        element2 = horasFin[index];
      let indice = index.toString();
      objHorasInicio[index] =
      {
        text: element1,
        value: indice,
        disabled: false
      };
      objHorasFin[index] =
      {
        text: element2,
        value: indice,
        disabled: false
      }
    };
    // console.log("objeto hora inicio", objHorasInicio);
    // console.log("objeto horas fin", objHorasFin);
    let idItemActual = itemEditar.id;
    // console.log("id del registro editado", idItemActual);
    let fecha = itemEditar.fecha;
    // console.log("fechaseleccionada", fecha);
    let array = filtrarKey(data, "fecha", fecha);
    // console.log("array filtrado por fecha", array);
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.id !== idItemActual) {
        let hi = element.horainicio.slice(0, 5),
          hf = element.horafin.slice(0, 5),
          posIhi = horasInicio.indexOf(hi),
          posIhf = horasInicio.indexOf(hf),
          posFhi = horasFin.indexOf(hi),
          posFhf = horasFin.indexOf(hf);

        // Construcción objeto para select Horas Inicio
        (posIhf === -1) && (posIhf = horasInicio.length - 1);
        if (posIhi === posIhf)
          objHorasInicio[posIhi].disabled = true
        else
          for (let index = posIhi; index < posIhf; index++) {
            objHorasInicio[index].disabled = true;
          };

        // Construcción objeto  para select Horas Fin
        (posFhi === -1) && (posFhi = 0)
        if (posFhf === posFhi + 1)
          objHorasFin[posFhf].disabled = true
        else
          for (let index = posFhi + 1; index <= posFhf; index++) {
            objHorasFin[index].disabled = true;
          };
      }
    };

    let hi = registro.horainicio.slice(0, 5);
    let hf = registro.horafin.slice(0, 5);

    registro.inicio = horasInicio.indexOf(hi);
    registro.fin = horasFin.indexOf(hf);
    valoresDefault = {
      nombre: registro.nombre,
      asunto: registro.asunto,
      inicio: registro.inicio,
      fin: registro.fin,
      fecha: registro.fecha,
      correo: registro.correo,
      asunto: registro.asunto,
      telefono: registro.telefono,
      cantidad: registro.cantidad,
      instancia: registro.instancia
    }

    // validar que la fecha y hora estén disponbiles

    // console.log("registro a enviarse", registro, registro.fin, registro.inicio);
    setActualizado(true);
    handleShow();
  }

  const getDataForm = (data) => {    //actualización de registro
    
    // console.log("datos a enviar antes", data);
    let url = referencias.actualizareservas;
    data.id = registro.id;
    data.idUsuario = usuario.idUsuario;
    data.inicio = horasInicioVC[data.inicio];
    data.fin = horasFinVC[data.fin]

    // console.log("datos a enviar", data);
    sendData(url, data)
      .then(respuesta => {
        if (!respuesta.error) {
          // console.log("entré if");
          alertify.alert('Aviso', 'El registro ha sido actualizado exitosamente');
          setActualizado(false);
          obtener(consulta, function (datos) {
            setData(datos);
            setActualizado(true);
          });
        }
        else {
          let msjServer;
          if (respuesta.error) {
            msjServer = respuesta.msj;
          }
          else {
            msjServer = "Problemas de conexión con la base de datos. Error 405"
          }
          alertify.alert("Error", msjServer);
        }
      })
    handleClose();
  };

  const eliminarRegistro = (idBorrar) => {
    // console.log("Id del elemento a borrar", idBorrar);
    let url = referencias.cambiaBorradoReserva;
    let regEliminar = {
      id_usuario: usuario.idUsuario,
      id_registro: idBorrar,
      valor_borrado: 1
    }
    // console.log("registro", regEliminar);
    // console.log("url", url);

    sendData(url, regEliminar)
      .then(respuesta => {
        // console.log("respuesta.error", respuesta.error);
        if (!respuesta.error) {
          // console.log("entré if");
          alertify.alert('Aviso', 'El registro ha sido eliminado exitosamente');
          setCargado(false);
          obtener(consulta, function (datos) {
            setData(datos);
            setCargado(true);
          });
        }
        else {
          let msjServer;
          if (respuesta.error) {
            msjServer = respuesta.msj;
          }
          else {
            msjServer = "Problemas de conexión con la base de datos. Error 405"
          }
          alertify.alert("Error", msjServer);
        }
      })
  };


  return (
    <React.Fragment>
      {vistaMes ? (
        cargado
          ? <ContTabla array={data} idMes={idMes} handleReservaciones={handleReservaciones} obtenerIdItem={eliminarRegistro} obtenerItem={editarRegistro} />
          : <p>Actualizando datos </p>

      ) : (
        <SalaReuniones handleMes={handleMes} obtenerIdMes={obtenerIdMes} eliminarElemento={eliminarRegistro} />
      )
      }
      <GModal
        show={show}
        // size="lg"
        handleClose={handleClose}
        title="Reserva de sala"
        footer=""
      >
        {actualizado
          // ? <FormReservacion valoresDefault={valoresDefault} getDataForm={getDataForm} getDataFecha={getDataFecha} selectInicio={objHorasInicio} selectFin={objHorasFin} />
          ? <FormReservacion valoresDefault={valoresDefault} getDataForm={getDataForm} selectInicio={objHorasInicio} selectFin={objHorasFin} />
          : <h1>Actualizando datos...</h1>
        }
      </GModal>

    </React.Fragment>
  )
}