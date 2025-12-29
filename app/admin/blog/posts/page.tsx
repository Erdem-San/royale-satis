'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, Search, Loader2 } from 'lucide-react';
import { BlogPost, PaginatedBlogPosts } from '@/types/blog';
import toast from 'react-hot-toast';

export default function AdminBlogPostsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [posts, setPosts] = useState<PaginatedBlogPosts | null>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: searchParams.get('status') || 'all',
        search: searchParams.get('search') || '',
    });
    const [searchTerm, setSearchTerm] = useState(filters.search);

    useEffect(() => {
        fetchPosts();
    }, [filters]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.status !== 'all') params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);

            const response = await fetch(`/api/admin/blog/posts?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Blog yazıları yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, title: string) => {
        if (!confirm(`"${title}" yazısını silmek istediğinizden emin misiniz?`)) return;

        try {
            const response = await fetch(`/api/admin/blog/posts/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete post');

            toast.success('Blog yazısı silindi');
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Blog yazısı silinirken bir hata oluştu');
        }
    };

    const handleFilterChange = (status: string) => {
        setFilters({ ...filters, status });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters({ ...filters, search: searchTerm });
    };

    const formatDate = (date: string | null) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">
                        Blog Yazıları
                    </h2>
                    <Link
                        href="/admin/blog/posts/create"
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Yazı
                    </Link>
                </div>

                {/* Filters and Search */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Status Filters */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleFilterChange('all')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filters.status === 'all'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-[#1F2228] text-gray-300 hover:bg-[#252830] border border-gray-700'
                                    }`}
                            >
                                Tümü ({posts?.total || 0})
                            </button>
                            <button
                                onClick={() => handleFilterChange('published')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filters.status === 'published'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-[#1F2228] text-gray-300 hover:bg-[#252830] border border-gray-700'
                                    }`}
                            >
                                Yayında
                            </button>
                            <button
                                onClick={() => handleFilterChange('draft')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filters.status === 'draft'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-[#1F2228] text-gray-300 hover:bg-[#252830] border border-gray-700'
                                    }`}
                            >
                                Taslak
                            </button>
                        </div>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Blog yazılarında ara..."
                                    className="w-full rounded-md border-gray-600 bg-[#1F2228] text-white shadow-sm pl-10 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                            <button
                                type="submit"
                                className="rounded-md bg-[#252830] px-4 py-2 text-sm font-semibold text-gray-200 shadow-sm hover:bg-[#2a2d35] border border-gray-700 transition-colors"
                            >
                                Ara
                            </button>
                        </form>
                    </div>
                </div>

                {/* Blog List */}
                <div className="overflow-hidden bg-[#1F2228] shadow-sm sm:rounded-lg border border-gray-800">
                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto" />
                        </div>
                    ) : !posts || posts.data.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 bg-[#252830] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Blog yazısı bulunamadı</h3>
                                <p className="text-gray-400 mb-6">İlk blog yazınızı oluşturarak başlayın</p>
                                <Link
                                    href="/admin/blog/posts/create"
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Blog Yazısı Oluştur
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 space-y-6">
                            {posts.data.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-[#252830] border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors"
                                >
                                    <div className="flex flex-col md:flex-row gap-6 p-6">
                                        {/* Featured Image */}
                                        <div className="w-full md:w-48 h-32 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                            {post.featured_image ? (
                                                <Image
                                                    src={post.featured_image}
                                                    alt={post.title}
                                                    width={192}
                                                    height={128}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xl font-semibold text-white mb-1 truncate">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-400">
                                                        /{post.slug}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${post.is_published
                                                            ? 'bg-green-900/30 text-green-400'
                                                            : 'bg-gray-700 text-gray-300'
                                                        }`}
                                                >
                                                    {post.is_published ? 'Yayında' : 'Taslak'}
                                                </span>
                                            </div>

                                            {post.excerpt && (
                                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                                    {post.excerpt}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>Oluşturulma: {formatDate(post.created_at)}</span>
                                                    {post.published_at && (
                                                        <span>Yayınlanma: {formatDate(post.published_at)}</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/blog/${post.slug}`}
                                                        target="_blank"
                                                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors"
                                                        title="Görüntüle"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/blog/posts/${post.id}/edit`}
                                                        className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/20 rounded transition-colors"
                                                        title="Düzenle"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(post.id, post.title)}
                                                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                                                        title="Sil"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
