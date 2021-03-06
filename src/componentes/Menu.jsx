import React, { useContext } from 'react';
import MyContext from '../modulos/MyContext';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {faUserAlt,faAddressCard, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import logo from '../images/logo_mep_small.png';


export default function Menu(props) {  
  const { usuario, setUsuario } = useContext(MyContext);

  const handlerCerrarSesion = (e) => {    
    var datosUsuario = {
      correo: "",
      idUsuario: "",
      tipoUsuario: "",
      isAccesado : false};
      setUsuario(datosUsuario);
  }

        return (
          <React.Fragment>
                <div className="div-encabezado">
            <div className="container-fluid">            
              <Navbar className="float-right" bg="transparent" expand="lg">
              <Navbar.Brand href="#home">
              </Navbar.Brand>
              <div>
              </div>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="dropdown dropleft float-right">
                  <NavDropdown title="Opciones" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/usuario"><FontAwesomeIcon icon={faUserAlt} size="1x" /> Usuario: {usuario.correo}</NavDropdown.Item>
                    <NavDropdown.Item href="#action/creditos" data-referencia="9" onClick={props.handleCargarComponentes}><FontAwesomeIcon icon={faAddressCard} size="1x" /> Créditos</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/salir" onClick = {handlerCerrarSesion} ><FontAwesomeIcon icon={faSignOutAlt} size="1x" /> Salir</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </div>
          <div className="jumbotron jumbotron-fluid ">
              <h1 className="h1text" > <span className="logo"><img src={logo} className= "img-fluid" alt="imagen logo MEP"/></span></h1>
            </div>
          </div>
        </React.Fragment>
    );
};