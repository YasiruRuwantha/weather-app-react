import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Login from './login';

function App() {
  const [data, setData] = useState({});
  const [forecastData, setForecastData] = useState([]);
  const [latitude, setLatitude] = useState(6.9271); // Set default latitude here
  const [longitude, setLongitude] = useState(79.8612); // Set default longitude here
  const [loggedIn, setLoggedIn] = useState(false);
  const [showExtendedForecast, setShowExtendedForecast] = useState(false);

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=e107821d2337a17f855584396391708b`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=e107821d2337a17f855584396391708b`;

  const searchLocation = () => {
    axios.get(currentWeatherUrl).then((response) => {
      setData(response.data);
    });

    axios.get(forecastUrl).then((response) => {
      // Filter the forecast to get only one forecast per day (next 3 days)
      const filteredForecastData = response.data.list
        .filter((item, index) => index % 8 === 0)
        .slice(1, 4); // Exclude the current day's forecast and keep the next 3 days
      setForecastData(filteredForecastData);
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchLocation();
    }
  };

  useEffect(() => {
    searchLocation();
  }, []);

  const formatForecastDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleViewMore = () => {
    setShowExtendedForecast(!showExtendedForecast);
    if (!showExtendedForecast) {
      // Fetch the forecast for the whole week
      axios.get(forecastUrl).then((response) => {
        // Filter the forecast to get only one forecast per day
        const filteredForecastData = response.data.list.filter((item, index) => index % 8 === 0);
        setForecastData(filteredForecastData);
      });
    } else {
      // Fetch the forecast for the next 3 days again
      searchLocation();
    }
  };

  return (
    <div className="app">
      {!loggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="container">
          <div className="search">
            <input
              value={latitude}
              onChange={(event) => setLatitude(event.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter Latitude"
              type="text"
            />
            <input
              value={longitude}
              onChange={(event) => setLongitude(event.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter Longitude"
              type="text"
            />
          </div>
          <div className="top">
            <div className="location">
              <p>{data.name}</p>
            </div>
            <div className="temp">
              {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
            </div>
            <div className="description">
              {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
          </div>

          {data.name !== undefined && (
            <div className="bottom">
              <div className="feels">
                {data.main ? <p className="bold">{data.main.feels_like.toFixed()}°C</p> : null}
                <p>Feels Like</p>
              </div>
              <div className="humidity">
                {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
                <p>Humidity</p>
              </div>
              <div className="wind">
                {data.wind ? <p className="bold">{data.wind.speed.toFixed()} MPH</p> : null}
                <p>Wind Speed</p>
              </div>
            </div>
          )}

          <div className="forecast">
            {forecastData.map((item) => (
              <div className="forecast-box" key={item.dt}>
                <p>{formatForecastDate(item.dt_txt)}</p>
                <p>{item.main.temp.toFixed()}°C</p>
                <p>{item.weather[0].main}</p>
              </div>
            ))}
          </div>

          <button className="view-more-button" onClick={handleViewMore}>
            {showExtendedForecast ? 'View Less' : 'View More'}
          </button>

          {showExtendedForecast && (
            <div className="extended-forecast">
              {/* Render the extended forecast for the whole week here */}
              {/* You can fetch and display the whole week's forecast here */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;