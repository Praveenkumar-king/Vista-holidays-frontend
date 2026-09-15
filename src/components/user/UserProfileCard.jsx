import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Edit3, 
  Settings,
  Camera
} from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * UserProfileCard:
 * Premium summary card presenting user identity, avatar, verified credentials, and quick actions.
 * Protects sensitive fields (never displays password, tokens, or internals).
 */
export const UserProfileCard = ({ user, onEditClick }) => {
  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const avatarUrl = user.profileImage?.url;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-7 relative overflow-hidden transition-all duration-300 hover:shadow-card">
      {/* Decorative Brand Accent Background */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-500 via-teal-500 to-emerald-500" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Profile Picture / Cloudinary Avatar */}
        <div className="relative group">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-display text-2xl font-bold shadow-md border-2 border-white ring-2 ring-slate-100 flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.name || 'User Profile'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <Link
            to="/user/profile"
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md hover:bg-brand-600 transition-colors"
            title="Update Profile Photo"
          >
            <Camera className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* User Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 truncate">
              {user.name}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3 h-3" />
              {user.accountStatus === 'active' ? 'Active Traveler' : user.accountStatus}
            </span>
            {user.emailVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                <CheckCircle2 className="w-3 h-3 text-sky-600" />
                Email Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="w-3 h-3 text-amber-600" />
                Verification Pending
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2 truncate">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{user.mobile || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-col gap-2.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <Link to="/user/profile" className="flex-1 sm:flex-initial">
            <Button
              variant="outline"
              size="sm"
              iconLeft={Edit3}
              className="w-full text-xs font-semibold"
            >
              Edit Profile
            </Button>
          </Link>
          <Link to="/user/profile#settings" className="flex-1 sm:flex-initial">
            <Button
              variant="ghost"
              size="sm"
              iconLeft={Settings}
              className="w-full text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Account Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
