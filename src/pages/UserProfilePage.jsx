import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Phone,
  Camera,
  Trash2,
  Upload,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userService } from '../services/userService';
import { Button } from '../components/ui/Button';
import { Container } from '../components/layout/Container';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const UserProfilePage = () => {
  const { currentUser, updateUser } = useAuth();
  const toast = useToast();

  // Profile fields state
  const [formData, setFormData] = useState({
    name: '',
    mobile: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Profile Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Security / Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Populate data on mount or when currentUser updates
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        mobile: currentUser.mobile || ''
      });
    }
  }, [currentUser]);

  // Handle image selection with validation (PNG, JPG, JPEG, WEBP <= 5MB)
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid profile image (PNG, JPG, JPEG, or WEBP).', 'Invalid Format');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be 5 MB or smaller.', 'File Too Large');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Upload Selected Image to Cloudinary
  const handleUploadPhoto = async () => {
    if (!imageFile) return;

    setUploadingImage(true);
    try {
      const response = await userService.uploadProfileImage(imageFile);
      if (response.success && response.data?.user) {
        updateUser(response.data.user);
        setImageFile(null);
        setImagePreview(null);
        toast.success('Profile photo uploaded successfully to Cloudinary.', 'Photo Updated');
      } else {
        toast.error(response.message || 'Failed to upload photo.', 'Upload Error');
      }
    } catch (err) {
      toast.error(err.message || 'Error connecting to upload service.', 'Upload Failed');
    } finally {
      setUploadingImage(false);
    }
  };

  // Cancel selected preview
  const handleCancelPreview = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove Profile Image from Cloudinary
  const handleRemovePhoto = async () => {
    if (!currentUser?.profileImage?.url) return;

    if (!window.confirm('Are you sure you want to remove your profile photo?')) {
      return;
    }

    setRemovingImage(true);
    try {
      const response = await userService.removeProfileImage();
      if (response.success && response.data?.user) {
        updateUser(response.data.user);
        toast.success('Profile photo removed. Restored default avatar.', 'Photo Removed');
      } else {
        toast.error(response.message || 'Could not remove photo.', 'Error');
      }
    } catch (err) {
      toast.error(err.message || 'Error removing photo.', 'Removal Failed');
    } finally {
      setRemovingImage(false);
    }
  };

  // Save Name & Mobile
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters long.', 'Validation Error');
      return;
    }

    const digits = formData.mobile.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      toast.error('Please enter a valid phone number (7-15 digits).', 'Validation Error');
      return;
    }

    setSavingProfile(true);
    try {
      const response = await userService.updateProfile({
        name: formData.name.trim(),
        mobile: formData.mobile.trim()
      });

      if (response.success && response.data) {
        updateUser(response.data);
        toast.success('Your profile has been updated.', 'Profile Saved');
      } else {
        toast.error(response.message || 'Failed to update profile.', 'Error');
      }
    } catch (err) {
      toast.error(err.message || 'Unable to update profile.', 'Error');
    } finally {
      setSavingProfile(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please fill in both current and new password.', 'Required Fields');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.', 'Weak Password');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match.', 'Password Mismatch');
      return;
    }

    setSavingPassword(true);
    try {
      const response = await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.success) {
        toast.success('Your password has been changed successfully.', 'Security Updated');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(response.message || 'Failed to update password.', 'Error');
      }
    } catch (err) {
      toast.error(err.message || 'Current password incorrect.', 'Change Failed');
    } finally {
      setSavingPassword(false);
    }
  };

  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const currentDisplayPhoto = imagePreview || currentUser?.profileImage?.url;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-10 sm:py-14">
      <Container size="lg">
        {/* Top Breadcrumb Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/user/dashboard"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-xs text-slate-400">Account Preferences</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Profile & Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal identity, Cloudinary profile photo, and security credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Cloudinary Profile Photo */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 text-center">
              <h2 className="text-sm font-display font-bold text-slate-900 mb-4">
                Profile Photo
              </h2>

              {/* Avatar Frame */}
              <div className="relative mx-auto w-32 h-32 rounded-3xl overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-display text-4xl font-bold shadow-card border-4 border-white ring-2 ring-slate-100 mb-4">
                {currentDisplayPhoto ? (
                  <img
                    src={currentDisplayPhoto}
                    alt={currentUser?.name || 'Avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}

                {/* Upload Spinner Overlay */}
                {(uploadingImage || removingImage) && (
                  <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center text-white backdrop-blur-xs">
                    <LoadingSpinner size="sm" message="" />
                  </div>
                )}
              </div>

              {/* Photo Actions */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />

              {imageFile ? (
                <div className="space-y-2">
                  <p className="text-xs text-emerald-600 font-semibold truncate">
                    Ready: {imageFile.name}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 text-xs font-semibold"
                      onClick={handleUploadPhoto}
                      loading={uploadingImage}
                    >
                      Confirm Upload
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={handleCancelPreview}
                      disabled={uploadingImage}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <Button
                    variant="outline"
                    size="sm"
                    iconLeft={Camera}
                    className="w-full text-xs font-semibold"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage || removingImage}
                  >
                    {currentUser?.profileImage?.url ? 'Replace Photo' : 'Upload Photo'}
                  </Button>

                  {currentUser?.profileImage?.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconLeft={Trash2}
                      className="w-full text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={handleRemovePhoto}
                      loading={removingImage}
                    >
                      Remove Photo
                    </Button>
                  )}
                </div>
              )}

              <p className="text-[11px] text-slate-400 mt-4">
                Supported formats: PNG, JPG, JPEG, WEBP. Max size: 5 MB. Stored securely on Cloudinary.
              </p>
            </div>

            {/* Account Status Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Security & Status
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Email Verification</span>
                  {currentUser?.emailVerified ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                      <Clock className="w-3.5 h-3.5" />
                      Pending
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Account Tier</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {currentUser?.role || 'User'} Traveler
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500">Member Since</span>
                  <span className="font-medium text-slate-700">
                    {currentUser?.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'Recently Joined'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Personal Information & Password */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Details Form */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-extrabold text-slate-900">
                    Personal Information
                  </h2>
                  <p className="text-xs text-slate-500">
                    Update your display name and contact mobile number.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      minLength={2}
                      maxLength={100}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                      placeholder="Your full name"
                    />
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={currentUser?.email || ''}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-500 cursor-not-allowed"
                        title="Email address cannot be modified directly"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Primary verified identity (read-only).
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                        placeholder="+91 98765 43210"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Used for booking confirmations and traveler alerts.
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={savingProfile}
                    className="font-semibold text-xs px-6"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>

            {/* Change Password / Security Section */}
            <div id="settings" className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-extrabold text-slate-900">
                    Security & Password
                  </h2>
                  <p className="text-xs text-slate-500">
                    Keep your account secure by updating your secret password.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                      placeholder="Enter your current password"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        required
                        minLength={8}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                        placeholder="Min. 8 characters"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                        placeholder="Re-type new password"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    loading={savingPassword}
                    className="font-semibold text-xs px-6 text-slate-800"
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default UserProfilePage;
