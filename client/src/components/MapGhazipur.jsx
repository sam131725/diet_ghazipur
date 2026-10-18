import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PLACES, DIET_LOCATION } from '../config.js';
import { useLang } from '../i18n.jsx';

const pin = (color, size) =>
  L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 1px 5px rgba(0,0,0,.45)"></div>`,
    iconSize: [size, size], iconAnchor: [size / 2, size], popupAnchor: [0, -size],
  });
const ICONS = { diet: pin('#d9730d', 34), tehsil: pin('#1b3a8a', 24), block: pin('#138808', 20) };
const LABEL = { diet: 'Institute', tehsil: 'Tehsil', block: 'Block' };

function FlyTo({ target }) {
  const map = useMap();
  if (target) map.flyTo([target.lat, target.lng], target.type === 'diet' ? 13 : 12, { duration: 1 });
  return null;
}

export default function MapGhazipur({ height = 480, list = true }) {
  const { t } = useLang();
  const [filter, setFilter] = useState('all');
  const [target, setTarget] = useState(null);
  const shown = PLACES.filter((p) => filter === 'all' || p.type === filter || p.type === 'diet');

  return (
    <div className={`mapbox ${list ? 'withlist' : ''}`}>
      {list && (
        <div className="maplist">
          <div className="chips">
            {[['all', 'All'], ['tehsil', 'Tehsils'], ['block', 'Blocks']].map(([k, l]) => (
              <button key={k} className={`chip ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>{t(l)}</button>
            ))}
          </div>
          <ul>
            {shown.map((p) => (
              <li key={p.name}>
                <button onClick={() => setTarget({ ...p })} className={target?.name === p.name ? 'on' : ''}>
                  <span className={`dot ${p.type}`} /> <b>{t(p.name)}</b><small>{t(LABEL[p.type])}</small>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <MapContainer center={[DIET_LOCATION.lat, DIET_LOCATION.lng]} zoom={10} scrollWheelZoom={false} style={{ height }}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Circle center={[DIET_LOCATION.lat, DIET_LOCATION.lng]} radius={25000} pathOptions={{ color: '#1b3a8a', fillOpacity: 0.04, weight: 1, dashArray: '4 6' }} />
        {shown.map((p) => (
          <Marker key={p.name} position={[p.lat, p.lng]} icon={ICONS[p.type]}>
            <Popup>
              <b>{t(p.name)}</b><br />{t(p.info)}<br />
              <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}>{t('Get directions')}</a>
            </Popup>
          </Marker>
        ))}
        <FlyTo target={target} />
      </MapContainer>
    </div>
  );
}
