// import { NextResponse } from "next/server";
// import { getDbConnection } from "../../../../lib/db";

// export async function GET(request) {
//   const db = getDbConnection(); // Mendapatkan koneksi dari singleton
//   const { searchParams } = new URL(request.url);
//   const countryCode = searchParams.get('country'); // Ambil parameter 'country' dari URL query

//   try {
//     // Buat query dasar
//     const query = db('gdb_rise')
//       .distinct('settlement', 'country')
//       .orderBy(['settlement', 'country']); // Mengurutkan berdasarkan settlement, lalu country

//     // Tambahkan filter jika ada parameter 'country'
//     if (countryCode) {
//       if (typeof countryCode !== 'string' || countryCode.length !== 2) {
//         // Validasi countryCode: harus string 2 karakter (ISO country code)
//         return NextResponse.json(
//           { error: 'Invalid country code' },
//           { status: 400 }
//         );
//       }
//       query.where('country', countryCode); // Filter berdasarkan country
//     }

//     // Eksekusi query
//     const result = await query;

//     // Return hasil dalam format JSON
//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching settlement:', error);

//     // Return error dalam format JSON dengan status 500 (server error)
//     return NextResponse.json(
//       { error: 'Failed to fetch settlement', details: error.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { getDbConnection } from "../../../../lib/db";

export async function GET(request) {
  const db = getDbConnection(); // Mendapatkan koneksi dari singleton
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get('country'); // Ambil parameter 'country' dari URL query

  try {
    // Buat query dasar dengan JOIN antara gdb_rise dan settlements
    const query = db('gdb_rise')
      .distinct('gdb_rise.settlement', 'gdb_rise.country', 'gdb_rise_settlement.name', 'gdb_rise_settlement.lat', 'gdb_rise_settlement.long', 'gdb_rise_settlement.zoom')
      .join('gdb_rise_settlement', function() {
        this.on('gdb_rise.settlement', '=', 'gdb_rise_settlement.name');
      })
      .orderBy(['gdb_rise.settlement', 'gdb_rise.country']); // Mengurutkan berdasarkan settlement, lalu country

    // Tambahkan filter jika ada parameter 'country'
    if (countryCode) {
      if (typeof countryCode !== 'string' || countryCode.length !== 2) {
        // Validasi countryCode: harus string 2 karakter (ISO country code)
        return NextResponse.json(
          { error: 'Invalid country code' },
          { status: 400 }
        );
      }
      query.where('gdb_rise.country', countryCode); // Filter berdasarkan country
    }

    // Eksekusi query
    const result = await query;

    // Return hasil dalam format JSON
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching settlement:', error);

    // Return error dalam format JSON dengan status 500 (server error)
    return NextResponse.json(
      { error: 'Failed to fetch settlement', details: error.message },
      { status: 500 }
    );
  }
}


