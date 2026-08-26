import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_INVENTORY } from '@/lib/mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rypyrhjqpvmkqrhwdmlo.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5cHlyaGpxcHZta3FyaHdkbWxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Nzc2NjE1NSwiZXhwIjoyMTAzMzQyMTU1fQ.AAl9oQ-fkVEvPxWgXpV7xtZUysNMODzPsvHjcQAR7to';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // If database table is currently empty, auto-seed the 6 realistic showroom cars
    if (!data || data.length === 0) {
      try {
        const seedPayload = INITIAL_INVENTORY.map(c => ({
          id: c.id,
          name: c.name,
          brand: c.brand,
          model: c.model,
          variant: c.variant || '',
          category: c.category,
          price: c.price,
          price_value: c.priceValue,
          year: c.year,
          fuel: c.fuel,
          transmission: c.transmission,
          owners: c.owners,
          km_driven: c.kmDriven || '',
          colour: c.colour || '',
          insurance: c.insurance || '',
          fc: c.fc || '',
          service_history: c.serviceHistory || '',
          keys: c.keys || '',
          manual: c.manual || '',
          description: c.description || '',
          status: c.status,
          image: c.image,
          images: c.images || [c.image],
          is_featured: c.isFeatured || false,
          views_count: c.viewsCount || 0,
          whatsapp_clicks: c.whatsappClicks || 0,
          created_at: c.createdAt || new Date().toISOString(),
          updated_at: c.updatedAt || new Date().toISOString()
        }));

        const { data: seededData } = await supabase
          .from('cars')
          .insert(seedPayload)
          .select();

        if (seededData && seededData.length > 0) {
          return NextResponse.json({ success: true, data: seededData });
        }
      } catch (seedErr) {
        console.warn('Auto-seeding failed, returning default inventory:', seedErr);
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('cars')
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Vehicle ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('cars')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Vehicle ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
