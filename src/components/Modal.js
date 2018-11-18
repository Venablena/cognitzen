import React , { Component } from 'react';
import ReactDOM from 'react-dom';
import Provider, { GameContext } from '../Provider';

const modalRoot = document.getElementById('modal-root');

class Modal extends Component {
  render() {
    return ReactDOM.createPortal(
      <GameContext.Consumer>
        {({
          showModal,
          handleModalClose,
        })=> {
          if(showModal) {
            return (
              <main className={`modal`}>
                <button onClick={handleModalClose}>close</button>
                <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc7rEnoej4XzwvOBS3r-bvkpWqanKFhQ5hd_lR_pxKYlkTHIw/viewform?embedded=true" width="100%" height="90%" frameBorder="0" marginHeight="0" marginWidth="0">Loading...</iframe>
              </main>
            )
          }
          return null;
        }}
      </GameContext.Consumer>,
      document.body,
    );
  }
}

export default Modal;
