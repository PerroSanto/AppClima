import React, { useEffect, useState } from 'react';
import './App.css';


function App() {


const [climaActual, setClimaActual] = useState()
const [location, setUbicacion] = useState()
useEffect(() => {climaActualAPI()}, []) 

const APIKey = 'AMc4kWCFvO4KidIEvGGXGcA0Hu8Oatcw'


const climaActualAPI = async () => {   
  try{
    const clientApi = await fetch('https://api.ipify.org?format=json');
    const clientIpJSON = await clientApi.json();
    const clientIP = clientIpJSON.ip
    const locationApi = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/ipaddress?apikey=${APIKey}&q=${clientIP}&language=es-ar`);
    const location = await locationApi.json();
    setUbicacion(location)
    const locationKey = location.Key
    const api = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${APIKey}&language=es-ar`);
    const climaActual = await api.json();
    setClimaActual(climaActual)
  } catch (error) {
    console.log(error);
  }
}; 


const [climaExtendidoDiario, setClimaExtendido] = useState()
useEffect(() => {climaExtendidoAPI()}, []) 

const climaExtendidoAPI = async () => {   
  const locationKey= '7048'
  try{
      const climaExtendidoApi = await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${APIKey}&language=es-ar&details=false&metric=true`);
      const climaExtendido = await climaExtendidoApi.json();
      const climaExtendidoDiario = climaExtendido.DailyForecasts
      setClimaExtendido(climaExtendidoDiario);
      } catch (error) {
      console.log(error);
    }
}; 


function diaDeLaSemana(utcSeconds){
  const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  var newDate = new Date(0);
  var utcDate = newDate.setUTCSeconds(utcSeconds);
  var newDateUtc = new Date(utcDate);
  var dayName = days[newDateUtc.getDay()];
return dayName
};

//Render

  return (
    <div className="App">
      <header className="App-header">
        <h1>Acu Clima</h1>
        { ! climaActual ? <p>Cargando datos...</p> : 
        
        <div>
        {climaActual.map((infoClima, index) => {
            var largoVariableIcono = `${infoClima.WeatherIcon}`.length
            var icono = 0
           { largoVariableIcono === 1 ? icono = '0' + infoClima.WeatherIcon : icono = infoClima.WeatherIcon}
            return (
              <div key={index} className="bg-gray-500 m-6 p-12 rounded-xl container mx-auto font-sans">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h1 className="text-6xl">{infoClima.Temperature.Metric.Value}ºC</h1>
                  </div>
                  <div>
                    <img src={`https://developer.accuweather.com/sites/default/files/${icono}-s.png`} alt="img" className="w-full"></img>
                  </div>
                  <div className="col-span-2 text-2xl">
                    <h1>{infoClima.WeatherText}</h1>
                  </div> 
                  <div className=" col-span-2 text-xs">
                    <h1 >Estas cerca de {location.LocalizedName}, {location.AdministrativeArea.LocalizedName},  {location.Country.LocalizedName}.</h1>
                  </div>
                </div>
              </div>
            )
        })}
        
        
        <div className="grid grid-cols-5 gap-3">

        {climaExtendidoDiario.map((infoExtendido, index) => {
                      var largoVariableIcono = `${infoExtendido.Day.Icon}`.length
                      var icono = 0
                     { largoVariableIcono === 1 ? icono = '0' + infoExtendido.Day.Icon : icono = infoExtendido.Day.Icon}
          return(
            <div  key={index} className="bg-gray-600 m-4 p-6 rounded-xl container mx-auto font-sans grid gap-3 auto-cols-auto">
              <div className="text-sm text-center underline">
                <h1 >{diaDeLaSemana(infoExtendido.EpochDate)}</h1>
              </div>
              <div>
                <img src={`https://developer.accuweather.com/sites/default/files/${icono}-s.png`} alt="img"></img>
              </div>
              <div className="text-sm text-center">
                <h1>{infoExtendido.Temperature.Minimum.Value} / {infoExtendido.Temperature.Maximum.Value}ºC</h1>
              </div>
            </div>

          )         
        })}     
        </div>
        </div>

        }
        </header>
        </div>
  );
}

export default App;