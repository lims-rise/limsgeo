"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Tooltip } from "react-leaflet";
import styled from 'styled-components';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import proj4 from "proj4";

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
  iconUrl: '/icons/inhouse.png', // Path relatif ke public/ // Ganti dengan path ke gambar atau ikon Anda
  iconSize: [32, 32], // Ukuran ikon (lebar, tinggi)
  iconAnchor: [16, 32], // Titik anchor (tempat marker akan ditempatkan di peta)
  popupAnchor: [0, -32], // Titik popup terkait dengan ikon (jarak dari ikon)
});

const soilIcon = new L.Icon({
  iconUrl: '/icons/soil.png', // Path relatif ke public/ // Ganti dengan path ke gambar atau ikon Anda
  iconSize: [32, 32], // Ukuran ikon (lebar, tinggi)
  iconAnchor: [16, 32], // Titik anchor (tempat marker akan ditempatkan di peta)
  popupAnchor: [0, -32], // Titik popup terkait dengan ikon (jarak dari ikon)
});

const waterIcon = new L.Icon({
  iconUrl: '/icons/water.png', // Path relatif ke public/ // Ganti dengan path ke gambar atau ikon Anda
  iconSize: [32, 32], // Ukuran ikon (lebar, tinggi)
  iconAnchor: [16, 32], // Titik anchor (tempat marker akan ditempatkan di peta)
  popupAnchor: [0, -32], // Titik popup terkait dengan ikon (jarak dari ikon)
});

