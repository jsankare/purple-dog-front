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
    iban: '',
    bic: '',
    accountHolder: '',
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
          iban: user.bankDetails?.iban || '',
          bic: user.bankDetails?.bic || '',
          accountHolder: user.bankDetails?.accountHolderName || '',
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

      const bankInfo = {
        iban: formData.iban,
        bic: formData.bic,
        accountHolder: formData.accountHolder,
      };
      
      await profileAPI.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        address,
        companyName: formData.companyName,
        siret: formData.siret,
        website: formData.website,
        bankInfo,
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link 
          href="/profile" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-[#4B2377] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200/50 overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-[#4B2377] to-purple-700">
            <div className="absolute -bottom-10 left-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <img 
                    src="https://ui-avatars.com/api/?name=Alexandra+Dubois&size=80&background=4B2377&color=fff" 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-[#4B2377] rounded-full flex items-center justify-center shadow-lg hover:bg-purple-800 transition-colors">
                  <Camera className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-12 px-6 pb-6">
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all text-sm"
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
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-900 uppercase tracking-wider">Adresse</h3>
                
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-neutral-700 mb-1">
                    Rue
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all text-sm"
                    placeholder="123 Avenue des Champs-Élysées"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all text-sm"
                      placeholder="Paris"
                    />
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-1">
                      Code postal
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all text-sm"
                      placeholder="75008"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">
                      Pays
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all text-sm"
                      placeholder="France"
                    />
                  </div>
                </div>
              </div>

              {userRole === 'professionnel' && (
                <>
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-neutral-700 mb-1">
                      Nom de l'entreprise
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="siret" className="block text-sm font-medium text-neutral-700 mb-1">
                        SIRET
                      </label>
                      <input
                        type="text"
                        id="siret"
                        name="siret"
                        value={formData.siret}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-neutral-700 mb-1">
                        Site web
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all text-sm"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-900 uppercase tracking-wider">Informations bancaires</h3>
                
                <div>
                  <label htmlFor="accountHolder" className="block text-sm font-medium text-neutral-700 mb-1">
                    Titulaire du compte
                  </label>
                  <input
                    type="text"
                    id="accountHolder"
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all text-sm"
                    placeholder="Prénom Nom"
                  />
                </div>

                <div>
                  <label htmlFor="iban" className="block text-sm font-medium text-neutral-700 mb-1">
                    IBAN
                  </label>
                  <input
                    type="text"
                    id="iban"
                    name="iban"
                    value={formData.iban}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all text-sm font-mono"
                    placeholder="FR76 1234 5678 9012 3456 7890 123"
                  />
                </div>

                <div>
                  <label htmlFor="bic" className="block text-sm font-medium text-neutral-700 mb-1">
                    BIC / SWIFT
                  </label>
                  <input
                    type="text"
                    id="bic"
                    name="bic"
                    value={formData.bic}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all text-sm font-mono"
                    placeholder="BNPAFRPPXXX"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                  <p className="font-medium mb-1">🔒 Sécurité</p>
                  <p>Vos informations bancaires sont cryptées et sécurisées. Elles ne seront utilisées que pour les transactions liées à votre compte.</p>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-neutral-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-lg bg-[#4B2377] text-white hover:bg-purple-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
