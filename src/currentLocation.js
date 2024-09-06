import React from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";


const dateBuilder = (d) => {
  let months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  let days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

class Weather extends React.Component {
  state = {
    lat: undefined,
    lon: undefined,
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
    main: undefined,
    bgImg: undefined,
  };

  componentDidMount() {
    if (navigator.geolocation) {
      this.getPosition()
        .then((position) => {
          this.getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          this.getWeather(28.67, 77.22);
          alert("Please allow access for real-time weather data.");
        });
    } else {
      alert("Geolocation not available");
    }

    this.timerID = setInterval(
      () => this.getWeather(this.state.lat, this.state.lon),
      600000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  getWeather = async (lat, lon) => {
    const api_call = await fetch(
      `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
    );
    const data = await api_call.json();

    this.setState({
      lat: lat,
      lon: lon,
      city: data.name,
      temperatureC: Math.round(data.main.temp),
      temperatureF: Math.round(data.main.temp * 1.8 + 32),
      humidity: data.main.humidity,
      main: data.weather[0].main,
      country: data.sys.country,  
    });

    switch (this.state.main) {
      case "Haze":
        this.setState({
          icon: "CLEAR_DAY",
          bgImg: "./images/background.jpg"
        });
        break;
      case "Clouds":
        this.setState({
          icon: "CLOUDY",
          bgImg: "./images/city.jpg"
        });
        break;
      case "Rain":
        this.setState({
          icon: "RAIN",
          bgImg: "./images/city.jpg"
        });
        break;
      case "Snow":
        this.setState({
          icon: "SNOW",
          bgImg: "./images/city1.jpg"
        });
        break;
      case "Dust":
        this.setState({
          icon: "WIND",
          bgImg: "./images/background1.jpg"
        });
        break;
      case "Drizzle":
        this.setState({
          icon: "SLEET",
          bgImg: "./images/city1.jpg"
        });
        break;
      case "Fog":
        this.setState({
          icon: "FOG",
          bgImg: "./images/background1.jpg"
        });
        break;
      case "Smoke":
        this.setState({
          icon: "FOG",
          bgImg: "./images/city1.jpg"
        });
        break;
      case "Tornado":
        this.setState({
          icon: "WIND",
          bgImg: "./images/background1.jpg"
        });
        break;
      default:
        this.setState({
          icon: "CLEAR_DAY",
          bgImg: "./images/city.jpg"
        });
    }
  };

  render() {
    if (this.state.temperatureC) {
      return (
        <React.Fragment>
          <div className="city" style={{ backgroundImage: `url(${this.state.bgImg})` }}>
            <div className="title">
              <h2>{this.state.city}</h2>
              <h3>{this.state.country}</h3>
            </div>
            <div className="date-time">
              <div className="dmy">
                <div id="txt"></div>
                <div className="current-time">
                  <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                </div>
                <div className="current-date">{dateBuilder(new Date())}</div>
              </div>
              <div className="temperature">
                <p>{this.state.temperatureC}°<span>C</span></p>
              </div>
            </div>
          </div>
          <Forcast icon={this.state.icon} weathername={this.state.main} />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <img src={loader} alt="Loading" style={{ width: "50%", WebkitUserDrag: "none" }} />
          <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
            Detecting your location
          </h3>
          <h3 style={{ color: "white", marginTop: "10px" }}>
            Your current location will be displayed on the app & used for calculating real-time weather.
          </h3>
        </React.Fragment>
      );
    }
  }
}

export default Weather;
