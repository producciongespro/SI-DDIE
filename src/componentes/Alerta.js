import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.min.css';


const mostrarAlerta = ( titulo, mensaje) => {
        // console.log("Alerta",titulo,mensaje);
             alertify.alert(titulo, mensaje); 
}
 
export default mostrarAlerta;

