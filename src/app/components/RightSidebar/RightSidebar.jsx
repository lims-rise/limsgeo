"use client";
import Image from "next/image";
import React, { useState } from "react";
import Flag from "react-world-flags";

// Function to format the date
const formatDate = (date) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${daysOfWeek[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// Reusable component for line items (Boundary, Access lines, etc.) with compact styling
const LineItem = ({ color, label }) => (
  <div className="flex items-center space-x-2">
    <div className={`flex-1 border-t-4 ${color} rounded-full shadow-sm`} />
    <span className="text-gray-700 text-xs font-medium">{label}</span>
  </div>
);

// Reusable component for status items (Active, Demolished, etc.) with compact styling
const StatusItem = ({ color, label }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-6 h-4 ${color} rounded-md shadow-sm border border-white/50`} />
    <span className="text-gray-700 text-xs font-medium">{label}</span>
  </div>
);

// Reusable component for information items (Thermochron, Hygrochron, etc.) with compact styling
const InformationItem = ({ iconSrc, label, iconSize = { width: 24, height: 24 }, className = '' }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-md p-1.5 shadow-sm">
      <Image src={iconSrc} alt={label} width={iconSize.width} height={iconSize.height} 
        className="object-contain" 
        style={{ height: iconSize.height, width: iconSize.width }} 
      />
    </div>
    <div className="flex-1">
      <p className="text-xs font-medium text-gray-800 leading-tight">{label}</p>
    </div>
  </div>
);

// Component for displaying the flag based on selected country
const CountryFlag = ({ countryCode }) => {
  const defaultCountryCode = ['ID', 'FJ']; // dua negara yang ingin ditampilkan sebagai default

  if (!countryCode) {
    return (
      <div className="flex justify-center items-center space-x-1 max-w-full overflow-hidden">
        {defaultCountryCode.map((code, index) => (
          <div key={index} className="flex-shrink-0" style={{ width: '55px', height: '40px' }}>
            <Flag code={code} style={{
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              borderRadius: '4px'
            }} />
          </div>
        ))}
      </div>
    );
  }

  switch (countryCode) {
    case 'Indonesia':
      return (
        <div className="flex justify-center">
          <div style={{ width: '70px', height: '50px' }}>
            <Flag code="ID" style={{
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              borderRadius: '4px'
            }} />
          </div>
        </div>
      );
    case 'Fiji':
      return (
        <div className="flex justify-center">
          <div style={{ width: '70px', height: '50px' }}>
            <Flag code="FJ" style={{
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              borderRadius: '4px'
            }} />
          </div>
        </div>
      );
    default:
      return (
        <div className="flex justify-center items-center space-x-1 max-w-full overflow-hidden">
          {defaultCountryCode.map((code, index) => (
            <div key={index} className="flex-shrink-0" style={{ width: '55px', height: '40px' }}>
              <Flag code={code} style={{
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                borderRadius: '4px'
              }} />
            </div>
          ))}
        </div>
      );
  }
};

function RightSidebar({ selectedSettlementRightSidebar, selectedObjectiveRightSidebar, selectedCountryRightSidebar }) {
  const [selectedPanel, setSelectedPanel] = useState("info"); // Active panel (info, settings, statistics)
  const currentDate = formatDate(new Date());

  return (
    <div className="sidebar-container fixed right-0 top-0 w-80 bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-800 shadow-2xl h-screen flex flex-col border-l border-gray-200">
      {/* Modern Header with White Background */}
      <div className="w-full bg-white rounded-t-3xl border-b border-gray-200 shadow-sm">
        <div className="relative p-3 text-center">
          <div className="relative z-10 space-y-3">
            {/* Flag Information with Modern Styling - Smaller */}
            <div className="rounded-lg p-2 shadow-sm border border-gray-200" style={{
              background: 'linear-gradient(135deg, #0FB3BA 0%, #1976d2 100%)',
              boxShadow: '0 -4px 20px rgba(15, 179, 186, 0.3)'
            }}>
              <div style={{ transform: 'scale(0.6)' }}>
                <CountryFlag countryCode={selectedCountryRightSidebar} />
              </div>
            </div>
            {/* Logo Header */}
            <div className="flex justify-center">
              <div className="rounded-lg p-2 shadow-md w-full flex justify-center" >
                <Image 
                  src="/images/rise.png" 
                  alt="Right Sidebar Logo" 
                  width={120} 
                  height={60} 
                  className="w-24 h-auto object-contain" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mt-0 pt-2 custom-scrollbar">
        {/* Content Area with Compact Spacing */}
        <div className="p-4 space-y-4">
          {/* Compact Settlement Information */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                  {selectedSettlementRightSidebar?.settlement || 'Settlement'}
                </h3>
                {selectedSettlementRightSidebar?.settlement && (
                  <p className="text-xs text-cyan-700 italic font-medium">{selectedSettlementRightSidebar?.settlement}</p>
                )}
              </div>
            </div>
          </div>

          {/* Compact Information Section */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Information</h3>
            </div>
            
            <div className="panel-content space-y-3">
              {/* Conditional Information Based on Objective */}
              {["objective_2a", "objective_2b", "objective_3"].includes(selectedObjectiveRightSidebar) && (
                <div className="space-y-3">
                  {/* Compact Equipment Section */}
                  {(selectedObjectiveRightSidebar === "objective_2a" || selectedObjectiveRightSidebar === "objective_2b") && (
                    <div className="bg-gradient-to-r from-amber-50 to-amber-50 rounded-lg p-3 border-none">
                      <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-amber-500 rounded-full mr-2"></div>
                        Equipment & Sensors
                      </h4>
                      <div className="grid grid-cols-1 gap-1.5">
                        {selectedObjectiveRightSidebar === "objective_2a" && (
                          <>
                            <div className="bg-white rounded-md p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                              <InformationItem iconSrc="/icons/thermochron.png" label="Thermochron" iconSize={{ width: 16, height: 28 }} className="" />
                            </div>
                            <div className="bg-white rounded-md p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                              <InformationItem iconSrc="/icons/hygrochron.png" label="Hygrochron" iconSize={{ width: 16, height: 24 }} className="" />
                            </div>
                            <div className="bg-white rounded-md p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                              <InformationItem iconSrc="/icons/raingauge.png" label="Raingauge" iconSize={{ width: 20, height: 32 }} className="" />
                            </div>
                            <div className="bg-white rounded-md p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                              <InformationItem iconSrc="/icons/wildlife.png" label="Ultrasonic/Acoustic" iconSize={{ width: 20, height: 32 }} className="" />
                            </div>
                            <div className="bg-white rounded-md p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                              <InformationItem iconSrc="/icons/hobo.png" label="Hobo" iconSize={{ width: 20, height: 32 }} className="" />
                            </div>
                          </>
                        )}
                        {selectedObjectiveRightSidebar === "objective_2b" && (
                          <>
                            <div className="bg-white rounded-md p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                              <InformationItem iconSrc="/icons/inhouse.png" label="In House Water Sample" />
                            </div>
                            <div className="bg-white rounded-md p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                              <InformationItem iconSrc="/icons/soil.png" label="Soil Sample" />
                            </div>
                            <div className="bg-white rounded-md p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                              <InformationItem iconSrc="/icons/water.png" label="Water Sample" />
                            </div>
                            <div className="bg-white rounded-md p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                              <InformationItem iconSrc="/icons/well.png" label="Well Water" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Compact Lines Section */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-50 rounded-lg p-3 border-none">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-500 rounded-full mr-2"></div>
                      Boundary Lines
                    </h4>
                    <div className="space-y-1.5">
                      <div className="bg-white rounded-md p-2 shadow-sm border border-blue-100">
                        <LineItem color="border-orange" label="Boundary Line" />
                      </div>
                      <div className="bg-white rounded-md p-2 shadow-sm border border-blue-100">
                        <LineItem color="border-blue" label="Road Access Line" />
                      </div>
                      {selectedObjectiveRightSidebar === "objective_2b" && (
                        <div className="bg-white rounded-md p-2 shadow-sm border border-blue-100">
                          <LineItem color="border-pink" label="Bootsock Line" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Compact Status Section */}
                  <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-lg p-3 border-none">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-500 rounded-full mr-2"></div>
                      Status Indicators
                    </h4>
                    <div className="grid grid-cols-1 gap-1.5">
                      <div className="bg-white rounded-md p-2 shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-200">
                        <StatusItem color="bg-active" label="Active" />
                      </div>
                      {selectedObjectiveRightSidebar !== "objective_2a" && (
                        <>
                          <div className="bg-white rounded-md p-2 shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-200">
                            <StatusItem color="bg-underconstruction" label="Underconstruction" />
                          </div>
                          <div className="bg-white rounded-md p-2 shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-200">
                            <StatusItem color="bg-demolished" label="Demolished" />
                          </div>
                          <div className="bg-white rounded-md p-2 shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-200">
                            <StatusItem color="bg-vacant" label="Vacant" />
                          </div>
                        </>
                      )}
                      {selectedObjectiveRightSidebar !== "objective_2b" && selectedObjectiveRightSidebar !== "objective_3" && (
                        <>
                          <div className="bg-white rounded-md p-2 shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-200">
                            <StatusItem color="bg-rundown" label="RunDown" />
                          </div>
                          <div className="bg-white rounded-md p-2 shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-200">
                            <StatusItem color="bg-risehouse" label="RiseHouse" />
                          </div>
                          <div className="bg-white rounded-md p-2 shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-200">
                            <StatusItem color="bg-replace" label="Replace" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modern Footer with Gradient */}
      <div className="absolute bottom-0 w-full backdrop-blur-sm" style={{
        background: 'linear-gradient(135deg, #0FB3BA 0%, #1976d2 100%)',
        boxShadow: '0 -4px 20px rgba(15, 179, 186, 0.3)'
      }}>
        <div className="relative p-2 text-center">
          <div className="absolute inset-0 "></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-slate-50 rounded-full animate-pulse"></div>
              <p className="text-sm text-white font-thin">{currentDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
