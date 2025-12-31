/**
 * GDPR Service - Data Export & Account Deletion
 */

import { apiService } from './apiService';
import { showSuccess, showError } from './toastService';

/**
 * Exportiere alle Benutzerdaten als JSON
 */
export async function exportUserData() {
  try {
    const response = await apiService.get('/api/gdpr/export');
    
    // Erstelle Download-Link für JSON-Datei
    const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aura-presence-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showSuccess('Daten erfolgreich exportiert');
    return response.data;
  } catch (error) {
    showError('Fehler beim Exportieren der Daten');
    throw error;
  }
}

/**
 * Account löschen (Soft Delete - wird nach 30 Tagen permanent gelöscht)
 */
export async function deleteAccount(password) {
  try {
    const response = await apiService.delete('/api/gdpr/delete', {
      data: { password }
    });
    
    showSuccess('Account wurde zur Löschung markiert. Löschung erfolgt in 30 Tagen.');
    return response.data;
  } catch (error) {
    showError(error.response?.data?.message || 'Fehler beim Löschen des Accounts');
    throw error;
  }
}

/**
 * Account-Löschung abbrechen (innerhalb von 30 Tagen möglich)
 */
export async function cancelAccountDeletion() {
  try {
    const response = await apiService.post('/api/gdpr/cancel-deletion');
    showSuccess('Account-Löschung wurde abgebrochen');
    return response.data;
  } catch (error) {
    showError('Fehler beim Abbrechen der Löschung');
    throw error;
  }
}

