// components/BuildingInfoPopup.jsx

const BuildingInfoPopup = ({ info }) => {
    // Menggunakan satu prop 'info' yang berisi objek lengkap
    // agar lebih rapi daripada meneruskan 10+ props.
    const {
      structure,
      houseno,
      gid,
      hoid,
      settlement,
      id_building,
      country,
      campaign,
      connected,
      note,
      status,
      id_map
    } = info;

    const statusColors = {
        'Active': {
          bg: 'bg-green-100',
          text: 'text-green-800',
          subtext: 'text-green-600'
        },
        'Vacant': {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          subtext: 'text-yellow-600'
        },
        'Demolished': {
          bg: 'bg-red-100',
          text: 'text-red-800',
          subtext: 'text-red-600'
        },
        'UnderConstruction': {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            subtext: 'text-gray-600'
          },
          'RiseHouse': {
            bg: 'bg-purple-100',
            text: 'text-purple-800',
            subtext: 'text-purple-600'
          },
          'Replace': {
            bg: 'bg-amber-100',
            text: 'text-amber-800',
            subtext: 'text-amber-600'
          },
        // Default color jika status tidak cocok
        default: {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          subtext: 'text-gray-500'
        }
      };

    // 2. Pilih konfigurasi warna berdasarkan status, atau gunakan default
    const currentColors = statusColors[status] || statusColors.default
  
    return (
      <div className="max-w-sm font-sans p-4">
        <div className="bg-white rounded-lg shadow-md">
        {/* Header dengan warna dinamis */}
        <div className={`${currentColors.bg} p-3 rounded-t-lg border-b border-gray-200`}>
          <h3 className={`text-base font-bold ${currentColors.text}`}>
            Building Information
          </h3>
          <p className={`text-xs ${currentColors.subtext}`}>House No: {houseno ?? 'N/A'}</p>
        </div>
  
          {/* Konten */}
          <div className="p-3 text-sm">
            <div className="grid grid-cols-[auto_1fr] gap-x-7 gap-y-1.5">
        
                <span className="font-semibold text-gray-600">Country:</span>
                <span className="text-gray-800">{country ?? '-'}</span>

                <span className="font-semibold text-gray-600">Settlement:</span>
                <span className="text-gray-800">{settlement ?? '-'}</span>
            
                <span className="font-semibold text-gray-600">Structure:</span>
                <span className="text-gray-800">{structure ?? '-'}</span>
  
                <span className="font-semibold text-gray-600">Status:</span>
                <span className="text-gray-800">{status ?? '-'}</span>

                <span className="font-semibold text-gray-600">Campaign:</span>
                <span className="text-gray-800">{campaign ?? '-'}</span>
        
                <span className="font-semibold text-gray-600">Connected:</span>
                <span className="text-gray-800">{connected ?? '-'}</span>
        
                <span className="font-semibold text-gray-600">ID Map:</span>
                <span className="text-gray-800">{id_map ?? '-'}</span>
        
                <span className="font-semibold text-gray-600">ID Building:</span>
                <span className="text-gray-800">{id_building ?? '-'}</span>

                <span className="font-semibold text-gray-600">Note:</span>
                <span className="text-gray-800 break-words">{note ?? '-'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default BuildingInfoPopup;