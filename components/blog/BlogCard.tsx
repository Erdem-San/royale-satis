'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';

interface BlogCardProps {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image: string | null;
    published_at: string | null;
}

export default function BlogCard({
    id,
    title,
    slug,
    excerpt,
    featured_image,
    published_at
}: BlogCardProps) {
    const formatDate = (date: string | null) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Link
            href={`/blog/${slug}`}
            className="group block bg-[#1F2228] rounded-xl overflow-hidden border border-gray-800 hover:border-indigo-600 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-600/10"
        >
            {/* Featured Image */}
            <div className="relative h-48 bg-gray-800 overflow-hidden">
                {featured_image ? (
                    <Image
                        src={featured_image}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Date */}
                {published_at && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(published_at)}</span>
                    </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {title}
                </h3>

                {/* Excerpt */}
                {excerpt && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {excerpt}
                    </p>
                )}

                {/* Read More */}
                <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>Devamını Oku</span>
                    <ArrowRight className="h-4 w-4" />
                </div>
            </div>
        </Link>
    );
}
