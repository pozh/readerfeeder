import React, { Component } from 'react';
import './styles.scss';

class ButtonConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.toggleConfirmation = this.toggleConfirmation.bind(this);
  }

  toggleConfirmation(event) {
    event.preventDefault();
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <span>
        <a href="#" className={this.state.isOpen ? 'd-none' : this.props.className} onClick={this.toggleConfirmation}>{this.props.children}</a>
        <span className={this.state.isOpen ? '' : 'd-none'}>
          <a href={this.props.href} className="btn btn-link px-2" onClick={this.props.onClick}>Yes, I&apos;m sure</a>
          <a href={this.props.href} className="btn btn-link px-2 text-muted" onClick={this.toggleConfirmation}>Cancel</a>
        </span>
      </span>
    );
  }
}

export default ButtonConfirm;
