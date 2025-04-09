// import { NextResponse } from "next/server";
// import { getDbConnection } from "../../../../lib/db";

// export async function GET(request) {
//   const db = getDbConnection(); // Mendapatkan koneksi dari singleton
//   const { searchParams } = new URL(request.url);
//   const countryCode = searchParams.get('prefix'); // Ambil parameter 'country' dari URL query
// //   const campaignParam = searchParams.get('campaign'); // Ambil parameter 'campaign' dari URL query

//   try {
//     // Buat query dasar
//     let query = db('gdb_rise_o2a_equipment as equipment')
//       .select('equipment.gid', 'equipment.name', 'equipment.pointid', 'equipment.equipment_', 'equipment.barcode', 'equipment.notes', 'country.prefix', db.raw('ST_AsGeoJSON(geom) AS geom')) // Ambil semua kolom dari tabel equipment dan prefix dari tabel country
//       .leftJoin('gdb_rise_country as country', 'equipment.id_country', '=', 'country.id_country') // Relasi dengan tabel gdb_rise_country
//       .orderBy(['equipment.gid'])
//     //   .select('equipment.equipment_', 'country.prefix'); // Ambil semua kolom dari tabel equipment dan prefix dari tabel country

//     // Filter berdasarkan country jika ada
//     // if (countryCode) {
//     //     if (typeof countryCode !== 'string' || countryCode.length !== 2) {
//     //       // Validasi countryCode: harus string 2 karakter (ISO country code)
//     //       return NextResponse.json(
//     //         { error: 'Invalid country code' },
//     //         { status: 400 }
//     //       );
//     //     }
//     //     query.where('prefix', countryCode); // Filter berdasarkan country
//     //   }
  
//       // Filter berdasarkan campaign jika ada
//     //   if (campaignParam) {
//     //     // Memecah parameter 'campaign' jika lebih dari satu ID dipisahkan koma
//     //     const campaignIds = campaignParam.split(',').map(id => id.trim());
        
//     //     if (campaignIds.length > 0) {
//     //       query.whereIn('campaign', campaignIds); // Menggunakan 'whereIn' untuk filter kampanye
//     //     }
//     //   }
//     // Eksekusi query
//     const result = await query;

//     // Return hasil dalam format JSON
//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching campaigns:', error);

//     // Return error dalam format JSON dengan status 500 (server error)
//     return NextResponse.json(
//       { error: 'Failed to fetch campaigns', details: error.message },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { getDbConnection } from "../../../../lib/db";

export async function GET(request) {
    const db = getDbConnection(); // Mendapatkan koneksi dari singleton
    const {searchParams} = new URL(request.url);
    const selectedCountry = searchParams.get('id_country');
    const selectedSettlement = searchParams.get('settlement');
    const selectedCampaign = searchParams.get('campaign_e');

    try {
        let query = db('gdb_rise_o2a_equipment').select(
            'gid',
            'name',
            'pointid',
            'equipment_',
            'barcode',
            'activedate',
            'inactiveda',
            'campaign_s',
            'campaign_e',
            'notes',
            db.raw('ST_AsGeoJSON(geom) AS geom')
        );

        // Filter berdasarkan country jika ada
        if (selectedCountry) {
            query = query.where('id_country', selectedCountry); // Menambahkan filter berdasarkan id_country
        }
    
        if (selectedSettlement) {
            query = query.where('settlement', selectedSettlement); // Menambahkan filter berdasarkan id_country
        }

        // Jika ada filter berdasarkan campaign
        // if (selectedCampaign) {
        //     console.log('Applying filter for campaign:', selectedCampaign);  // Log untuk debugging
            
        //     // Ambil rentang campaign_start dan campaign_end berdasarkan campaign yang dipilih
        //     const campaignData = await db('gdb_rise_o2a_equipment')
        //         .select('campaign_s', 'campaign_e')
        //         .where('campaign_e', selectedCampaign)
        //         .first();  // Mengambil satu baris data kampanye (karena campaign unik)

        //     if (campaignData) {
        //         const { campaign_s, campaign_e } = campaignData;
        //         console.log('Campaign S:', campaign_s, 'Campaign E:', campaign_e);  // Log untuk debugging

        //         // Cek apakah campaign_start dan campaign_end adalah tanggal
        //         console.log('Type of campaign_s:', typeof campaign_s);
        //         console.log('Type of campaign_e:', typeof campaign_e);

        //         // Menambahkan filter untuk rentang campaign_start dan campaign_end
        //         query = query
        //             .andWhere(function() {
        //                 this.where('campaign_s', '<=', selectedCampaign)  // campaign_s harus lebih kecil atau sama dengan selectedCampaign
        //                     .andWhere('campaign_e', '>=', selectedCampaign);  // campaign_e harus lebih besar atau sama dengan selectedCampaign
        //             });
        //     } else {
        //         // Jika campaign tidak ditemukan
        //         console.log('No data found for campaign:', selectedCampaign);
        //         return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        //     }
        // }
        if (selectedCampaign) {
            console.log('Applying filter for campaign:', selectedCampaign);  // Log untuk debugging
            
            if (selectedCampaign === "0") {
                // Jika selectedCampaign adalah 0, tampilkan data yang campaign_s = 0
                query = query.andWhere(function() {
                    this.where('campaign_s', '=', 0) // Pastikan campaign_s = 0
                        .orWhere(function() {
                            this.where('campaign_s', '<=', selectedCampaign)  // campaign_s harus lebih kecil atau sama dengan selectedCampaign
                                .andWhere('campaign_e', '>=', selectedCampaign);  // campaign_e harus lebih besar atau sama dengan selectedCampaign
                        });
                });
            } else {
                // Jika selectedCampaign bukan 0, gunakan logika standar
                query = query.andWhere(function() {
                    this.where('campaign_s', '<=', selectedCampaign)  // campaign_s harus lebih kecil atau sama dengan selectedCampaign
                        .andWhere('campaign_e', '>=', selectedCampaign);  // campaign_e harus lebih besar atau sama dengan selectedCampaign
                });
            }
        }


        const result = await query;
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
