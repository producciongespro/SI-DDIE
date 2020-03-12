import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Modal } from 'react-bootstrap';

import Tabla from './Tabla';

import MyContext from '../modulos/MyContext';


import enviar from '../modulos/enviar';
import filtrar from '../modulos/filtrar';

import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.min.css';
import 'alertifyjs/build/css/themes/default.min.css';

import mostrarAlerta from './Alerta.js';

import Papelera from './Papelera1js';
import Imagen from './Imagen';
import papeleraVacia from '../images/papelera-vacia.png';
import papelera from '../images/papelera.png';

import referenciasJson from '../data/referencias.json';

const referencias = referenciasJson[0];

var tmpConsultas = null,
  tipoIntervencion = null,
  tipoSolicitante = null,
  idSolicitud = null,
  tipoRespuesta = null,
  datosEliminados = null,
  tmpEditar = null,
  tmpEliminados = null,
  intervenciones = null,
  intervencionId = null;

// carga de los JSON de los selects
var urlConsultas = referencias.consultageneral + "?tabla=consultas",
  urlEliminadosConsultas = referencias.consultaeliminados + "?tabla=consultas",
  urlIntervencion = referencias.consultageneral + "?tabla=tipo_intervencion",
  urlSolicitante = referencias.consultageneral + "?tabla=tipo_solicitante",
  urlSolicitud = referencias.consultageneral + "?tabla=tipo_solicitud",
  urlRespuesta = referencias.consultageneral + "?tabla=tipo_respuesta";

