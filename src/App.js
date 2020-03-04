import React, {useRef, useState, useEffect}  from 'react';

//componentes

import Ingreso from './componentes/Ingreso';
import Consultas from './componentes/Consultas';
import ConsultasVer from './componentes/ConsultasVer';
import Basededatos  from './componentes/Basededatos.js';
import BasededatosVer  from './componentes/BasededatosVer.js';
import Bitacora from './componentes/Bitacora';
import Estadisticas from './componentes/Estadisticas';
import Produccion from './componentes/Produccion.js';
import ProduccionVer from './componentes/ProduccionVer.js';
import Calendario  from './componentes/Calendario';
import Acerca from './componentes/Acerca';
import MenuBotones from './componentes/MenuBotones';
import Menu from './componentes/Menu';

import MyContext from './modulos/MyContext';

// import Inicio from './componentes/Inicio';


// hojas de estilos
import "./css/master.css";
import  'pretty-checkbox/src/pretty-checkbox.scss';


const componentes = [<Consultas/>,<ConsultasVer/>,<Basededatos />,<BasededatosVer/>,<Produccion/>,<ProduccionVer />,<Estadisticas />,<Bitacora />,<Calendario />, <Acerca/>];

function App() {

  // controla cantidades de columnas segun dispositivo
  const [colUno, setColUno] = useState("col-sm-3");
  const [colDos, setColDos] = useState("col-sm-9");


  const [usuario, setUsuario] = useState({correo:"", idUsuario:"",tipoUsuario:"", isAccesado: false});
  const value = { usuario, setUsuario };
  
  // console.log("usuario datos iniciales", usuario)
    
  const [componente, setComponente] = useState(null);

  useEffect(() => {
    //Acción que se ejecuta al montar el componente en el DOM
}, []); 

// const handleCargarComponentes2 =(e)=>{
//   e.preventDefault();
//   console.log( "Componente:", e.target.dataset.componente);
  
// }


const handleCargarComponentes = (e) => {     
  
     if ( e.target.tagName.toUpperCase() ==='A') { // EXCEPCION para cargar página de créditos
    // console.log("entre al if, valor dataset", e.target.dataset.referencia);
     e.preventDefault();
     setComponente( componentes[parseInt(e.target.dataset.referencia)] );
    // console.log( "componentes[e.target.dataset.componente]", componentes[e.target.dataset.referencia] );
  }
  else {
    console.log("componentes[e.target.value] ", componentes[e.target.value] );
    
    setComponente( componentes[e.target.value] );  
  }  
  var btns = document.getElementsByName("botones"); 
  // console.log("btns", btns);
    
  for (var i = 0; i < btns.length; i++) {
      var element = btns[i];
      if (element.id[0] === e.target.id[0]){        
        element.classList.add("inactivo");
      }
      else {
        element.classList.remove("inactivo");
      }
    }
}

   return ( 
    <div className="App">
      <MyContext.Provider value={value}>
      {
        usuario.isAccesado ?
          <React.Fragment>
              <Menu  handleCargarComponentes={handleCargarComponentes}   />
              <div className="row">
                <MenuBotones handleCargarComponentes={handleCargarComponentes}  />  
                {
                  componente !== null ?
                  (
                    <React.Fragment>
                      <div id="col2" className={"visor "+colDos}>
                        {componente}
                      </div>
                    </React.Fragment>
                  ) :
                  (
                    <React.Fragment>
                      <div id="col2" className={"visor "+colDos}>
                        <Consultas/>
                      </div>
                    </React.Fragment>
                  )
                }
              </div>
            </React.Fragment>
          :
          <React.Fragment>
            <Ingreso />
              <div className="contModal row">
                <div className="col-12">              </div>
              </div>
            {/* {console.log("usuario datos posteriores", usuario)}           */}
          </React.Fragment>
      }
      </MyContext.Provider>
    </div>
  )
}
export default App;
