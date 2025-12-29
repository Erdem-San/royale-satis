'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { BlogCategory } from '@/types/blog';
import toast from 'react-hot-toast';

export default function AdminBlogCategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/blog/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Kategoriler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`"${name}" kategorisini silmek istediğinizden emin misiniz?`)) return;

        try {
            const response = await fetch(`/api/admin/blog/categories/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete category');

            toast.success('Kategori silindi');
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Kategori silinirken bir hata oluştu');
        }
    };

    const handleOpenModal = (category?: BlogCategory) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', description: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', slug: '', description: '' });
    };

    const generateSlug = (name: string) => {
        return name
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

    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: generateSlug(name),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingCategory
                ? `/api/admin/blog/categories/${editingCategory.id}`
                : '/api/admin/blog/categories';

            const method = editingCategory ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save category');
            }

            toast.success(editingCategory ? 'Kategori güncellendi' : 'Kategori oluşturuldu');
            handleCloseModal();
            fetchCategories();
        } catch (error: any) {
            console.error('Error saving category:', error);
            toast.error(error.message || 'Kategori kaydedilirken bir hata oluştu');
        }
    };

    return (
        <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">
                        Blog Kategorileri
                    </h2>
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Kategori
                    </button>
                </div>

                {/* Categories List */}
                <div className="overflow-hidden bg-[#1F2228] shadow-sm sm:rounded-lg border border-gray-800">
                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto" />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <h3 className="text-xl font-semibold text-white mb-2">Kategori bulunamadı</h3>
                                <p className="text-gray-400 mb-6">İlk kategorinizi oluşturarak başlayın</p>
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Kategori Oluştur
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-[#252830]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            İsim
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Slug
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Açıklama
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-[#252830] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white">{category.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-400">/{category.slug}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-400 line-clamp-2">
                                                    {category.description || '—'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(category)}
                                                        className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/20 rounded transition-colors"
                                                        title="Düzenle"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category.id, category.name)}
                                                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                                                        title="Sil"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#1F2228] rounded-lg border border-gray-800 max-w-md w-full">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-white mb-4">
                                    {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            İsim *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleNameChange(e.target.value)}
                                            className="w-full rounded-md border-gray-600 bg-[#252830] text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                            placeholder="Kategori ismi"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Slug *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                            className="w-full rounded-md border-gray-600 bg-[#252830] text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                            placeholder="kategori-slug"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Açıklama
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            rows={3}
                                            className="w-full rounded-md border-gray-600 bg-[#252830] text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Kategori açıklaması"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="flex-1 rounded-md bg-[#252830] px-4 py-2 text-sm font-semibold text-gray-200 shadow-sm hover:bg-[#2a2d35] border border-gray-700"
                                        >
                                            İptal
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                        >
                                            {editingCategory ? 'Güncelle' : 'Oluştur'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
