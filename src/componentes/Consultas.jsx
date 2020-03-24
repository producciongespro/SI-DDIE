import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';


import mostrarAlerta from './Alerta.js';

import MyContext from '../modulos/MyContext';

import enviar from '../modulos/enviar';
import obtener from '../modulos/obtener';

import referenciasJson from '../data/referencias.json';

const referencias = referenciasJson[0];

export default function Consultas() {


  const { register, handleSubmit, errors, clearError } = useForm();

  const { usuario, setUsuario } = useContext(MyContext);

  //Cargado se cambia a True cuando se termina la carga de json del servidor
  const [cargado, setCargado] = useState(false);

  //Estado para controlar la carga del json respectivo
  const [tipo_intervencion, setTipoIntervencion] = useState(null);
  //Estado que maneja  la seleccion del usuario
  const [intervencion, setIntervencion] = useState(null);

  //Estado para controlar la carga del json respectivo
  const [id_solicitud, setIdSolicitud] = useState(null);
  //Estado que maneja  la seleccion del usuario
  const [solicitud, setSolicitud] = useState(null);

  //Estado para controlar la carga del json respectivo
  const [tipo_solicitante, setTipoSolicitante] = useState(null);
  //Estado que maneja  la seleccion del usuario
  const [solicitante, setSolicitante] = useState(null);

  //Estado para controlar la carga del json respectivo
  const [tipo_respuesta, setTipoRespuesta] = useState(null);
  //Estado que maneja  la seleccion del usuario
  const [respuesta, setRespuesta] = useState(null);

  const onSubmit = (data, e) => {
    data.fecha_respuesta === "" && delete data["fecha_respuesta"];
    data.id_respuesta === "" && delete data["id_respuesta"];
    let url = referencias.guardaconsulta + "?tabla_destino=consultas";
    // console.log("url desde submit", url);

    enviar(url, data, function (resp) {
      mostrarAlerta("Alerta", resp.data.mensaje );
      // console.log(resp.data.mensaje);
    });
    setIntervencion(0);
    e.target.reset(); // reset after form submit

  };
  // console.log("errors",errors);

  useEffect(() => {
    //Acción que se ejecuta una vez que se monta el componente

    // carga de los JSON de los selects
    let urlIntervencion = referencias.consultageneral + "?tabla=tipo_intervencion",
      urlSolicitante = referencias.consultageneral + "?tabla=tipo_solicitante",
      urlSolicitud = referencias.consultageneral + "?tabla=tipo_solicitud",
      urlRespuesta = referencias.consultageneral + "?tabla=tipo_respuesta";

    obtener(urlIntervencion, function (data) {
      // console.log("datos", data);
      setTipoIntervencion(data);
      //Carga el segundo select en el callback del primer "obtner":
      obtener(urlSolicitante, function (data) {
        //Callback del segundo obtener
        setTipoSolicitante(data);
        //Activa cargado para que meuistre el formulario:
        obtener(urlSolicitud, function (data) {
          //Callback del segundo obtener
          setIdSolicitud(data);
          obtener(urlRespuesta, function (data) {
            //Callback del segundo obtener
            setTipoRespuesta(data);

            setCargado(true)
          });
        });
      })
    })
  }, []);

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

    setIntervencion(parseInt(e.target.value));
  }

  return (
    cargado ?
      (
        <div className="col-12">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="header-1">Agregar consulta</h1><hr />
            <div className="row">
              <div className="form-group col-sm-12 ">
                <label className="font-len" htmlFor="id_intervencion">Tipo de intervención:&nbsp;&nbsp;</label>
                <select className="custom-select" key="iditervencion" defaultValue="" onChange={handlerSeleccion} name="id_intervencion" ref={register({ required: true })}>
                  {errors.id_intervencion && <p className="errors">Este campo es requerido</p>}
                  <option value="" disabled>Seleccione...</option>
                  {

                    tipo_intervencion.map((item, i) => (
                      <option key={"intervencion" + i} value={item.id}>{item.tipo}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-12 ">
                <label className="font-len" htmlFor="id_solicitante">Tipo de solicitante:</label>
                <select className="custom-select" key="idsolicitante" defaultValue="" onChange={handlerSeleccion} name="id_solicitante" ref={register({ required: true })}>
                  {errors.id_solicitante && <p className="errors">Este campo es requerido</p>}
                  <option value="" disabled>Seleccione...</option>
                  {

                    tipo_solicitante.map((item, i) => (
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
                  <input className="form-control" type="text" placeholder="Escriba el otro tipo de solicitante" id="solicitante_otro" name="solicitante_otro" ref={register({ required: true })} />
                  {errors.solicitante_otro && <p className="errors">Este campo es requerido</p>}
                </div>
              </div>
            }
            <div className="row">
              <div className="form-group col-sm-12 ">
                <label className="font-len" htmlFor="id_solicitud">Tipo de solicitud:</label>
                <select className="custom-select" key="idsolicitud" defaultValue="" onChange={handlerSeleccion} name="id_solicitud" ref={register({ required: true })}>
                  {errors.id_solicitud && <p className="errors">Este campo es requerido</p>}
                  <option value="" disabled>Seleccione...</option>
                  {

                    id_solicitud.map((item, i) => (
                      <option key={"solicitud" + i} value={item.id}>{item.tipo}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-12">
                <label className="font-len" htmlFor="tema">Tema:</label>
                <input className="form-control" type="text" id="tema" name="tema" ref={register({ required: true })} />
                {errors.tema && <p className="errors">Este campo es requerido</p>}
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-12">
                <label className="font-len" htmlFor="fecha_solicitud">Fecha:</label>
                <input type="date" className="form-control" id="fecha_solicitud" name="fecha_solicitud" placeholder="Digite la fecha" ref={register({ required: true })} />
                {errors.fecha_solicitud && <p className="errors">Este campo es requerido</p>}
              </div>
            </div>
            <br />
            <h2 className="header-2">Atención a la consulta</h2>
            <hr />
            <div className="row">
              <div className="form-group col-sm-12 ">
                <label className="font-len" htmlFor="id_respuesta">Tipo de respuesta:</label>
                <select className="custom-select" key="id_respuesta" defaultValue="" onChange={handlerSeleccion} name="id_respuesta" ref={register}>
                  {errors.id_respuesta && <p className="errors">Este campo es requerido</p>}
                  <option value="" disabled>Seleccione...</option>
                  {
                    tipo_respuesta.map((item, i) => (
                      <option key={"solicitud" + i} value={item.id}>{item.tipo}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-12">
                <label className="font-len" htmlFor="fecha_respuesta">Fecha:</label>
                <input type="date" className="form-control" id="fecha_respuesta" name="fecha_respuesta" placeholder="Digite la fecha" ref={register} />
                {errors.fecha_respuesta && <p className="errors">Este campo es requerido</p>}
              </div>
            </div>
            <div className="form-group d-none">
              <input type="text" className="form-control" name="id_usuario" id="id_usuario" defaultValue={usuario.idUsuario} ref={register} />
            </div>
            <div className="row">
              <div className="col-md-4 center">
                <input className="btn btn-block btn-main" type="submit" value="Guardar registro" />
              </div>
            </div>
          </form>
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