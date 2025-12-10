'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, User, MapPin, Building } from 'lucide-react';
import { profileAPI } from '@/lib/api';

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    companyName: '',
    siret: '',
    website: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.getProfile();
        const user = response.profile;
        
        const address = user.address || {};
        
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          street: address.street || '',
          city: address.city || '',
          postalCode: address.postalCode || '',
          country: address.country || '',
          companyName: user.companyName || '',
          siret: user.siret || '',
          website: user.website || '',
        });
        setUserRole(user.role);
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const address = {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      };
      
      await profileAPI.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        address,
        companyName: formData.companyName,
        siret: formData.siret,
        website: formData.website,
      });
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F3FF] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-neutral-300 border-t-[#4B2377] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/profile" 
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-[#4B2377] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au profil</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-neutral-900 mb-2">
            Modifier mon profil
          </h1>
          <div className="w-24 h-px bg-[#4B2377]"></div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white border border-neutral-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informations personnelles */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-[#4B2377]" />
                <h2 className="text-xl font-semibold text-neutral-900">
                  Informations personnelles
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div className="pt-8 border-t border-neutral-200">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-[#4B2377]" />
                <h2 className="text-xl font-semibold text-neutral-900">
                  Adresse
                </h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-neutral-700 mb-2">
                    Rue
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                    placeholder="123 Avenue des Champs-Élysées"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                      placeholder="75008"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                      placeholder="Paris"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-2">
                      Pays
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                      placeholder="France"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Informations professionnelles */}
            {userRole === 'professionnel' && (
              <div className="pt-8 border-t border-neutral-200">
                <div className="flex items-center gap-2 mb-6">
                  <Building className="w-5 h-5 text-[#4B2377]" />
                  <h2 className="text-xl font-semibold text-neutral-900">
                    Informations professionnelles
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-neutral-700 mb-2">
                      Nom de l'entreprise
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                      placeholder="Purple Dog SARL"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="siret" className="block text-sm font-medium text-neutral-700 mb-2">
                        SIRET
                      </label>
                      <input
                        type="text"
                        id="siret"
                        name="siret"
                        value={formData.siret}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                        placeholder="123 456 789 00012"
                      />
                    </div>

                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-neutral-700 mb-2">
                        Site web
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                        placeholder="https://www.exemple.fr"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row gap-4 justify-end">
              <Link
                href="/profile"
                className="px-6 py-3 border border-neutral-300 text-neutral-700 hover:border-[#4B2377] hover:text-[#4B2377] transition-colors text-center"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#4B2377] text-white hover:bg-[#3d1d61] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Enregistrer les modifications</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
