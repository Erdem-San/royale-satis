'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { Calendar, ArrowLeft, Loader2, Tag } from 'lucide-react';

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/blog/posts/${slug}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError('Blog yazısı bulunamadı');
                } else {
                    throw new Error('Failed to fetch post');
                }
                return;
            }
            const data = await response.json();
            setPost(data);
        } catch (error) {
            console.error('Error fetching post:', error);
            setError('Blog yazısı yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string | null) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1b1e] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-[#1a1b1e] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">{error || 'Blog yazısı bulunamadı'}</h1>
                    <Link href="/blog" className="text-indigo-400 hover:text-indigo-300">
                        Blog sayfasına dön
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a1b1e]">
            {/* Header */}
            <div className="bg-[#1F2228] border-b border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Bloga Dön</span>
                    </Link>
                </div>
            </div>

            {/* Article */}
            <article className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Featured Image */}
                        {post.featured_image && (
                            <div className="relative h-96 rounded-xl overflow-hidden mb-8">
                                <Image
                                    src={post.featured_image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
                            {post.published_at && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(post.published_at)}</span>
                                </div>
                            )}
                            {post.category && (
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-xs font-medium">
                                        {post.category.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        {post.excerpt && (
                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Content */}
                        <div
                            className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white 
                prose-p:text-gray-300 
                prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300
                prose-strong:text-white
                prose-code:text-indigo-400 prose-code:bg-indigo-900/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-[#1F2228] prose-pre:border prose-pre:border-gray-700
                prose-img:rounded-lg
                prose-blockquote:border-l-indigo-500 prose-blockquote:text-gray-300
                prose-ul:text-gray-300
                prose-ol:text-gray-300
                prose-li:text-gray-300"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </div>
            </article>
        </div>
    );
}
