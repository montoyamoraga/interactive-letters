import React, { useState } from 'react';

export const SideBar = ({ children }) => {
  const [opacity, setOpacity] = useState(0);
  const functionSelector = children && children[0];

  const containerStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'rgba(0, 0, 0, 0.3)',
    color: 'white',
    padding: '8px', // Disminuimos el padding del contenedor
    borderRadius: '5px',
    zIndex: 1000,
    opacity: opacity,
    transition: 'opacity 0.3s ease-in-out',
  };
  const labelStyle = {
    display: 'block',
    marginBottom: '3px', // Disminuimos el margen inferior del label
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.5em', // Disminuimos el tamaño de la fuente del label
  };
  const selectStyle = {
    padding: '4px', // Disminuimos el padding del select
    borderRadius: '3px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    fontSize: '0.5em', // Disminuimos el tamaño de la fuente del select
  };
  const optionStyle = {
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    fontSize: '0.5em', // Disminuimos el tamaño de la fuente de las opciones
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0.2);
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <label htmlFor="functionSelect" style={labelStyle}>Seleccionar Obra:</label>
      {functionSelector && React.cloneElement(functionSelector, {
        style: { ...functionSelector.props.style, ...selectStyle },
        selectoptionsstyle: optionStyle
      })}
    </div>
  );
};