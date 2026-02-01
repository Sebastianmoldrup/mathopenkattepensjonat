"use client";

import { useState, useEffect } from "react";
import type { Profile, ProfileFormData } from "@/types";

interface ProfileFormProps {
  initialData: Profile | null;
  onSubmit: (data: ProfileFormData) => void;
  isLoading: boolean;
  isOnboarding?: boolean;
}

export default function ProfileForm({
  initialData,
  onSubmit,
  isLoading,
  isOnboarding,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
    emergency_contact: "",
    notes: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || "",
        last_name: initialData.last_name || "",
        address: initialData.address || "",
        phone: initialData.phone || "",
        emergency_contact: initialData.emergency_contact || "",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  const isValid =
    formData.first_name &&
    formData.last_name &&
    formData.address &&
    formData.phone;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fornavn <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
            placeholder="Ola"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Etternavn <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
            placeholder="Nordmann"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Adresse <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          placeholder="Eksempelveien 1, 0123 Oslo"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Telefonnummer <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          placeholder="+47 123 45 678"
        />
      </div>

      {/* Emergency Contact */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nødkontakt (valgfritt)
        </label>
        <input
          type="text"
          name="emergency_contact"
          value={formData.emergency_contact}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          placeholder="Navn og telefonnummer"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Notater (valgfritt)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          placeholder="Spesielle ønsker eller informasjon vi bør vite om..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="text-red-500">*</span> Obligatoriske felt
        </p>
        <button
          type="submit"
          disabled={isLoading || !isValid}
          className={`
            px-8 py-3 rounded-xl font-semibold transition
            ${
              isLoading || !isValid
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg"
            }
          `}
        >
          {isLoading
            ? "Lagrer..."
            : isOnboarding
              ? "Fortsett"
              : "Lagre endringer"}
        </button>
      </div>
    </form>
  );
}
