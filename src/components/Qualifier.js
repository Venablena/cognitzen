import React from 'react';

const Qualifier = ({
  handleDrop,
  content,
  type,
  className
}) => {

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  if(!content) return null

  return (
    <div
      className={ className }
      onDragOver={ (e) => handleDragOver(e) }
      onDrop={ handleDrop }
    >
      <header>{ type }</header>
      <p>{ content }</p>
    </div>
  );
}

export default Qualifier;
