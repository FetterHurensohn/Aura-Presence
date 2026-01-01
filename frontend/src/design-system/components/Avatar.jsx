import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

/**
 * Avatar Component
 * 
 * Zeigt Benutzer-Avatare mit verschiedenen Größen, Status-Indikatoren und Fallbacks.
 * 
 * @param {string} src - Bild-URL
 * @param {string} alt - Alt-Text
 * @param {string} size - Größe: xs, sm, md, lg, xl
 * @param {string} status - Online-Status: online, offline, away, busy
 * @param {string} fallback - Fallback wenn kein Bild: initials, icon
 * @param {string} initials - Initialen (falls fallback='initials')
 * @param {string} className - Zusätzliche CSS-Klassen
 */
const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'md',
  status = null,
  fallback = 'icon',
  initials = '',
  className = '',
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  // Size Classes
  const sizeClasses = {
    xs: 'w-6 h-6 text-caption',    // 24px
    sm: 'w-8 h-8 text-small',      // 32px
    md: 'w-10 h-10 text-body',     // 40px
    lg: 'w-12 h-12 text-h3',       // 48px
    xl: 'w-16 h-16 text-h2',       // 64px
  };

  // Status Indicator Sizes
  const statusSizeClasses = {
    xs: 'w-2 h-2 border',
    sm: 'w-2.5 h-2.5 border',
    md: 'w-3 h-3 border-2',
    lg: 'w-3.5 h-3.5 border-2',
    xl: 'w-4 h-4 border-2',
  };

  // Status Colors
  const statusColors = {
    online: 'bg-success',
    offline: 'bg-muted-500',
    away: 'bg-yellow-500',
    busy: 'bg-danger',
  };

  const avatarClasses = [
    'relative inline-flex items-center justify-center',
    'rounded-full overflow-hidden',
    'bg-surface-700 text-muted-500',
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ');

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Render Avatar Content
  const renderContent = () => {
    // Show image if available and not errored
    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={alt}
          onError={handleImageError}
          className="w-full h-full object-cover"
        />
      );
    }

    // Fallback: Initials
    if (fallback === 'initials' && initials) {
      return (
        <span className="font-semibold uppercase">
          {initials.slice(0, 2)}
        </span>
      );
    }

    // Fallback: Icon
    return (
      <Icon name="user" className="w-1/2 h-1/2" />
    );
  };

  return (
    <div className={avatarClasses} {...props}>
      {renderContent()}

      {/* Status Indicator */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            rounded-full border-bg-900
            ${statusSizeClasses[size]}
            ${statusColors[status]}
          `}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  status: PropTypes.oneOf(['online', 'offline', 'away', 'busy']),
  fallback: PropTypes.oneOf(['initials', 'icon']),
  initials: PropTypes.string,
  className: PropTypes.string,
};

export default Avatar;



