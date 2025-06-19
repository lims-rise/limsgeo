// components/GeoJsonLayer.jsx
import React from 'react';
import { GeoJSON, Popup } from 'react-leaflet';
import L from 'leaflet';
import SimpleInfoPopup from '../SimpleInfoPopup/SimpleInfoPopup'; // Impor komponen popup

const GeoJsonLayer = ({ items, style, icon }) => {
  // Jika tidak ada data, jangan render apapun
  if (!items || items.length === 0) {
    return null;
  }

  // Tentukan props untuk GeoJSON berdasarkan apakah 'icon' disediakan
  const geoJsonProps = {};

  if (style) {
    // Jika 'style' ada, gunakan untuk garis atau poligon
    geoJsonProps.style = style;
  } else if (icon) {
    // Jika 'icon' ada, gunakan untuk membuat marker titik
    geoJsonProps.pointToLayer = (feature, latlng) => {
      return L.marker(latlng, { icon });
    };
  }

  return (
    <>
      {items.map(({ geoJsonData, gid, township, id }) => (
        <GeoJSON
          key={gid}
          data={geoJsonData}
          {...geoJsonProps}
        >
          {/* Gunakan komponen <Popup> dari react-leaflet.
            Ini jauh lebih baik daripada layer.on({ mouseover, ... })
          */}
          <Popup>
            <SimpleInfoPopup gid={gid} township={township} id={id} />
          </Popup>
        </GeoJSON>
      ))}
    </>
  );
};

export default GeoJsonLayer;