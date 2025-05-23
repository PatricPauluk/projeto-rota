import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MapComponent from '../MapComponent';

// Mock the Google Maps API
const mockUseJsApiLoader = jest.fn();
jest.mock('@react-google-maps/api', () => ({
  useJsApiLoader: () => mockUseJsApiLoader(),
  GoogleMap: ({ children }: { children: React.ReactNode }) => <div data-testid="google-map">{children}</div>,
  MarkerF: ({ onClick }: { onClick: () => void }) => (
    <div data-testid="marker" onClick={onClick}>Marker</div>
  ),
  InfoWindowF: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="info-window">{children}</div>
  ),
}));

describe('MapComponent', () => {
  const defaultProps = {
    apiKey: 'test-api-key',
    center: { lat: -23.550520, lng: -46.633308 },
    zoom: 12,
    markers: [
      {
        id: '1',
        position: { lat: -23.550520, lng: -46.633308 },
        infoContent: 'Test Location',
      },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when map is not loaded', () => {
    mockUseJsApiLoader.mockReturnValue({
      isLoaded: false,
      loadError: null,
    });
    render(<MapComponent {...defaultProps} />);
    expect(screen.getByText('Carregando Mapa...')).toBeInTheDocument();
  });

  it('renders error state when there is a load error', () => {
    mockUseJsApiLoader.mockReturnValue({
      isLoaded: true,
      loadError: new Error('API Error'),
    });
    render(<MapComponent {...defaultProps} />);
    expect(screen.getByText('Erro ao carregar o mapa. Verifique sua chave de API ou conexão.')).toBeInTheDocument();
  });

  it('renders map with markers when loaded successfully', () => {
    mockUseJsApiLoader.mockReturnValue({
      isLoaded: true,
      loadError: null,
    });
    render(<MapComponent {...defaultProps} />);
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
    expect(screen.getByTestId('marker')).toBeInTheDocument();
  });

  it('shows info window when marker is clicked', () => {
    mockUseJsApiLoader.mockReturnValue({
      isLoaded: true,
      loadError: null,
    });
    render(<MapComponent {...defaultProps} />);
    const marker = screen.getByTestId('marker');
    fireEvent.click(marker);
    expect(screen.getByTestId('info-window')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });
}); 