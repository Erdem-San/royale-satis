import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');
        const category = searchParams.get('category');

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = supabase
            .from('blog_posts')
            .select(`
        *,
        category:blog_categories(*)
      `, { count: 'exact' })
            .eq('is_published', true)
            .lte('published_at', new Date().toISOString())
            .order('published_at', { ascending: false });

        if (category) {
            query = query.eq('category_id', category);
        }

        const { data, error, count } = await query.range(from, to);

        if (error) {
            console.error('Blog posts fetch error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            data: data || [],
            total: count || 0,
            page,
            pageSize,
            totalPages: Math.ceil((count || 0) / pageSize),
        });
    } catch (error: any) {
        console.error('Blog posts API error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
