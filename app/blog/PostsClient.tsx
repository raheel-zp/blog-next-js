"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Post } from "@/types/post";
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export default function PostsClient() {

    const { data, isLoading, error } = useQuery({
        queryKey: ['posts'],
        queryFn: () => fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`).then(res => res.json()),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading posts</div>

    const posts: Post[] = Array.isArray(data) ? data : data.posts;
    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
            <div className="space-y-6">
                {posts.map((post: Post) => (
                    <article key={post.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
                        {post.image &&
                            <Image
                                src={post.image}
                                alt={post.title}
                                width={600}
                                height={300}
                                className="rounded mb-3"
                            />
                        }
                        {!post.image &&
                            <Image
                                src={`/images/placeholder.png`}
                                alt={post.title}
                                width={600}
                                height={300}
                                className="rounded mb-3"
                            />
                        }
                        <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                        <p className="text-gray-600 mb-3">{post.excerpt}</p>
                        <Link href={`/blog/${post.slug}`} className="text-blue-600 font-medium">
                            Read More →
                        </Link>
                    </article>
                ))}
            </div>
        </main>
    );
}
