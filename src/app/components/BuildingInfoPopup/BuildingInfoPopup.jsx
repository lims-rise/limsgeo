// import { motion } from 'framer-motion';

// const BuildingInfoPopup = ({ info }) => {
//     // Menggunakan satu prop 'info' yang berisi objek lengkap
//     // agar lebih rapi daripada meneruskan 10+ props.
//     const {
//       structure,
//       houseno,
//       gid,
//       hoid,
//       settlement,
//       id_building,
//       country,
//       campaign,
//       connected,
//       note,
//       status,
//       id_map
//     } = info;

//     const statusColors = {
//         'Active': {
//           bg: 'bg-green-100',
//           text: 'text-green-800',
//           subtext: 'text-green-600'
//         },
//         'Vacant': {
//           bg: 'bg-yellow-100',
//           text: 'text-yellow-800',
//           subtext: 'text-yellow-600'
//         },
//         'Demolished': {
//           bg: 'bg-red-100',
//           text: 'text-red-800',
//           subtext: 'text-red-600'
//         },
//         'UnderConstruction': {
//             bg: 'bg-gray-100',
//             text: 'text-gray-800',
//             subtext: 'text-gray-600'
//           },
//           'RiseHouse': {
//             bg: 'bg-purple-100',
//             text: 'text-purple-800',
//             subtext: 'text-purple-600'
//           },
//           'Replace': {
//             bg: 'bg-amber-100',
//             text: 'text-amber-800',
//             subtext: 'text-amber-600'
//           },
//         // Default color jika status tidak cocok
//         default: {
//           bg: 'bg-gray-100',
//           text: 'text-gray-800',
//           subtext: 'text-gray-500'
//         }
//       };

//     // 2. Pilih konfigurasi warna berdasarkan status, atau gunakan default
//     const currentColors = statusColors[status] || statusColors.default
  
//     return (
//       <div className="max-w-sm font-sans p-4">
//         <div className="bg-white rounded-lg shadow-md">
//         {/* Header dengan warna dinamis */}
//         <div className={`${currentColors.bg} p-3 rounded-t-lg border-b border-gray-200`}>
//           <h3 className={`text-base font-bold ${currentColors.text}`}>
//             Building Information
//           </h3>
//           <p className={`text-xs ${currentColors.subtext}`}>House No: {houseno ?? 'N/A'}</p>
//         </div>
  
//           {/* Konten */}
//           <div className="p-3 text-sm">
//             <div className="grid grid-cols-[auto_1fr] gap-x-7 gap-y-1.5">
        
//                 <span className="font-semibold text-gray-600">Country:</span>
//                 <span className="text-gray-800">{country ?? '-'}</span>

//                 <span className="font-semibold text-gray-600">Settlement:</span>
//                 <span className="text-gray-800">{settlement ?? '-'}</span>
            
//                 <span className="font-semibold text-gray-600">Structure:</span>
//                 <span className="text-gray-800">{structure ?? '-'}</span>
  
//                 <span className="font-semibold text-gray-600">Status:</span>
//                 <span className="text-gray-800">{status ?? '-'}</span>

//                 <span className="font-semibold text-gray-600">Campaign:</span>
//                 <span className="text-gray-800">{campaign ?? '-'}</span>
        
//                 <span className="font-semibold text-gray-600">Connected:</span>
//                 <span className="text-gray-800">{connected ?? '-'}</span>
        
//                 <span className="font-semibold text-gray-600">ID Map:</span>
//                 <span className="text-gray-800">{id_map ?? '-'}</span>
        
//                 <span className="font-semibold text-gray-600">ID Building:</span>
//                 <span className="text-gray-800">{id_building ?? '-'}</span>

//                 <span className="font-semibold text-gray-600">Note:</span>
//                 <span className="text-gray-800 break-words">{note ?? '-'}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };
  
//   export default BuildingInfoPopup;

// components/BuildingInfoPopup.jsx
import { motion } from 'framer-motion';
import centroid from '@turf/centroid';
import { useState } from 'react';

