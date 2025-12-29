'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/blog/ImageUpload';
import RichTextEditor from '@/components/blog/RichTextEditor';
import DateTimePicker from '@/components/blog/DateTimePicker';
import TagInput from '@/components/blog/TagInput';
import toast from 'react-hot-toast';
import { BlogCategory } from '@/types/blog';

export default function CreateBlogPostPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [data, setData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: [] as string[],
        is_published: false,
        published_at: '',
        category_id: null as number | null,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/blog/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const handleTitleChange = useCallback((title: string) => {
        const slug = generateSlug(title);
        setData(prev => ({ ...prev, title, slug }));
    }, []);

    const handleContentChange = useCallback((content: string) => {
        setData(prev => ({ ...prev, content }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const response = await fetch('/api/admin/blog/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create post');
            }

            toast.success('Blog yazısı başarıyla oluşturuldu!');
            router.push('/admin/blog/posts');
        } catch (error: any) {
            console.error('Error creating post:', error);
            toast.error(error.message || 'Blog yazısı oluşturulurken bir hata oluştu');
        } finally {
            setProcessing(false);
        }
    };

    const handleSaveAsDraft = async (e: React.MouseEvent) => {
        e.preventDefault();
        setData(prev => ({ ...prev, is_published: false }));
        setTimeout(() => {
            document.getElementById('submit-form')?.click();
        }, 0);
    };

    return (
        <div className="py-6">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">
                        Yeni Blog Yazısı
                    </h2>
                    <Link
                        href="/admin/blog/posts"
                        className="inline-flex items-center rounded-md bg-[#252830] px-4 py-2 text-sm font-semibold text-gray-200 shadow-sm hover:bg-[#2a2d35] border border-gray-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Geri
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Featured Image */}
                    <div className="overflow-hidden bg-[#1F2228] shadow-sm sm:rounded-lg border border-gray-800">
                        <div className="p-6">
                            <ImageUpload
                                value={data.featured_image}
                                onChange={(url) => setData(prev => ({ ...prev, featured_image: url }))}
                                label="Öne Çıkan Görsel"
                            />
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="overflow-hidden bg-[#1F2228] shadow-sm sm:rounded-lg border border-gray-800">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Temel Bilgiler</h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                                        Başlık *
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-600 bg-[#252830] text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                        placeholder="Blog yazısı başlığı"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="slug" className="block text-sm font-medium text-gray-300">
                                        URL (Slug) *
                                    </label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="text-gray-400">/blog/</span>
                                        <input
                                            id="slug"
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => setData(prev => ({ ...prev, slug: e.target.value }))}
                                            className="flex-1 rounded-md border-gray-600 bg-[#252830] text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                            placeholder="url-dostu-baslik"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-300">
                                        Kategori
                                    </label>
                                    <select
                                        id="category_id"
                                        value={data.category_id || ''}
                                        onChange={(e) => setData(prev => ({ ...prev, category_id: e.target.value ? parseInt(e.target.value) : null }))}
                                        className="mt-1 block w-full rounded-md border-gray-600 bg-[#252830] text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">Kategori Seçiniz</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300">
                                        Özet
                                    </label>
                                    <textarea
                                        id="excerpt"
                                        value={data.excerpt}
                                        onChange={(e) => setData(prev => ({ ...prev, excerpt: e.target.value }))}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-600 bg-[#252830] text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Blog yazısının kısa açıklaması"
                                    />
                                    <p className="mt-1 text-xs text-gray-400">
                                        Blog listelerinde ve önizlemelerde gösterilecek
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className="overflow-hidden bg-[#1F2228] shadow-sm sm:rounded-lg border border-gray-800">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-white">İçerik *</h3>
                            </div>
                            <RichTextEditor
                                value={data.content}
                                onChange={handleContentChange}
                                placeholder="Blog içeriğinizi buraya yazın..."
                            />
                        </div>
                    </div>

                    {/* SEO Section */}
                    <div className="overflow-hidden bg-[#1F2228] shadow-sm sm:rounded-lg border border-gray-800">
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-white">SEO Optimizasyonu</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="meta_title" className="block text-sm font-medium text-gray-300">
                                        Meta Başlık
                                    </label>
                                    <input
                                        id="meta_title"
                                        type="text"
                                        value={data.meta_title}
                                        onChange={(e) => setData(prev => ({ ...prev, meta_title: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-600 bg-[#252830] text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="SEO başlığı (boş bırakılırsa yazı başlığı kullanılır)"
                                    />
                                    <p className="mt-1 text-xs text-gray-400">
                                        Önerilen: 50-60 karakter
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="meta_description" className="block text-sm font-medium text-gray-300">
                                        Meta Açıklama
                                    </label>
                                    <textarea
                                        id="meta_description"
                                        value={data.meta_description}
                                        onChange={(e) => setData(prev => ({ ...prev, meta_description: e.target.value }))}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-600 bg-[#252830] text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Arama motorları için kısa açıklama"
                                    />
                                    <p className="mt-1 text-xs text-gray-400">
                                        Önerilen: 150-160 karakter
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="meta_keywords" className="block text-sm font-medium text-gray-300 mb-2">
                                        Meta Anahtar Kelimeler
                                    </label>
                                    <TagInput
                                        value={data.meta_keywords}
                                        onChange={(tags) => setData(prev => ({ ...prev, meta_keywords: tags }))}
                                        placeholder="Etiket ekle ve Enter'a bas..."
                                    />
                                    <p className="mt-1 text-xs text-gray-400">
                                        Enter tuşuna basarak etiket ekleyin
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Publish Options */}
                    <div className="overflow-hidden bg-[#1F2228] shadow-sm sm:rounded-lg border border-gray-800">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Yayınlama Seçenekleri</h3>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_published}
                                        onChange={(e) => setData(prev => ({ ...prev, is_published: e.target.checked }))}
                                        className="h-5 w-5 rounded border-gray-600 bg-[#252830] text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div>
                                        <span className="text-white font-medium">Hemen yayınla</span>
                                        <p className="text-sm text-gray-400">
                                            Bu blog yazısını herkese açık hale getir
                                        </p>
                                    </div>
                                </label>
                                {data.is_published && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Veya Tarih/Saat Belirle
                                        </label>
                                        <DateTimePicker
                                            value={data.published_at}
                                            onChange={(value) => setData(prev => ({ ...prev, published_at: value }))}
                                            label=""
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-4 pt-4">
                        <Link
                            href="/admin/blog/posts"
                            className="rounded-md bg-[#252830] px-6 py-3 text-sm font-semibold text-gray-200 shadow-sm hover:bg-[#2a2d35] border border-gray-700"
                        >
                            İptal
                        </Link>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleSaveAsDraft}
                                disabled={processing}
                                className="rounded-md bg-gray-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 transition-colors disabled:opacity-50"
                            >
                                Taslak Olarak Kaydet
                            </button>
                            <button
                                id="submit-form"
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 inline-flex items-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Oluşturuluyor...
                                    </>
                                ) : (
                                    data.is_published ? 'Yayınla' : 'Oluştur'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
