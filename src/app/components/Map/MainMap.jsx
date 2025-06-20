"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Tooltip } from "react-leaflet";
import styled from 'styled-components';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import proj4 from "proj4";
import EquipmentPopup from "../EquipmentPopup/EquipmentPopup";
import GeoJsonLayer from "../GeoJsonLayer/GeoJsonLayer";
import BuildingLayer from "../BuildingLayer/BuildingLayer";

// Styling untuk overlay blur
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.4); /* Latar belakang putih transparan */
  backdrop-filter: blur(5px); /* Efek blur */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Menempatkan overlay di atas semua elemen lain */
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3; /* Warna latar belakang spinner */
  border-top: 4px solid #0FB3BA; /* Warna spinner */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Buat ikon kustom
const inhouseIcon = new L.Icon({
  iconUrl: '/icons/inhouse.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const soilIcon = new L.Icon({
  iconUrl: '/icons/soil.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const waterIcon = new L.Icon({
  iconUrl: '/icons/water.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const wellIcon = new L.Icon({
  iconUrl: '/icons/well.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const thermochronIcon = new L.Icon({
  iconUrl: '/icons/thermochron.png',
  iconSize: [20, 40],
  iconAnchor: [10, 40],
  popupAnchor: [0, -40],
});

const hygrochronIcon = new L.Icon({
  iconUrl: '/icons/hygrochron.png',
  iconSize: [20, 40],
  iconAnchor: [10, 40],
  popupAnchor: [0, -40],
});

const raingaugeIcon = new L.Icon({
  iconUrl: '/icons/raingauge.png',
  iconSize: [35, 35],
  iconAnchor: [17.5, 35],
  popupAnchor: [0, -35],
});

const hoboIcon = new L.Icon({
  iconUrl: '/icons/hobo.png',
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
});

const acousticIcon = new L.Icon({
  iconUrl: '/icons/wildlife.png',
  iconSize: [42, 32],
  iconAnchor: [21, 32],
  popupAnchor: [0, -32],
});

