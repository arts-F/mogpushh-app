import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Search,
  MapPin,
  X,
} from 'lucide-react-native';
import { theme } from '../App';

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  description: string;
  icon: string;
  sunrise: string;
  sunset: string;
}

interface ForecastData {
  date: string;
  tempMax: number;
  tempMin: number;
  description: string;
  icon: string;
}

const API_KEY = 'b6fd43b5921a86fa9904b937e3dce975'; // OpenWeatherMap free API key

export default function WeatherDashboardScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedLocations, setSavedLocations] = useState<string[]>([
    'New York',
    'London',
    'Tokyo',
  ]);

  // Fetch weather on component mount
  useEffect(() => {
    fetchWeatherByCity('New York');
  }, []);

  const fetchWeatherByCity = async (city: string) => {
    setLoading(true);
    try {
      // Current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!weatherResponse.ok) {
        throw new Error('City not found');
      }

      const weatherData = await weatherResponse.json();

      const currentWeather: WeatherData = {
        city: weatherData.name,
        country: weatherData.sys.country,
        temperature: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
        visibility: weatherData.visibility / 1000,
        pressure: weatherData.main.pressure,
        description: weatherData.weather[0].main,
        icon: weatherData.weather[0].icon,
        sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(
          'en-US',
          { hour: '2-digit', minute: '2-digit' }
        ),
        sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(
          'en-US',
          { hour: '2-digit', minute: '2-digit' }
        ),
      };

      setWeather(currentWeather);

      // 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      const forecastData = await forecastResponse.json();
      const dailyForecasts: { [key: string]: ForecastData } = {};

      forecastData.list.forEach(
        (item: {
          dt_txt: string;
          main: { temp_max: number; temp_min: number };
          weather: Array<{ main: string; icon: string }>;
        }) => {
          const date = item.dt_txt.split(' ')[0];
          if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
              date,
              tempMax: Math.round(item.main.temp_max),
              tempMin: Math.round(item.main.temp_min),
              description: item.weather[0].main,
              icon: item.weather[0].icon,
            };
          }
        }
      );

      setForecast(Object.values(dailyForecasts).slice(0, 5));
    } catch (error) {
      Alert.alert('Error', 'Could not fetch weather data. Please try again.');
      console.error('Weather fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchWeatherByCity(searchQuery);
      setSearchQuery('');
    }
  };

  const handleSaveLocation = () => {
    if (weather && !savedLocations.includes(weather.city)) {
      setSavedLocations([...savedLocations, weather.city]);
      Alert.alert('Success', `${weather.city} saved to favorites!`);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    switch (iconCode) {
      case '01d':
      case '01n':
        return <Sun size={64} color={theme.secondary} />;
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return <Cloud size={64} color={theme.lightText} />;
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return <CloudRain size={64} color={theme.primary} />;
      default:
        return <Cloud size={64} color={theme.lightText} />;
    }
  };

  const renderForecastDay = ({ item }: { item: ForecastData }) => (
    <View style={styles.forecastCard}>
      <Text style={styles.forecastDate}>
        {new Date(item.date).toLocaleDateString('en-US', {
          weekday: 'short',
        })}
      </Text>
      <View style={styles.forecastIcon}>
        {getWeatherIcon(item.icon)}
      </View>
      <Text style={styles.forecastTemp}>
        {item.tempMax}°/{item.tempMin}°
      </Text>
      <Text style={styles.forecastDesc}>{item.description}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Weather Dashboard</Text>
        <Text style={styles.headerSubtitle}>
          Plan prayer times with weather awareness
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search city..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.lightText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Search size={20} color={theme.white} />
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Fetching weather data...</Text>
        </View>
      ) : weather ? (
        <>
          {/* Current Weather Card */}
          <View style={styles.currentWeatherCard}>
            <View style={styles.weatherHeader}>
              <View>
                <View style={styles.cityRow}>
                  <MapPin size={16} color={theme.primary} />
                  <Text style={styles.cityText}>
                    {weather.city}, {weather.country}
                  </Text>
                </View>
                <Text style={styles.weatherDescription}>
                  {weather.description}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleSaveLocation}
              >
                <Text style={styles.favoriteButtonText}>★</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.temperatureDisplay}>
              <View style={styles.weatherIconContainer}>
                {getWeatherIcon(weather.icon)}
              </View>
              <View style={styles.temperatureText}>
                <Text style={styles.currentTemp}>{weather.temperature}°C</Text>
                <Text style={styles.feelsLike}>
                  Feels like {weather.feelsLike}°C
                </Text>
              </View>
            </View>

            {/* Weather Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <Droplets size={20} color={theme.primary} />
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{weather.humidity}%</Text>
              </View>

              <View style={styles.detailCard}>
                <Wind size={20} color={theme.primary} />
                <Text style={styles.detailLabel}>Wind Speed</Text>
                <Text style={styles.detailValue}>{weather.windSpeed} km/h</Text>
              </View>

              <View style={styles.detailCard}>
                <Eye size={20} color={theme.primary} />
                <Text style={styles.detailLabel}>Visibility</Text>
                <Text style={styles.detailValue}>
                  {weather.visibility.toFixed(1)} km
                </Text>
              </View>

              <View style={styles.detailCard}>
                <Gauge size={20} color={theme.primary} />
                <Text style={styles.detailLabel}>Pressure</Text>
                <Text style={styles.detailValue}>{weather.pressure} hPa</Text>
              </View>
            </View>

            {/* Sunrise/Sunset */}
            <View style={styles.sunriseSunset}>
              <View style={styles.sunSection}>
                <Sun size={16} color={theme.secondary} />
                <Text style={styles.sunLabel}>Sunrise</Text>
                <Text style={styles.sunTime}>{weather.sunrise}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.sunSection}>
                <Sun size={16} color={theme.secondary} />
                <Text style={styles.sunLabel}>Sunset</Text>
                <Text style={styles.sunTime}>{weather.sunset}</Text>
              </View>
            </View>
          </View>

          {/* 5-Day Forecast */}
          {forecast.length > 0 && (
            <View style={styles.forecastSection}>
              <Text style={styles.forecastTitle}>5-Day Forecast</Text>
              <FlatList
                data={forecast}
                renderItem={renderForecastDay}
                keyExtractor={(item) => item.date}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.forecastList}
              />
            </View>
          )}

          {/* Prayer Insight */}
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>💡 Prayer Insight</Text>
            <Text style={styles.insightText}>
              {weather.description === 'Rain'
                ? '🌧️ Indoor prayer recommended. This is a great time for focused intercession!'
                : weather.description === 'Clear' || weather.description === 'Sunny'
                ? '☀️ Perfect weather for outdoor prayer walks and meditation.'
                : '🙏 Weather conditions are suitable for your prayer time. Pray until something happens!'}
            </Text>
          </View>
        </>
      ) : null}

      {/* Saved Locations */}
      {savedLocations.length > 0 && (
        <View style={styles.savedLocationsSection}>
          <Text style={styles.savedLocationsTitle}>Quick Access</Text>
          <View style={styles.savedLocationsList}>
            {savedLocations.map((location) => (
              <TouchableOpacity
                key={location}
                style={styles.savedLocationButton}
                onPress={() => fetchWeatherByCity(location)}
              >
                <Text style={styles.savedLocationText}>{location}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.lightText,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: theme.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchButton: {
    backgroundColor: theme.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.lightText,
  },
  currentWeatherCard: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.primary,
    marginLeft: 6,
  },
  weatherDescription: {
    fontSize: 14,
    color: theme.lightText,
    marginTop: 4,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonText: {
    fontSize: 20,
    color: theme.secondary,
  },
  temperatureDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  weatherIconContainer: {
    marginRight: 20,
  },
  temperatureText: {
    flex: 1,
  },
  currentTemp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.primary,
  },
  feelsLike: {
    fontSize: 12,
    color: theme.lightText,
    marginTop: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  detailCard: {
    width: '48%',
    backgroundColor: theme.background,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: theme.lightText,
    marginTop: 6,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.primary,
    marginTop: 4,
  },
  sunriseSunset: {
    flexDirection: 'row',
    backgroundColor: theme.background,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  sunSection: {
    alignItems: 'center',
    flex: 1,
  },
  sunLabel: {
    fontSize: 12,
    color: theme.lightText,
    marginTop: 6,
  },
  sunTime: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.primary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: theme.border,
    marginHorizontal: 10,
  },
  forecastSection: {
    marginBottom: 20,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 12,
  },
  forecastList: {
    gap: 10,
  },
  forecastCard: {
    backgroundColor: theme.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 100,
    borderLeftWidth: 3,
    borderLeftColor: theme.secondary,
  },
  forecastDate: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.primary,
    marginBottom: 6,
  },
  forecastIcon: {
    marginBottom: 6,
  },
  forecastTemp: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
  },
  forecastDesc: {
    fontSize: 10,
    color: theme.lightText,
    marginTop: 4,
  },
  insightCard: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.secondary,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 13,
    color: theme.white,
    lineHeight: 18,
  },
  savedLocationsSection: {
    marginBottom: 20,
  },
  savedLocationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 12,
  },
  savedLocationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  savedLocationButton: {
    backgroundColor: theme.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  savedLocationText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.primary,
  },
});
