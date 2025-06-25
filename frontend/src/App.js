import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [snakes, setSnakes] = useState([]);
  const [selectedSnake, setSelectedSnake] = useState(null);
  const [selectedContinent, setSelectedContinent] = useState('');
  const [continents, setContinents] = useState([]);
  const [emergencyInfo, setEmergencyInfo] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    initializeData();
    fetchContinents();
    fetchEmergencyInfo();
    fetchStats();
  }, []);

  const initializeData = async () => {
    try {
      await axios.post(`${API}/init-data`);
      console.log('Data initialized successfully');
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  const fetchContinents = async () => {
    try {
      const response = await axios.get(`${API}/continents`);
      setContinents(response.data);
    } catch (error) {
      console.error('Error fetching continents:', error);
    }
  };

  const fetchEmergencyInfo = async () => {
    try {
      const response = await axios.get(`${API}/emergency`);
      setEmergencyInfo(response.data);
    } catch (error) {
      console.error('Error fetching emergency info:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSnakes = async (continent = '', search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (continent) params.append('continent', continent);
      if (search) params.append('search', search);
      
      const response = await axios.get(`${API}/snakes?${params}`);
      setSnakes(response.data);
    } catch (error) {
      console.error('Error fetching snakes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinentSelect = (continent) => {
    setSelectedContinent(continent);
    setCurrentView('snakes');
    fetchSnakes(continent);
  };

  const handleSnakeSelect = (snake) => {
    setSelectedSnake(snake);
    setCurrentView('snake-detail');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentView('snakes');
    fetchSnakes(selectedContinent, searchTerm);
  };

  const getDangerColor = (dangerLevel) => {
    switch (dangerLevel) {
      case 'Harmless': return 'bg-green-100 text-green-800';
      case 'Mildly Venomous': return 'bg-yellow-100 text-yellow-800';
      case 'Venomous': return 'bg-orange-100 text-orange-800';
      case 'Highly Venomous': return 'bg-red-100 text-red-800';
      case 'Deadly': return 'bg-red-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const HomeView = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🐍 SerpentAware</h1>
          <p className="text-xl mb-6">Your Complete Guide to Snake Safety & Education</p>
          <div className="flex justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total_snakes || 0}</div>
              <div>Snake Species</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.venomous_snakes || 0}</div>
              <div>Venomous Species</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">6</div>
              <div>Continents</div>
            </div>
          </div>
        </div>
      </header>

      {/* Emergency Section */}
      <section className="bg-red-50 border-l-4 border-red-500 py-6">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setCurrentView('emergency')}
            className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            🚨 EMERGENCY: Snake Bite Information - Click Here
          </button>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search snakes by name, scientific name, or country..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Continents */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Explore Snakes by Continent</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {continents.map((continent) => (
              <div
                key={continent.continent}
                onClick={() => handleContinentSelect(continent.continent)}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-green-500"
              >
                <h3 className="text-xl font-bold mb-2">{continent.continent}</h3>
                <p className="text-gray-600 mb-4">{continent.count} snake species documented</p>
                <div className="text-green-600 font-semibold">Explore →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Why SerpentAware?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Accurate Identification</h3>
              <p className="text-gray-600">High-quality images and detailed descriptions help you identify snakes correctly.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-bold mb-2">Emergency Ready</h3>
              <p className="text-gray-600">Instant access to first aid information and emergency procedures.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">Educational</h3>
              <p className="text-gray-600">Learn fascinating facts about snake behavior, habitat, and ecology.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const SnakesView = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView('home')}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              ← Back to Home
            </button>
            <h1 className="text-2xl font-bold">
              {selectedContinent ? `${selectedContinent} Snakes` : 'Search Results'}
            </h1>
            <div className="text-sm text-gray-600">
              {snakes.length} species found
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-2xl">🐍 Loading snakes...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snakes.map((snake) => (
              <div
                key={snake.id}
                onClick={() => handleSnakeSelect(snake)}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              >
                <img
                  src={snake.image_url}
                  alt={snake.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1">{snake.name}</h3>
                  <p className="text-sm text-gray-600 italic mb-2">{snake.scientific_name}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getDangerColor(snake.danger_level)}`}>
                      {snake.danger_level}
                    </span>
                    <span className="text-sm text-gray-600">
                      {snake.is_venomous ? '⚠️ Venomous' : '✅ Non-venomous'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{snake.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const SnakeDetailView = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setCurrentView('snakes')}
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            ← Back to Snake List
          </button>
        </div>
      </header>

      {selectedSnake && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="relative">
              <img
                src={selectedSnake.image_url}
                alt={selectedSnake.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h1 className="text-3xl font-bold text-white mb-2">{selectedSnake.name}</h1>
                <p className="text-xl text-gray-200 italic">{selectedSnake.scientific_name}</p>
              </div>
            </div>

            <div className="p-6">
              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Danger Level</div>
                  <div className={`inline-block px-3 py-1 text-sm rounded-full mt-1 ${getDangerColor(selectedSnake.danger_level)}`}>
                    {selectedSnake.danger_level}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Size Range</div>
                  <div className="font-semibold">{selectedSnake.size_range}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Venomous</div>
                  <div className="font-semibold">
                    {selectedSnake.is_venomous ? '⚠️ Yes' : '✅ No'}
                  </div>
                </div>
              </div>

              {/* Description */}
              <section className="mb-6">
                <h2 className="text-xl font-bold mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{selectedSnake.description}</p>
              </section>

              {/* Location */}
              <section className="mb-6">
                <h2 className="text-xl font-bold mb-3">Location & Habitat</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Countries</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSnake.countries.map((country, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 text-sm rounded">
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Habitat</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSnake.habitat.map((hab, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 text-sm rounded">
                          {hab}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Identification */}
              <section className="mb-6">
                <h2 className="text-xl font-bold mb-3">🔍 Identification Features</h2>
                <ul className="space-y-2">
                  {selectedSnake.identification_features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Safety Information */}
              {selectedSnake.is_venomous && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-bold text-red-800 mb-4">🚨 Safety Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-green-800 mb-2">✅ What TO Do</h3>
                      <ul className="space-y-1">
                        {selectedSnake.what_to_do.map((action, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-red-800 mb-2">❌ What NOT To Do</h3>
                      <ul className="space-y-1">
                        {selectedSnake.what_not_to_do.map((action, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-red-600 mt-1">✗</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-red-200">
                    <h3 className="font-bold text-red-800 mb-2">🏥 First Aid Steps</h3>
                    <ol className="space-y-1">
                      {selectedSnake.first_aid.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* Behavior and Diet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <section>
                  <h2 className="text-xl font-bold mb-3">🦎 Behavior</h2>
                  <p className="text-gray-700">{selectedSnake.behavior}</p>
                </section>
                
                <section>
                  <h2 className="text-xl font-bold mb-3">🍽️ Diet</h2>
                  <p className="text-gray-700">{selectedSnake.diet}</p>
                </section>
              </div>

              {/* Interesting Facts */}
              <section>
                <h2 className="text-xl font-bold mb-3">🤔 Interesting Facts</h2>
                <ul className="space-y-2">
                  {selectedSnake.interesting_facts.map((fact, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">💡</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const EmergencyView = () => (
    <div className="min-h-screen bg-red-50">
      <header className="bg-red-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView('home')}
              className="text-red-200 hover:text-white font-semibold"
            >
              ← Back to Home
            </button>
            <h1 className="text-3xl font-bold">🚨 Emergency Information</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {emergencyInfo.map((info) => (
            <div key={info.id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{info.icon}</span>
                <h2 className="text-2xl font-bold">{info.title}</h2>
              </div>
              
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2">Quick Steps:</h3>
                <ol className="space-y-2">
                  {info.quick_steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Emergency Numbers:</h3>
                <div className="flex flex-wrap gap-2">
                  {info.emergency_numbers.map((number, index) => (
                    <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded font-mono">
                      {number}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home': return <HomeView />;
      case 'snakes': return <SnakesView />;
      case 'snake-detail': return <SnakeDetailView />;
      case 'emergency': return <EmergencyView />;
      default: return <HomeView />;
    }
  };

  return <div className="App">{renderCurrentView()}</div>;
}

export default App;