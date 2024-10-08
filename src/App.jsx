//Imports
import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import cartasJSON from './datosCartas.json'
import constantes from './constants/constantesResultado.js'
import { sxFotito, sxFotito2, letrasResultado } from './constants/constantesEstilos.js'
import SimpleMediaQuery from './logic functions/SimpleMediaQuery.js'
import { useWidth } from './hooks/useWidth.js'

import { CartaV2 } from './componenteCarta.jsx'

// TODO: TEST UTILIZANDO PLAYWRIGHT
//TODO: Quitar Background state


//Componente principal
const App = () => {

  const cartasRandom = cartasJSON.sort(() => Math.random() - 0.5); //Ordenar el JSON randomly

  //Estados
  const [background, setBackground] = useState(Array(12).fill('Background'));
  const [imgEstado, setImgEstado] = useState(Array(12).fill(''));
  const [imgEstado2, setImgEstado2] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [indexActual, setIndexActual] = useState(undefined)
  const [misCartasChulas, setMisCartasChulas] = useState(cartasRandom.slice(0, 12))
  const [puntosTotalesState, setPuntosTotalesState] = useState(0);
  const [claseGanar, setClaseGanar] = useState(Array(12).fill(''));

  const { width } = useWidth();

  //Variables y constantes necesarias post-declaración de estados
  let puntosTotales = 0;
  const misCartasChulasId = misCartasChulas.map(cada => cada.id) //Array de los IDs de las cartas
  let estadoActualGanar = [...claseGanar];
  cartasJSON.sort((a, b) => a.id - b.id) //Reordenar el JSON para evitar duplicado de cartas

  //useEffects
  useEffect(() => { //Controlar fin de partida cuando todo no esté background
    finPartida();
  }, [background]);

  //Componente del set de cartas bocaArriba (4x3)
  const setArriba = misCartasChulas.map((cada, index) => {
    return (
      <div className={`${claseGanar[index]} img${cada.img}`} key={index + 12} >
        <CartaV2 id={cada.id} minWidth={width} img={cada.img} />
      </div>)
  })

  //Componente del set de cartas bocaAbajo (4x3)
  const setAbajo = misCartasChulas.map((cada, index) => {
    //Click -> Se cambia el estado de la carta a bocaArriba
    const handleClick = () => {
      let estadoActualBackground = [...background];
      if (estadoActualBackground[index] === "Background") {
        //estadoActualBackground[index] = `img${cada.img}`;
        estadoActualBackground[index] = `img${cada.img} invisible`;
        setBackground(estadoActualBackground);

      }

      else { //Si ya está bocaArriba, se puede hacer zoom
        zoom(index, cada.img);
      }



    } //Se devuelve el set
    return (
      <div className={`${claseGanar[index]}  ${background[index]}`} onClick={handleClick} key={index} >
        <CartaV2 id={cada.id} minWidth={width} img={cada.img} />
      </div>)
  });


  //Función del zoom de la carta
  const zoom = (index, img) => {
    let estadoActualImg = [...imgEstado];

    estadoActualImg[index] = `img${img}`;
    setImgEstado(estadoActualImg);
    setImgEstado2(estadoActualImg[index]);
    setIndexActual(index);
  }

  //Función para controlar la obtención de puntos
  const conseguirPuntuacion = (cada, index) => {
    estadoActualGanar[index] = `Ganar`;
    puntosTotales = puntosTotales + cada.puntos;
  }

  //Función para que puntúe la carta
  const puntuacion = (cada, index) => {
    const calcularUnico = (fila) => {
      let contador2 = 0;
      if (fila.includes(index)) {
        fila.forEach(posicion => {
          if (misCartasChulas[posicion].tipo === cada.condicion2 || misCartasChulas[posicion].categoria === cada.condicion2) {
            contador2++;
          }
        }); if (contador2 === 1) {
          conseguirPuntuacion(cada, index)
        }
      }
    }

    switch (cada.condicion1) {
      case "nada":
        conseguirPuntuacion(cada, index);
        break;

      case "trasera":
        constantes.filaTrasera.includes(index) ? conseguirPuntuacion(cada, index) : ""
        break;
      case "delantera":
        constantes.filaDelantera.includes(index) ? conseguirPuntuacion(cada, index) : ""
        break;
      case "central":
        constantes.filaCentral.includes(index) ? conseguirPuntuacion(cada, index) : ""
        break;
      case "esquinas":
        constantes.esquinas.includes(index) ? conseguirPuntuacion(cada, index) : ""
        break;
      case "flanco":
        constantes.flancos.includes(index) ? conseguirPuntuacion(cada, index) : ""
        break;
      case "columnCentral":
        constantes.columnasCentrales.includes(index) ? conseguirPuntuacion(cada, index) : ""
        break;

      case "debajo":
        if ((index - 4) >= 0) {
          if (misCartasChulas[index - 4].tipo === cada.condicion2 || misCartasChulas[index - 4].categoria === cada.condicion2) {
            conseguirPuntuacion(cada, index)
          }
        }
        break;

      case "encima":
        if ((index + 4) <= 11) {
          if (misCartasChulas[index + 4].tipo === cada.condicion2 || misCartasChulas[index + 4].categoria === cada.condicion2) {
            conseguirPuntuacion(cada, index)
          }
        }
        break;

      case "lado":
        if ((index - 1) >= 0 && (index + 1) <= 11) {
          if (index === 4 || index === 8 || index === 0) {
            if (cada.condicion2 === misCartasChulas[index + 1].tipo || cada.condicion2 === misCartasChulas[index + 1].categoria) {
              conseguirPuntuacion(cada, index);
            }
          } else if (index === 3 || index === 7 || index === 11) {
            if (cada.condicion2 === misCartasChulas[index - 1].tipo || cada.condicion2 === misCartasChulas[index - 1].categoria) {
              conseguirPuntuacion(cada, index);
            }

          } else {
            if (cada.condicion2 === misCartasChulas[index - 1].tipo || cada.condicion2 === misCartasChulas[index + 1].tipo || cada.condicion2 === misCartasChulas[index - 1].categoria || cada.condicion2 === misCartasChulas[index + 1].categoria) {
              conseguirPuntuacion(cada, index);
            }
          }
        } break;

      case "enJuego":
        let contador = 0;
        misCartasChulas.forEach(carta => {
          if (carta.tipo === cada.condicion2 || carta.categoria === cada.condicion2) {
            contador++;
          }

        }); switch (cada.condicion4) {
          case ">=":
            if (contador >= cada.condicion3) {
              conseguirPuntuacion(cada, index);
            }
            break;
          case "<=":
            if (contador <= cada.condicion3) {
              conseguirPuntuacion(cada, index);
            }
            break;
          case "0":
            if (contador === cada.condicion3) {
              conseguirPuntuacion(cada, index);
            }
            break;
        }
        break;

      case "unicoFila":
        calcularUnico(constantes.filaTrasera);
        calcularUnico(constantes.filaCentral);
        calcularUnico(constantes.filaDelantera);
        break;

      case "unicaColumna":
        calcularUnico(constantes.columnaDerecha);
        calcularUnico(constantes.columnaCentralDerecha);
        calcularUnico(constantes.columnaCentralIzquierda);
        calcularUnico(constantes.columnaIzquierda);
        break;
    }
  }

  //Función de fin de partida
  const finPartida = () => {
    const todoMostrado = background.every(elemento => elemento != "Background");
    if (todoMostrado) {
      misCartasChulas.forEach((cada, index) => {
        puntuacion(cada, index);
      })
      setPuntosTotalesState(puntosTotales)
      setIsFinished(true);
      setClaseGanar(estadoActualGanar);
    }

  }

  //Función obtener número aleatorio entre dos arrays
  const handleClick5 = () => {
    setTimeout(descartar, 1500);
  }
  function numAleatorio(array1, array2) {
    // Generar un número aleatorio entre 0 y la longitud de array2
    const maximo = array2.length - 1;
    let numeroAleatorio;

    do {
      numeroAleatorio = Math.floor(Math.random() * (maximo + 1));
    } while (array1.includes(numeroAleatorio));

    return numeroAleatorio;
  }

  //Función para descartar la carta del zoom
  const descartar = () => {
    let cambioCartasChulas = [...misCartasChulas];
    let estadoActualBackground = [...background];
    let miNum = numAleatorio(misCartasChulasId, cartasJSON);
    cambioCartasChulas[indexActual] = cartasJSON[miNum]
    zoom(indexActual, cambioCartasChulas[indexActual].img)
    estadoActualBackground[indexActual] = `img${cambioCartasChulas[indexActual].img}`;
    setBackground(estadoActualBackground);
    setMisCartasChulas(cambioCartasChulas);
  }

  //Componente de enseñar el texto del resultado o el botón de descarte
  const resultado = () => {
    if (isFinished) {
      return <div className="letrasResultado">
        <Typography variant="body1" sx={letrasResultado}>
          El resultado es: {puntosTotalesState}
        </Typography>
      </div>
    }
    else {
      return indexActual === undefined ? "Haz click de nuevo en una carta revelada para poder descartarla" : <button className="boton" onClick={handleClick5}>Descartar carta de {misCartasChulas[indexActual].titulo}</button>

    }
  }



  //Return de la clase App. Envía todo el tablero.
  return (
    <Grid container spacing={0} justify="center" alignItems="center">
      <Grid item xl={9} lg={9} md={12} sm={12} xs={12} sx={{ position: 'relative', height: { lg: '95vh', md: '95vh', sm: '58vh', xs: '58vh' } }}>

        <div className='cartaSet' style={SimpleMediaQuery("set")}>
          {setAbajo}
        </div>
        <div className='cartaSet2' style={SimpleMediaQuery("set")}>
          {setArriba}
        </div>

      </Grid>
      <Grid item xl={3} lg={3} md={12} sm={12} xs={12} className={`zoom`} style={SimpleMediaQuery("gridBottom")}>
        <div className={`fotito ${imgEstado2}`} style={SimpleMediaQuery("zoom")}>
          <Typography variant="body1" sx={sxFotito}>
            Haz click de nuevo en una carta revelada para verla en formato grande
          </Typography></div>
        <div className="fotito2" style={{ flexGrow: '1' }}><Typography variant="body1" sx={sxFotito2}>
          {resultado()}
        </Typography></div>
      </Grid>
    </Grid>
  );
};

export default App