import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import MapComponent from '../components/MapComponent';
import { useVehicles } from '../hooks/useVehicles';
import { EnrichedVehicle } from '../types/Vehicle';

const Maps_API_KEY = process.env.VITE_MAPS_API_KEY || '';

const HomePage: React.FC = () => {
  const [filter, setFilter] = useState<string>('');
  const [currentType, setCurrentType] = useState<string>('tracked');
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(20);

  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    setPage(1);
    setFetchTrigger(prev => prev + 1);
  }, [filter, currentType]);

  console.log('Maps_API_KEY', process.env.VITE_MAPS_API_KEY)
  const {
    data: vehicles,
    isLoading,
    isError,
    error,
    hasMore
  } = useVehicles({
    filter,
    type: 'tracked',
    page,
    perPage,
    fetchTrigger
  });

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      if (currentType === 'tracked') {
        return vehicle.latitude !== undefined && vehicle.longitude !== undefined;
      } else if (currentType === 'others') {
        return vehicle.latitude === undefined || vehicle.longitude === undefined;
      }
      return true;
    });
  }, [vehicles, currentType]);

  const [mapCenter, setMapCenter] = useState({ lat: -23.550520, lng: -46.633308 });

  const mapMarkers = useMemo(() => {
    return filteredVehicles
      .filter(vehicle => vehicle.latitude !== undefined && vehicle.longitude !== undefined)
      .map(vehicle => ({
        id: vehicle.id,
        position: { lat: vehicle.latitude!, lng: vehicle.longitude! },
        infoContent: `Placa: ${vehicle.plate}<br/>Frota: ${vehicle.fleet || 'N/A'}<br/>Status: ${vehicle.status}`
      }));
  }, [filteredVehicles]);

  useEffect(() => {
    if (mapMarkers.length > 0) {
      if (mapCenter.lat !== mapMarkers[0].position.lat || mapCenter.lng !== mapMarkers[0].position.lng) {
        setMapCenter({ lat: mapMarkers[0].position.lat, lng: mapMarkers[0].position.lng });
      }
    }
  }, [mapMarkers, mapCenter]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`Auto-refresh: Incrementando fetchTrigger para disparar nova busca (${new Date().toLocaleTimeString()})`);
      setFetchTrigger(prev => prev + 1);
    }, 120000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const observer = useRef<IntersectionObserver>();
  const lastVehicleElementRef = useCallback((node: HTMLTableRowElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const handleVehicleClick = useCallback((vehicle: EnrichedVehicle) => {
    setSelectedVehicle(vehicle);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedVehicle(null);
  }, []);

  const [selectedVehicle, setSelectedVehicle] = useState<EnrichedVehicle | null>(null);

  return (
    <div className="space-y-8">
      {/* Seção de Filtro e Busca */}
      <section className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="filterType"
                value="tracked"
                checked={currentType === 'tracked'}
                onChange={() => setCurrentType('tracked')}
                className="form-radio text-blue-500"
              />
              <span>Rastreados</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="filterType"
                value="others"
                checked={currentType === 'others'}
                onChange={() => setCurrentType('others')}
                className="form-radio text-blue-500"
              />
              <span>Outros</span>
            </label>
          </div>

          <input
            type="text"
            placeholder="Buscar por placa ou frota"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-grow p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
            Novo
          </button>
        </div>
      </section>

      {/* Seção do Mapa Rastreador */}
      <section className="bg-gray-800 p-6 rounded-lg shadow-md min-h-[400px]">
        <div className="w-full h-[400px] flex items-center justify-center">
          {isLoading && vehicles.length === 0 ? (
            <p className="text-gray-400 text-lg">Carregando Mapa e Veículos...</p>
          ) : isError ? (
            <p className="text-red-500 text-lg">Erro ao carregar o mapa ou veículos: {error?.message}</p>
          ) : (
            <MapComponent
              apiKey={Maps_API_KEY}
              center={mapCenter}
              zoom={12}
              markers={mapMarkers}
            />
          )}
        </div>
        {!isLoading && !isError && mapMarkers.length === 0 && (
          <p className="text-gray-400 text-lg text-center mt-4">Nenhum veículo com localização para exibir no mapa.</p>
        )}
      </section>

      {/* Seção da Tabela de Dados */}
      <section className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Lista de Veículos</h2>
        <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Placa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Frota</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Modelo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle, index) => {
                  if (filteredVehicles.length === index + 1) {
                    return (
                      <tr
                        key={vehicle.id}
                        ref={lastVehicleElementRef}
                        className="hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleVehicleClick(vehicle)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">{vehicle.plate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{vehicle.fleet || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{vehicle.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{vehicle.model}</td>
                        <td className={`px-6 py-4 whitespace-nowrap ${
                          vehicle.status === 'active' ? 'text-green-400' :
                          vehicle.status === 'inactive' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {vehicle.status === 'active' ? 'Em Viagem' :
                           vehicle.status === 'inactive' ? 'Parado' :
                           'Outro'}
                        </td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr
                        key={vehicle.id}
                        className="hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleVehicleClick(vehicle)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">{vehicle.plate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{vehicle.fleet || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{vehicle.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{vehicle.model}</td>
                        <td className={`px-6 py-4 whitespace-nowrap ${
                          vehicle.status === 'active' ? 'text-green-400' :
                          vehicle.status === 'inactive' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {vehicle.status === 'active' ? 'Em Viagem' :
                           vehicle.status === 'inactive' ? 'Parado' :
                           'Outro'}
                        </td>
                      </tr>
                    );
                  }
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-gray-400">
                    Nenhum veículo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {isLoading && filteredVehicles.length > 0 && (
            <p className="text-center text-gray-400 py-4">Carregando mais veículos...</p>
          )}
          {!hasMore && filteredVehicles.length > 0 && (
            <p className="text-center text-gray-400 py-4">Fim da lista de veículos.</p>
          )}
        </div>

      </section>

      {/* Modal de Detalhes do Veículo */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full text-white relative">
            <h3 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Detalhes do Veículo</h3>
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl"
            >
              ×
            </button>
            <div className="space-y-3 text-lg">
              <p><strong>Placa:</strong> {selectedVehicle.plate}</p>
              <p><strong>Frota:</strong> {selectedVehicle.fleet || 'N/A'}</p>
              <p><strong>Tipo:</strong> {selectedVehicle.type}</p>
              <p><strong>Modelo:</strong> {selectedVehicle.model}</p>
              <p><strong>Status:</strong> {selectedVehicle.status === 'active' ? 'Em Viagem' : selectedVehicle.status === 'inactive' ? 'Parado' : 'Outro'}</p>
              <p><strong>Proprietário:</strong> {selectedVehicle.nameOwner}</p>
              {selectedVehicle.latitude && selectedVehicle.longitude && (
                <p>
                  <strong>Localização:</strong>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedVehicle.latitude},${selectedVehicle.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-400 hover:underline"
                  >
                    Ver no Google Maps
                  </a>
                </p>
              )}
              {!selectedVehicle.latitude || !selectedVehicle.longitude && (
                <p className="text-gray-500">Localização não disponível.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;