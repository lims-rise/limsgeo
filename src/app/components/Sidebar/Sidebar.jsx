"use client";
import React, { useEffect, useState } from "react";
import MapWrapper from "../Map/MapWrapper";
import RightSidebar from "../RightSidebar/RightSidebar";

function Sidebar() {
  const [campaigns, setCampaigns] = useState([]); // Daftar kampanye
  const [countries, setCountries] = useState([]); // Daftar negara
  const [settlements, setSettlements] = useState([]) // Daftar settlement
  const [status, setStatus] = useState([]); // Daftar status
  const [objectives, setObjectives] = useState([]); //Daftar objective
  const [equipments, setEquipments] = useState([]); // Daftar equipment
  const [selectedCampaign, setSelectedCampaign] = useState([0]); // Kampanye yang dipilih
  const [selectedCountry, setSelectedCountry] = useState(null); // Negara yang dipilih
  const [selectedSettlement, setSelectedSettlement] = useState(null); // Settlement yang dipilih
  const [selectedStatus, setSelectedStatus] = useState(null); // Status yang dipilih
  const [selectedObjective, setSelectedObjective] = useState(null); // Objective yang dipilih
  const [selectedEquipment, setSelectedEquipment] = useState(null); // Equipment yang dipilih
  const [isLoadingCountries, setIsLoadingCountries] = useState(true); // Loading state untuk negara
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true); // Loading state untuk kampanye
  const [isLoadingSettelments, setIsloadingSettelments] = useState(true); // Loading state untuk settlement
  const [isLoadingStatus, setIsLoadingStatus] = useState(true); // Loading state untuk status
  const [isLoadingObjective, setIsloadingObjective] = useState(true); //Loading state untuk objective
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(true); // Loading state untuk equipment
  const [isCheckboxMode, setIsCheckboxMode] = useState(true); // Toggle untuk memilih mode (checkbox atau dropdown)


  const handleObjectiveChange = (event) => {
    const objectiveCode = event.target.value; // Ambil value (url_name)
    const selectedObj = objectives.find((objective) => objective.url_name === objectiveCode);
    setSelectedObjective(selectedObj); // Simpan objek lengkap jika perlu
  };


  const handleCampaignChange = (event) => {
    if (isCheckboxMode) {
      // Ketika menggunakan checkbox, simpan nilai sebagai string
      const campaignValue = event.target.value; // Simpan sebagai string
      
      // Update state dengan menambahkan atau menghapus campaign dari selectedCampaign
      setSelectedCampaign((prevCampaigns) => {
        const newCampaigns = prevCampaigns.includes(campaignValue)
          ? prevCampaigns.filter((campaign) => campaign !== campaignValue) // Hapus jika sudah tercentang
          : [...prevCampaigns, campaignValue]; // Tambahkan jika belum tercentang
  
        // Pastikan selectedCampaign selalu berupa array string
        return newCampaigns.length === 0 ? "" : newCampaigns;
      });
    } else {
      // Ketika menggunakan dropdown (multiple selection), ambil semua opsi yang dipilih
      const campaignValues = Array.from(event.target.selectedOptions, (option) => option.value);
  
      // Update state dengan array kampanye yang dipilih
      setSelectedCampaign(campaignValues.length === 0 ? "" : campaignValues);
    }
  };
  

  const handleCountryChange = (event) => {
    const countryCode = event.target.value;
    const country = countries.find((country) => country.prefix === countryCode);
    setSelectedCountry(country); // Memperbarui negara yang dipilih
  };

  const handleSettlementChange  = (event) => {
    const settlementCode = event.target.value;
    const settlement = settlements.find((settlement) => settlement.settlement === settlementCode)
    setSelectedSettlement(settlement);
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    if (status === "all") {
      setSelectedStatus(null); // Menampilkan semua data jika memilih "All"
    } else {
      setSelectedStatus(status); // Memilih status tertentu
    }
  }

   // Fungsi umum untuk fetch data dan handle error dan loading
   const fetchData = async (url, setter, loadingSetter) => {
    try {
      loadingSetter(true); // Set loading true
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      setError(error); // Menangani error secara umum
    } finally {
      loadingSetter(false); // Set loading false setelah data didapat
    }
  };

  // Fetch data negara saat pertama kali render
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await fetch("./api/country");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const countryData = await response.json();
        setCountries(countryData); // Set data negara
        setIsLoadingCountries(false); // Hentikan loading negara
      } catch (error) {
        console.error("Error fetching country data:", error);
        setIsLoadingCountries(false);
      }
    };

    fetchCountryData();
  }, []); // Fetch hanya sekali saat pertama kali render

  // Fetch data lain berdasarkan negara yang dipilih
  useEffect(() => {
    if (!selectedCountry) return; // Jika tidak ada negara yang dipilih, hentikan fetch

    // Fetch kampanye, settlement, status, dan objective setelah negara dipilih
    fetchData(`./api/campaign?country=${selectedCountry.prefix}`, setCampaigns, setIsLoadingCampaigns);
    fetchData(`./api/settlement?country=${selectedCountry.prefix}`, setSettlements, setIsloadingSettelments);
    fetchData(`./api/status?country=${selectedCountry.prefix}`, setStatus, setIsLoadingStatus);
    fetchData(`./api/objective?country=${selectedCountry.prefix}`, setObjectives, setIsloadingObjective);

  }, [selectedCountry]); // Fetch data lain hanya jika selectedCountry berubah



  useEffect(() => {
    if (campaigns.length > 0) {
      // Set the selectedCampaign state to the last campaign
      setSelectedCampaign([String(campaigns[campaigns.length - 1].campaign)]);
    } else {
      setSelectedCampaign([]);
    }
  }, [campaigns]);


  // Reset selectedCampaign dan selectedSettlement saat selectedCountry berubah
  useEffect(() => {
    setSelectedCampaign(""); 
    setSelectedSettlement(null); 
    setSelectedStatus("");
    setSelectedObjective("");
    setSelectedEquipment("");
  }, [selectedCountry]); 


  console.log('selectedSettlement', selectedSettlement);
  console.log('selectedCountry', selectedCountry);
  console.log('selectedStatus', selectedStatus);
  console.log('selectedCampaign', selectedCampaign);
  console.log('selectedEquipment', selectedEquipment);
  return (
    <div className="flex w-full h-full">
      {/* Left Sidebar */}
      <div className="sidebar-container hidden sm:hidden md:block w-80 bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-800 shadow-2xl max-h-screen overflow-y-auto overflow-x-hidden custom-scrollbar border-r border-gray-200">
        {/* Modern Header with Light Gradient - Matching DataTable */}
        <div className="w-80 sm:hidden md:block text-white shadow-xl max-h-screen overflow-y-auto rounded-b-3xl fixed top-0 left-0 z-20 backdrop-blur-sm" style={{
          background: 'linear-gradient(135deg, #0FB3BA 0%, #1976d2 100%)',
          boxShadow: '0 4px 20px rgba(15, 179, 186, 0.3)'
        }}>
          <div className="relative p-6 text-center">
            <div className="absolute inset-0 bg-black/10 rounded-b-3xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto mb-3 bg-white/25 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold tracking-wide">Map Filters</h2>
              <p className="text-sm text-white/90 mt-1">Interactive Data Explorer</p>
            </div>
          </div>
        </div>

        <div className="p-6 max-h-full mt-40 space-y-8">
        {/* Modern Filter Country */}
        <div className="group">
          <label htmlFor="country" className="flex items-center text-sm font-semibold mb-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
            <span className="w-5 h-5 mr-2 rounded-full flex items-center justify-center shadow-sm" style={{
              background: 'linear-gradient(90deg, #3b82f6 0%, #14b8a6 100%)'
            }}>
              {/* SVG icon with colored paths */}
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#3b82f6"/>
                <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Select Country
          </label>
          <div className="relative">
            {isLoadingCountries ? (
              <div className="w-full bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <span className="text-gray-600">Loading countries...</span>
                </div>
              </div>
            ) : (
              <select
                id="country"
                value={selectedCountry ? selectedCountry.prefix : ""}
                onChange={handleCountryChange}
                className="w-full bg-white text-gray-800 border-2 border-gray-200 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 hover:border-cyan-400 transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer"
              >
                <option value="" disabled>🌍 Choose your region...</option>
                {countries.map((country) => (
                  <option key={country.prefix} value={country.prefix} className="bg-white">
                    {country.name}
                  </option>
                ))}
              </select>
            )}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Modern Filter Objective */}
        <div className="group">
          <label htmlFor="objective" className="flex items-center text-sm font-semibold mb-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
            <div className="w-5 h-5 mr-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Select Objective
          </label>
          <div className="relative">
            {isLoadingObjective ? (
              <div className="w-full bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="animate-pulse w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Loading objectives...</span>
                </div>
              </div>
            ) : (
              <select
                id="objective"
                value={selectedObjective ? selectedObjective.url_name : ""}
                onChange={handleObjectiveChange}
                className="w-full bg-white text-gray-800 border-2 border-gray-200 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 hover:border-cyan-400 transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer"
              >
                <option value="" disabled>🎯 Select objective...</option>
                {objectives.length > 0 ? (
                  objectives.map((objective, index) => (
                    <option key={index} value={objective.url_name} className="bg-white">
                      {objective.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled className="bg-white">❌ No objective available</option>
                )}
              </select>
            )}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Modern Filter Settlement */}
        { selectedObjective && (selectedObjective.url_name === "objective_2b" || selectedObjective.url_name === "objective_2a" || selectedObjective.url_name === "objective_3") && (
          <div className="group">
            <label htmlFor="settlement" className="flex items-center text-sm font-semibold mb-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
              <div className="w-5 h-5 mr-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              Select Settlement
            </label>
            <div className="relative">
              {isLoadingSettelments ? (
                <div className="w-full bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                    <span className="text-gray-600">Loading settlements...</span>
                  </div>
                </div>
              ) : (
                <select
                  id="settlement"
                  value={selectedSettlement ? selectedSettlement.settlement : ""}
                  onChange={handleSettlementChange}
                  className="w-full bg-white text-gray-800 border-2 border-gray-200 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 hover:border-cyan-400 transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                >
                  <option value="" disabled>🏘️ Choose settlement...</option>
                  {settlements.length > 0 ? (
                    settlements.map((settlement, index) => (
                      <option key={index} value={settlement.settlement} className="bg-white">
                        🏠 {settlement.settlement}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled className="bg-white">❌ No settlements available</option>
                  )}
                </select>
              )}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}



        {/* Modern Filter Campaign dan Status untuk objective_2b dan objective_3 */}
        { selectedSettlement && selectedObjective && (selectedObjective.url_name === "objective_2b" || selectedObjective.url_name === "objective_3") && (
          <>
            {/* Modern Toggle untuk memilih mode filter */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold mb-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                <div className="w-5 h-5 mr-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                Filter Mode
              </label>
              <div className="flex space-x-2 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setIsCheckboxMode(true)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isCheckboxMode 
                      ? ' bg-gradient-to-br from-[#0FB3BA] to-[#1976d2] text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ✅ Checkbox
                </button>
                <button
                  onClick={() => setIsCheckboxMode(false)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    !isCheckboxMode 
                      ? ' bg-gradient-to-br from-[#0FB3BA] to-[#1976d2] text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📋 Dropdown
                </button>
              </div>
            </div>

            {/* Modern Filter Campaign */}
            <div className="group">
              <label htmlFor="status" className="flex items-center text-sm font-semibold mb-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                <div className="w-5 h-5 mr-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Select Campaign
              </label>
              <div>
                {isLoadingCampaigns ? (
                  <div className="w-full bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                      <span className="text-gray-600">Loading campaigns...</span>
                    </div>
                  </div>
                ) : (
                  isCheckboxMode ? (
                    <div className="space-y-2 bg-white border-2 border-gray-200 rounded-xl p-3 shadow-sm max-h-60 overflow-y-auto custom-scrollbar">
                      {campaigns.map((campaign, index) => (
                        <div
                          key={index}
                          className={`flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer border ${
                            selectedCampaign.includes(String(campaign.campaign))
                              ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-300 shadow-sm'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            id={`campaign-${campaign.campaign}`}
                            value={String(campaign.campaign)}
                            checked={selectedCampaign.includes(String(campaign.campaign))}
                            onChange={handleCampaignChange}
                            className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2 mr-3"
                          />
                          <label
                            htmlFor={`campaign-${campaign.campaign}`}
                            className={`flex-1 text-sm cursor-pointer ${
                              selectedCampaign.includes(String(campaign.campaign)) 
                                ? 'font-semibold text-gray-900' 
                                : 'font-normal text-gray-700'
                            }`}
                          >
                            Campaign {campaign.campaign}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        id="campaign"
                        value={selectedCampaign}
                        onChange={handleCampaignChange}
                        multiple
                        className="w-full bg-white text-gray-800 border-2 border-gray-200 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 hover:border-cyan-400 transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer min-h-[120px] overflow-y-auto custom-scrollbar"
                      >
                        {campaigns.map((campaign, index) => (
                          <option
                            key={index}
                            value={campaign.campaign}
                            className="py-2 bg-white hover:bg-gray-50"
                          >
                            Campaign {campaign.campaign}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Modern Filter Status */}
            <div className="group">
              <label htmlFor="status" className="flex items-center text-sm font-semibold mb-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                <div className="w-5 h-5 mr-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Select Status
              </label>
              <div className="relative">
                {isLoadingStatus ? (
                  <div className="w-full bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="animate-pulse w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-600">Loading status...</span>
                    </div>
                  </div>
                ) : (
                  <select
                    id="status"
                    value={selectedStatus ? selectedStatus : ""}
                    onChange={handleStatusChange}
                    className="w-full bg-white text-gray-800 border-2 border-gray-200 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 hover:border-cyan-400 transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                  >
                    <option value="" disabled>📊 Select status...</option>
                    <option value="all" className="bg-white">All Status</option>
                    {status.length > 0 ? (
                      status.map((sts, index) => (
                        <option key={index} value={sts.status} className="bg-white">
                          {sts.status}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled className="bg-white">❌ No status available</option>
                    )}
                  </select>
                )}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Modern Filter Campaign untuk objective_2a */}
        { selectedSettlement && selectedObjective && (selectedObjective.url_name === "objective_2a") && (
          <>
            {/* Modern Toggle untuk memilih mode filter */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold mb-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                <div className="w-5 h-5 mr-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                Filter Mode
              </label>
              <div className="flex space-x-2 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setIsCheckboxMode(true)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isCheckboxMode 
                      ? 'bg-gradient-to-br from-[#0FB3BA] to-[#1976d2] text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ✅ Checkbox
                </button>
                <button
                  onClick={() => setIsCheckboxMode(false)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    !isCheckboxMode 
                      ? 'bg-gradient-to-br from-[#0FB3BA] to-[#1976d2] text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📋 Dropdown
                </button>
              </div>
            </div>

            {/* Modern Filter Campaign */}
            <div className="group">
              <label htmlFor="campaign" className="flex items-center text-sm font-semibold mb-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                <div className="w-5 h-5 mr-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                Select Campaign
              </label>
              <div>
                {isLoadingCampaigns ? (
                  <div className="w-full bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                      <span className="text-gray-600">Loading campaigns...</span>
                    </div>
                  </div>
                ) : (
                  isCheckboxMode ? (
                    <div className="space-y-2 bg-white border-2 border-gray-200 rounded-xl p-3 shadow-sm max-h-60 overflow-y-auto custom-scrollbar">
                      {campaigns.map((campaign, index) => (
                        <div
                          key={index}
                          className={`flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer border ${
                            selectedCampaign.includes(String(campaign.campaign))
                              ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-300 shadow-sm'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            id={`campaign-${campaign.campaign}`}
                            value={String(campaign.campaign)}
                            checked={selectedCampaign.includes(String(campaign.campaign))}
                            onChange={handleCampaignChange}
                            className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2 mr-3"
                          />
                          <label
                            htmlFor={`campaign-${campaign.campaign}`}
                            className={`flex-1 text-sm cursor-pointer ${
                              selectedCampaign.includes(String(campaign.campaign)) 
                                ? 'font-semibold text-gray-900' 
                                : 'font-normal text-gray-700'
                            }`}
                          >
                            Campaign {campaign.campaign}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        id="campaign"
                        value={selectedCampaign}
                        onChange={handleCampaignChange}
                        multiple
                        className="w-full bg-white text-gray-800 border-2 border-gray-200 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 hover:border-cyan-400 transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer min-h-[120px] overflow-y-auto custom-scrollbar"
                      >
                        {campaigns.map((campaign, index) => (
                          <option
                            key={index}
                            value={campaign.campaign}
                            className="py-2 bg-white hover:bg-gray-50"
                          >
                            Campaign {campaign.campaign}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                )}
              </div>
            </div>

          </>
        )}

        {/* Status Indicator */}
        {selectedCountry && selectedObjective && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-emerald-700">Status Indicator</p>
                <p className="text-xs text-emerald-600">
                  {selectedCountry.name} • {selectedObjective.name || selectedObjective.url_name}
                  {selectedSettlement && ` • ${selectedSettlement.settlement}`}
                  { selectedCampaign && ` • Campaign: ${Array.isArray(selectedCampaign) ? selectedCampaign.join(', ') : selectedCampaign}`}
                  { selectedStatus && ` • Status: ${selectedStatus}`}
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
      
      {/* Center - Map Container */}
      <div className="flex-1 overflow-auto">
        {/* Pass selectedCountry data to MapWrapper */}
        <MapWrapper
          selectedCampaign={selectedCampaign}
          selectedCountry={selectedCountry}
          selectedSettlement={selectedSettlement}
          selectedStatus={selectedStatus}
          selectedObjective = {selectedObjective?.url_name}
        // selectedEquipment = {selectedEquipment}
      />
      </div>
      
      {/* Right Sidebar */}
      <div className="sidebar-container hidden sm:hidden md:block w-80">
        <RightSidebar
            selectedSettlementRightSidebar={selectedSettlement}
            selectedObjectiveRightSidebar = {selectedObjective?.url_name}
            selectedCountryRightSidebar = {selectedCountry?.name}
        />
      </div>
    </div>
  );
}

export default Sidebar;