const defaultIcon = new L.Icon({
  iconUrl: '/icons/well.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});



const MainMap = ({ selectedCampaign, selectedCountry, selectedSettlement, selectedStatus, selectedObjective }) => {
    const [data, setData] = useState([]);
    const [boundaryData, setBoundaryData] = useState([]);
    const [roadAccessData, setRoadAccessData] = useState([]);
    const [bootsockData, setBootsockData] = useState([]);
    const [inhousewaterData, setInhousewaterData] = useState([]);
    const [soilData, setSoilData] = useState([]);
    const [waterData, setWaterData] = useState([]);
    const [wellData, setWellData] = useState([]);
    const [equipmentData, setEquipmentData] = useState([]);
    const [center, setCenter] = useState([-5.7535389, 157.0943453]);
    const [zoom, setZoom] = useState(4); // default zoom level
    const mapRef = useRef(null); // Reference to the map
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [geoJsonData, setGeoJsonData] = useState([]);
    const utmProjection = "EPSG:4326";

    console.log('selectedObjective', selectedObjective);
    console.log('equipmentData', equipmentData);
    console.log('data pusat', data);


    useEffect(() => {
        console.log('datanya peta', selectedCountry)
        if (selectedCountry) {
            setCenter([selectedCountry?.lat, selectedCountry?.long]); // Set center based on selected country
            setZoom(selectedCountry?.zoom); // Set zoom based on selected country
        }
    }, [selectedCountry]); // Re-run when selectedCountry changes

    useEffect(() => {
      if (selectedSettlement) {
        setCenter([selectedSettlement?.lat, selectedSettlement?.long]); // Set center based on selected country
        setZoom(selectedSettlement?.zoom); // Set zoom based on selected country
      }
    }, [selectedSettlement]); // Re-run when selectedCountry changes


      // Update the map view with smooth animation when center or zoom changes using flyTo
    useEffect(() => {
      if (mapRef.current) {
        // Use flyTo for a smoother transition
        mapRef.current.flyTo(center, zoom, {
          animate: true,
          duration: 1.5, // Duration in seconds
        });
      }
    }, [center, zoom]); // Only run when center or zoom change


    const fetchDataFromAPI = async (url, queryParams, setData, setError) => {
      try {
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setData(data);
      } catch (error) {
        setError(error);
      }
    };
    
    const buildQueryParams = (selectedCampaign, selectedCountry, selectedObjective, selectedSettlement) => {
      const queryParams = new URLSearchParams();
      
      if (selectedCampaign?.length > 0) {
        queryParams.append('campaign', selectedCampaign.join(','));
      }
      
      if (selectedCountry?.prefix) {
        queryParams.append('country', selectedCountry?.prefix);
      }
      
      if (selectedObjective) {
        queryParams.append('objective', selectedObjective);
      }
      
      if (selectedSettlement) {
        queryParams.append('settlement', selectedSettlement?.settlement);
      }
    
      return queryParams;
    };

    const buildQueryParams1 = (country, settlement, campaign) => {
      const queryParams = new URLSearchParams();
      if (country && country.id_country) {
        queryParams.append('id_country', country.id_country);
      }
      if (settlement) {
        queryParams.append('settlement', settlement?.settlement);
      }
      if (campaign?.length > 0) {
        queryParams.append('campaign_e', campaign.join(','));
      }
      return queryParams;
    };

    useEffect(() => {
      setLoading(true); // Set loading state to true during data fetch
      const fetchData = async () => {
        if (!selectedCampaign || !selectedObjective || !selectedCountry || !selectedSettlement) {
          console.log("No campaign selected, skipping data fetch.");
          setLoading(false); // Stop loading if missing required data
          return;
        }
  
        try {
          // General query parameters for all APIs
          const queryParams = buildQueryParams(selectedCampaign, selectedCountry, selectedObjective, selectedSettlement);
          
          // URL endpoints
          const urls = {
            data: "./api/data",
            boundary: "./api/boundary",
            access: "./api/access"
          };
  
          // Fetch general data
          await fetchDataFromAPI(urls.data, queryParams, setData, setError);
          
          // Fetch boundary data
          const boundaryParams = new URLSearchParams();
          if (selectedCountry?.id_country) {
            boundaryParams.append('id_country', selectedCountry.id_country);
          }
          if (selectedSettlement) {
            boundaryParams.append('settlement', selectedSettlement?.settlement);
          }
          await fetchDataFromAPI(urls.boundary, boundaryParams, setBoundaryData, setError);
  
          // Fetch road access data
          const accessParams = new URLSearchParams();
          if (selectedCountry?.id_country) {
            accessParams.append('id_country', selectedCountry.id_country);
          }
          if (selectedSettlement) {
            accessParams.append('settlement', selectedSettlement?.settlement);
          }
          await fetchDataFromAPI(urls.access, accessParams, setRoadAccessData, setError);
  
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false); // Set loading state to false once data fetching is done
        }
      };
  
      fetchData();
    }, [selectedCampaign, selectedObjective, selectedCountry, selectedSettlement, setLoading, setError, setData, setBoundaryData, setRoadAccessData]);

    useEffect(() => {
      setLoading(true);
      // Reset data
      setEquipmentData([]);
      setInhousewaterData([]);
      setSoilData([]);
      setWaterData([]);
      setWellData([]);
      setBootsockData([]);
  
      // Return early if any required params are missing
      if (!selectedCampaign || !selectedObjective || !selectedCountry || !selectedSettlement) {
        setLoading(false);
        return;
      }
  
      const fetchObjectiveData = async () => {
        try {
          const queryParams = buildQueryParams1(selectedCountry, selectedSettlement, selectedCampaign);
  
          if (selectedObjective === 'objective_2a') {
            // Objective2a
            const urlObjective2a = "./api/equipmento2a";
            await fetchDataFromAPI(urlObjective2a, queryParams, setEquipmentData, setError);
          } else if (selectedObjective === 'objective_2b') {
            // Fetch data for all API endpoints related to 'objective_2b'
  
            const urls = [
              { url: "./api/bootsock", setData: setBootsockData },
              { url: "./api/inhousewater", setData: setInhousewaterData },
              { url: "./api/soil", setData: setSoilData },
              { url: "./api/water", setData: setWaterData },
              { url: "./api/well", setData: setWellData },
            ];
  
            for (const { url, setData } of urls) {
              await fetchDataFromAPI(url, queryParams, setData, setError);
            }
          }
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchObjectiveData();
    }, [selectedCampaign, selectedCountry, selectedObjective, selectedSettlement, setBootsockData, setEquipmentData, setError, setInhousewaterData, setLoading, setSoilData, setWaterData, setWellData]);
    

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const convertToEquipmentGeoJSON = (equipment) => {
      try {
          const geoJsonData = JSON.parse(equipment.geom);
          
          // Cek jika tipe geometrinya adalah Point
          if (geoJsonData.type === 'Point') {
              // Proses koordinat untuk Point
              const [longitude, latitude] = geoJsonData.coordinates;
              const convertedCoordinates = proj4(selectedCountry.utmprojection, [longitude, latitude]);
              geoJsonData.coordinates = convertedCoordinates;
          }

          return geoJsonData;

      } catch (error) {
          console.error('Error parsing equipment GeoJSON:', error, equipment.geom);
          return null;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const convertToGeoJSON = (item) => {
        try {
        const geoJsonData = JSON.parse(item.geom);
        if (geoJsonData.type === 'MultiPolygon') {
            geoJsonData.coordinates = geoJsonData.coordinates.map(polygon =>
            polygon.map(ring =>
                ring.map(coord => {
                const converted = proj4(selectedCountry.utmprojection, coord);
                return converted;
                })
            )
            );
        }
        return geoJsonData;
        } catch (error) {
        console.error('Error parsing GeoJSON:', error, item.geom);
        return null;
        }
    };

    // Fungsi untuk memetakan garis-garis batas (MultiLineString)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const convertToBoundaryGeoJSON = (boundary) => {
        try {
          const geoJsonData = JSON.parse(boundary.geom);
          if (geoJsonData.type === 'MultiLineString') {
            geoJsonData.coordinates = geoJsonData.coordinates.map(line =>
              line.map(coord => {
                const converted = proj4(selectedCountry.utmprojection, coord);
                return converted;
              })
            );
          }
          return geoJsonData;
        } catch (error) {
          console.error('Error parsing Boundary GeoJSON:', error, boundary.geom);
          return null;
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const convertToAccessGeoJSON = (access) => {
        try {
            const geoJsonData = JSON.parse(access.geom);
            if (geoJsonData.type === 'MultiLineString') {
                geoJsonData.coordinates = geoJsonData.coordinates.map(line =>
                    line.map(coord => {
                        const converted = proj4(selectedCountry.utmprojection, coord);
                        return converted;
                    })
                ); 
            }
            return geoJsonData;
        } catch (error) {
            console.error('Error parsing Access GeoJSON:', error, access.geom);
            return null;
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const convertToBootsockGeoJSON = (bootsock) => {
      try {
          const geoJsonData = JSON.parse(bootsock.geom);
          if (geoJsonData.type === 'MultiLineString') {
              geoJsonData.coordinates = geoJsonData.coordinates.map(line =>
                  line.map(coord => {
                      const converted = proj4(selectedCountry.utmprojection, coord);
                      return converted;
                  })
              ); 
          }
          return geoJsonData;
      } catch (error) {
          console.error('Error parsing Bootsock GeoJSON:', error, bootsock.geom);
          return null;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const convertToInhousewaterGeoJSON = (inhousewater) => {
      try {
          const geoJsonData = JSON.parse(inhousewater.geom);
          
          // Cek jika tipe geometrinya adalah Point
          if (geoJsonData.type === 'Point') {
              // Proses koordinat untuk Point
              const [longitude, latitude] = geoJsonData.coordinates;
              const convertedCoordinates = proj4(selectedCountry.utmprojection, [longitude, latitude]);
              geoJsonData.coordinates = convertedCoordinates;
          }
          
          // Jika geom adalah MultiLineString, proses seperti sebelumnya
          else if (geoJsonData.type === 'MultiLineString') {
              geoJsonData.coordinates = geoJsonData.coordinates.map(line =>
                  line.map(coord => {
                      const converted = proj4(selectedCountry.utmprojection, coord);
                      return converted;
                  })
              );
          }

          return geoJsonData;

      } catch (error) {
          console.error('Error parsing Inhousewater GeoJSON:', error, inhousewater.geom);
          return null;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const convertToSoilGeoJSON = (soil) => {
      try {
          const geoJsonData = JSON.parse(soil.geom);
          
          // Cek jika tipe geometrinya adalah Point
          if (geoJsonData.type === 'Point') {
              // Proses koordinat untuk Point
              const [longitude, latitude] = geoJsonData.coordinates;
              const convertedCoordinates = proj4(selectedCountry.utmprojection, [longitude, latitude]);
              geoJsonData.coordinates = convertedCoordinates;
          }
          
          // Jika geom adalah MultiLineString, proses seperti sebelumnya
          else if (geoJsonData.type === 'MultiLineString') {
              geoJsonData.coordinates = geoJsonData.coordinates.map(line =>
                  line.map(coord => {
                      const converted = proj4(selectedCountry.utmprojection, coord);
                      return converted;
                  })
              );
          }

          return geoJsonData;

      } catch (error) {
          console.error('Error parsing soil GeoJSON:', error, soil.geom);
          return null;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const convertToWaterGeoJSON = (water) => {
      try {
          const geoJsonData = JSON.parse(water.geom);
          
          // Cek jika tipe geometrinya adalah Point
          if (geoJsonData.type === 'Point') {
              // Proses koordinat untuk Point
              const [longitude, latitude] = geoJsonData.coordinates;
              const convertedCoordinates = proj4(selectedCountry.utmprojection, [longitude, latitude]);
              geoJsonData.coordinates = convertedCoordinates;
          }
          
          // Jika geom adalah MultiLineString, proses seperti sebelumnya
          else if (geoJsonData.type === 'MultiLineString') {
              geoJsonData.coordinates = geoJsonData.coordinates.map(line =>
                  line.map(coord => {
                      const converted = proj4(selectedCountry.utmprojection, coord);
                      return converted;
                  })
              );
          }

          return geoJsonData;

      } catch (error) {
          console.error('Error parsing water GeoJSON:', error, water.geom);
          return null;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const convertToWellGeoJSON = (well) => {
      try {
          const geoJsonData = JSON.parse(well.geom);
          
          // Cek jika tipe geometrinya adalah Point
          if (geoJsonData.type === 'Point') {
              // Proses koordinat untuk Point
              const [longitude, latitude] = geoJsonData.coordinates;
              const convertedCoordinates = proj4(selectedCountry.utmprojection, [longitude, latitude]);
              geoJsonData.coordinates = convertedCoordinates;
          }
          
          // Jika geom adalah MultiLineString, proses seperti sebelumnya
          else if (geoJsonData.type === 'MultiLineString') {
              geoJsonData.coordinates = geoJsonData.coordinates.map(line =>
                  line.map(coord => {
                      const converted = proj4(selectedCountry.utmprojection, coord);
                      return converted;
                  })
              );
          }

          return geoJsonData;

      } catch (error) {
          console.error('Error parsing well GeoJSON:', error, well.geom);
          return null;
      }
    };

    

    const calculateCentroid = (coordinates) => {
        if (!coordinates || coordinates.length === 0) return [0, 0];
        const allPoints = coordinates.flat(3);
        const length = allPoints.length / 2;

        if (length === 0) return [0, 0];

        let xSum = 0;
        let ySum = 0;

        for (let i = 0; i < allPoints.length; i += 2) {
        const lng = allPoints[i];
        const lat = allPoints[i + 1];
        xSum += lng;
        ySum += lat;
        }

        return [ySum / length, xSum / length];
    };

    const getColorByStatus = (selectedStatus) => {
        switch (selectedStatus) {
        case 'Active':
            return '#92D050';
        case 'UnderConstruction':
            return '#BFBFBF';
        case 'Demolished':
            return '#FF5050';
        case 'Vacant':
            return '#FFD966';
        case 'RunDown':
            return '#997C70';
        case 'RiseHouse':
            return '#A294F9';
        case 'Replace':
              return '#F29F58';
        default:
            return '#FFD966';
        }
    };

 const geoJsonFeatures = useMemo(() => {
      return data
        .filter((item) => {
          // Filter berdasarkan status
          if (selectedStatus && selectedStatus !== "all") {
            return item.status === selectedStatus;
          }
          return true; // Jika "All" dipilih atau tidak ada filter status, tampilkan semua data
        })
        .filter((item) => {
          if (selectedCampaign && !selectedCampaign.includes(item.campaign)) {
            return true; // Hanya tampilkan data yang campaign-nya sesuai
          }
        })
        .map((item) => {
          if (item.geom) {
            const geoJsonData = convertToGeoJSON(item);
            const centroid = calculateCentroid(geoJsonData.coordinates);
            return {
              geoJsonData,
              centroid,
              gid: item.gid,
              id_map: item.id_map,
              id_building: item.id_building,
              hoid: item.hoid,
              houseno: item.houseno,
              settlement: item.settlement,
              status: item.status,
              structure: item.structure,
              country: item.country,
              campaign: item.campaign,
              connected: item.connected,
              note: item.note,
              geom: item.geom,
            };
          }
          return null;
        })
        .filter(item => item !== null);
    }, [data, selectedStatus, selectedCampaign, convertToGeoJSON]);
    
    const boundaryGeoJson = useMemo(() => {
        return boundaryData.map((boundary) => {
        if (boundary.geom) {
            const geoJsonData = convertToBoundaryGeoJSON(boundary);
            return {
            geoJsonData,
            gid: boundary.gid,
            township: boundary.name,
            };
        }
        return null;
        }).filter(boundary => boundary !== null);
    }, [boundaryData, convertToBoundaryGeoJSON]);

    const accessGeoJson = useMemo(() => {
        return roadAccessData.map((access) => {
        if (access.geom) {
            const geoJsonData = convertToAccessGeoJSON(access);
            return {
            geoJsonData,
            gid: access.gid,
            township: access.fid_,
            };
        }
        return null;
        }).filter(access => access !== null);
    }, [convertToAccessGeoJSON, roadAccessData]);

    const bootscokGeoJson = useMemo(() => {
      return bootsockData.map((bootsock) => {
      if (bootsock.geom) {
          const geoJsonData = convertToBootsockGeoJSON(bootsock);
          return {
          geoJsonData,
          gid: bootsock.gid,
          township: bootsock.township,
          };
      }
      return null;
      }).filter(bootsock => bootsock !== null);
  }, [bootsockData, convertToBootsockGeoJSON]);

  const inhousewaterGeoJson = useMemo(() => {
    return inhousewaterData.map((inhousewater) => {
    if (inhousewater.geom) {
        const geoJsonData = convertToInhousewaterGeoJSON(inhousewater);
        return {
        geoJsonData,
        gid: inhousewater.gid,
        township: inhousewater.township,
        };
    }
    return null;
    }).filter(inhousewater => inhousewater !== null);
  }, [convertToInhousewaterGeoJSON, inhousewaterData]);

  const soilGeoJson = useMemo(() => {
    return soilData.map((soil) => {
      if (soil.geom) {
        const geoJsonData = convertToSoilGeoJSON(soil);
        return {
          geoJsonData,
          gid: soil.gid,
          township: soil.township,
        };
      }
      return null;
    }).filter(soil => soil !== null);
  }, [convertToSoilGeoJSON, soilData]);

  const waterGeoJson = useMemo(() => {
    return waterData.map((water) => {
      if (water.geom) {
        const geoJsonData = convertToWaterGeoJSON(water);
        return {
          geoJsonData,
          gid: water.gid,
          id: water.id,
          township: water.township,
        };
      }
      return null;
    }).filter(water => water !== null);
  }, [convertToWaterGeoJSON, waterData]);

  const wellGeoJson = useMemo(() => {
    return wellData.map((well) => {
      if (well.geom) {
        const geoJsonData = convertToWellGeoJSON(well);
        return {
          geoJsonData,
          gid: well.gid,
          id: well.id,
          township: well.township,
        };
      }
      return null;
    }).filter(well => well !== null);
  }, [convertToWellGeoJSON, wellData]);

  // const equipmentGeoJson = useMemo(() => {
  //   return equipmentData.map((equipment) => {
  //     if (equipment.geom) {
  //       const geoJsonData = convertToEquipmentGeoJSON(equipment);
  //       return {
  //         geoJsonData,
  //         gid: equipment.gid,
  //         name: equipment.name,
  //         pointid: equipment.pointid,
  //         activedate: equipment.activedate,
  //         inactiveda: equipment.inactiveda,
  //         campaign_s: equipment.campaign_s,
  //         campaign_e: equipment.campaign_e,
  //         equipment_ : equipment.equipment_,
  //         barcode : equipment.barcode,
  //         notes : equipment.notes,

  //       };
  //     }
  //     return null;
  //   }).filter(equipment => equipment !== null);
  // }, [convertToEquipmentGeoJSON, equipmentData]);
  const groupedEquipmentByCoord = useMemo(() => {
    const geoJsonList = equipmentData.map((equipment) => {
      if (equipment.geom) {
        const geoJsonData = convertToEquipmentGeoJSON(equipment);
        return {
          geoJsonData,
          gid: equipment.gid,
          name: equipment.name,
          pointid: equipment.pointid,
          activedate: equipment.activedate,
          inactiveda: equipment.inactiveda,
          campaign_s: equipment.campaign_s,
          campaign_e: equipment.campaign_e,
          equipment_: equipment.equipment_,
          barcode: equipment.barcode,
          notes: equipment.notes,
        };
      }
      return null;
    }).filter(item => item !== null);
  
    // 🔁 Group berdasarkan koordinat
    const grouped = {};
    geoJsonList.forEach(item => {
      const coordinates = item.geoJsonData.coordinates;
      const key = `${coordinates[1].toFixed(6)},${coordinates[0].toFixed(6)}`; // lat, lng
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });
  
    return grouped;
  }, [convertToEquipmentGeoJSON, equipmentData]); // atau tambahkan convertToEquipmentGeoJSON jika tidak inline
  

    console.log('data center', center);
    console.log('data zoom', zoom);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
          {loading && (
        <Overlay>
        <Spinner />
      </Overlay>
          )}
          <MapContainer
          // center={[-5.1476, 119.4325]} // Koordinat Makassar
          ref={mapRef} // Attach the map reference
          center={center} // Initial center will be set by setView() if updated
          zoom={zoom} // Initial zoom will be set by setView() if updated
          scrollWheelZoom={true}
          style={{ height: '100vh' }}
          // onViewportChanged={handleViewportChange} // Menangani perubahan pada viewport
        >
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com">Esri</a> contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />

          <BuildingLayer
              features={geoJsonFeatures}
              getColorByStatus={getColorByStatus}
          />
          
          {/* Menampilkan MultiLineString */}
          {/* {boundaryGeoJson.map(({ geoJsonData, gid, name }) => (
              <React.Fragment key={gid}>
                      <GeoJSON
                      data={geoJsonData}
                      style={() => ({
                          color: '#FF6347',  // Garis berwarna tomato
                          weight: 3,
                          opacity: 1,
                      })}
                      onEachFeature={(feature, layer) => {
                          layer.on({
                          mouseover: () => {
                              layer.bindPopup(`
                              <h3>${name}</h3>
                              <ul>
                                  <li>GID: ${gid}</li>
                              </ul>
                              `).openPopup();
                          },
                          mouseout: () => {
                              layer.closePopup();
                          }
                          });
                      }}
                  />
              </React.Fragment>
          ))} */}

          {/* Menampilkan MultiLineString */}
          {/* {accessGeoJson.map(({ geoJsonData, gid, fid_ }) => (
              <React.Fragment key={gid}>
                  <GeoJSON
                      data={geoJsonData}
                      style={() => ({
                          color: '#006BFF',  // Garis berwarna tomato
                          weight: 3,
                          opacity: 1,
                      })}
                      onEachFeature={(feature, layer) => {
                          layer.on({
                          mouseover: () => {
                              layer.bindPopup(`
                              <h3>GID: ${gid}</h3>
                              <ul>
                                  <li>FID: ${fid_}</li>
                              </ul>
                              `).openPopup();
                          },
                          mouseout: () => {
                              layer.closePopup();
                          } 
                          });
                      }}              
                  />
              </React.Fragment>
          ))} */}

          {/* Menampilkan MultiLineString */}
          {/* {bootscokGeoJson.map(({ geoJsonData, gid, township }) => (
              <React.Fragment key={gid}>
                  <GeoJSON
                      data={geoJsonData}
                      style={() => ({
                          color: '#FF067F',  // Garis berwarna tomato
                          weight: 3,
                          opacity: 1,
                      })}
                      onEachFeature={(feature, layer) => {
                          layer.on({
                          mouseover: () => {
                              layer.bindPopup(`
                              <h3>GID: ${gid}</h3>
                              <ul>
                                  <li>TOWNSHIP: ${township}</li>
                              </ul>
                              `).openPopup();
                          },
                          mouseout: () => {
                              layer.closePopup();
                          } 
                          });
                      }}              
                  />
              </React.Fragment>
          ))} */}

          {/* Menampilkan Point */}
          {/* {inhousewaterGeoJson.map(({ geoJsonData, gid, township }) => (
              <React.Fragment key={gid}>
                  <GeoJSON
                      data={geoJsonData}
                      pointToLayer={(feature, latlng) => {
                          // Menggunakan ikon kustom untuk titik
                          return L.marker(latlng, { icon: inhouseIcon });
                      }}
                      onEachFeature={(feature, layer) => {
                          layer.on({
                              mouseover: () => {
                                  layer.bindPopup(`
                                      <h3>GID: ${gid}</h3>
                                      <ul>
                                          <li>TOWNSHIP: ${township}</li>
                                      </ul>
                                  `).openPopup();
                              },
                              mouseout: () => {
                                  layer.closePopup();
                              }
                          });
                      }}
                  />
              </React.Fragment>
          ))} */}

          {/* Menampilkan Point */}
          {/* {soilGeoJson.map(({geoJsonData, gid, township}) => (
            <React.Fragment key={gid}>
              <GeoJSON
                data={geoJsonData}
                pointToLayer={(feature, latlng) => {
                  return L.marker(latlng, { icon: soilIcon});
                }}
                onEachFeature={(feature, layer) => {
                  layer.on({
                    mousemove: () => {
                      layer.bindPopup(`
                          <h3>GID: ${gid}</h3>
                          <ul>
                            <li>TOWNSHIP: ${township}</li>
                          </ul>
                        `).openPopup();
                    },
                    mouseout: () => {
                      layer.closePopup();
                    }
                  });
                }}
              />
            </React.Fragment>
          ))} */}

          {/* Menampilkan Point */}
          {/* {waterGeoJson.map(({geoJsonData, gid, id, township}) => (
            <React.Fragment key={gid}>
              <GeoJSON
                data={geoJsonData}
                pointToLayer={(feature, latlng) => {
                  return L.marker(latlng, { icon: waterIcon});
                }}
                onEachFeature={(feature, layer) => {
                  layer.on({
                    mousemove: () => {
                      layer.bindPopup(`
                          <h3>GID: ${gid}</h3>
                          <h3>ID: ${id}</h3>
                          <ul>
                            <li>TOWNSHIP: ${township}</li>
                          </ul>
                        `).openPopup();
                    },
                    mouseout: () => {
                      layer.closePopup();
                    }
                  });
                }}
              />
            </React.Fragment>
          ))} */}

          {/* Menampilkan Point */}
          {/* {wellGeoJson.map(({geoJsonData, gid, id, township}) => (
            <React.Fragment key={gid}>
              <GeoJSON
                data={geoJsonData}
                pointToLayer={(feature, latlng) => {
                  return L.marker(latlng, { icon: wellIcon});
                }}
                onEachFeature={(feature, layer) => {
                  layer.on({
                    mousemove: () => {
                      layer.bindPopup(`
                          <h3>GID: ${gid}</h3>
                          <h3>ID: ${id}</h3>
                          <ul>
                            <li>TOWNSHIP: ${township}</li>
                          </ul>
                        `).openPopup();
                    },
                    mouseout: () => {
                      layer.closePopup();
                    }
                  });
                }}
              />
            </React.Fragment>
          ))} */}

          {/* 1. Menampilkan MultiLineString Bootscok */}
          <GeoJsonLayer
            items={boundaryGeoJson}
            style={() => ({
              color: '#FF6347',
              weight: 3,
              opacity: 1,
            })}
          />

          <GeoJsonLayer
            items={accessGeoJson}
            style={() => ({
              color: '#006BFF',
              weight: 3,
              opacity: 1,
            })}
          />

          <GeoJsonLayer
            items={bootscokGeoJson}
            style={() => ({
              color: '#FF067F',
              weight: 3,
              opacity: 1,
            })}
          />

          {/* 2. Menampilkan Point Inhouse Water */}
          <GeoJsonLayer items={inhousewaterGeoJson} icon={inhouseIcon} />

          {/* 3. Menampilkan Point Soil */}
          <GeoJsonLayer items={soilGeoJson} icon={soilIcon} />

          {/* 4. Menampilkan Point Water */}
          <GeoJsonLayer items={waterGeoJson} icon={waterIcon} />

          {/* 5. Menampilkan Point Well */}
          <GeoJsonLayer items={wellGeoJson} icon={wellIcon} />

          {/* Menampilkan Point */}
          {/* {equipmentGeoJson.map(({geoJsonData, gid, name, pointid, equipment_, barcode, inactiveda, activedate, campaign_e, campaign_s, notes}) => (
            <React.Fragment key={gid}>
              <GeoJSON
                data={geoJsonData}
                pointToLayer={(feature, latlng) => {
                  // Tentukan ikon berdasarkan nilai 'equipment_'
                  let icon;
                  if (equipment_ === 'Hygrochron') {
                    icon = hygrochronIcon;
                  } else if (equipment_ === 'Thermochron') {
                    icon = thermochronIcon;
                  } else if (equipment_ === 'Rain gauge') {
                    icon = raingaugeIcon;
                  } else if (equipment_ === 'HOBO') {
                    icon = hoboIcon;
                  } else if (equipment_ === 'Acoustic') {
                    icon = acousticIcon;
                  } else if (equipment_ === 'Ultrasonic') {
                    icon = acousticIcon;
                  } else {
                    icon = defaultIcon;  // Ganti dengan ikon default jika diperlukan
                  }

                  return L.marker(latlng, { icon });
                }}
                onEachFeature={(feature, layer) => {
                  layer.on({
                    mousemove: () => {
                      layer.bindPopup(`
                        <ul>
                          <li><strong>GID:</strong> ${gid}</li>
                          <li><strong>POINTID:</strong> ${pointid}</li>
                          <li><strong>BARCODE:</strong> ${barcode}</li>
                          <li><strong>NAME:</strong> ${name}</li>
                          <li><strong>EQUIPMENT:</strong> ${equipment_}</li>
                          <li><strong>NOTES:</strong> ${notes}</li>
                          <li><strong>ACTIVE DATE:</strong> ${activedate}</li>
                          <li><strong>INACTIVE DATE:</strong> ${inactiveda}</li>
                          <li><strong>CAMPAIGN START:</strong> ${campaign_s}</li>
                          <li><strong>CAMPAIGN END:</strong> ${campaign_e}</li>
                        </ul>
                      `).openPopup();
                    },
                    mouseout: () => {
                      layer.closePopup();
                    }
                  });
                }}
              />
            </React.Fragment>
          ))} */}
          {/* {Object.entries(groupedEquipmentByCoord).map(([coordKey, equipments], index) => {
            const [lat, lng] = coordKey.split(',').map(Number);
            const firstEquipment = equipments[0];

            let icon;
            switch (firstEquipment.equipment_) {
              case 'Hygrochron': icon = hygrochronIcon; break;
              case 'Thermochron': icon = thermochronIcon; break;
              case 'Rain gauge': icon = raingaugeIcon; break;
              case 'HOBO': icon = hoboIcon; break;
              case 'Acoustic':
              case 'Ultrasonic': icon = acousticIcon; break;
              default: icon = defaultIcon;
            }

            const popupContent = equipments.map(eq => `
              <ul style="margin-bottom:8px; padding:8px;">
                <li><strong>GID:</strong> ${eq.gid}</li>
                <li><strong>POINTID:</strong> ${eq.pointid}</li>
                <li><strong>BARCODE:</strong> ${eq.barcode}</li>
                <li><strong>NAME:</strong> ${eq.name}</li>
                <li><strong>EQUIPMENT:</strong> ${eq.equipment_}</li>
                <li><strong>NOTES:</strong> ${eq.notes}</li>
                <li><strong>ACTIVE DATE:</strong> ${eq.activedate}</li>
                <li><strong>INACTIVE DATE:</strong> ${eq.inactiveda}</li>
                <li><strong>CAMPAIGN START:</strong> ${eq.campaign_s}</li>
                <li><strong>CAMPAIGN END:</strong> ${eq.campaign_e}</li>
              </ul>
              <hr/>
            `).join('');

            return (
              <GeoJSON
                key={index}
                data={{
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [lng, lat]
                  }
                }}
                pointToLayer={(_, latlng) => L.marker(latlng, { icon })}
                onEachFeature={(_, layer) => {
                  // layer.bindPopup(popupContent);
                  layer.on({
                    mousemove: () => {
                      layer.bindPopup(popupContent).openPopup();
                    },
                    mouseout: () => {
                      layer.closePopup();
                    }
                  });
                }}
              />
            );
          })} */}
          {Object.entries(groupedEquipmentByCoord).map(([coordKey, equipments]) => {
            const [lat, lng] = coordKey.split(',').map(Number);
            const firstEquipment = equipments[0];

            let icon;
            // ... (logika switch case Anda untuk icon tetap sama)
            switch (firstEquipment.equipment_) {
              case 'Hygrochron': icon = hygrochronIcon; break;
              case 'Thermochron': icon = thermochronIcon; break;
              case 'Rain gauge': icon = raingaugeIcon; break;
              case 'HOBO': icon = hoboIcon; break;
              case 'Acoustic':
              case 'Ultrasonic': icon = acousticIcon; break;
              default: icon = defaultIcon;
            }

            return (
              <GeoJSON
                key={coordKey} // Gunakan coordKey yang unik sebagai key
                data={{
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [lng, lat]
                  }
                }}
                pointToLayer={(_, latlng) => L.marker(latlng, { icon })}
              >
                {/* Gunakan komponen Popup dari react-leaflet */}
                <Popup>
                  {/* Render komponen custom Anda di sini */}
                  <EquipmentPopup equipments={equipments} />
                </Popup>
              </GeoJSON>
            );
          })}
        </MapContainer>
    </div>
    );

};

export default MainMap;