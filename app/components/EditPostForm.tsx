'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditPostForm({ post }: { post: any }) {
    const router = useRouter();

    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        post.categories?.map((c: any) => c.name) || []
    );

    const [formData, setFormData] = useState({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
    });

    useEffect(() => {
        (async () => {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data.map((c: any) => c.name));
        })();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleCategory = (cat: string) => {
        setSelectedCategories((prev) =>
            prev.includes(cat)
                ? prev.filter((c) => c !== cat)
                : [...prev, cat]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`/api/posts/${post.slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, categories: selectedCategories }),
        });

        if (res.ok) {
            toast.success('Post updated successfully!');
            router.push('/admin');
            router.refresh();
        } else {
            const data = await res.json();
            toast.error(`Failed: ${data.error || 'Unknown error'}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full border p-2 rounded"
            />
            <input
                type="text"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Excerpt"
                className="w-full border p-2 rounded"
            />
            <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Author"
                className="w-full border p-2 rounded"
            />
            <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Post content..."
                rows={8}
                className="w-full border p-2 rounded"
            />

            <div>
                <label className="font-semibold">Select Categories:</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat)}
                                onChange={() => toggleCategory(cat)}
                            />
                            {cat}
                        </label>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Update Post
            </button>
        </form>
    );
}
