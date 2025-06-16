import { NextResponse } from 'next/server';
import { getDbConnection } from '../../../../lib/db';

export async function GET(request) {
  const db = getDbConnection(); // Mendapatkan koneksi dari singleton
  const { searchParams } = new URL(request.url);
  const selectedCampaign = searchParams.get('campaign');
  const selectedCountry = searchParams.get('country');

  const selectedObjective = searchParams.get('objective'); // Mendapatkan nilai objective
  const selectedSettlement = searchParams.get('settlement');
  
  try {
    // Mulai query dasar yang umum
    let query = db('gdb_rise').select(
      'gid',
      'id_map',
      'id_building',
      'hoid',
      'houseno',
      'settlement',
      'status',
      'structure',
      'country',
      'campaign',
      'connected',
      'note',
      db.raw('ST_AsGeoJSON(geom) AS geom')
    );

    let query2 = db('gdb_rise')
      .select(
        'gdb_rise.gid',
        'gdb_rise.id_map',
        'gdb_rise.id_building',
        'gdb_rise.hoid',
        'gdb_rise.houseno',
        'gdb_rise.settlement',
        'gdb_rise_o2a.status',  // status dari tabel gdb_rise_o2a
        'gdb_rise.structure',
        'gdb_rise.country',
        'gdb_rise.campaign',
        'gdb_rise.connected',
        'gdb_rise_o2a.note',
        db.raw('ST_AsGeoJSON(gdb_rise.geom) AS geom') // kolom geom dari gdb_rise
      )
      .join('gdb_rise_o2a', 'gdb_rise.id_building', '=', 'gdb_rise_o2a.id_building'); // Join berdasarkan id_building

    // Kondisi untuk memilih query yang digunakan berdasarkan selectedObjective
    if (selectedObjective === 'objective_2a') {
      // Menambahkan filter berdasarkan country dan campaign pada query2
      if (selectedCountry) {
        query2 = query2.where('gdb_rise_o2a.country', selectedCountry);
      }

      if (selectedCampaign) {
        const campaignArray = selectedCampaign.split(',').map(campaign => campaign.trim());
        query2 = query2.whereIn('gdb_rise.campaign', campaignArray);
      }

      if (selectedSettlement) {
        query2 = query2.where('gdb_rise.settlement', selectedSettlement);
      }

      // Eksekusi query2 untuk objective_2a
      const result = await query2;
      return NextResponse.json(result);

    } else if (selectedObjective === 'objective_2b' || selectedObjective === 'objective_3') {
      // Menambahkan filter berdasarkan country dan campaign pada query
      if (selectedCountry) {
        query = query.where('gdb_rise.country', selectedCountry);
      }

      if (selectedCampaign) {
        const campaignArray = selectedCampaign.split(',').map(campaign => campaign.trim());
        query = query.whereIn('gdb_rise.campaign', campaignArray);
      }

      if (selectedSettlement) {
        query = query.where('gdb_rise.settlement', selectedSettlement);
      }

      // Eksekusi query untuk objective_2b
      const result = await query;
      return NextResponse.json(result);
    } else {
      // Jika tidak ada objective yang dipilih, eksekusi query default
      const result = await query;
      return NextResponse.json(result);
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
