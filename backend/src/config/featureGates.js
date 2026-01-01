/**
 * Feature Gates & Role-based Access Control
 * Definiert welche Features für welche Rollen verfügbar sind
 */

export const FEATURES = {
  BASIC_ANALYSIS: {
    name: 'Basic MediaPipe Analysis',
    roles: ['free', 'pro', 'enterprise'],
  },
  AI_FEEDBACK: {
    name: 'AI-powered Feedback (OpenAI)',
    roles: ['pro', 'enterprise'],
  },
  UNLIMITED_ANALYSIS: {
    name: 'Unlimited Analysis Sessions',
    roles: ['pro', 'enterprise'],
  },
  EXPORT_DATA: {
    name: 'Export Analysis as PDF/JSON',
    roles: ['pro', 'enterprise'],
  },
  TEAM_DASHBOARD: {
    name: 'Team Management & Dashboard',
    roles: ['enterprise'],
  },
  API_ACCESS: {
    name: 'API Access',
    roles: ['enterprise'],
  },
  CUSTOM_BRANDING: {
    name: 'Custom Branding',
    roles: ['enterprise'],
  },
};

export const LIMITS = {
  free: {
    analysisPerMonth: 5,
    sessionDurationMinutes: 15,
    storageRetentionDays: 7,
  },
  pro: {
    analysisPerMonth: -1, // unlimited
    sessionDurationMinutes: -1, // unlimited
    storageRetentionDays: 90,
  },
  enterprise: {
    analysisPerMonth: -1,
    sessionDurationMinutes: -1,
    storageRetentionDays: 365,
  },
};

/**
 * Prüfe ob eine Rolle ein bestimmtes Feature hat
 * @param {string} userRole - Benutzer-Rolle (free/pro/enterprise)
 * @param {string} feature - Feature-Name (z.B. 'AI_FEEDBACK')
 * @returns {boolean}
 */
export function hasFeature(userRole, feature) {
  return FEATURES[feature]?.roles.includes(userRole) || false;
}

/**
 * Hole Limit-Wert für eine Rolle
 * @param {string} userRole - Benutzer-Rolle (free/pro/enterprise)
 * @param {string} limitKey - Limit-Schlüssel (z.B. 'analysisPerMonth')
 * @returns {number}
 */
export function getLimit(userRole, limitKey) {
  return LIMITS[userRole]?.[limitKey] || 0;
}