const BuildingInfoPopup = ({ info }) => {
    const [copyStatus, setCopyStatus] = useState('Copy Koor.');
    // 1. Cek dasar apakah `info` dan `info.geom` ada
    if (!info || !info.geom) {
        console.error("Data 'info' atau 'info.geom' tidak ditemukan.", info);
        return null;
    }

    // 2. Coba ubah string 'geom' menjadi objek JavaScript
    let parsedGeom;
    try {
        // Jika info.geom sudah berupa objek, ini tidak akan melakukan apa-apa.
        // Jika berupa string, ini akan mengubahnya menjadi objek.
        parsedGeom = typeof info.geom === 'string' ? JSON.parse(info.geom) : info.geom;
    } catch (e) {
        console.error("Gagal melakukan JSON.parse pada geom. Data mungkin rusak:", info.geom, "Error:", e);
        return null; // Gagal parse, jangan lanjutkan
    }

    // 3. SEKARANG, lakukan validasi pada objek yang sudah di-parse
    if (!parsedGeom || !parsedGeom.type || !parsedGeom.coordinates) {
        console.error("Objek 'geom' setelah di-parse tidak valid:", parsedGeom);
        return null;
    }
  // Destructuring properti dari prop 'info'
  const {
    structure,
    houseno,
    settlement,
    country,
    campaign,
    connected,
    note, // Pastikan 'note' ada di sini
    status,
    id_map,
    id_building,
    geom
  } = info;

  // Konfigurasi warna dinamis berdasarkan status
  const statusColors = {
    'Active': { bg: 'bg-green-100', text: 'text-green-800', subtext: 'text-green-600' },
    'Vacant': { bg: 'bg-yellow-100', text: 'text-yellow-800', subtext: 'text-yellow-600' },
    'Demolished': { bg: 'bg-red-100', text: 'text-red-800', subtext: 'text-red-600' },
    'UnderConstruction': { bg: 'bg-gray-100', text: 'text-gray-800', subtext: 'text-gray-600' },
    'RiseHouse': { bg: 'bg-purple-100', text: 'text-purple-800', subtext: 'text-purple-600' },
    'Replace': { bg: 'bg-amber-100', text: 'text-amber-800', subtext: 'text-amber-600' },
    default: { bg: 'bg-gray-100', text: 'text-gray-800', subtext: 'text-gray-500' }
  };
  const currentColors = statusColors[status] || statusColors.default;

  // Varian animasi untuk Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring', damping: 15, stiffness: 200,
        staggerChildren: 0.05 // Jeda animasi antar anak
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Array data detail untuk di-render secara dinamis
  const details = [
    { label: 'Country:', value: country },
    { label: 'Settlement:', value: settlement },
    { label: 'Structure:', value: structure },
    { label: 'Status:', value: status },
    { label: 'Campaign:', value: campaign },
    { label: 'Connected:', value: connected },
    { label: 'Id Map:', value: id_map },
    { label: 'Id Building:', value: id_building },
    { label: 'Note:', value: note }, // <<< PERBAIKAN DI SINI
  ];

  // Kalkulasi Centroid menggunakan objek yang sudah valid
  const feature = { type: 'Feature', geometry: parsedGeom, properties: {} };
  const centerPoint = centroid(feature);
  const centerCoords = centerPoint.geometry.coordinates;

  // Fungsi untuk menyalin koordinat
  const handleCopyCoords = () => {
    const coordsString = `${centerCoords[1]}, ${centerCoords[0]}`;
    
    // Gunakan .then() dan .catch() untuk penanganan yang lebih baik
    navigator.clipboard.writeText(coordsString).then(() => {
      // 3. Jika berhasil, ubah status
      setCopyStatus('Tersalin!');
      // Kembalikan ke semula setelah 2 detik
      setTimeout(() => {
        setCopyStatus('Copy Koor.');
      }, 2000);
    }).catch(err => {
      // Jika gagal, beri tahu pengguna
      console.error('Gagal menyalin:', err);
      setCopyStatus('Gagal!');
       setTimeout(() => {
        setCopyStatus('Copy Koor.');
      }, 2000);
    });
  };

  return (
    <motion.div
      className="max-w-sm font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, scale: 1.02 }}
      // Sedikit di-adjust agar tidak terpotong Leaflet
      style={{ padding: '1rem' }} 
    >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <motion.div variants={itemVariants} className={`${currentColors.bg} p-3 border-b border-gray-200`}>
          <h3 className={`text-base font-bold ${currentColors.text}`}>
            Building Information
          </h3>
          <p className={`text-xs ${currentColors.subtext}`}>House No: {houseno ?? 'N/A'}</p>
        </motion.div>
        
        {/* Konten */}
        <div className="p-3 text-sm">
          {/* Detail Informasi dengan animasi */}
          <motion.div variants={itemVariants} className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
            {details.map((item) => (
              item.value ? ( // Hanya render jika ada value
                <div key={item.label} className="contents">
                  <span className="font-semibold text-gray-600">{item.label}</span>
                  <span className="text-gray-800 break-words">{item.value}</span>
                </div>
              ) : null
            ))}
          </motion.div>

          {/* Tombol Aksi dengan animasi */}
          <motion.div variants={itemVariants} className="mt-4 pt-3 border-t border-gray-200 flex space-x-3">
            <a
              href={`https://www.google.com/maps?q&layer=c&cbll=${centerCoords[1]},${centerCoords[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-md transition-all shadow-sm hover:shadow-md"
            >
              Street View
            </a>
            <button
                onClick={handleCopyCoords}
                // 4. Buat style dan teks tombol menjadi dinamis
                className={`flex-1 text-center text-sm text-white font-semibold py-1.5 px-3 rounded-md transition-all duration-300 shadow-sm hover:shadow-md ${
                copyStatus === 'Tersalin!' ? 'bg-green-500' : 'bg-gray-500 hover:bg-gray-600'
                }`}
                // Nonaktifkan tombol saat proses copy berlangsung untuk mencegah klik ganda
                disabled={copyStatus !== 'Copy Koor.'}
            >
                {copyStatus}
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default BuildingInfoPopup;