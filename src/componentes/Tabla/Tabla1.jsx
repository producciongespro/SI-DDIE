let claseBoostrap = "table ";

export default function Tabla(props) {
  const conf = props.conf;
  conf.oscura && (claseBoostrap = claseBoostrap + " table-dark  table-responsive");
  conf.alterna && (claseBoostrap = claseBoostrap + " table-striped table-responsive");
  //console.log(claseBoostrap);

  const handleVerDetalles = (i) => {
    // console.log("props.array",props.array);
    // console.log("props.array[i]", props.array[i]);
    props.obtenerItem && props.obtenerItem(props.array[i]);
  };

  const handleObtenerId = (e) => {
    props.obtenerId && props.obtenerId(e.target.id);
  };


  
  const JsxEncabezado = (item, key) => {
    return (
      console.log("item", item)
    )
  }
  return (
    <table className={claseBoostrap}>
      <thead>
        <tr>
          {conf.indice && <th scope="col"> # </th>}
          {props.conf.encabezado.map((item, i) => (
            <th key={i} scope="col">
              {item}
            </th>
          ))}
          {conf.ver && <th className="text-center">Ver</th>}
          {conf.eliminar && <th className="text-center">Eliminar</th>}
        </tr>
      </thead>
      <tbody>
        {props.array.map((item, i) => {
               if (item.control === "input") {
                return JsxEncabezado(item, i);
              }
          <tr key={i}>
            {conf.indice && <th scope="row"> {i + 1} </th>}
            {conf.campos.map((campo, indice) => (
              <td key={"campo" + indice}> {item[campo]} </td>
            ))}

            {
              //Columna ver
              conf.ver && (
                <td className="text-center">
                  <button
                    onClick={() => handleVerDetalles(i)}
                    className="btn btn-regresar btn-sm px-3"
                  >
                    👁️
                  </button>
                </td>
              )
            }

            {
              //Columna eliminar (obtener el id)
              conf.eliminar && (
                <td className="text-center">
                  <button
                    id={item.id}
                    onClick={handleObtenerId}
                    className="btn btn-regresar btn-sm px-3"
                  >
                    🗑️
                  </button>
                </td>
              )
            }
          </tr>
        })
       }
      </tbody>
    </table>
  );
}