export default function ConsultasVer() {

  const [datosFiltrados, setDatosFiltrados] = useState(null);

   //Bandera que indica que la solicitud y retorno de datos están resuletos
   const [datosListos, setDatosListos] = useState(false);

  const { register, handleSubmit, errors, clearError } = useForm();

  const { usuario, setUsuario } = useContext(MyContext);

 //Bandera que se utiliza para tiempo en espera de recuperar un json cuando se ha borrado un registro
  const [esperando, setEsperando] = useState(false);

  // Estado que indica el desplegar la tabla en modo papelera
  const [modoVisor, setModoVisor] = useState(true);

  //Estado para ocultar o mostrar un modal
  const [show, setShow] = useState(false);
  //cerrar modal
  const handleClose = () => setShow(false);

  
  //Estado que maneja  la seleccion del usuario
  const [intervencion, setIntervencion] = useState(null);

  //Estado que maneja  la seleccion del usuario
  const [solicitud, setSolicitud] = useState(null);

  //Estado que maneja  la seleccion del usuario
  const [solicitante, setSolicitante] = useState(null);
  
  //Estado que maneja  la seleccion del usuario
  const [respuesta, setRespuesta] = useState(null);

  const handlePapelera = () => setModoVisor(false);

  const onSubmit = (data, e) => {
    let idConsulta = tmpEditar[0].id;
    
    data.fecha_respuesta === "" && delete data["fecha_respuesta"];
    data.id_respuesta === "" && delete data["id_respuesta"];

    let url = referencias.actualizaconsulta + "?tabla_destino=consultas&id="+idConsulta + "";
    // console.log("url desde submit", url);

    enviar(url, data, function (resp) {
      handleClose();
      mostrarAlerta("Alerta", resp.msj);
      actualizaDatos(function () {
        if(intervencionId){
          tmpEditar = filtrar(tmpConsultas, "id_intervencion", intervencionId);
        }
        else {
          tmpEditar=tmpConsultas;
        }        
        setDatosFiltrados(tmpEditar);
        setEsperando(false);
    });
    });
  };
  
  async function actualizaDatos(cb) {     
    let response1 = await fetch(urlConsultas);
    tmpConsultas = await response1.json();    
    cb();    
  }

  async function actualizaDatosEliminados(cb) {     
    let response1 = await fetch(urlEliminadosConsultas);
    tmpEliminados = await response1.json();    
    cb();    
  }

  async function obtenerDatos(cb) {
   
    // // 1 Consultas       
    let response1 = await fetch(urlConsultas);
    tmpConsultas = await response1.json()

       
    // 2 Intervención
    let response2 = await fetch(urlIntervencion);
    tipoIntervencion = await response2.json();

    //3 Solicitante
    let response3 = await fetch(urlSolicitante);
    tipoSolicitante = await response3.json();


    // 4 Solicitud
    let response4 = await fetch(urlSolicitud);
    idSolicitud = await response4.json();

    // 5 Respuesta
    let response5 = await fetch(urlRespuesta);
    tipoRespuesta = await response5.json();

    // 6 Eliminados
    let response6 = await fetch(urlEliminadosConsultas);
    datosEliminados = await response6.json();
    console.log("eliminados", datosEliminados);
    
    cb();   

  };

useEffect(() => {
    // console.log("Componente montado");
    obtenerDatos(function () {
      setDatosListos(true);
      setDatosFiltrados(tmpConsultas);     
  });
}, []);

  const handlerSeleccionarIntervencion = (e) => {
    intervencionId = parseInt(e.target.value);
    // console.log("e.target.value", e.target.value);
    intervenciones = filtrar(tmpConsultas, "id_intervencion", intervencionId);
    setDatosFiltrados(intervenciones);
  }
  // const handlePapelera = (e)=>{
  //   console.log("targer", e.target);
    
  //   console.log("presioné PAPELERA");
  //   setModoVisor(false);

  // }

  

  const valor = () => {
    console.log("id_respuesta",tmpEditar[0].id_respuesta); 
    let valor="", val=""; 
    tmpEditar[0].id_respuesta!==null ?(valor = tmpEditar[0].id_respuesta): valor=""; 
    return valor 
  }

  const handlerSeleccion = (e) => {
    clearError();
    parseInt(e.target.value);
    switch (e.target.name) {
      case "id_intervencion":
        setIntervencion(parseInt(e.target.value));
        break;
      case "id_solicitud":
        setSolicitud(parseInt(e.target.value));
        break;
      case "id_solicitante":
        setSolicitante(parseInt(e.target.value));
        break;
      case "tipo_respuesta":
        setRespuesta(parseInt(e.target.value));
        break;
      default:
        break;
    }
  }

  const handleEditarConsulta = (e) => {
    let id = parseInt(e.target.id);
    tmpEditar = filtrar(tmpConsultas, "id", id);
    setEsperando(true);
    setShow(true);
  }

  const handleEliminarConsulta = (e) => {
    const idConsulta = e.target.id;

    alertify.confirm("¿Desea realmente eliminar el recurso?",
      function () {    
        var data = {};
        let url = referencias.actualizaconsulta + "?tabla_destino=consultas&id="+idConsulta + "";
        // console.log("url desde submit", url);
        
        data.borrado = 1;   
        // console.log("DATA",data);
        
        enviar(url, data, function (resp) {
                mostrarAlerta("Alerta", resp.msj);
                actualizaDatos(function () {
                  if(intervencionId){
                    tmpEditar = filtrar(tmpConsultas, "id_intervencion", intervencionId);
                  }
                  else {
                    tmpEditar=tmpConsultas;
                  }
                  console.log("LARGO", tmpEditar.lenght);        
                  setDatosFiltrados(tmpEditar);
                  setEsperando(false);
            })
        });
    });
  }

  const handleRecupera= (e) => {

  }


  return (
    datosListos ?
      (
        <div className="col-12">
          <h1 className="header-1">Ver consultas</h1><hr />
          <div className="row">
            <div className="col-sm-8 input-group mb-3 input-group-sm">
              <div className="input-group-prepend">
                <span className="font-len">Tipo de Intervención:</span>&nbsp;&nbsp; 
              </div>
              <select className="custom-select" key="iditervencion" defaultValue="" onChange={handlerSeleccionarIntervencion} name="id_intervencion">
                {/* {errors.id_intervencion && <p className="errors">Este campo es requerido</p>} */}
                <option value="" disabled>Seleccione...</option>
                {

                  tipoIntervencion.map((item, i) => (
                    <option key={"intervencion" + i} value={item.id}>{item.tipo}</option>
                  ))
                }
              </select>
            </div>
            <div className="col-sm-4">
              {datosEliminados.length== 0 ?
              (   
                <Imagen classElement="img-papelera-vacia float-right" origen={papeleraVacia} />
              )
              :
              (
                <input className="btn btn-main text-center" type="button" value="Papelera" onClick={handlePapelera}></input>
                  // classElement="img-papelera float-right" origen={papelera}  onClick={handleClose} onClick={handlePapelera}/>
                // <Imagen classElement="img-papelera float-right" origen={papelera}  onClick={handleClose} onClick={handlePapelera}/>
              )
              }
              {/* <Imagen classElement="img-papelera float-right" origen={papelera} /> */}
            </div>
          </div>
          {  
            !modoVisor ?
            (
              <h1>Modo papelera</h1>
            )
            :
            (
              esperando ?
                (  
                  <Tabla array={datosFiltrados} clase="table table-striped sombreado" modo="visor" />
                )
                :
                (
                  <Tabla array={datosFiltrados} handleEliminarRecurso={handleEliminarConsulta} handleEditarConsulta={handleEditarConsulta} clase="table table-striped" modo="visor" />
                )
             )
           }
          {<Modal
            show={show}
            onHide={handleClose}
            size="xl"
            backdrop = "static"
          // aria-labelledby="contained-modal-title-vcenter"
          // centered

          >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Header closeButton className="modal-header-edicion">
              <Modal.Title ><h1>Edición</h1></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {
                <>
                    {(tmpEditar && tmpEditar[0]) &&
                      <React.Fragment>
                        <div className="row">
                          <div className="form-group col-sm-6 ">
                            <label className="font-len" htmlFor="id_intervencion">Tipo de intervención:&nbsp;&nbsp;</label>
                            <select className="custom-select" key="iditervencion" defaultValue={tmpEditar[0].id_intervencion} onChange={handlerSeleccion} name="id_intervencion" ref={register({ required: true })}>
                              {errors.id_intervencion && <p className="errors">Este campo es requerido</p>}
                              <option value="" disabled>Seleccione...</option>
                              {

                                tipoIntervencion.map((item, i) => (
                                  <option key={"intervencion" + i} value={item.id}>{item.tipo}</option>
                                ))
                              }
                            </select>
                          </div>
                          <div className="form-group col-sm-6 ">
                            <label className="font-len" htmlFor="id_solicitante">Tipo de solicitante:</label>
                            <select className="custom-select" key="idsolicitante" defaultValue={tmpEditar[0].id_solicitante} onChange={handlerSeleccion} name="id_solicitante" ref={register({ required: true })}>
                              {errors.id_solicitante && <p className="errors">Este campo es requerido</p>}
                              <option value="" disabled>Seleccione...</option>
                              {

                                tipoSolicitante.map((item, i) => (
                                  <option key={"solicitante" + i} value={item.id}>{item.tipo}</option>
                                ))
                              }
                            </select>
                          </div>
                        </div>
                        {solicitante === 5 && 
                          <div className="row">
                            <div className="form-group col-sm-12">
                              <label className="font-len" htmlFor="solicitante_otro">Descripción:</label>
                              <input className="form-control" type="text" placeholder="Escriba el otro tipo de solicitante" id="solicitante_otro" name="solicitante_otro" defaultValue={tmpEditar[0].solicitante_otro} ref={register({ required: true })} />
                              {errors.solicitante_otro && <p className="errors">Este campo es requerido</p>}
                            </div>
                          </div>
                        }
                        <div className="row">
                          <div className="form-group col-sm-6 ">
                            <label className="font-len" htmlFor="id_solicitud">Tipo de solicitud:</label>
                            <select className="custom-select" key="idsolicitud" defaultValue={tmpEditar[0].id_solicitud} onChange={handlerSeleccion} name="id_solicitud" ref={register({ required: true })}>
                              {errors.id_solicitud && <p className="errors">Este campo es requerido</p>}
                              <option value="" disabled>Seleccione...</option>
                              {

                                idSolicitud.map((item, i) => (
                                  <option key={"solicitud" + i} value={item.id}>{item.tipo}</option>
                                ))
                              }
                            </select>
                          </div>
                          <div className="form-group col-sm-6">
                            <label className="font-len" htmlFor="fecha_solicitud">Fecha:</label>
                            <input type="date" className="form-control" id="fecha_solicitud" name="fecha_solicitud" defaultValue={tmpEditar[0].fecha_solicitud} placeholder="Digite la fecha" ref={register({ required: true })} />
                            {errors.fecha_solicitud && <p className="errors">Este campo es requerido</p>}
                          </div>
                        </div>
                        <div className="row">
                          <div className="form-group col-sm-12">
                            <label className="font-len" htmlFor="tema">Tema:</label>
                            <input className="form-control" type="text" id="tema" name="tema" defaultValue={tmpEditar[0].tema} ref={register({ required: true })} />
                            {errors.tema && <p className="errors">Este campo es requerido</p>}
                          </div>
                        </div>
                        <h4 className="header-1">Atención a la consulta</h4>
                        <div className="row">
                          <div className="form-group col-sm-6 ">
                            <label className="font-len" htmlFor="id_respuesta">Tipo de respuesta:</label>
                            <select className="custom-select" key="id_respuesta" defaultValue={valor() } onChange={handlerSeleccion} name="id_respuesta" ref={register}>
                              {errors.id_respuesta && <p className="errors">Este campo es requerido</p>}
                              <option value="" disabled>Seleccione...</option>
                              {
                                tipoRespuesta.map((item, i) => (
                                  <option key={"solicitud" + i} value={item.id}>{item.tipo}</option>
                                ))
                              }
                            </select>
                          </div>
                          <div className="form-group col-sm-6">
                            <label className="font-len" htmlFor="fecha_respuesta">Fecha:</label>
                            <input type="date" className="form-control" id="fecha_respuesta" name="fecha_respuesta" defaultValue={tmpEditar[0].fecha_respuesta} placeholder="Digite la fecha" ref={register} />
                            {errors.fecha_respuesta && <p className="errors">Este campo es requerido</p>}
                          </div>
                        </div>
                        <div className="form-group d-none">
                          <input type="text" className="form-control" name="id_usuario" id="id_usuario" defaultValue={usuario.idUsuario} ref={register} />
                        </div>
                      </React.Fragment>
                    }
                </>
              }
            </Modal.Body>
            <Modal.Footer className="modal-footer-edicion">
              <input className="btn btn-main text-center" type="submit" value="Guardar" onClick={handleClose}></input>
            </Modal.Footer>

           </form>
          </Modal>}
        </div>
      )
      :
      (
        <div>
          <span className="spinner-grow spinner-grow-lg text-danger"></span>
          <span className=""> Cargando datos. Por favor espere...</span>
        </div>

      )

  );
}
