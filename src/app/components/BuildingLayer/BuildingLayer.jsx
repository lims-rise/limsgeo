// components/BuildingLayer.jsx

import React from 'react';
import { GeoJSON, Popup, Tooltip } from 'react-leaflet';
import BuildingInfoPopup from '../BuildingInfoPopup/BuildingInfoPopup'; // Impor komponen popup

const BuildingLayer = ({ features, getColorByStatus }) => {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <>
      {features.map((feature) => {
        // Ambil properti yang dibutuhkan dari setiap feature
        const { geoJsonData, centroid, houseno, status, gid, id_map } = feature;

        return (
          <GeoJSON
            key={`${gid}-${id_map}`} // Key yang unik dan stabil
            data={geoJsonData}
            style={() => ({
              fillColor: getColorByStatus(status),
              weight: 2, // Bug duplikat 'weight' diperbaiki, kita gunakan satu saja
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 1
            })}
          >
            {/* Popup yang akan muncul saat di-klik */}
            <Popup>
              {/* Melewatkan seluruh objek 'feature' sebagai prop 'info' */}
              <BuildingInfoPopup info={feature} />
            </Popup>

            {/* Tooltip yang selalu terlihat */}
            <Tooltip
              permanent
              direction="center"
              offset={[0, 0]}
              className="custom-tooltip" // Anda bisa style ini di CSS global jika perlu
              position={centroid}
            >
              {houseno}
            </Tooltip>
          </GeoJSON>
        );
      })}
    </>
  );
};

export default BuildingLayer;