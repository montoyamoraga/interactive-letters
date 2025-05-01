import React from 'react';

export const SideBar = ({ children }) => {
  // Renderiza solo el primer elemento del array children, que parece ser la selección de funciones
  const functionSelector = children && children[0];
  const containerStyle = {
    position: 'absolute',
    top: '20px', // Ajusta la distancia desde la parte superior si es necesario
    right: '20px', // Cambiamos 'left' a 'right' para moverlo a la derecha
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    zIndex: 1000,
  };

  return (
    <div style={containerStyle}>
      {functionSelector}
    </div>
  );
};