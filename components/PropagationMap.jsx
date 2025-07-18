// components/PropagationMap.jsx
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl =
  'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

export function PropagationMap() {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-2 text-white">Propagation Overlay</h3>
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: '#2d3748', outline: 'none' },
                  hover: { fill: '#4a5568', outline: 'none' },
                  pressed: { fill: '#2b6cb0', outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
