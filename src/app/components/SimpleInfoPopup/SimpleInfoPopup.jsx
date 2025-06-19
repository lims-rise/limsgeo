// components/SimpleInfoPopup.jsx

const SimpleInfoPopup = ({ gid, township, id }) => {
    return (
      <div className="w-60 font-sans p-3">
        <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
          {/* Baris untuk GID */}
          <span className="font-bold text-gray-700">GID:</span>
          <span className="text-gray-800">{gid ?? '-'}</span>
  
          {/* Baris untuk Township */}
          <span className="font-bold text-gray-700">Township:</span>
          <span className="text-gray-800">{township ?? '-'}</span>
  
          {/* Baris untuk ID, hanya tampil jika ada nilainya */}
          {id && (
            <>
              <span className="font-bold text-gray-700">ID:</span>
              <span className="text-gray-800">{id}</span>
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default SimpleInfoPopup;