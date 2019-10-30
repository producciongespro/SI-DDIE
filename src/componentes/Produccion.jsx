import React, { Component } from 'react';
import {ValidationForm, TextInput, SelectGroup} from 'react-bootstrap4-form-validation';
 //https://andyhu92.github.io/react-bootstrap4-form-validation/#/example/basic-usage
//  https://andyhu92.github.io/react-bootstrap4-form-validation/#/api/validation-form

 import axios from 'axios';

import mostrarAlerta from './Alerta.js';

import referenciasJson from '../data/referencias.json';

import LoadingSpinner from './spinner/LoadingSpinner';

const referencias = referenciasJson[0];

var producto = {
  "id_producto": "",
  "id_usuario" : 1,
  "cantidad"   : 0,
  "fecha"      : "0001-01-01",
}

var  me;

class Produccion extends Component {
  constructor(props) {
    super(props);
         // If you want to use the reset state function, you need to have a reference to the ValidationForm component
        //If your React < 16.3, check https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
    this.formRef = React.createRef();

    this.state = { 
      tipo_productos : [],
      productos_poblacion_meta : [],
      arreglo_poblacion : [],
      alertaActiva : false,
      loading: false, 
      classSuccess : false,
    
      immediate:true,   //estado de validación del form
      setFocusOnError:true,
      clearInputOnReset:false
    };
  }
  componentDidMount( ) {
    this.obtenerJson("tipo_productos");
    this.obtenerJson("productos_poblacion_meta");
  }


  obtenerJson = (tabla) => {
   let url= referencias.consultageneral+"?tabla=" + tabla;
   axios.get(url)
      .then(res => {     
        this.setState({ [tabla] : res.data  }); 
        console.log("table", res.data);
        if (tabla === 'productos_poblacion_meta') {
          this.state.tipo_productos.map((item) => (
            this.setState({arreglo_poblacion : res.data.id}, () => {console.log("arreglo poblacion", this.state.arreglo_poblacion);
            })
            // this.setState({ loading: true }, () => {
          ))
        }
      })
      .catch(function (error) {
        console.log("error",error)
      })
      .finally(function () {
      });
  }

  //eventos del formulario
  handleSubmit = (e, formData, inputs) => {
    e.preventDefault();
    // console.log("formData",e, formData, inputs);
    // alert(JSON.stringify(formData, null, 2));
    this.enviarDatosForm();
  }

  handleErrorSubmit = (e,formData, errorInputs) => {
      // console.log("handleErrorSubmit",e,formData, errorInputs);
      console.log("handleErrorSubmit", errorInputs)
  }

  resetForm = () => {
      let formRef = this.formRef.current;
      formRef.resetValidationState(this.state.clearInputOnReset);
  }

  enviarDatosForm = () => {
      me = this;
      // console.log("producto", producto);
      
       this.setState({ loading: true }, () => {
        axios.post(referencias.guardaconsulta+"?tabla_destino=productos", producto)    
          .then(function (response) {
            // console.log("response.data",response.data);
             me.setState({loading: false});   
                 mostrarAlerta( "Alerta", response.data['mensaje']  );
          })
          .catch(function (error) {
            console.log("Este es el error en envío",error);       
          })
          .finally(function () {
            console.log("Transacción finalizada");        
          });
        });

  }

  obtenerPoblacion = (e) => {
    //ojo limpiar el valor si no es 5, en caso de más de un registro
    console.log("Target obtener Poblacion", e.target.value);
    e.target.value !== '1'?this.setState({ classSuccess: true }):this.setState({ classSuccess: false });
    this.obtenerDatosForm(e);    
  }

  obtenerDatosForm = (e) => {
    const opcion = e.target.name;
    // console.log("e.target.name",e.target.name);    
    // console.log("e.target.value",e.target.value);

    switch (opcion) {
      case "id_producto":
        producto.id_producto = e.target.value;
        break;
      case "cantidad":
        producto.cantidad = e.target.value;  //ojo revisar, que guardo en id_tipo solicitante
      break;
      case "fecha":
        producto.fecha = e.target.value;
        break;
      default:
       // console.log("Opción fuera de rango");
        break;
    }
  }

  // handleChangeCheck = (e) => {
  //   let isChecked = e.target.checked;
  //   console.log("valor del ",e.target.id," es: ",isChecked);
    
  //   // do whatever you want with isChecked value
  // }

  render() { 
    const  loading  = this.state.loading;
    const  classSuccess  = this.state.classSuccess;
    return (
      <React.Fragment>
        <ValidationForm onSubmit={this.handleSubmit} onErrorSubmit={this.handleErrorSubmit}
                        ref={this.formRef}
                        immediate={this.state.immediate}
                        setFocusOnError={this.state.setFocusOnError}
                        defaultErrorMessage = {
                          { required : "Este campo es requerido",
                          min : "El número debe ser mayor a 0",
                          max : "El número debe ser menor igual a 20"}
                        }
                        >
          <h1 className="header-1">Producción</h1>
          <hr/>
          <div className="form-group">
            <label className="font-len" htmlFor="tipo_producto">Seleccione el tipo de producto:</label>
            <SelectGroup  key="selectproducto" defaultValue={'DEFAULT'} className="form-control" name="id_producto" required onChange={this.obtenerPoblacion} >
              <option  disabled value="DEFAULT">Seleccione la opción</option>
              {
                  this.state.tipo_productos.map((item) => (
                  <option key={item.id} value={item.id}>{item.tipo}   </option>
                ))
              }
              </SelectGroup>
            </div>
            <div className="row">
              <div className={"col-sm-12 my-2" + (classSuccess? "":" d-none")}>
              {
                  this.state.productos_poblacion_meta.map((item) => (
                    <div className="pretty p-default p-curve">
                    {/* <TextInput key={"poblacion"+ item.id} id={item.id}  name = {"poblacion"+ item.id} type="checkbox" onChange={this.handleChangeCheck}/> */}
                    <TextInput key={"poblacion"+ item.id} id={item.id}  name = {"poblacion"+ item.id} type="checkbox"/>                    
                    <div className="state">
                        <label>{item.nombre}</label>
                    </div>
                  </div>
                ))
              } 
              </div>
            </div>               
         
          <div className="row">
            <div className="form-group col-sm-6">
              <label className="font-len" htmlFor="cantidad">Cantidad:</label>
              <TextInput key="cantidad" type="number" className="form-control" id="cantidad" name="cantidad" min="1" max="20" required onChange={this.obtenerDatosForm}/>
            </div>

            <div className="form-group col-sm-6">
              <label className="font-len" htmlFor="fecha_solicitud">Fecha:</label>
              <TextInput key="fecha" type="date" className="form-control" id="fecha" name="fecha" onChange={this.obtenerDatosForm} required />
            </div>
          </div>
          <hr/>
          <div className="row">
            <div className="col-md-6 center">
              <button className="btn btn-block btn-main"> 
                Guardar registro {loading ? <LoadingSpinner key="loading" elementClass={"spinner-grow text-light spinner-grow-lg"} /> : <LoadingSpinner  key="loading" elementClass={"d-none"} /> } 
              </button>
            </div>
          </div>       
        </ValidationForm>   
      </React.Fragment>
      );
  }
}

export default Produccion;