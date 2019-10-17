import React, { Component } from 'react';
import axios from 'axios';

import referenciasJson from '../data/referencias.json';

import LoadingSpinner from './spinner/LoadingSpinner';

import mostrarAlerta from './Alerta.js'

const referencias = referenciasJson[0];

var usuario = 1,
    me,
    datos = { };



//1 - Definicion de la clase
class Respuestas extends Component {

  //2 - Constructor
  constructor(props) {
    super(props);
    this.state = { 
      consultas : [],
      tipo_respuesta: [],
      loading: false, // will be true when ajax request is running
      registroactual : {}  //guarda información de registro a actualizar
     }
  }

  componentDidMount() {
    //Obtener datos  
    this.obtenerJson("consultas"); // obtiene listado de registros del usuario actual
    this.obtenerJson("tipo_respuesta");
  }


  obtenerJson = (tabla) => {  
  
    var url="";
    if (tabla ==="consultas") {
      url= referencias.consultaespecifica+"?tabla=" + tabla+"&id_u="+usuario;
    } else {
      url= referencias.consultageneral+"?tabla=" + tabla;
    }
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

    enviarDatosForm = (     ) => {    
      me = this;
      this.setState({ loading: true }, () => {

      var id_consulta = this.state.registroactual.id;

      console.log("URL servicio", referencias.actualizaconsulta+"?tabla_destino=consultas&id="+id_consulta);
      axios.post(referencias.actualizaconsulta+"?tabla_destino=consultas&id="+id_consulta, datos)     
        .then(function (response) {
          console.log("response.data",response.data);
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

  obtenerDatosForm = (e) => {
    const opcion = e.target.name;

    switch (opcion) {
      case "respuesta":
        datos.id_respuesta = e.target.value;
        break;
      case "fecha_respuesta":
        datos.fecha_respuesta = e.target.value;
          break;
      default:
        console.log("Opción fuera de rango");
        break;
    }    
  }

  obtenerDatosConsulta = (e) => {

    // eslint-disable-next-line array-callback-return
    this.state.consultas.map((item) =>  {
        if (item.id === e.target.value) {
          this.setState( {registroactual: item }, ()=> {
            // datos.id = item.id;
            console.log("Registro actual", this.state.registroactual); 
          }  );
    }
  });
  }

    render() { 
      const  loading  = this.state.loading;
      return (
        <React.Fragment>
        <h1 className="header-1">Respuestas</h1>
        
          <div className="form-group">
            <label className="font-len" htmlFor="consultas">Seleccione la consulta:</label>
            <select  defaultValue={'0'} className="form-control"  name="consultas" onChange={this.obtenerDatosConsulta}>              
              <option  disabled value="0">Seleccione la opción</option>
              { 
                  this.state.consultas.map((item) => (
                  <option key={item.id} value={item.id}>{item.tema}</option>
                ))
              }
            </select>
          </div>
            <div className="form-group module">
              <p><span className="font-len">Tipo de solicitud: </span>{this.state.registroactual.tipo_solicitud}</p>
              <p><span className="font-len">Tipo de solicitante: </span> {this.state.registroactual.tipo_solicitante}</p>
              {/* <p><span className="font-len">Tema: </span>{this.state.registroactual.tema}</p> */}
              <p><span className="font-len">Fecha de solicitud: </span> {this.state.registroactual.fecha_solicitud}</p>
            </div>
          
          <h2 className="header-2">Atención a la consulta</h2>
          <hr />
          <label className="font-len" htmlFor="respuesta">Tipo de respuesta:</label>
            <select defaultValue={'DEFAULT'}  className="form-control" id="respuesta" name="respuesta" onChange={this.obtenerDatosForm} >
            <option  disabled value="DEFAULT">Seleccione la opción</option>
            {
               this.state.tipo_respuesta.map((item) => (
               <option key={item.id} value={item.id}>  {item.tipo}   </option>
              ))
            }
            </select>
          <div className="form-group">
            <label className="font-len" htmlFor="fecha_respuesta">Fecha de respuesta:</label>
            <input type="date" className="form-control" id="fecha_respuesta" name="fecha_respuesta" onChange={this.obtenerDatosForm} />
          </div>

          <div className="row">
            <div className="col-md-6 center">
            <button className="btn btn-block btn-main" onClick={this.enviarDatosForm} > Actualizar registro {loading ? <LoadingSpinner elementClass={"spinner-grow text-light spinner-grow-lg"} /> : <LoadingSpinner elementClass={"d-none"} /> } </button>
            </div>
          </div>          
      </React.Fragment>
        );
    }
}
 
export default Respuestas;