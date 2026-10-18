import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { DIET_LOCATION } from '../config.js';

// Small non-interactive map for the footer; click opens the Contact page.
export default function MiniMap() {
  return (
    <Link to="/contact" className="minimap" aria-label="DIET Ghazipur location, open contact page">
      <MapContainer center={[DIET_LOCATION.lat, DIET_LOCATION.lng]} zoom={13} dragging={false} zoomControl={false}
        scrollWheelZoom={false} doubleClickZoom={false} touchZoom={false} keyboard={false} attributionControl={false}
        style={{ height: 120, width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CircleMarker center={[DIET_LOCATION.lat, DIET_LOCATION.lng]} radius={8} pathOptions={{ color: '#fff', weight: 3, fillColor: '#d9230f', fillOpacity: 1 }} />
      </MapContainer>
    </Link>
  );
}
