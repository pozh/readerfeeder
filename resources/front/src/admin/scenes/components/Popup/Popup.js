import React, { Component } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { XCircle as IcoX } from 'react-feather';
import './styles.scss';


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#app');

class Popup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal(event) {
    event.preventDefault();
    this.setState({modalIsOpen: false});
  }

  render() {
    return (
      <div>
        <button className="btn btn-primary" onClick={this.openModal}>Add new</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          className="modal__content"
        >
          <h2 className="modal__title">{this.props.title}</h2>
          <Link className="modal__close" to="" onClick={this.closeModal}>
            <IcoX/>
          </Link>
          <div className="modal__container">
            {this.props.children}
          </div>
        </Modal>
      </div>
    );
  }
}

export default Popup;
