import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';

import obtener from '../modulos/obtener';
import meses from "../data/meses.json";
// import moment from 'moment';
// import 'moment/locale/es';

import MyContext from '../modulos/MyContext';

import mostrarAlerta from './Alerta.js';

// import "../css/form.css";

import enviar from '../modulos/enviar';

import referenciasJson from '../data/referencias.json';
const referencias = referenciasJson[0];

export default function Basededatos() {

  // const { register, handleSubmit, errors, clearError } = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors } } = useForm();

  const { usuario, setUsuario } = useContext(MyContext);

  //Estado para controlar la carga del json de ingresos:
  const [ingreso, setIngreso] = useState(null);

  //Estado que maneja el ingreso seleccionado por el usuario
  const [ingresoSel, setIngresoSel] = useState(null);

  //Estado que maneja el mes seleccionado por el usuario
  const [mesSel, setMesSel] = useState(null);

  //Cargado se cambia a True cuando se termina la carga de json del servidor
  const [cargado, setCargado] = useState(false);

   const meses = ["enero", "febrero", "marzo", "abril", "may", "junio","julio", "agosto", "setiemre", "octubre", "noviembre", "diciembre"];
  
  const onSubmit = (data, e) => {
    console.log("data", data);

    let url = referencias.guardaconsulta + "?tabla_destino=ingresos";

    enviar(url, data, function (resp) {
      mostrarAlerta("Alerta", resp.data.mensaje );
    });
    setIngresoSel(0);
    e.target.reset(); // reset after form submit
  };
  // console.log("errors", errors);


  useEffect(() => {
    // moment.locale('es');
    let urlIngreso = referencias.consultageneral + "?tabla=tipo_ingreso";
    //Carga el primer json:
    obtener(urlIngreso, function (data) {
      setIngreso(data);
      setCargado(true);
    })
  }, []);


  const handleSeleccionarIngreso = (e) => {
    //obtenr el valor de seleccion
    // clearError();
    setIngresoSel(parseInt(e.target.value));
  }

  const handleMonthSelect = (e) => {
    //obtenr el valor de seleccion
    // clearError();
    let mesActual = parseInt(e.target.value);
    setMesSel(mesActual);
  }

  return (
    cargado ?
      (
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="header-1">Base de datos</h1>
          <div className="row">
            <div className="form-group col-sm-6 ">
              <label className="font-len" htmlFor="id_ingreso">Nuevo ingreso:&nbsp;&nbsp;</label>
              <select className="custom-select" defaultValue="" onChange={handleSeleccionarIngreso}  {...register("id_ingreso", { required: true })} >
                <option value="" disabled>Seleccione...</option>
                {
                  ingreso.map((item, i) => (
                    <option key={"ingreso" + i} value={item.id}>{item.tipo}</option>
                  ))
                }
              </select>
            </div>
            <div className="form-group col-sm-6 my-2">
            <input type="text" className="col-sm-6 my-2 form-group" placeholder="Descriptor" {...register("descriptor", { required: true })} />
            {errors.descriptor && "Este campo es requerido"}
              {/* <InputItem elementClass="col-sm-6 my-2 form-group" placeholderText="Descriptor" tipo="text" nombre="descriptor" textlabel="Descriptor" referencia={register({ required: true })} />
              {errors.descriptor && <p className="errors">Este campo es requerido</p>} */}
            </div>
          </div>
          {ingresoSel === 3 &&
            <div className="row">
              <div className="col-sm-6">
                <label className="font-len" htmlFor="mes">Mes:</label>
                <select className="custom-select" defaultValue="" onChange={handleMonthSelect} name="mes" id="mes" {...register("mes", { required: true })}>
                  {errors.mes && <p className="errors">Este campo es requerido</p>}
                  <option value="" disabled>Seleccione...</option>
                  {
                    meses.map((label, i) => (
                      <option key={"mes" + label} value={i + 1}>{label}</option>
                    ))}
                </select>
              </div>
              <div className="col-sm-6">
              <input type="number" className="col-sm-6 my-2 form-group" placeholder="Escriba el año" {...register("anno", { required: true })} />
                {/* <InputItem tipo="number" nombre="anno" placeholderText="Escriba el año" textlabel="Año:" referencia={register({ required: true })} /> */}
                {errors.anno && <p className="errors">Este campo es requerido</p>}
              </div>
            </div>
          }
          { (ingresoSel === 8 || ingresoSel === 9) &&
            <React.Fragment>
              <div className="row">
                <div className="form-group col-sm-6 my-2">
                <input type="text" className="col-sm-6 my-2 form-group" placeholder="Número de registro" {...register("registro", { required: true })} />
                  {/* <InputItem placeholderText="Número..." tipo="text" nombre="registro" textlabel="Número de registro" referencia={register({ required: true })} /> */}
                  {errors.registro && <p className="errors">Este campo es requerido</p>}
                </div>
                <div className="form-group col-sm-6 my-2">
                  <label className="font-len" htmlFor="nota">Ingrese las notas:</label>
                  <textarea className="form-control" placeholderText="Ingrese las notas" name="nota" {...register("nota",{ required: true })} />
                  {errors.nota && <p className="errors">Este campo es requerido</p>}
                </div>
              </div>
            </React.Fragment>
          }
          {ingresoSel === 8 &&
           <React.Fragment>
            <div className="row">
              <div className="form-group col-sm-6 my-2">
              <input type="text" className="col-sm-6 my-2 form-group" placeholder="Número de registro antiguo" {...register("modificado_reg_antiguo", { required: true })} />
                {/* <InputItem placeholderText="Número...." tipo="text" nombre="modificado_reg_antiguo" textlabel="Número registro antiguo" referencia={register({ required: true })} /> */}
                {errors.modificado_reg_antiguo && <p className="errors">Este campo es requerido</p>}
              </div>
              <div className="form-group col-sm-6 my-2">
                <p><label className="font-len" htmlFor="modificado_datos_corregidos">Ingrese los datos corregidos:</label> </p>
                <textarea className="form-control" name="modificado_datos_corregidos" id="modificado_datos_corregidos" {...register("modificado_datos_corregidos",{ required: true })} />
                {errors.modificado_datos_corregidos && <p className="errors">Este campo es requerido</p>}
              </div>
            </div>
          </React.Fragment>
          }
          <div className="row">
            <div className="form-group col-sm-6 my-2">
            <input type="text" className="col-sm-6 my-2 form-group" placeholder="Portada" {...register("portada", { required: true })} />
              {/* <InputItem tipo="number" nombre="portada" textlabel="Portada:" placeholderText="No. portada" referencia={register({ required: true })} /> */}
              {errors.portada && <p className="errors">Este campo es requerido</p>}
            </div>
            <div className="form-group col-sm-6 my-2">
            <input type="text" className="col-sm-6 my-2 form-group" placeholder="No. del texto" {...register("texto_completo", { required: true })} />
              {/* <InputItem tipo="number" nombre="texto_completo" textlabel="Texto completo:" placeholderText="No. del texto" referencia={register({ required: true })} /> */}
              {errors.texto_completo && <p className="errors">Este campo es requerido</p>}
            </div>
          </div>

          <div className="row">
            <div className="form-group col-sm-6 my-2">
            <input type="text" className="col-sm-6 my-2 form-group" placeholder="Número de registro antiguo" {...register("modificado_reg_antiguo", { required: true })} />
              {/* <InputItem tipo="number" nombre="enlace" textlabel="Enlace:" placeholderText="No. enlace" referencia={register({ required: true })} /> */}
              {errors.enlace && <p className="errors">Este campo es requerido</p>}
            </div>
            <div className="form-group col-sm-6 my-2">
            <input type="text" className="col-sm-6 my-2 form-group" placeholder="Número de registro antiguo" {...register("modificado_reg_antiguo", { required: true })} />
              {/* <InputItem tipo="date" nombre="fecha" textlabel="Fecha:" referencia={register({ required: true })} /> */}
              {errors.fecha && <p className="errors">Este campo es requerido</p>}
            </div>
          </div>
          <div className={"form-group d-none"}>
            <input type="text" className="form-control" name="id_usuario" id="id_usuario" defaultValue={usuario.idUsuario} ref={register} />
          </div>

          <div className="row">
            <div className="col-md-4 center">
              <input className="btn btn-block btn-main" type="submit" value="Guardar registro" />
            </div>
          </div>
        </form>
      )
      :
      (

        <div>
          <span className="spinner-grow spinner-grow-lg text-danger"></span>
          <span className=""> Cargando datos. Por favor espere...</span>
        </div>
      )

  )
}  
