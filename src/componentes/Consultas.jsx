import React, { Component } from 'react';
import {ValidationForm, TextInput, SelectGroup} from 'react-bootstrap4-form-validation';

import axios from 'axios';
import mostrarAlerta from './Alerta.js'
import LoadingSpinner from './spinner/LoadingSpinner';
import referenciasJson from '../data/referencias.json';

const referencias = referenciasJson[0];

// var correoUser = sessionStorage.getItem("correo");
var idUser = sessionStorage.getItem("id_usuario");
     
// console.log("correoUser", correoUser);
console.log("idUser en consultas", idUser);


var  me;


class Consultas extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = { 
      id_intervencion: "",
      id_usuario    : "",
      id_solicitud : "",
      registro_id : "",
      id_solicitante : "",
      tema : "",
      solicitante_otro : "",
      fecha_solicitud : "",
      id_respuesta : "",
      fecha_respuesta : "",
      respuesta : "",   
      
      tipo_intervencion : [],
      tipo_solicitud : [],
      tipo_solicitante : [],
      tipo_respuesta: [],      
      alertaActiva : false,
      classSuccess : false,
      loading: false, // will be true when ajax request is running
      // validacion
      immediate:true,
      setFocusOnError:true,
      clearInputOnReset:true
     }
  }

  componentDidMount() {
    this.obtenerJson("tipo_solicitud");
    this.obtenerJson("tipo_solicitante");
    this.obtenerJson("tipo_intervencion");
    this.obtenerJson("tipo_respuesta");
  }


  obtenerJson = (tabla) => {
    // var tablaConsulta = tabla.substring(1);
   let url= referencias.consultageneral+"?tabla=" + tabla;
    // console.log("URL",url);
    axios.get(url)
      .then(res => {     
        this.setState({ [tabla] : res.data  }); 
      })

      .catch(function (error) {
        console.log("error",error)
      })
      .finally(function () {
      });
  }

  handleSubmit = (e, formData, inputs) => {
    e.preventDefault();
    this.enviarDatosForm(formData);
    // alert(JSON.stringify(formData, null, 2));
  }

  handleErrorSubmit = (e,formData, errorInputs) => {
      console.log("handleErrorSubmit", errorInputs)
  }

  resetForm = () => {
    me = this;
    let formRef = me.formRef.current;    
    formRef.resetValidationState(this.state.clearInputOnReset);
}

  enviarDatosForm =  (datos)  => {
    console.log("datos", datos);
    
      me = this;
      if (datos.id_respuesta === ""){
        delete datos["id_respuesta"];
      };
      if (datos.fecha_respuesta === ""){
        delete datos["fecha_respuesta"];
      }
      if (datos.solicitante_otro === ""){
        delete datos["solicitante_otro"];
      }

       this.setState({ loading: true }, () => {
        // let url= referencias.guardaconsulta+"?tabla_destino=consultas";
        // console.log("url", url);
        
        axios.post(referencias.guardaconsulta+"?tabla_destino=consultas", datos)    
          .then(function (response) {
          
            console.log("response.data",response.data['error']);
             me.setState({loading: false});
             mostrarAlerta( "ALERTA", response.data['mensaje']  );
              if(!response.data['error']){
                me.setState(() => ({
                  id_intervencion: "",
                  id_solicitud : "",
                  registro_id : "",
                  id_solicitante : "",
                  tema : "",
                  solicitante_otro : "",
                  fecha_solicitud : "",
                  id_respuesta : "",
                  fecha_respuesta : "",
                  respuesta : "",
                  classSuccess: false 
                  })
                );
                me.resetForm();
              }               
          })
          .catch(function (error) {
            console.log("Este es el error en envío",error);       
            // mostrarAlerta( "Error", "Ocurrido un error al guardar la información"  );
          })
          .finally(function () {
            console.log("Transacción finalizada");        
          });
        });

  }

  handleChange = (e) => {
    console.log("e.target.name", e.target.name);
    
  this.setState({
    [e.target.name]: e.target.value
  })
  if (e.target.name === 'id_solicitante') {
      e.target.value === '5'?this.setState({ classSuccess: true }):this.setState({ classSuccess: false });
  }
}


    render() { 
      const  loading  = this.state.loading;
      const  classSuccess  = this.state.classSuccess;
      return (
        <React.Fragment>
          <h1 className="header-1">Consultas</h1>     
          <hr/>         
          <ValidationForm onSubmit={this.handleSubmit} onErrorSubmit={this.handleErrorSubmit}
                  ref={this.formRef}
                  immediate={this.state.immediate}
                  setFocusOnError={this.state.setFocusOnError}
                  defaultErrorMessage = {
                    { required : "Este campo es requerido"}}
              >
                    
              <label className="font-len" htmlFor="id_intervencion">Tipo de intervención:</label>
              <SelectGroup key="idintervencion" name="id_intervencion" id="id_intervencion"
                         value={this.state.id_intervencion} 
                        required errorMessage="Por favor seleccione un tipo de intervención."
                        onChange={this.handleChange}
                        >
                <option  disabled value="">Seleccione la opción</option>
                {
                    this.state.tipo_intervencion.map((item) => (
                    <option key={"intervencion"+ item.id} value={item.id}>  {item.tipo}   </option>
                  ))
                }
              </SelectGroup>

            <label className="font-len" htmlFor="id_solicitante">Tipo de solicitante:</label>
            <SelectGroup key="idsolicitante" name="id_solicitante" id="id_solicitante"
                         value={this.state.id_solicitante} 
                        required errorMessage="Por favor seleccione un tipo de solicitante."
                        onChange={this.handleChange}>
                <option  disabled value="">Seleccione la opción</option>
                {
                      this.state.tipo_solicitante.map((item) => (
                    <option key={item.id} value={item.id}>  {item.tipo}   </option>
                  ))
                }
            </SelectGroup>
            <br/>
            <div className={"form-group form-control-sm " + (classSuccess? "":"d-none")}>
                <TextInput key ="tiposolicitante" type="text" className="form-control" placeholder="Escriba el nombre" name="solicitante_otro"/>
            </div>
            
              <label className="font-len" htmlFor="id_solicitud">Tipo de solicitud:</label>
              <SelectGroup key="idsolicitud" name="id_solicitud" id="id_solicitud"
                         value={this.state.id_solicitud} 
                        required errorMessage="Por favor seleccione el tipo de solicitud." 
                        onChange={this.handleChange}>
                  
              <option  disabled value="">Seleccione la opción</option>
              { 
                  this.state.tipo_solicitud.map((item) => (
                  <option key={"solicitud"+item.id} value={item.id}>  {item.tipo}   </option>
                ))
              }
              </SelectGroup>
            <div className="form-group">
              <label className="font-len" htmlFor="tema">Tema:</label>
              <TextInput key ="temas" type="text" className="form-control" id="tema" name="tema" required/>
            </div>
            <div className="form-group">
              <label className="font-len" htmlFor="fecha_solicitud">Fecha solicitud:</label>
              <TextInput key ="fechasolicitud" type="date" className="form-control" id="fecha_solicitud" name="fecha_solicitud" required />
            </div>
            <br />
            <h2 className="header-2">Atención a la consulta</h2>
            <hr />
            <label className="font-len" htmlFor="id_respuesta">Tipo de respuesta:</label>
              <SelectGroup key="idrespuesta" name="id_respuesta" id="id_respuesta"
                      value={this.state.id_respuesta}
                      onChange={this.handleChange}>
              <option  disabled value="">Seleccione la opción</option>
              {
                this.state.tipo_respuesta.map((item) => (
                <option key={item.id} value={item.id}>  {item.tipo}   </option>
                ))
              }
              </SelectGroup>
            <div className="form-group">
              <label className="font-len" htmlFor="fecha_respuesta">Fecha de respuesta:</label>
              <TextInput key ="fecharespuesta"  type="date" className="form-control" id="fecha_respuesta" name="fecha_respuesta"/>
            </div>

            <div className={"form-group d-none"}>
                <TextInput key ="usuario" type="text" className="form-control" name="id_usuario" id="id_usuario" value ={idUser}/>    
            </div>

            <div className="row">
              <div className="col-md-6 center">
                <button className="btn btn-block btn-main"> 
                Guardar registro {loading ? <LoadingSpinner elementClass={"spinner-grow text-light spinner-grow-lg"} /> : <LoadingSpinner elementClass={"d-none"} /> } </button>
              </div>
            </div>  
          </ValidationForm>  
          </React.Fragment>

        );
    }
}
 
export default Consultas;