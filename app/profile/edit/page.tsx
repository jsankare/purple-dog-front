'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Camera } from 'lucide-react';
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4B2377] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50/30 to-neutral-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/profile" 
              className="text-neutral-600 hover:text-[#4B2377] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-light tracking-tight text-neutral-900">
              Modifier le <span className="text-[#4B2377] font-normal">Profil</span>
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200/50 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-[#4B2377] to-purple-700">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <img 
                    src="https://ui-avatars.com/api/?name=Alexandra+Dubois&size=128&background=4B2377&color=fff" 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#4B2377] rounded-full flex items-center justify-center shadow-lg hover:bg-purple-800 transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-900 uppercase tracking-wider">Adresse</h3>
                
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
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
                    placeholder="123 Avenue des Champs-Élysées"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
                      placeholder="Paris"
                    />
                  </div>

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
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
                      placeholder="75008"
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
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
                      placeholder="France"
                    />
                  </div>
                </div>
              </div>

              {userRole === 'professionnel' && (
                <>
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
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
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
                        className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
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
                        className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-6 border-t border-neutral-200">
                <Link
                  href="/profile"
                  className="flex-1 px-6 py-3 text-center rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Annuler
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-lg bg-[#4B2377] text-white hover:bg-purple-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
