const obtenerValoresCheck =(nombre)=>{
  let listaAnnos = [];
  let poblaciones = [];
  const chk  = document.getElementsByName(nombre);
  // console.log("chk", chk);
  var chkPoblacion ="";
  for (let index = 0; index < chk.length; index++) { 
    if (chk[index].checked ) {
      let itemchk = chk[index].id

         if(index<=8)
          { chkPoblacion =itemchk.slice(0,1);}
        else { chkPoblacion =itemchk.slice(0,2);}
      poblaciones = {"id": chkPoblacion};
      listaAnnos.push(poblaciones);   
    }
     
  }
  // console.log("listaAnnos", listaAnnos);
  
  return JSON.stringify(listaAnnos);
}

export default obtenerValoresCheck;