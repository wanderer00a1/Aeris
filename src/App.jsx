import axios from "axios";
import { useEffect, useState } from "react";
import { CiCloud } from "react-icons/ci";
import { TbTemperatureCelsius } from "react-icons/tb";
import { FaTemperatureFull, FaWind } from "react-icons/fa6";
import { IoCloudOutline } from "react-icons/io5";
import { WiHumidity } from "react-icons/wi";
import { Atom } from "react-loading-indicators";
import { RiPercentLine } from "react-icons/ri";

const key = "NIf7JVr9wHbQ16794lyaEgzfbtapMlRd";
function App() {
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!location) return;
    async function fetchWeather() {
      setIsLoading(true);
      const res = await axios.get(
        `https://api.tomorrow.io/v4/weather/forecast?location=${location}&apikey=${key}`
      );
      console.log(res.data);
      setData(res.data);
      setIsLoading(false);
    }
    fetchWeather();
  }, [location]);
  return (
    <>
      <Navbar>
        <Logo />
        <WeatherForm onSet={setLocation} />
      </Navbar>

      {isLoading ? (
        <div className="loading">
          <Atom
            color="#319bcc"
            size="medium"
            text="Fetching..."
            textColor="#2490e3"
          />
        </div>
      ) : (
        <>
          <div className="container">
            <Box>
              <CurrentWeatherInfo data={data} />
            </Box>
            <Box>
              <AirConditions data={data} />
            </Box>
          </div>
          <div>
            <Forecast data={data} />
          </div>
        </>
      )}
    </>
  );
}
export default App;

function Navbar({ children }) {
  return <nav>{children}</nav>;
}

function Logo() {
  const [liveTime, setLiveTime] = useState(new Date());
  useEffect(() => {
    const live = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(live);
  }, []);
  return (
    <div className="nav">
      <div className="logo">
        Aeris <CiCloud />
      </div>
      <div style={{fontFamily:"cursive"}}>
        {liveTime.toLocaleDateString("en-GB").replace(/\//g, "-")} |{" "}
        {liveTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </div>
      <div className="invisible">Aeris ☁️</div>
    </div>
  );
}

function Box({ children }) {
  return <div className="box">{children}</div>;
}

function WeatherForm({ onSet }) {
  const [query, setQuery] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onSet(query);
    setQuery("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="input">
        <input
          type="text"
          placeholder="Check the weather..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="btn" type="submit">
          🔎
        </button>
      </div>
    </form>
  );
}

function CurrentWeatherInfo({ data }) {
  const currentdate = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const getTemperatureLabel = (temp) => {
    if (temp <= 0) return "Freezing ❄️";
    else if (temp < 10) return "Cold 🌨️";
    else if (temp < 18) return "Cool 🍃";
    else if (temp < 24) return "Warm ⛅";
    else if (temp < 30) return "Hot ☀️";
    else return "Very Hot 🔥";
  };
  return (
    <>
      {data && (
        <div className="weatherinfo">
          <h2>Current Weather</h2>

          <div className="info">
            <div className="placeNtime">
              <span>
                <strong>{data?.location?.name}</strong>
              </span>
              <span>
                Today {currentdate.getDate()}{" "}
                {monthNames[currentdate.getMonth()]}
              </span>
            </div>
            <div className="weather">
              <span>
                {data?.timelines?.minutely[0].values.temperature}
                <TbTemperatureCelsius />
              </span>
              <span>
                {getTemperatureLabel(
                  data?.timelines?.minutely[0].values.temperature
                )}
              </span>
            </div>
            <div className="sym">
              <CiCloud />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AirConditions({ data }) {
  return (
    <>
      {data && (
        <div className="Airinfo">
          <h2>Air Conditions</h2>
          <div className="airCon">
            <div className="feels">
              <span>
                <FaTemperatureFull /> Feels Like
              </span>
              <strong>
                {data?.timelines?.minutely[0].values.temperatureApparent}
                <TbTemperatureCelsius />
              </strong>
            </div>
            <div className="wind">
              <span>
                <FaWind /> Wind
              </span>
              <strong>
                {data?.timelines?.minutely[0].values.windSpeed} m/s
              </strong>
            </div>
            <div className="cloud">
              <span>
                <IoCloudOutline /> Clouds
              </span>
              <strong>
                {data?.timelines?.minutely[0].values.cloudCover} %
              </strong>
            </div>
            <div className="humidity">
              <span>
                <WiHumidity /> Humidity
              </span>
              <strong>{data?.timelines?.minutely[0].values.humidity} %</strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Forecast({ data }) {
  const weekly = data?.timelines?.daily?.slice(1);
  return (
    data && (
      <>
        <h2 className="header">Weekly Forecast</h2>
        <div className="forecast">
          {weekly?.map((day) => (
            <ForecastBlocks key={day.time} day={day} />
          ))}
        </div>
      </>
    )
  );
}

function ForecastBlocks({ day }) {
  const date = new Date(day?.time);
  const Name = date.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
  return (
    <div className="forecastInfo">
      <h3>{Name}</h3>
      <div className="col">
        <strong>
          <FaTemperatureFull className="icon" />
          {day.values.temperatureMax}
          <TbTemperatureCelsius className="icon" />
        </strong>

        <strong>
          <IoCloudOutline className="icon" />
          {day.values.cloudCoverMax}
          <RiPercentLine />
        </strong>
      </div>
      <div className="col2">
        <span>
          <FaWind className="icon" />
          {day.values.windSpeedMax} m/s
        </span>
        <strong>
          <WiHumidity className="icon" />
          {day.values.humidityAvg}
          <RiPercentLine className="icon" />
        </strong>
      </div>
    </div>
  );
}
