/**
 * Account Page - Profile Summary
 * EXAKT 1:1 nach Foto
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../services/authService';
import { showSuccess, showError } from '../services/toastService';
import { useTranslation } from '../i18n/LanguageContext';
import './Account.css';

function Account({ user, onLogout, onUpdateUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t, changeLanguage } = useTranslation();
  
  // Edit Modal States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  
  // Language dropdown state
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  // Toggle dropdown
  const toggleLanguageDropdown = () => {
    console.log('🔵 toggleLanguageDropdown called! Current:', languageDropdownOpen);
    setLanguageDropdownOpen(!languageDropdownOpen);
  };

  // Language display map
  const languageNames = {
    'de': 'Deutsch',
    'en': 'English',
    'fr': 'Français',
    'es': 'Español',
    'it': 'Italiano'
  };

  // Get user initial
  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'J';
  };

  const handleEdit = (field, currentValue) => {
    console.log('🔧 handleEdit called:', { field, currentValue });
    setEditField(field);
    setEditValue(currentValue);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    // Für language ist trim() nicht nötig, da es ein Dropdown ist
    if (editField !== 'language' && (!editValue || editValue.trim().length === 0)) {
      showError('Bitte einen gültigen Wert eingeben');
      return;
    }
    
    // Für language: Prüfe ob ein gültiger Wert ausgewählt wurde
    if (editField === 'language' && !editValue) {
      showError('Bitte eine Sprache auswählen');
      return;
    }

    setLoading(true);
    
    try {
      // Prepare update data based on field
      const updateData = {};
      
      if (editField === 'name') {
        updateData.name = editValue.trim();
      } else if (editField === 'company') {
        updateData.company = editValue.trim();
      } else if (editField === 'country') {
        updateData.country = editValue.trim();
      } else if (editField === 'language') {
        updateData.language = editValue; // Kein trim() für language codes
      } else if (editField === 'password') {
        // TODO: Implement password change separately
        showError('Passwort-Änderung noch nicht implementiert');
        setLoading(false);
        return;
      }

      console.log('🔄 Updating profile with:', updateData);

      // Update profile via API
      const updatedUser = await updateProfile(updateData);
      
      console.log('✅ Profile updated:', updatedUser);
      
      // Update parent component's user state
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      
      showSuccess('Profil erfolgreich aktualisiert');
      setEditModalOpen(false);
      setEditValue('');
    } catch (err) {
      console.error('❌ Fehler beim Aktualisieren:', err);
      showError(err.response?.data?.message || 'Fehler beim Aktualisieren des Profils');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setEditValue('');
  };

  const handleUpgrade = () => {
    console.log('Upgrade clicked');
    // TODO: Implement upgrade to premium
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  // Handle language change
  const handleLanguageChange = async (newLanguage) => {
    console.log('🌐 handleLanguageChange called with:', newLanguage);
    setLoading(true);
    setLanguageDropdownOpen(false);
    
    try {
      // Update language in context (immediate UI update)
      changeLanguage(newLanguage);
      
      console.log('📤 Calling updateProfile...');
      const updatedUser = await updateProfile({ language: newLanguage });
      console.log('✅ updateProfile successful:', updatedUser);
      
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      
      showSuccess(t('messages.languageChanged'));
    } catch (err) {
      console.error('❌ Fehler beim Ändern der Sprache:', err);
      showError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page-new">
      {/* Account Button - fixiert oben rechts */}
      <div className="account-avatar-btn">
        {getUserInitial()}
      </div>

      {/* Content */}
      <div className="account-content-new">
        {/* Profile Summary */}
        <section className="account-section">
          <h1 className="account-main-title">Profile Summary</h1>

          {/* Vor- und Nachname */}
          <div className="profile-field">
            <div className="field-label-bold">Vor- und Nachname:</div>
            <div className="field-row">
              <span className="field-value">{user?.name || 'Nicht angegeben'}</span>
              <button className="edit-icon-btn" onClick={() => handleEdit('name', user?.name || '')}>
                <svg viewBox="0 0 32 32" fill="currentColor">
                  <path d="M25.384,11.987a.993.993,0,0,1-.707-.293L20.434,7.452a1,1,0,0,1,0-1.414l2.122-2.121a3.07,3.07,0,0,1,4.242,0l1.414,1.414a3,3,0,0,1,0,4.242l-2.122,2.121A.993.993,0,0,1,25.384,11.987ZM22.555,6.745l2.829,2.828L26.8,8.159a1,1,0,0,0,0-1.414L25.384,5.331a1.023,1.023,0,0,0-1.414,0Z"/>
                  <path d="M11.9,22.221a2,2,0,0,1-1.933-2.487l.875-3.5a3.02,3.02,0,0,1,.788-1.393l8.8-8.8a1,1,0,0,1,1.414,0l4.243,4.242a1,1,0,0,1,0,1.414l-8.8,8.8a3,3,0,0,1-1.393.79h0l-3.5.875A2.027,2.027,0,0,1,11.9,22.221Zm3.752-1.907h0ZM21.141,8.159l-8.094,8.093a1,1,0,0,0-.262.465l-.876,3.5,3.5-.876a1,1,0,0,0,.464-.263l8.094-8.094Z"/>
                  <path d="M22,29H8a5.006,5.006,0,0,1-5-5V10A5.006,5.006,0,0,1,8,5h9.64a1,1,0,0,1,0,2H8a3,3,0,0,0-3,3V24a3,3,0,0,0,3,3H22a3,3,0,0,0,3-3V14.61a1,1,0,0,1,2,0V24A5.006,5.006,0,0,1,22,29Z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Unternehmen */}
          <div className="profile-field">
            <div className="field-label-bold">Unternehmen:</div>
            <div className="field-row">
              <span className="field-value">{user?.company || 'Nicht angegeben'}</span>
              <button className="edit-icon-btn" onClick={() => handleEdit('company', user?.company || '')}>
                <svg viewBox="0 0 32 32" fill="currentColor">
                  <path d="M25.384,11.987a.993.993,0,0,1-.707-.293L20.434,7.452a1,1,0,0,1,0-1.414l2.122-2.121a3.07,3.07,0,0,1,4.242,0l1.414,1.414a3,3,0,0,1,0,4.242l-2.122,2.121A.993.993,0,0,1,25.384,11.987ZM22.555,6.745l2.829,2.828L26.8,8.159a1,1,0,0,0,0-1.414L25.384,5.331a1.023,1.023,0,0,0-1.414,0Z"/>
                  <path d="M11.9,22.221a2,2,0,0,1-1.933-2.487l.875-3.5a3.02,3.02,0,0,1,.788-1.393l8.8-8.8a1,1,0,0,1,1.414,0l4.243,4.242a1,1,0,0,1,0,1.414l-8.8,8.8a3,3,0,0,1-1.393.79h0l-3.5.875A2.027,2.027,0,0,1,11.9,22.221Zm3.752-1.907h0ZM21.141,8.159l-8.094,8.093a1,1,0,0,0-.262.465l-.876,3.5,3.5-.876a1,1,0,0,0,.464-.263l8.094-8.094Z"/>
                  <path d="M22,29H8a5.006,5.006,0,0,1-5-5V10A5.006,5.006,0,0,1,8,5h9.64a1,1,0,0,1,0,2H8a3,3,0,0,0-3,3V24a3,3,0,0,0,3,3H22a3,3,0,0,0,3-3V14.61a1,1,0,0,1,2,0V24A5.006,5.006,0,0,1,22,29Z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Land */}
          <div className="profile-field">
            <div className="field-label-bold">Land:</div>
            <div className="field-row">
              <span className="field-value">{user?.country || 'Nicht angegeben'}</span>
              <button className="edit-icon-btn" onClick={() => handleEdit('country', user?.country || '')}>
                <svg viewBox="0 0 32 32" fill="currentColor">
                  <path d="M25.384,11.987a.993.993,0,0,1-.707-.293L20.434,7.452a1,1,0,0,1,0-1.414l2.122-2.121a3.07,3.07,0,0,1,4.242,0l1.414,1.414a3,3,0,0,1,0,4.242l-2.122,2.121A.993.993,0,0,1,25.384,11.987ZM22.555,6.745l2.829,2.828L26.8,8.159a1,1,0,0,0,0-1.414L25.384,5.331a1.023,1.023,0,0,0-1.414,0Z"/>
                  <path d="M11.9,22.221a2,2,0,0,1-1.933-2.487l.875-3.5a3.02,3.02,0,0,1,.788-1.393l8.8-8.8a1,1,0,0,1,1.414,0l4.243,4.242a1,1,0,0,1,0,1.414l-8.8,8.8a3,3,0,0,1-1.393.79h0l-3.5.875A2.027,2.027,0,0,1,11.9,22.221Zm3.752-1.907h0ZM21.141,8.159l-8.094,8.093a1,1,0,0,0-.262.465l-.876,3.5,3.5-.876a1,1,0,0,0,.464-.263l8.094-8.094Z"/>
                  <path d="M22,29H8a5.006,5.006,0,0,1-5-5V10A5.006,5.006,0,0,1,8,5h9.64a1,1,0,0,1,0,2H8a3,3,0,0,0-3,3V24a3,3,0,0,0,3,3H22a3,3,0,0,0,3-3V14.61a1,1,0,0,1,2,0V24A5.006,5.006,0,0,1,22,29Z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* E-Mail-Adresse - KEIN EDIT-ICON */}
          <div className="profile-field">
            <div className="field-label-bold">E-Mail-Adresse:</div>
            <div className="field-row">
              <span className="field-value">{user?.email || 'jacquesdong9@gmail.com'}</span>
            </div>
          </div>

          {/* Passwort */}
          <div className="profile-field">
            <div className="field-label-bold">Passwort:</div>
            <div className="field-row">
              <span className="field-value">***************</span>
              <button className="edit-icon-btn" onClick={() => handleEdit('password', '***************')}>
                <svg viewBox="0 0 32 32" fill="currentColor">
                  <path d="M25.384,11.987a.993.993,0,0,1-.707-.293L20.434,7.452a1,1,0,0,1,0-1.414l2.122-2.121a3.07,3.07,0,0,1,4.242,0l1.414,1.414a3,3,0,0,1,0,4.242l-2.122,2.121A.993.993,0,0,1,25.384,11.987ZM22.555,6.745l2.829,2.828L26.8,8.159a1,1,0,0,0,0-1.414L25.384,5.331a1.023,1.023,0,0,0-1.414,0Z"/>
                  <path d="M11.9,22.221a2,2,0,0,1-1.933-2.487l.875-3.5a3.02,3.02,0,0,1,.788-1.393l8.8-8.8a1,1,0,0,1,1.414,0l4.243,4.242a1,1,0,0,1,0,1.414l-8.8,8.8a3,3,0,0,1-1.393.79h0l-3.5.875A2.027,2.027,0,0,1,11.9,22.221Zm3.752-1.907h0ZM21.141,8.159l-8.094,8.093a1,1,0,0,0-.262.465l-.876,3.5,3.5-.876a1,1,0,0,0,.464-.263l8.094-8.094Z"/>
                  <path d="M22,29H8a5.006,5.006,0,0,1-5-5V10A5.006,5.006,0,0,1,8,5h9.64a1,1,0,0,1,0,2H8a3,3,0,0,0-3,3V24a3,3,0,0,0,3,3H22a3,3,0,0,0,3-3V14.61a1,1,0,0,1,2,0V24A5.006,5.006,0,0,1,22,29Z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Sprache */}
          <div className="profile-field">
            <div className="field-label-bold">Sprache:</div>
            <div 
              className="language-selector-container"
              onClick={(e) => {
                console.log('🟢 Container clicked!');
                e.stopPropagation();
              }}
            >
              <button 
                className="language-selector-btn" 
                onClick={toggleLanguageDropdown}
                disabled={loading}
                type="button"
                style={{ position: 'relative', zIndex: 9999 }}
              >
                <span>{languageNames[user?.language] || languageNames['de']}</span>
                <svg 
                  className={`dropdown-icon ${languageDropdownOpen ? 'open' : ''}`}
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  width="20" 
                  height="20"
                  style={{ pointerEvents: 'none' }}
                >
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
              
              {languageDropdownOpen && (
                <div className="language-dropdown" style={{ zIndex: 10000 }}>
                  <button 
                    className={`language-option ${user?.language === 'de' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('🇩🇪 Deutsch selected');
                      handleLanguageChange('de');
                    }}
                    type="button"
                  >
                    Deutsch
                  </button>
                  <button 
                    className={`language-option ${user?.language === 'en' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('🇬🇧 English selected');
                      handleLanguageChange('en');
                    }}
                    type="button"
                  >
                    English
                  </button>
                  <button 
                    className={`language-option ${user?.language === 'fr' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('🇫🇷 Français selected');
                      handleLanguageChange('fr');
                    }}
                    type="button"
                  >
                    Français
                  </button>
                  <button 
                    className={`language-option ${user?.language === 'es' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('🇪🇸 Español selected');
                      handleLanguageChange('es');
                    }}
                    type="button"
                  >
                    Español
                  </button>
                  <button 
                    className={`language-option ${user?.language === 'it' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('🇮🇹 Italiano selected');
                      handleLanguageChange('it');
                    }}
                    type="button"
                  >
                    Italiano
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Subscription */}
        <section className="account-section">
          <h2 className="account-section-title">Subscription</h2>
          
          <div className="subscription-content">
            <div className="current-plan">
              <span className="plan-label">Aktueller Plan:</span>
              <span className="plan-value">Free Plan</span>
            </div>
            <button className="upgrade-btn" onClick={handleUpgrade}>
              Upgraden
            </button>
          </div>
        </section>

        {/* Datenschutz */}
        <section className="account-section">
          <h2 className="account-section-title">Datenschutz</h2>
          
          <div className="privacy-links">
            <button className="privacy-link" onClick={() => navigate('/privacy-policy')}>
              Datenschutzrichtlinie
            </button>
            <button className="privacy-link" onClick={() => navigate('/methodology')}>
              Methodik & Grenzen
            </button>
            <button className="privacy-link" onClick={() => navigate('/data-storage')}>
              Datenspeicherung
            </button>
            <button className="privacy-link" onClick={() => navigate('/security')}>
              Sicherheit
            </button>
          </div>
        </section>

        {/* Abmelden Button */}
        <div className="logout-section">
          <button className="logout-btn" onClick={handleLogout}>
            Abmelden
          </button>
        </div>

        {/* Spacer für Bottom Nav */}
        <div style={{ height: '100px' }}></div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="edit-modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="edit-modal-title">
              {editField === 'name' && 'Vor- und Nachname ändern'}
              {editField === 'company' && 'Unternehmen ändern'}
              {editField === 'country' && 'Land ändern'}
              {editField === 'language' && 'Sprache ändern'}
              {editField === 'password' && 'Passwort ändern'}
            </h3>
            
            {editField === 'country' ? (
              <select
                className="edit-modal-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              >
                <option value="">Wähle dein Land</option>
                <option value="Deutschland">Deutschland</option>
                <option value="Österreich">Österreich</option>
                <option value="Schweiz">Schweiz</option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Luxemburg">Luxemburg</option>
                <option value="">──────────────</option>
                <option value="Belgien">Belgien</option>
                <option value="Dänemark">Dänemark</option>
                <option value="Finnland">Finnland</option>
                <option value="Frankreich">Frankreich</option>
                <option value="Griechenland">Griechenland</option>
                <option value="Irland">Irland</option>
                <option value="Italien">Italien</option>
                <option value="Kroatien">Kroatien</option>
                <option value="Niederlande">Niederlande</option>
                <option value="Norwegen">Norwegen</option>
                <option value="Polen">Polen</option>
                <option value="Portugal">Portugal</option>
                <option value="Schweden">Schweden</option>
                <option value="Spanien">Spanien</option>
                <option value="Tschechien">Tschechien</option>
                <option value="Ungarn">Ungarn</option>
                <option value="Vereinigtes Königreich">Vereinigtes Königreich</option>
                <option value="">──────────────</option>
                <option value="USA">USA</option>
                <option value="Kanada">Kanada</option>
                <option value="Australien">Australien</option>
                <option value="Neuseeland">Neuseeland</option>
                <option value="">──────────────</option>
                <option value="Anderes">Anderes Land</option>
              </select>
            ) : editField === 'language' ? (
              <select
                className="edit-modal-input"
                value={editValue}
                onChange={(e) => {
                  console.log('🌐 Language dropdown changed:', e.target.value);
                  setEditValue(e.target.value);
                }}
              >
                <option value="de">Deutsch</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="it">Italiano</option>
              </select>
            ) : (
              <input
                type={editField === 'password' ? 'password' : 'text'}
                className="edit-modal-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={
                  editField === 'name' ? 'Vor- und Nachname eingeben' :
                  editField === 'company' ? 'Unternehmen eingeben' :
                  editField === 'country' ? 'Land eingeben' :
                  'Neues Passwort eingeben'
                }
              />
            )}
            
            <div className="edit-modal-actions">
              <button 
                className="edit-modal-btn cancel" 
                onClick={handleCancelEdit}
                disabled={loading}
              >
                Abbrechen
              </button>
              <button 
                className="edit-modal-btn save" 
                onClick={handleSaveEdit}
                disabled={loading}
              >
                {loading ? 'Speichern...' : 'Speichern'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MENUBAR - GLEICH WIE ÜBERALL */}
      <nav className="menubar-new">
        {/* Links: Linie ÜBER Icons */}
        <div className="menubar-left">
          <div className="menubar-line"></div>
          <div className="menubar-icons">
            <button className="menubar-icon" onClick={() => navigate('/dashboard')}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22,5.724V2c0-.552-.447-1-1-1s-1,.448-1,1v2.366L14.797,.855c-1.699-1.146-3.895-1.146-5.594,0L2.203,5.579c-1.379,.931-2.203,2.48-2.203,4.145v9.276c0,2.757,2.243,5,5,5h3c.553,0,1-.448,1-1V15c0-.551,.448-1,1-1h4c.552,0,1,.449,1,1v8c0,.552,.447,1,1,1h3c2.757,0,5-2.243,5-5V9.724c0-1.581-.744-3.058-2-4Zm0,13.276c0,1.654-1.346,3-3,3h-2v-7c0-1.654-1.346-3-3-3h-4c-1.654,0-3,1.346-3,3v7h-2c-1.654,0-3-1.346-3-3V9.724c0-.999,.494-1.929,1.322-2.487L10.322,2.513c1.02-.688,2.336-.688,3.355,0l7,4.724c.828,.558,1.322,1.488,1.322,2.487v9.276Z"/>
              </svg>
            </button>
            <button className="menubar-icon" onClick={() => navigate('/sessions')}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="m16,10.111l-7,3.889v-7.778l7,3.889Zm8,7.889c0,3.309-2.691,6-6,6s-6-2.691-6-6,2.691-6,6-6,6,2.691,6,6Zm-2,0c0-2.206-1.794-4-4-4s-4,1.794-4,4,1.794,4,4,4,4-1.794,4-4Zm-3-3h-2v3.423l2.079,2.019,1.393-1.435-1.472-1.43v-2.577ZM21,0H3C1.346,0,0,1.346,0,3v17h10.262c-.165-.64-.262-1.308-.262-2H2V3c0-.551.448-1,1-1h18c.552,0,1,.449,1,1v8.079c.754.437,1.428.992,2,1.642V3c0-1.654-1.346-3-3-3Z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mitte: Großer Button */}
        <button className="menubar-center-btn" onClick={() => navigate('/session-prepare')}>
          <svg viewBox="0 0 24 24" fill="white">
            <path d="m16.395,10.122l-5.192-2.843c-.673-.379-1.473-.372-2.138.017-.667.39-1.064,1.083-1.064,1.855v5.699c0,.772.397,1.465,1.064,1.855.34.199.714.297,1.087.297.358,0,.716-.091,1.041-.274l5.212-2.854c.687-.386,1.096-1.086,1.096-1.873s-.409-1.487-1.105-1.878Zm-.961,2.003l-5.212,2.855c-.019.01-.077.042-.147-.001-.074-.043-.074-.107-.074-.128v-5.699c0-.021,0-.085.074-.128.027-.016.052-.021.074-.021.036,0,.065.016.083.026l5.192,2.844c.019.011.076.043.076.13s-.058.119-.066.125ZM12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,22c-5.514,0-10-4.486-10-10S6.486,2,12,2s10,4.486,10,10-4.486,10-10,10Z"/>
          </svg>
        </button>

        {/* Rechts: Linie ÜBER Icons */}
        <div className="menubar-right">
          <div className="menubar-line"></div>
          <div className="menubar-icons">
            <button className="menubar-icon" onClick={() => navigate('/insights')}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23,22H5a3,3,0,0,1-3-3V1A1,1,0,0,0,0,1V19a5.006,5.006,0,0,0,5,5H23a1,1,0,0,0,0-2Z"/><path d="M6,20a1,1,0,0,0,1-1V12a1,1,0,0,0-2,0v7A1,1,0,0,0,6,20Z"/><path d="M10,10v9a1,1,0,0,0,2,0V10a1,1,0,0,0-2,0Z"/><path d="M15,13v6a1,1,0,0,0,2,0V13a1,1,0,0,0-2,0Z"/><path d="M20,9V19a1,1,0,0,0,2,0V9a1,1,0,0,0-2,0Z"/><path d="M6,9a1,1,0,0,0,.707-.293l3.586-3.586a1.025,1.025,0,0,1,1.414,0l2.172,2.172a3,3,0,0,0,4.242,0l5.586-5.586A1,1,0,0,0,22.293.293L16.707,5.878a1,1,0,0,1-1.414,0L13.121,3.707a3,3,0,0,0-4.242,0L5.293,7.293A1,1,0,0,0,6,9Z"/>
              </svg>
            </button>
            <button className="menubar-icon" onClick={() => navigate('/courses')}>
              <svg viewBox="0 0 512 512" fill="currentColor">
                <path d="M470.549,111.573L313.237,36.629c-34.628-20.684-77.728-21.051-112.704-0.96L41.451,111.573c-0.597,0.299-1.216,0.619-1.792,0.96c-37.752,21.586-50.858,69.689-29.272,107.441c7.317,12.798,18.08,23.284,31.064,30.266l43.883,20.907V375.68c0.026,46.743,30.441,88.039,75.072,101.931c31.059,8.985,63.264,13.384,95.595,13.056c32.326,0.362,64.531-4,95.595-12.949c44.631-13.891,75.046-55.188,75.072-101.931V271.104l42.667-20.395v175.957c0,11.782,9.551,21.333,21.333,21.333c11.782,0,21.333-9.551,21.333-21.333v-256C512.143,145.615,492.363,122.473,470.549,111.573z M384,375.787c0.011,27.959-18.129,52.69-44.8,61.077c-27.046,7.728-55.073,11.479-83.2,11.136c-28.127,0.343-56.154-3.408-83.2-11.136c-26.671-8.388-44.811-33.118-44.8-61.077v-84.309l70.763,33.707c17.46,10.368,37.401,15.816,57.707,15.765c19.328,0.137,38.331-4.98,54.976-14.805L384,291.477V375.787z M452.267,211.733l-160.896,76.8c-22.434,13.063-50.241,12.693-72.32-0.96l-157.419-74.88c-17.547-9.462-24.101-31.357-14.639-48.903c3.2-5.934,7.998-10.853,13.85-14.201l159.893-76.373c22.441-13.034,50.233-12.665,72.32,0.96l157.312,74.944c11.569,6.424,18.807,18.555,18.965,31.787C469.354,193.441,462.9,205.097,452.267,211.733L452.267,211.733z"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Account;
