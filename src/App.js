import React, { useEffect, useState } from 'react';
import './App.css';


function App() {


const [climaActual, setClimaActual] = useState()
const [location, setUbicacion] = useState()
const [climaExtendido, setClimaExtendido] = useState()
useEffect(() => {climaActualAPI()}, []) 

    const climaActualAPI = async () => {   
    try{
      const clientApi = await fetch('https://api.ipify.org?format=json');
      const clientIpJSON = await clientApi.json();
      const clientIP = clientIpJSON.ip
      const locationApi = await fetch('http://dataservice.accuweather.com/locations/v1/cities/ipaddress?apikey=fTT6RDjIGJHnuoyryuxeSZSI4hM55cKg&q=' + clientIP + '&language=es-ar');
      const location = await locationApi.json();
      setUbicacion(location)
      const locationKey = location.Key
      const api = await fetch('http://dataservice.accuweather.com/currentconditions/v1/' + locationKey + '?apikey=fTT6RDjIGJHnuoyryuxeSZSI4hM55cKg&language=es-ar');
      const climaActual = await api.json();
      setClimaActual(climaActual)
      const climaExtendidoAPI = await fetch('http://dataservice.accuweather.com/forecasts/v1/daily/5day/' + locationKey + '?apikey=fTT6RDjIGJHnuoyryuxeSZSI4hM55cKg&language=es-ar');
      const climaExtendido = await climaExtendidoAPI.json();
      setClimaExtendido(climaExtendido)
      console.log(climaExtendido);
      } catch (error) {
      console.log(error);
    }
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
            <div key={index} class="bg-gray-500 m-6 p-12 rounded-xl container mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="">
                <h1>{infoClima.Temperature.Metric.Value}º</h1>
                </div>
                <div className="">
                <img src={`https://developer.accuweather.com/sites/default/files/${icono}-s.png`} alt="img"></img>
                </div>
                <div className=" col-span-2">
                <h1>{infoClima.WeatherText}</h1>
                </div> 
                <div className=" col-span-2">
                  <h1>Estas cerca de {location.LocalizedName}, {location.AdministrativeArea.LocalizedName},  {location.Country.LocalizedName}</h1>
                </div>
              </div>
            </div>
         )
        })}



    </div>

        }
      </header>
    </div>
  );
}

export default App;
/*
          {climaExtendido.DailyForecasts.map((infoExtendido, index) => {
                      var largoVariableIcono = `${infoExtendido.Day.Icon}`.length
                      var icono = 0
                     { largoVariableIcono === 1 ? icono = '0' + infoExtendido.Day.Icon : icono = infoExtendido.Day.Icon}
          return(
          <div>
          <h1>{infoExtendido.Date}</h1>
          <h1>{infoExtendido.Day.IconPhrase}</h1>
          <img src={`https://developer.accuweather.com/sites/default/files/${icono}-s.png`} alt="img"></img>
          </div>
          )        
        })}          
*/