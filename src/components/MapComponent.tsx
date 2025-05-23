import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places', 'geometry'];

interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  infoContent?: string;
}

interface MapComponentProps {
  apiKey: string;
  center: { lat: number; lng: number };
  zoom: number;
  markers?: MapMarker[];
}

const MapComponent: React.FC<MapComponentProps> = ({ apiKey, center, zoom, markers }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null);

  const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback(mapInstance: google.maps.Map) {
    setMap(null);
  }, []);

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setActiveMarker(marker);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setActiveMarker(null);
  }, []);

  if (loadError) return <div>Erro ao carregar o mapa. Verifique sua chave de API ou conexão.</div>;
  if (!isLoaded) return <div>Carregando Mapa...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }}
    >
      {markers && markers.map(marker => (
        <MarkerF
          key={marker.id}
          position={marker.position}
          onClick={() => handleMarkerClick(marker)}
        />
      ))}

      {activeMarker && activeMarker.infoContent && (
        <InfoWindowF
          position={activeMarker.position}
          onCloseClick={handleInfoWindowClose}
        >
          <div className="p-2 text-gray-900">
            {activeMarker.infoContent}
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
};

export default React.memo(MapComponent);