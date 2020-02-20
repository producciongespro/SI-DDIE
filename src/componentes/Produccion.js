import React, {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import obtener from '../modulos/obtener';
import obtenerValoresCheck from '../modulos/obtenerValoresCheck';
import CheckBox from '../componentes/CheckBox';
import InputItem from '../componentes/InputItem';

// import axios from 'axios';

// import mostrarAlerta from './Alerta.js';

import "../css/form.css";

import referenciasJson from '../data/referencias.json';
import enviar from '../modulos/enviar';

const referencias = referenciasJson[0];

var idUser = sessionStorage.getItem("id_usuario");


export default function Form1() {
    const { register, handleSubmit, errors, clearError } = useForm();

    //Estado para controlar la carga del json de productos:
    const [productos, setProductos] = useState(null);
    
    //Estado que maneja el producto seleccionado por el usuario
    const [producto, setProducto] = useState(null);

    //Estado que carga las poblaciones del json del servidor
    const [poblaciones, setPoblaciones] = useState(null);

    //Cargado se cambia a True cuando se termina la carga de json del servidor
    const [cargado, setCargado] = useState(false);

      //Cargado se cambia a True cuando se termina la carga de json del servidor
      const [otraPoblacion, setOtraPoblacion] = useState(false);

    // const onSubmit = data => console.log(data);
    const onSubmit = (data, e) => {
      let arrayPoblacion = obtenerValoresCheck("beneficiario");

      delete data["beneficiario"]; //borrar el check
      data.poblacion = arrayPoblacion
      
            
      let url = referencias.guardaconsulta+"?tabla_destino=productos";
      // console.log("url desde submit", url);
      
      enviar(url, data, function (msj) { console.log(msj);
        });
      setProducto(0);
      e.target.reset(); // reset after form submit

    };
    console.log("errors",errors);


    useEffect(() => {
        //Acción que se ejecuta una vez que se monta el componente
        // console.log("Componente montado");
        let urlProductos= referencias.consultageneral+"?tabla=tipo_productos",
            urlPoblacion = referencias.consultageneral+"?tabla=productos_poblacion_meta";
        //Carga el primer json:
        obtener(urlProductos, function (data) {
            // console.log("datos", data);
            setProductos(data);
            //Carga el segundo select en el callback del primer "obtner":
            obtener(urlPoblacion, function (data) {  
                //Callback del segundo obtener
                setPoblaciones(data);
                //Activa cargado para que meuistre el formulario:
                 setCargado(true)
            })

           
        })
    }, []);


    const handleSeleccionarProducto =(e)=>{
        //obtenr el valor de seleccion
        clearError();
        parseInt(e.target.value)
        setProducto(parseInt(e.target.value));
        
    }
    const handleChangeCheck =(e)=>{
      (e.target.checked)?setOtraPoblacion(true):setOtraPoblacion(false);
    }
    return (        
            cargado ?                    
      (
        <div className="col-12">
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="form-group col-sm-6 ">
              <label className="font-len" htmlFor="id_producto">Seleccione el tipo de producto:&nbsp;&nbsp;</label>
            <select className="custom-select"  defaultValue="" onChange={handleSeleccionarProducto} name="id_producto" ref={register({required: true})}>
            {errors.id_producto && <p className="errors">Este campo es requerido</p>}
            <option value="" disabled>Seleccione...</option>
               {
                  
                   productos.map((item,i)=>(
                   <option key={"producto"+i} value={item.id}>{item.tipo}</option>
                   ))
               }
            </select>
          </div>
          {(producto > 2 && producto < 7 )&&
              <div className="form-group col-sm-6 my-2">
                <InputItem  elementClass= "col-sm-6 my-2 form-group"  placeholderText="Digite el número consecutivo" tipo="number" nombre= "numero_consecutivo" textlabel="Número consecutivo"  referencia={register({required: true})}/>
                {errors.numero_consecutivo && <p className="errors">Este campo es requerido</p>}
              </div>
              }
            {producto === 7 &&
              <div className="form-group col-sm-6 my-2">
                  <InputItem  elementClass= ""  tipo="text" placeholderText="Escriba el tema del video" nombre= "tema_video_divulgacion" textlabel="Tema del video"  referencia={register({required: true})} />
                  {errors.tema_video_divulgacion && <p className="errors">Este campo es requerido</p>}
              </div>
            }   
          </div>   
          {producto === 8 && 
            <div className="row">
              <div className="form-group col-sm-12 my-2">
                <InputItem  tipo="text" placeholderText="Describa el tipo de producto" nombre= "desc_otro" textlabel="Descripción"  referencia={register({required: true})} />
                {errors.desc_otro && <p className="errors">Este campo es requerido</p>}
              </div>
            </div> 
          }
          {producto > 1 && 
            <div className="row">
              <div className="form-group col-sm-12 my-2">
                <p className="font-len" >Población beneficiaria</p>
                <CheckBox array={poblaciones} nombre="beneficiario" register={register} handleChange={handleChangeCheck} />
              </div>
            </div> }
            
            {otraPoblacion && 
              <React.Fragment>
                <InputItem tipo="text" nombre= "poblacion_otro" placeholderText="Escriba el otro tipo de población" textlabel="Descripción"  referencia={register({required: true})} />
                {errors.poblacion_otro && <p className="errors">Este campo es requerido</p>}
              </React.Fragment>
             }

          {producto === 1 && (
            <div className="row">
              <div className="form-group col-sm-3 my-2">
                <InputItem tipo="number" nombre= "volumen_revista" placeholderText="Escriba el volumen" textlabel="Volumen"  referencia={register({required: true})} />
                {errors.volumen_revista && <p className="errors">Este campo es requerido</p>}
              </div>
              <div className="form-group col-sm-3 my-2">
                <InputItem  tipo="number" nombre= "numero_revista"  placeholderText="Escriba el  número de la revista" textlabel="Número"   referencia={register({required: true})} />
                {errors.numero_revista && <p className="errors">Este campo es requerido</p>}
              </div>
              <div className="form-group col-sm-3 my-2">
                <InputItem tipo="number" nombre= "mes_revista" placeholderText="Escriba el mes" textlabel="Mes" referencia={register({required: true})}  />
                {errors.mes_revista && <p className="errors">Este campo es requerido</p>}
              </div>
              <div className="form-group col-sm-3 my-2">
                <InputItem tipo="number" nombre= "anno_revista" textlabel="Año" placeholderText="Escriba el año" referencia={register({required: true})}  />
                {errors.anno_revista && <p className="errors">Este campo es requerido</p>}
              </div>
            </div>
            )
          }
          <div className="row">
            <div className="form-group col-sm-6">
              <label className="font-len" htmlFor="cantidad">Cantidad:</label>
              <input className="form-control" type="number" placeholder="Digite la cantidad" id="cantidad" name="cantidad" ref={register({required: true})} />
              {errors.cantidad && <p className="errors">Este campo es requerido</p>}
          </div>

          <div className="form-group col-sm-6">
            <label className="font-len" htmlFor="fecha">Fecha:</label>
            <input  type="date" className="form-control" id="fecha" name="fecha" placeholder="Digite la fecha" ref={register({required: true})} />
            {errors.fecha && <p className="errors">Este campo es requerido</p>}
          </div>
          
        </div>
        <hr/>
        <div className="row">
          <div className="form-group col-sm-6">
            <label className="font-len" htmlFor="cantidad_beneficiarios">Cantidad de beneficiarios:</label>
            <input type="number" className="form-control" id="cantidad_beneficiarios" name="cantidad_beneficiarios" placeholder="Digite la cantidad de beneficiarios" ref={register({required: true})} />
            {errors.cantidad_beneficiarios && <p className="errors">Este campo es requerido</p>}
          </div>
          <hr/>
        </div>

        <div className={"form-group d-none"}>
            <input type="text" className="form-control" name="id_usuario" id="id_usuario" defaultValue ={idUser} ref={register}/>    
        </div>

        <div className="row">
          <div className="col-md-6 center">
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