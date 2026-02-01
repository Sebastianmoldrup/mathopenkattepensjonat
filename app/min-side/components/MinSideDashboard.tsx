"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, getCats, getBookings } from "@/lib/supabase/utils";
import type { Profile, Cat, Booking } from "@/types";

interface MinSideDashboardProps {
  userId: string;
}

export default function MinSideDashboard({ userId }: MinSideDashboardProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cats, setCats] = useState<Cat[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  async function loadDashboardData() {
    const [profileData, catsData, bookingsData] = await Promise.all([
      getProfile(userId),
      getCats(userId),
      getBookings(userId),
    ]);

    setProfile(profileData);
    setCats(catsData);
    setBookings(bookingsData);
    setLoading(false);
  }

  if (loading) {
    return <div className="text-center py-8">Laster...</div>;
  }

  const upcomingBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed",
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
        Velkommen, {profile?.first_name || "til Min side"}! 🐾
      </h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-semibold mb-1">Mine katter</p>
              <p className="text-3xl font-bold text-blue-900">{cats.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-semibold mb-1">
                Kommende bookinger
              </p>
              <p className="text-3xl font-bold text-green-900">
                {upcomingBookings.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-semibold mb-1">
                Totale bookinger
              </p>
              <p className="text-3xl font-bold text-purple-900">
                {bookings.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8 border border-orange-200 mb-8">
        <h2 className="text-2xl font-bold mb-6">Hurtigvalg</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/booking")}
            className="bg-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 hover:text-white border-2 border-orange-300 rounded-xl p-6 text-left transition group"
          >
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="font-bold text-lg mb-1">Ny booking</h3>
                <p className="text-sm text-gray-600 group-hover:text-white">
                  Book opphold for katten din
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/min-side/mine-katter/ny")}
            className="bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white border-2 border-blue-300 rounded-xl p-6 text-left transition group"
          >
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="font-bold text-lg mb-1">Legg til katt</h3>
                <p className="text-sm text-gray-600 group-hover:text-white">
                  Registrer en ny katt
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Cats */}
      {cats.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Dine katter</h2>
            <button
              onClick={() => router.push("/min-side/mine-katter")}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Se alle →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cats.slice(0, 3).map((cat) => (
              <div
                key={cat.id}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 cursor-pointer hover:shadow-lg transition"
                onClick={() => router.push(`/min-side/mine-katter/${cat.id}`)}
              >
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-bold text-lg">{cat.name}</h3>
                <p className="text-sm text-gray-600">
                  {cat.breed || "Blanding"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Booking */}
      {upcomingBookings.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Neste booking</h2>
            <button
              onClick={() => router.push("/min-side/mine-bookinger")}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Se alle bookinger →
            </button>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Check-in</p>
                <p className="text-xl font-bold">
                  {new Date(upcomingBookings[0].start_date).toLocaleDateString(
                    "nb-NO",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Check-out</p>
                <p className="text-xl font-bold">
                  {new Date(upcomingBookings[0].end_date).toLocaleDateString(
                    "nb-NO",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-green-200 pt-4">
              <div>
                <p className="text-sm text-gray-600">Antall katter</p>
                <p className="font-semibold">
                  {upcomingBookings[0].cats?.length || 0}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total pris</p>
                <p className="font-semibold text-lg">
                  {upcomingBookings[0].total_price} kr
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
