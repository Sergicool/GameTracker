import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker } from 'react-color';

function ColorDropdownPicker({ color, onChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  // Cerrar picker al clickar fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    }

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={pickerRef}>
      {/* Botón pequeño que muestra el color actual */}
      <button
        type="button"
        onClick={() => setShowPicker(prev => !prev)}
        style={{
          width: '30px',
          height: '30px',
          backgroundColor: color,
          border: '1px solid #ccc',
          cursor: 'pointer',
          padding: 0,
          borderRadius: 4,
          marginBottom: '2px'
        }}
        aria-label="Open color picker"
      />

      {/* Picker desplegable */}
      {showPicker && (
        <div style={{ position: 'absolute', zIndex: 1000, top: '35px', left: 0 }}>
          <SketchPicker
            color={color}
            onChange={c => onChange(c.hex)}
          />
        </div>
      )}
    </div>
  );
}

export default ColorDropdownPicker;
