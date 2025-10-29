'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PostList from './posts/PostList';

export default function AdminPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sort, setSort] = useState<'asc' | 'desc'>('desc');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/posts?search=${encodeURIComponent(search)}&sort=${sort}&page=${page}&category=${selectedCategory}`);
            const data = await res.json();
            setPosts(data.posts);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data || []);
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchPosts();
        }, 100);
        return () => clearTimeout(delay);
    }, [search, sort, page, selectedCategory]);

    return (
        <main className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <Link href="/admin/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    ➕ New Post
                </Link>
            </div>

            {/* Search and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded w-full sm:w-1/2"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border px-3 py-2 rounded"
                >
                    <option value="all">All Categories</option>
                    {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
                    className="border p-2 rounded w-full sm:w-1/4"
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
            </div>

            {/* Post List */}
            {loading ? (
                <p className="text-gray-500">Loading posts...</p>
            ) : posts.length > 0 ? (
                <PostList posts={posts} />
            ) : (
                <p className="text-gray-500">No posts found.</p>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center gap-3 mt-6">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    ⬅ Previous
                </button>
                <span className="px-2 py-2 text-gray-700">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Next ➡
                </button>
            </div>
        </main>
    );
}
