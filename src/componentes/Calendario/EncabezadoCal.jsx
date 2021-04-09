import React, { useState, useEffect } from "react";
import { filtrarId } from 'gespro-utils/filtrar_array';
import meses from "./meses.json";
let idMesActual;
const limiteMeses = meses.length;


export default function EncabezadoCal(props) { 
  
  // const { usuario, setUsuario } = useContext(MyContext);

  const [mesActual, setMesActual] = useState(null );    

  useEffect(()=>{
    idMesActual = props.hoy.mes;
    setMesActual(filtrarId(meses, props.hoy.mes) )
  },[]);

  useEffect (()=>{
    props.obtenerMes(idMesActual, mesActual  )
  },[mesActual])

  const handlePasarMeses = (e) => {
    const id = e.target.id;
    id === "btnAtras" && idMesActual > 1 && idMesActual--;
    id === "btnAdelante" && idMesActual < limiteMeses && idMesActual++;    
    setMesActual(filtrarId(meses, idMesActual));    
  };

  return (
    <div className="row">
      <div
        onClick={handlePasarMeses}
        id="btnAtras"
        role="button"
        className="col-sm-2 text-left emoji-l"
      >
        ◀️
      </div>

      <div className="col-sm-3 text-left">
      <button
        onClick={props.vistaCalendario}
        id="btnReservado"
        role="button">
         👁️ Reservado
      </button>
      </div>
      <div className="col-sm-5 text-left">
        <h2 className="text-center"> {mesActual && mesActual.titulo} </h2>
      </div>
      <div
        onClick={handlePasarMeses}
        id="btnAdelante"
        role="button"
        className="col-sm-2 text-right emoji-l"
      >
        ▶️
      </div>
    </div>
  );
}
