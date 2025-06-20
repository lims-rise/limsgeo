// components/BuildingLayer.jsx

// import React from 'react';
// import { GeoJSON, Popup, Tooltip } from 'react-leaflet';
// import BuildingInfoPopup from '../BuildingInfoPopup/BuildingInfoPopup'; // Impor komponen popup

// const BuildingLayer = ({ features, getColorByStatus }) => {
//   if (!features || features.length === 0) {
//     return null;
//   }

//   return (
//     <>
//       {features.map((feature) => {
//         // Ambil properti yang dibutuhkan dari setiap feature
//         const { geoJsonData, centroid, houseno, status, gid, id_map } = feature;

//         return (
//           <GeoJSON
//             key={`${gid}-${id_map}`} // Key yang unik dan stabil
//             data={geoJsonData}
//             style={() => ({
//               fillColor: getColorByStatus(status),
//               weight: 2, // Bug duplikat 'weight' diperbaiki, kita gunakan satu saja
//               opacity: 1,
//               color: 'white',
//               dashArray: '3',
//               fillOpacity: 1
//             })}
//           >
//             {/* Popup yang akan muncul saat di-klik */}
//             <Popup>
//               {/* Melewatkan seluruh objek 'feature' sebagai prop 'info' */}
//               <BuildingInfoPopup info={feature} />
//             </Popup>

//             {/* Tooltip yang selalu terlihat */}
//             <Tooltip
//               permanent
//               direction="center"
//               offset={[0, 0]}
//               className="custom-tooltip" // Anda bisa style ini di CSS global jika perlu
//               position={centroid}
//             >
//               {houseno}
//             </Tooltip>
//           </GeoJSON>
//         );
//       })}
//     </>
//   );
// };

// export default BuildingLayer;

// components/BuildingLayer.jsx

// import React, { useState } from 'react'; // useState untuk fitur highlight (opsional)
// import { GeoJSON, Popup, Tooltip, useMap } from 'react-leaflet'; // <-- 1. IMPORT useMap DI SINI
// import BuildingInfoPopup from '../BuildingInfoPopup/BuildingInfoPopup'; // Impor komponen popup

// const BuildingLayer = ({ features, getColorByStatus }) => {
//   const map = useMap(); // <-- 2. PANGGIL useMap UNTUK MENDAPATKAN INSTANCE PETA
//   const [hoveredGid, setHoveredGid] = useState(null);

//   if (!features || features.length === 0) {
//     return null;
//   }

//   return (
//     <>
//       {features.map((feature) => {
//         // Ambil properti yang dibutuhkan dari setiap feature
//         const { geoJsonData, centroid, houseno, status, gid, id_map } = feature;

//         return (
//           <GeoJSON
//             key={`${gid}-${id_map}`}
//             data={geoJsonData}
//             style={() => ({
//               fillColor: getColorByStatus(status),
//               weight: hoveredGid === gid ? 4 : 2,
//               color: hoveredGid === gid ? '#FFD700' : 'white',
//               fillOpacity: 1,
//               opacity: 1,
//               dashArray: '3',
//             })}
//             // Handler untuk semua interaksi pada layer ini
//             eventHandlers={{
//               // Event saat mouse diarahkan ke poligon
//               mouseover: () => {
//                 setHoveredGid(gid);
//               },
//               // Event saat mouse meninggalkan poligon
//               mouseout: () => {
//                 setHoveredGid(null);
//               },
//               // Event saat poligon di-klik
//               click: (e) => {
//                 // Sekarang variabel 'map' sudah terdefinisi dan bisa digunakan
//                 map.flyToBounds(e.target.getBounds());
//               },
//             }}
//           >
//             <Popup>
//               <BuildingInfoPopup info={feature} />
//             </Popup>
//             <Tooltip
//               permanent
//               direction="center"
//               offset={[0, 0]}
//               className="custom-tooltip"
//               position={centroid}
//             >
//               {houseno}
//             </Tooltip>
//           </GeoJSON>
//         );
//       })}
//     </>
//   );
// };

// export default BuildingLayer;

import React, { useState } from 'react';
import { GeoJSON, Popup, Tooltip, useMap } from 'react-leaflet';
import BuildingInfoPopup from '../BuildingInfoPopup/BuildingInfoPopup';

const BuildingLayer = ({ features, getColorByStatus }) => {
  const map = useMap();
  const [hoveredGid, setHoveredGid] = useState(null);

  if (!features || features.length === 0) {
    return null;
  }

  return (
    <>
      {features.map((feature) => {
        const { geoJsonData, centroid, houseno, status, gid, id_map } = feature;

        return (
          <GeoJSON
            key={`${gid}-${id_map}`}
            data={geoJsonData}
            // --- BAGIAN YANG DI-IMPROVE ADA DI SINI ---
            style={() => {
              const isHovered = hoveredGid === gid;
              // Kondisi baru: Apakah ada item lain yang sedang di-hover?
              const isAnotherHovered = hoveredGid !== null && !isHovered;

              if (isHovered) {
                // Style saat item ini di-hover (paling menonjol)
                return {
                  fillColor: getColorByStatus(status),
                  weight: 4,
                  color: '#FFD700', // Emas atau warna highlight cerah lainnya
                  fillOpacity: 1,
                  opacity: 1,
                  dashArray: '',
                };
              } else if (isAnotherHovered) {
                // Style saat item LAIN di-hover (efek pudar/tidak aktif)
                return {
                  fillColor: getColorByStatus(status),
                  weight: 1,
                  color: 'white', // Warna abu-abu pudar untuk garis batas
                  fillOpacity: 0.5, // Opasitas isi poligon dikurangi
                  opacity: 1,     // Opasitas keseluruhan poligon dikurangi
                  dashArray: '3',
                };
              } else {
                // Style default saat tidak ada yang di-hover
                return {
                  fillColor: getColorByStatus(status),
                  weight: 1.5,
                  color: 'white',
                  fillOpacity: 1,
                  opacity: 1,
                  dashArray: '1',
                };
              }
            }}
            eventHandlers={{
              mouseover: () => {
                setHoveredGid(gid);
              },
              mouseout: () => {
                setHoveredGid(null);
              },
            //   click: (e) => {
            //     map.flyToBounds(e.target.getBounds());
            //   },
            }}
          >
            <Popup>
              <BuildingInfoPopup info={feature} />
            </Popup>
            <Tooltip
              permanent
              direction="center"
              offset={[0, 0]}
              className="custom-tooltip"
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