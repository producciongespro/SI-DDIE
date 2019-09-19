import React from 'react';

const Basededatos = () => {
  return (  
    <React.Fragment>
      <h1>Ingreso a la base de datos</h1>
      <div className="form-group">
        <label for="id_ingreso">Id del ingreso:</label>
        <input type="number" className="form-control" id="id_ingreso" name="id_ingreso" />
      </div>
      <div className="form-group">
        <label for="descriptor">Descriptor:</label>
        <input type="number" className="form-control" id="descriptor" name="descriptor" />
      </div>
      <div className="form-group">
        <label for="portada">Portada:</label>
        <input type="number" className="form-control" id="portada" name="portada" />
      </div>
      <div className="form-group">
        <label for="texto_completo">Texto completo:</label>
        <input type="number" className="form-control" id="texto_completo" name="texto_completo" />
      </div>
      <div className="form-group">
        <label for="enlace">Enlace:</label>
        <input type="number" className="form-control" id="enlace" name="enlace" />
      </div>
      <div className="form-group">
        <label for="fecha">Fecha</label>
        <input type="date" className="form-control" id="fecha" name="fecha" />
      </div>
      
      <button type="submit" id="btnEnviar" className="btn btn-primary">Enviar</button>
    </React.Fragment>
    

  );
}
 
export default Basededatos;