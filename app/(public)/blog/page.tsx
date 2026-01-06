'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogCard from '@/components/blog/BlogCard';
import { BlogPost, PaginatedBlogPosts } from '@/types/blog';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
    const searchParams = useSearchParams();
    const [posts, setPosts] = useState<PaginatedBlogPosts | null>(null);
    const [loading, setLoading] = useState(true);
    const page = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/blog/posts?page=${page}&pageSize=9`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1b1e] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a1b1e]">

            {/* Container to center content */}
            <div className="container mx-auto px-4 py-6">
                {/* Breadcrumb - Badges style matching screenshot */}
                <div className="flex items-center gap-2 mb-4 text-[11px] font-bold text-gray-400">
                    <Link href="/" className="px-3 py-1 bg-[#252830] rounded-lg hover:bg-gray-700 hover:text-white transition-colors">
                        Anasayfa
                    </Link>
                    <span className="text-gray-600">&gt;</span>
                    <div className="px-3 py-1 bg-[#252830] rounded-lg text-gray-300">
                        Blog
                    </div>
                </div>


                {/* Hero Banner - Constrained Width & Rounded */}
                <div className="relative w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden mb-6 shadow-2xl">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(https://static-cdn.jtvnw.net/jtv_user_pictures/7101eb6a-01a1-44dc-85cd-ba7338f630df-profile_banner-480.jpeg)` }}
                    />
                    <div className="absolute inset-0 from-blue-900 via-blue-800 to-gray-900 opacity-80 bg-gradient-to-br"></div>
                    <div className="absolute inset-0 bg-black/40"></div>
                    {/* Banner Content (Optional) */}
                    <div className="relative h-full flex items-center justify-center z-10">
                        <div className="text-center">
                            <h1 className="text-4xl font-black text-white tracking-[0.2em] opacity-40 select-none">
                                BLOG
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Blog Grid Section */}
                <section className="py-6 md:py-4 lg:py-6">
                    {!posts || posts.data.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-20">
                            <div className="max-w-md mx-auto">
                                <div className="w-24 h-24 bg-gradient-to-br from-green-900 to-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    Henüz blog yazısı bulunmamaktadır
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Yakında ilginç içerikler için geri dönün!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Blog Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {posts.data.map((post) => (
                                    <BlogCard
                                        key={post.id}
                                        id={post.id}
                                        title={post.title}
                                        slug={post.slug}
                                        excerpt={post.excerpt}
                                        featured_image={post.featured_image}
                                        published_at={post.published_at}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {posts.totalPages > 1 && (
                                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-400">
                                        Toplam <span className="font-medium text-white">{posts.total}</span> yazıdan{' '}
                                        <span className="font-medium text-white">{(page - 1) * posts.pageSize + 1}</span>-
                                        <span className="font-medium text-white">{Math.min(page * posts.pageSize, posts.total)}</span> arası gösteriliyor
                                    </div>
                                    <div className="flex gap-2">
                                        {Array.from({ length: posts.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                            <a
                                                key={pageNum}
                                                href={`/blog?page=${pageNum}`}
                                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${pageNum === page
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-[#1F2228] text-gray-300 hover:bg-[#252830] border border-gray-700'
                                                    }`}
                                            >
                                                {pageNum}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}
