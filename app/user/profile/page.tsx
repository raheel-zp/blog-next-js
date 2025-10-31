"use client"

import { useState, useEffect } from "react"
import { User, Mail, Shield, Edit } from "lucide-react"

interface UserProfile {
    id: number
    name: string
    email: string
    role: string
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/users/profile")
                const data = await res.json()
                setUser(data)
            } catch (err) {
                console.error("Failed to fetch user:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                Loading profile...
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-600">
                No user found.
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition">
                        <Edit className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex flex-col items-center text-center space-y-4 mt-6">
                    <div className="w-24 h-24 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-md">
                        {user.name.charAt(0).toUpperCase()}
                    </div>

                    <h3 className="text-xl font-medium text-gray-900">{user.name}</h3>
                    <p className="text-gray-500">{user.email}</p>
                </div>

                <div className="border-t pt-6 space-y-4">
                    <div className="flex items-center gap-3 text-gray-700">
                        <User className="w-5 h-5 text-indigo-500" />
                        <span><strong>Name:</strong> {user.name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-indigo-500" />
                        <span><strong>Email:</strong> {user.email}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                        <Shield className="w-5 h-5 text-indigo-500" />
                        <span><strong>Role:</strong> {user.role}</span>
                    </div>
                </div>

                <button
                    className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition shadow-md"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    )
}
