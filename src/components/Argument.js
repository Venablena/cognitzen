import React from 'react';

const Argument = ({
  content,
  handleDragStart,
}) => {

  return (
    <div className= 'argument'
      draggable
      onDragStart = { handleDragStart }
    >{ content }</div>
  );
}

export default Argument;