const wellIcon = new L.Icon({
  iconUrl: '/icons/well.png', // Path relatif ke public/ // Ganti dengan path ke gambar atau ikon Anda
  iconSize: [32, 32], // Ukuran ikon (lebar, tinggi)
  iconAnchor: [16, 32], // Titik anchor (tempat marker akan ditempatkan di peta)
  popupAnchor: [0, -32], // Titik popup terkait dengan ikon (jarak dari ikon)
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
    const [center, setCenter] = useState([-5.7535389, 157.0943453]);
    const [zoom, setZoom] = useState(4); // default zoom level
    const mapRef = useRef(null); // Reference to the map
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [geoJsonData, setGeoJsonData] = useState([]);
    const utmProjection = "EPSG:4326";

    console.log('selectedObjective', selectedObjective);

    useEffect(() => {
        console.log('datanya peta', selectedCountry)
        if (selectedCountry) {
            setCenter([selectedCountry.lat, selectedCountry.long]); // Set center based on selected country
            setZoom(selectedCountry.zoom); // Set zoom based on selected country
        }
    }, [selectedCountry]); // Re-run when selectedCountry changes

    useEffect(() => {
      if (selectedSettlement) {
        setCenter([selectedSettlement.lat, selectedSettlement.long]); // Set center based on selected country
        setZoom(selectedSettlement.zoom); // Set zoom based on selected country
      }
    }, [selectedSettlement]); // Re-run when selectedCountry changes

    // useEffect(() => {
    //     if (mapRef.current) {
    //         // If the map has been initialized, update the center and zoom
    //         mapRef.current.setView(center, zoom); // Move the map to the new center and zoom level
    //     }
    // }, [center, zoom]); // Update map view when center or zoom changes

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

  //   useEffect(() => {
  //     const fetchData = async () => {
  //         if (!selectedCampaign || selectedCampaign.length === 0) {
  //             console.log("No campaign selected, skipping data fetch.");
  //             return; // Jika tidak ada kampanye yang dipilih, hentikan proses fetch
  //         }
          
  //         try {
  //             // Membangun URL dengan parameter filter campaign
  //             let url = "./api/data";
              
  //             // Menambahkan filter kampanye ke URL
  //             if (selectedCampaign.length > 0) {
  //                 url += `?campaign=${selectedCampaign.join(',')}`; // Mengirimkan daftar kampanye yang dipilih
  //             }
  
  //             // Mengambil data dari API untuk geojson data (peta bangunan)
  //             const res = await fetch(url);
  //             if (!res.ok) {
  //                 throw new Error(`HTTP error! status: ${res.status}`);
  //             }
  //             const data = await res.json();
  //             setData(data);
  
  //             // Ambil data boundary (MultiLineString) dari API tambahan
  //             const boundaryRes = await fetch("./api/boundary");
  //             if (!boundaryRes.ok) {
  //                 throw new Error(`HTTP error! status: ${boundaryRes.status}`);
  //             }
  //             const boundaryData = await boundaryRes.json();
  //             setBoundaryData(boundaryData);
  
  //             // Ambil data road_access (MultiLineString) dari API tambahan
  //             const roadAccess = await fetch("./api/access");
  //             if (!roadAccess.ok) {
  //                 throw new Error(`HTTP error! status: ${roadAccess.status}`);
  //             }
  //             const roadAccessData = await roadAccess.json();
  //             setRoadAccessData(roadAccessData);

  //             // // Ambil data bootsock (MultiLineString) dari API tambahan
  //             // const bootsock = await fetch("./api/bootsock");
  //             // if (!bootsock.ok) {
  //             //   throw new Error(`HTTP error! status: ${bootsock.status}`);
  //             // }
  //             // const bootsockData = await bootsock.json();
  //             // setBootsockData(bootsockData);
  
  //         } catch (error) {
  //             setError(error);
  //         }
  //     };
  
  //     fetchData(); // Ambil data setiap kali selectedCampaign berubah
  // }, [selectedCampaign]);

      // Fetch bootsock data based on selectedObjective
      
      useEffect(() => {
        const fetchData = async () => {
          if (!selectedCampaign || selectedCampaign.length === 0) {
            console.log("No campaign selected, skipping data fetch.");
            return; // Jika tidak ada kampanye yang dipilih, hentikan proses fetch
          }
          
          try {
            let url = "./api/data";
            let urlBoundary = "./api/boundary";
            
            // Menambahkan filter kampanye dan negara ke URL jika ada
            const queryParams = new URLSearchParams();
            const queryParams1 = new URLSearchParams();
            
            // General Data
            if (selectedCampaign.length > 0) {
              queryParams.append('campaign', selectedCampaign.join(','));
            }
            
            if (selectedCountry && selectedCountry.prefix) {
              queryParams.append('country', selectedCountry.prefix);
            }
            
            if (queryParams.toString()) {
              url += `?${queryParams.toString()}`;
            }

            // Mengambil data dari API untuk geojson data (peta bangunan)
            const res = await fetch(url);
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setData(data);

            //Boundary
            if (selectedCountry && selectedCountry.id_country) {
              queryParams1.append('id_country', selectedCountry.id_country);
            }

            if (queryParams1.toString()) {
              urlBoundary += `?${queryParams1.toString()}`;
            }
        
            // Ambil data boundary (MultiLineString) dari API tambahan
            const boundaryRes = await fetch(urlBoundary);
            if (!boundaryRes.ok) {
              throw new Error(`HTTP error! status: ${boundaryRes.status}`);
            }
            const boundaryData = await boundaryRes.json();
            setBoundaryData(boundaryData);
            
        
            // Ambil data road_access (MultiLineString) dari API tambahan
            const roadAccessRes = await fetch("./api/access");
            if (!roadAccessRes.ok) {
              throw new Error(`HTTP error! status: ${roadAccessRes.status}`);
            }
            const roadAccessData = await roadAccessRes.json();
            setRoadAccessData(roadAccessData);
            
          } catch (error) {
            setError(error);
          }
        };
      
        fetchData(); // Ambil data setiap kali selectedCampaign atau selectedCountry berubah
      }, [selectedCampaign, selectedCountry]);
      
      
      useEffect(() => {
        const fetchBootsockData = async () => {
            if (!selectedObjective) return; // Don't fetch bootsock data if no objective selected

            if(selectedObjective === 'objective_2b'){
              try {
                const res = await fetch("./api/bootsock");
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const bootsockData = await res.json();
                setBootsockData(bootsockData);
                } catch (error) {
                    setError(error);
                }
              return
            }
        };

        const fetchInhousewaterData = async () => {
          if (!selectedObjective) return; // Don't fetch bootsock data if no objective selected

          if (selectedObjective === 'objective_2b') {
            try {
              const res = await fetch("./api/inhousewater");
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              const inhousewaterData = await res.json();
              setInhousewaterData(inhousewaterData);
              } catch (error) {
                  setError(error);
              }
            return
          }
        };

        const fetchSoidData = async () => {
          if (!selectedObjective) return;

          if (selectedObjective === 'objective_2b') {
            try {
              const res = await fetch("./api/soil");
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              const soilData = await res.json();
              setSoilData(soilData);
              } catch {
                setError(error);
              }
            return
          }
        };

        const fetchWaterData = async () => {
          if (!selectedObjective) return;

          if (selectedObjective === 'objective_2b') {
            try {
              const res = await fetch("./api/water");
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              const waterData = await res.json();
              setWaterData(waterData);
              } catch {
                setError(error);
              }
            return
          }
        };

        const fetchWellData = async () => {
          if (!selectedObjective) return;

          if (selectedObjective === 'objective_2b') {
            try {
              const res = await fetch("./api/well");
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              const wellData = await res.json();
              setWellData(wellData);
              } catch {
                setError(error);
              }
            return
          }
        };

        fetchWellData();
        fetchWaterData();
        fetchSoidData();
        fetchInhousewaterData();
        fetchBootsockData(); // Fetch bootsock data when selectedObjective changes
    }, [selectedObjective]);
  

    // Fungsi untuk menangani perubahan pada center dan zoom
    // const handleViewportChange = (viewport) => {
    //     setCenter(viewport.center);  // Update center peta
    //     setZoom(viewport.zoom);      // Update zoom peta
    // };

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
              note: item.note
            };
          }
          return null;
        })
        .filter(item => item !== null);
    }, [data, selectedStatus, selectedCampaign, selectedObjective]);
    
    const boundaryGeoJson = useMemo(() => {
        return boundaryData.map((boundary) => {
        if (boundary.geom) {
            const geoJsonData = convertToBoundaryGeoJSON(boundary);
            return {
            geoJsonData,
            gid: boundary.gid,
            name: boundary.name,
            };
        }
        return null;
        }).filter(boundary => boundary !== null);
    }, [boundaryData]);

    const accessGeoJson = useMemo(() => {
        return roadAccessData.map((access) => {
        if (access.geom) {
            const geoJsonData = convertToAccessGeoJSON(access);
            return {
            geoJsonData,
            gid: access.gid,
            fid_: access.fid_,
            };
        }
        return null;
        }).filter(access => access !== null);
    }, [roadAccessData]);

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
  }, [bootsockData]);

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
  }, [inhousewaterData]);

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
  }, [soilData]);

  const waterGeoJson = useMemo(() => {
    return waterData.map((water) => {
      if (water.geom) {
        const geoJsonData = convertToWaterGeoJSON(water);
        return {
          geoJsonData,
          gid: water.gid,
          id: water.id,
          date: water.date,
          township: water.township,
        };
      }
      return null;
    }).filter(water => water !== null);
  }, [waterData]);

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
  }, [wellData]);


    console.log('data center', center);
    console.log('data zoom', zoom);

  // Gunakan useEffect untuk mengubah loading ketika geoJsonData selesai diterima
  useEffect(() => {
    if (geoJsonData.length > 0) {
      setLoading(false); // Set loading ke false hanya setelah geoJsonData berhasil dimuat
    }
  }, [geoJsonData]); // Memantau geoJsonData

  // Fungsi untuk fetch data berdasarkan filter yang dipilih
  const fetchData = useCallback(async () => {
    setLoading(true); // Mulai loading
    try {
      // Simulasi API fetch berdasarkan filter
      const response = await fetch(`/api/data?country=${selectedCountry}&campaign=${selectedCampaign}`);
      const data = await response.json();
      setGeoJsonData(data); // Set data hasil fetch
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Selesai loading
    }
  }, [selectedCountry, selectedCampaign]); // Fetch ulang data saat filter berubah

  // Menggunakan useEffect untuk memanggil fetchData saat filter berubah
  useEffect(() => {
    if (selectedCountry || selectedCampaign || selectedSettlement || selectedStatus || selectedObjective) {
      fetchData(); // Panggil fetchData jika filter berubah
    }
  }, [selectedCountry, selectedCampaign, fetchData, selectedSettlement, selectedStatus, selectedObjective]);

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
          {geoJsonFeatures.map(({ geoJsonData, centroid, gid, id_map, id_building, hoid, houseno, settlement, status, structure, country, campaign, connected, note }) => (
            <React.Fragment key={gid}>
              {/* GeoJSON Layer */}
              <GeoJSON
                data={geoJsonData}
                style={() => ({
                  fillColor: getColorByStatus(status),  // Menentukan warna berdasarkan status
                  weight: 1,
                  weight: 2,
                  opacity: 1,
                  color: 'white',
                  dashArray: '3',
                  fillOpacity: 1
                })}
                onEachFeature={(feature, layer) => {
                  layer.on({
                    mouseover: () => {
                      layer.bindPopup(`  
                        <h2 style="font-size: 18px; font-weight: bold;">Building Information</h2>
                        <ul>
                          <li><strong>Structure:</strong> ${structure}</li>
                          <li><strong>House Number:</strong> ${houseno}</li>
                          <li><strong>GID:</strong> ${gid}</li>
                          <li><strong>House ID:</strong> ${hoid}</li>
                          <li><strong>Settlement:</strong> ${settlement}</li>
                          <li><strong>Building ID:</strong> ${id_building}</li>
                          <li><strong>Country:</strong> ${country}</li>
                          <li><strong>Campaign:</strong> ${campaign}</li>
                          <li><strong>Connected:</strong> ${connected}</li>
                          <li><strong>Note:</strong> ${note}</li>
                          <li><strong>Status:</strong> ${status}</li>
                          <li><strong>Map ID:</strong> ${id_map}</li>
                        </ul>
                      `).openPopup();
                    },
                    mouseout: () => {
                      layer.closePopup();
                    }
                  });
                }}
              >
                {/* Tooltip menggunakan react-leaflet, dengan posisi di centroid */}
                <Tooltip
                  permanent = "true"
                  direction="center"
                  offset={[0, 0]} // Menempatkan tooltip di tengah
                  className="custom-tooltip"
                  position={centroid} // Menggunakan centroid sebagai posisi tooltip
                >
                  {houseno}
                </Tooltip>
              </GeoJSON>
            </React.Fragment>
          ))}
          
          {/* Menampilkan MultiLineString */}
              {boundaryGeoJson.map(({ geoJsonData, gid, name }) => (
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
              ))}

          {/* Menampilkan MultiLineString */}
              {accessGeoJson.map(({ geoJsonData, gid, fid_ }) => (
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
              ))}

              {/* Menampilkan MultiLineString */}
              {bootscokGeoJson.map(({ geoJsonData, gid, township }) => (
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
              ))}

            {/* Menampilkan Point */}
            {inhousewaterGeoJson.map(({ geoJsonData, gid, township }) => (
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
          ))}

          {/* Menampilkan Point */}
          {soilGeoJson.map(({geoJsonData, gid, township}) => (
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
          ))}

          {/* Menampilkan Point */}
          {waterGeoJson.map(({geoJsonData, gid, id, date, township}) => (
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
                            <li>DATE: ${date}</li>
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
          ))}

          {/* Menampilkan Point */}
          {wellGeoJson.map(({geoJsonData, gid, id, township}) => (
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
          ))}

          </MapContainer>
    </div>
    );

};

export default MainMap;