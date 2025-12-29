'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogCard from '@/components/blog/BlogCard';
import { BlogPost, PaginatedBlogPosts } from '@/types/blog';
import { Loader2 } from 'lucide-react';

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
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a1b1e]">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 text-white py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Blog
                        </h1>
                        <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
                            Son yazılarımızı keşfedin ve güncel içeriklerimizi okuyun
                        </p>
                    </div>
                </div>
            </section>

            {/* Blog Grid Section */}
            <section className="py-12 md:py-16 lg:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        {!posts || posts.data.length === 0 ? (
                            /* Empty State */
                            <div className="text-center py-20">
                                <div className="max-w-md mx-auto">
                                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    </div>
                </div>
            </section>
        </div>
    );
}
