<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Content-Type: text/html; charset=utf-8");
// $method = $_SERVER['REQUEST_METHOD'];

$tabla= $_GET['tabla'];
$id= $_GET['id_u'];
$sql = '';
switch ($tabla) {
    case 'consultas':
        // $sql = "SELECT consultas.id_intervencion, tipo_intervencion.tipo, tipo_solicitante.tipo FROM tipo_intervencion INNER JOIN tipo_solicitante ON  tipo_intervencion.id=consultas.id_intervencion AND tipo_solicitante.id=consultas.id_solicitante WHERE consultas.id_usuario = $id  AND consultas.id_respuesta='0'";
         $sql = "SELECT consultas.*, tipo_intervencion.tipo AS tipo_intervencion, tipo_solicitud.tipo AS tipo_solicitud, tipo_solicitante.tipo AS tipo_solicitante FROM `consultas` INNER JOIN `tipo_intervencion` ON tipo_intervencion.id = consultas.id_intervencion INNER JOIN `tipo_solicitud` ON tipo_solicitud.id = consultas.id_solicitud INNER JOIN `tipo_solicitante` ON tipo_solicitante.id = consultas.id_solicitante"; 
        break;
    
    default:
        # code...
        break;
}
// $sql="SELECT * FROM $tabla"; 

include "conectar.php";

sleep(1);
function desconectar($conexion){

    $close = mysqli_close($conexion);

        if($close){
            echo '';
        }else{
            echo 'Ha sucedido un error inexperado en la desconexion de la base de datos
';
        }

    return $close;
}

function obtenerArreglo($sql){
    //Creamos la conexion con la funcion anterior
  $conexion = conectarDB();

    //generamos la consulta

        mysqli_set_charset($conexion, "utf8"); //formato de datos utf8

    if(!$resultado = mysqli_query($conexion, $sql)) die(); //si la conexión cancelar programa

    $arreglo = array(); //creamos un array

    //guardamos en un array todos los datos de la consulta
    $i=0;

    while($row = mysqli_fetch_assoc($resultado))
    {
        $arreglo[$i] = $row;
        $i++;
    }

    desconectar($conexion); //desconectamos la base de datos

    return $arreglo; //devolvemos el array
}

        $r = obtenerArreglo($sql);
        echo json_encode($r);

?>
