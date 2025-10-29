import { useEffect, useState } from 'react';

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('theme') || 'light';

  const [city, setCity] = useState('Chennai');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    mode === 'dark'
      ? root.classList.add('dark')
      : root.classList.remove('dark');
  }, [mode]);

  // Fetch weather
  const fetchWeather = async () => {
    try {
      setError('');
      const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      ).then((r) => r.json());

      if (!geo.results?.length) {
        setError('City not found');
        setWeather(null); // ✅ Clear previous weather
        return;
      }

      const { latitude, longitude } = geo.results[0];

      const weatherResp = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      ).then((r) => r.json());

      setWeather(weatherResp.current_weather);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch weather');
      setWeather(null); // ✅ Clear previous weather on fetch error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Weather Now
        </h1>

        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-3 rounded-lg border dark:border-gray-700 dark:bg-gray-700 dark:text-white"
          placeholder="Enter city name..."
        />

        <button
          onClick={fetchWeather}
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          Search
        </button>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {weather && (
          <div className="mt-5 text-center">
            <p className="text-lg dark:text-gray-300">
              🌡 Temperature: <b>{weather.temperature}°C</b>
            </p>
            <p className="text-lg dark:text-gray-300">
              💨 Wind: <b>{weather.windspeed} km/h</b>
            </p>
            <p className="text-lg dark:text-gray-300">
              ⛅ Code: <b>{weather.weathercode}</b>
            </p>
          </div>
        )}

        <p className="text-center text-xs mt-4 text-gray-500 dark:text-gray-400">
          Theme controlled via URL → <code>?theme=dark</code> or{' '}
          <code>?theme=light</code>
        </p>
      </div>
    </div>
  );
}
