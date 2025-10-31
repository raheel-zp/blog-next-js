'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function NewPostForm({ redirectUrl }: { redirectUrl: string }) {
    const { data: session } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        slug: '',
        categories: [] as string[],
    });

    const [errors, setErrors] = useState<Record<string, string>>({})

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        setIsLoading(true);
        async function loadCategories() {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data.map((cat: { name: string }) => cat.name));
            setIsLoading(false);
        }
        loadCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'title' && { slug: value.toLowerCase().replace(/\s+/g, '-') }),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);
        const res = await fetch('/api/posts/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.status === 400) {
            const data = await res.json();
            const fieldErrors: Record<string, string> = {};
            const err = data.errors ?? data;

            if (err && typeof err === 'object' && !Array.isArray(err)) {
                for (const [key, value] of Object.entries(err)) {
                    if (Array.isArray(value) && value.length > 0) {
                        fieldErrors[key] = String(value[0]);
                    } else if (value) {
                        fieldErrors[key] = String(value);
                    }
                }
            }
            setErrors(fieldErrors);
            return;
        }

        if (res.ok) {
            router.push(redirectUrl);
        } else {
            toast.error('Failed to create post');
        }

        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full border p-2 rounded"
                    required
                />
                {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
            </div>
            <div>
                <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="Slug (e.g., my-first-post)"
                    className="w-full border p-2 rounded"
                    required
                />
                {errors.slug && (
                    <p className="text-red-600 text-sm">{errors.slug}</p>
                )}
            </div>
            <div>
                <input
                    type="text"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Excerpt"
                    className="w-full border p-2 rounded"
                />
                {errors.excerpt && (
                    <p className="text-red-600 text-sm">{errors.excerpt}</p>
                )}
            </div>
            <div>
                <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author"
                    className="w-full border p-2 rounded"
                />
                {errors.author && (
                    <p className="text-red-600 text-sm">{errors.author}</p>
                )}
            </div>
            <div>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Post content..."
                    rows={8}
                    className="w-full border p-2 rounded"
                />
                {errors.content && (
                    <p className="text-red-600 text-sm">{errors.content}</p>
                )}
            </div>
            {isLoading ? <p>Loading Categories</p> :
                < div >
                    <label className="block mb-1 font-medium">Categories</label>

                    <div className="flex flex-wrap gap-2 border rounded p-2">
                        {formData.categories.map((category) => (
                            <span
                                key={category}
                                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                            >
                                {category}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            categories: prev.categories.filter((c) => c !== category),
                                        }))
                                    }
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    ✕
                                </button>
                            </span>
                        ))}

                        <input
                            type="text"
                            placeholder="Add or select categories..."
                            className="flex-1 outline-none p-1"
                            onChange={(e) => {
                                const value = e.target.value.trim();

                                // show suggestions dynamically
                                const matches = categories.filter(
                                    (cat) =>
                                        cat.toLowerCase().includes(value.toLowerCase()) &&
                                        !formData.categories.includes(cat)
                                );
                                setSuggestions(value ? matches.slice(0, 5) : []);
                                setNewCategory(value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && newCategory) {
                                    e.preventDefault();
                                    if (!formData.categories.includes(newCategory)) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            categories: [...prev.categories, newCategory],
                                        }));
                                    }
                                    setNewCategory('');
                                    setSuggestions([]);
                                }
                            }}
                            value={newCategory}
                        />
                    </div>

                    {suggestions.length > 0 && (
                        <div className="border border-gray-300 rounded mt-1 bg-white shadow-sm max-h-32 overflow-y-auto">
                            {suggestions.map((sug) => (
                                <button
                                    key={sug}
                                    type="button"
                                    className="block w-full text-left px-3 py-2 hover:bg-blue-50"
                                    onClick={() => {
                                        if (!formData.categories.includes(sug)) {
                                            setFormData((prev) => ({
                                                ...prev,
                                                categories: [...prev.categories, sug],
                                            }));
                                        }
                                        setNewCategory('');
                                        setSuggestions([]);
                                    }}
                                >
                                    {sug}
                                </button>
                            ))}
                        </div>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                        Type to search or press <strong>Enter</strong> to add a new category.
                    </p>

                    {errors.categories && (
                        <p className="text-red-600 text-sm">{errors.categories}</p>
                    )}
                </div>
            }
            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Create Post
            </button>
        </form >
    );
}
