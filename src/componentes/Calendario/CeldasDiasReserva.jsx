import React, { useState, useEffect } from "react";
import dias from "./dias.json";
import meses from "./meses.json";
import referenciasJson from '../../data/referencias.json';

import obtener from '../../modulos/obtener';

import { filtrarId } from "gespro-utils/filtrar_array";
import "./celda_dias.css";

const referencias = referenciasJson[0];

export default function CeldasDias(props) {
  // const [reservado,setReservado] = useState(true);
  const [data, setData] = useState(null);

  let mesMontado = filtrarId(meses, props.idMes);
  console.log("mesMontado", mesMontado);
  var consecutivo = [],
   arregloEventos = [
    {
      datos : [],
      fullName: function () {
        return this.datos.length;
      }
    }
  ],
  person = [
    {
      datos :
      [
        {
          firstName: "John",
          lastName: "Doe",
          id: 5566
        },
        {
          firstName: "John",
          lastName: "Doe",
          id: 5566
        }
      ],
        fullName: function () {
        return this.datos.length;
      }
    }
  ];

  console.log("person 0",  person[0].fullName());

  console.log("person 0",  person[0].datos[0].firstName);

  const claseTamano = "cal-" + props.conf.t;

  useEffect(() => {
    let mes = props.idMes;
    (parseInt(mes) < 10) && (mes = "0" + mes)

    // console.log("agregar cero", mes)
    // :console.log("NO necesita cero", mes);
    // let mes= mesMontado.renderMes
    console.log("mes", mes);
    var consulta = referencias.consultafechareserva + "?mes=" + mes;

    //  let fecha = mesMontado.renderMes + item;
    console.log("consulta", consulta);
    obtener(consulta, function (datos) {
      setData(datos);
      console.log("Datos por fecha", datos);
      // setCargado(true);
      var arregloDiario = 
      {
        datos : [],
        fullName: function () {
          return this.datos.length;
        }
      }
      var elementFechaAnt = null;
      var j = 0;
      for (let index = 0; index < datos.length; index++) {
        const element = datos[index];
        const elementFecha = datos[index].fecha;
        const indice = elementFecha.slice(elementFecha.length - 2, elementFecha.length + 1);
        // console.log("posiciones igual al día",indice);
        // arregloEventos[indice] = null;
        if (index === 0) {
          arregloDiario.datos[j]] = element;
          elementFechaAnt = datos[index].fecha
          j++;
        }
        else
          if (elementFechaAnt === datos[index].fecha) {
            arregloDiario.datos[j] = element;
            j++;
          }
          else {
            arregloEventos[indice] = arregloDiario;
            elementFechaAnt = datos[index].fecha;
            arregloDiario = [];
            j = 0;
          }
      }
      console.log("arregloEventos", arregloEventos);
    })
  }, [mesMontado]);

  const handleSelecFecha = (e) => {
    let celda = e.currentTarget;
    const seleccion = {
      "id": celda.id,
      "dia": celda.dataset.dia,
      "mes": celda.dataset.mes.split("-")[1],
      "anno": celda.dataset.mes.split("-")[0]
    }

    props.obtenerFecha(seleccion);
  };

  const crearGrilla = () => {
    let contDia = 1;
    for (let index = 0; index < 39; index++) {
      if (index >= mesMontado.inicio) {
        if (contDia <= mesMontado.maximo) {
          consecutivo.push(contDia);
        } else {
          consecutivo.push(0);
        }
        contDia++;
      } else {
        consecutivo.push(0);
      }
    }
    //        console.log(consecutivo);
  };

  const dataDia = (item) => {
    //  console.log("Fecha", dia);
    // var consulta = referencias.consultafechareserva + "?fecha="+ dia;
    // console.log("consulta", consulta);
    //     obtener(consulta, function (datos) {
    //       setData(datos);
    //       console.log("Datos por fecha", datos);
    //     });

    console.log("arreglo...", arregloEventos[8]);

    let datito = (
      <>
        <p>{item}</p>
        <p>Hola</p>
      </>
    )
    return datito
  }


  const jsxCelda = (item, i) => {
    // cargaEventos(item)
    // console.log("item Celdas", item);
    let claseCelda = null;
    if (props.hoy.dia === item && props.hoy.mes === parseInt(mesMontado.id)) {
      claseCelda = "celda-hoy";
    } else {
      claseCelda = "celda";
    }

    let tmpCelda = (
      <div
        key={"grid" + i}
        tabIndex="2"
        data-dia={item}
        data-mes={mesMontado.renderMes}
        id={mesMontado.renderMes + item}
        onClick={handleSelecFecha}
        onKeyPress={handleSelecFecha}
        className={claseCelda + " " + claseTamano}
        role="button"
        ref={props.agregarRefs}
      >
        {item}
        {/* {dataDia(item, mesMontado.renderMes + item)} */}
      </div>
    );

    let tmpCeldaCero = (
      <div
        key={"grid" + i}
        tabIndex="2"
        data-dia={item}
        data-mes={mesMontado.renderMes}
        id={mesMontado.renderMes + "0" + item}
        onClick={handleSelecFecha}
        onKeyPress={handleSelecFecha}
        className={claseCelda + " " + claseTamano}
        role="button"
        ref={props.agregarRefs}
      >
        {item}
        {/* {dataDia(item)} */}
      </div>
    );

    return item <= 9 ? tmpCeldaCero : tmpCelda;
  };

  crearGrilla();

  return (
    <div className="contenedor fondo-calendario">
      <div className="row">
        {dias.map((item) => (
          <div key={"dia" + item.id} className={"fila-dias " + claseTamano}>
            {item.nombre}
          </div>
        ))}
      </div>
      <div className="row">
        {consecutivo.map((item, i) =>
          item > 0 ? (
            jsxCelda(item, i)
          ) : (
            <div key={"grid" + i} className="celda-des"></div>
          )
        )}
      </div>
    </div>
  );
}
