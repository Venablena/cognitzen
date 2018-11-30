import React , { Component } from 'react';
import ReactDOM from 'react-dom';
import Provider, { GameContext } from '../Provider';

const modalRoot = document.getElementById('modal-root');

class Modal extends Component {
  render() {
    return (
      <GameContext.Consumer>
        {({
          showModal,
          handleModalClose,
        })=> {
          if(showModal) {
            return ReactDOM.createPortal (
              <main className={`modal`}>
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSfnnfAmdrjmlMkb2FZM3KHBEfm8UGLIfLuaSznI96xOD0dYjA/viewform?embedded=true"
                  width="100%"
                  height="90%"
                  frameBorder="0"
                  marginHeight="0" marginWidth="0">
                  Loading...
                </iframe>
                <form className='survey-form'>
                  <label>
                    Your email :
                    <input
                      type="text"
                      name="email"
                      placeholder="email is required"
                      required
                    />
                  </label>
                  <button
                    className='button-close'
                    onClick={handleModalClose}>
                    &times;
                  </button>
                </form>
              </main> ,
              modalRoot,
            )
          }
          return null;
        }}
      </GameContext.Consumer>
    );
  }
}

export default Modal;
