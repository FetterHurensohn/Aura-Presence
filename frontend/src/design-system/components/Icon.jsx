import React from 'react';
import PropTypes from 'prop-types';

// Dynamischer Import aller Icons
const iconModules = import.meta.glob('/src/assets/icons/outline/*.svg', { 
  eager: true, 
  as: 'raw' 
});

/**
 * Icon Component
 * 
 * Lädt und rendert SVG-Icons aus dem Icon-Set mit dynamischer Größe und Farbe.
 * 
 * @param {string} name - Name des Icons (ohne 'icon-' Präfix und '.svg' Extension)
 * @param {number} size - Größe in Pixeln (16, 24, 32, 48)
 * @param {string} color - Tailwind-Farbklasse oder CSS-Farbe
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {string} variant - Icon-Variante (outline, filled, colored)
 */
const Icon = ({ 
  name, 
  size = 24, 
  color = 'currentColor', 
  className = '', 
  variant = 'outline',
  ...props 
}) => {
  // Konstruiere den Icon-Pfad
  const iconPath = `/src/assets/icons/${variant}/icon-${name}.svg`;
  
  // Hole den SVG-Content
  const svgContent = iconModules[iconPath];
  
  if (!svgContent) {
    console.warn(`Icon "${name}" not found in variant "${variant}"`);
    return null;
  }

  // Parse SVG-Content und ersetze Attribute
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
  const svgElement = svgDoc.documentElement;
  
  // Setze Größe
  svgElement.setAttribute('width', size);
  svgElement.setAttribute('height', size);
  
  // Farb-Mapping für Tailwind-Klassen
  const colorMap = {
    'accent': '#8A63FF',
    'cyan': '#00E5FF',
    'magenta': '#FF5DA2',
    'success': '#44FF9E',
    'danger': '#FF5757',
    'white': '#FFFFFF',
    'muted': '#6B6B78',
  };
  
  const resolvedColor = colorMap[color] || color;
  
  // Setze Farbe (stroke oder fill basierend auf dem Original-SVG)
  const hasStroke = svgElement.querySelector('[stroke]');
  const hasFill = svgElement.querySelector('[fill]:not([fill="none"])');
  
  if (resolvedColor !== 'currentColor') {
    if (hasStroke) {
      svgElement.querySelectorAll('[stroke]').forEach(el => {
        if (el.getAttribute('stroke') !== 'none') {
          el.setAttribute('stroke', resolvedColor);
        }
      });
    }
    if (hasFill) {
      svgElement.querySelectorAll('[fill]').forEach(el => {
        if (el.getAttribute('fill') !== 'none') {
          el.setAttribute('fill', resolvedColor);
        }
      });
    }
  }
  
  // Kombiniere Klassen
  const combinedClassName = `inline-block ${className}`.trim();
  
  return (
    <span 
      className={combinedClassName}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: resolvedColor === 'currentColor' ? undefined : resolvedColor 
      }}
      dangerouslySetInnerHTML={{ __html: svgElement.outerHTML }}
      {...props}
    />
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOf([14, 16, 20, 24, 32, 48]),
  color: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['outline', 'filled', 'colored']),
};

export default Icon;


