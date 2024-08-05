import useMediaQuery from '@mui/material/useMediaQuery';

//Controlar los estilos de la mayoría de los elementos renderizados
function SimpleMediaQuery(elemento) {
  const matches = useMediaQuery('(max-width:1200px)');

  if (matches) {
    switch (elemento) {

      case "set":
        return { height: '60vh' }

      case "gridBottom":
        return { flexDirection: "row" };

      case "zoom":
        return { width: "220vw", height: "31vh", flexGrow:'2'}

      case "card":
        return { width: "10px" }

      default:
        return "";
    }
  } else {
    if (elemento === "gridBottom") {
      return { flexDirection: "column" };
    }
  }

}
export default SimpleMediaQuery;