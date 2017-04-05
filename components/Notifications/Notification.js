import React from 'react';
import NotificationsApi from '../../data/NotificationsApi';

class Notification extends React.PureComponent {
  constructor() {
    super();
    this.timeouts = [];
  }

  componentWillMount() {
    this.setFade(this.props.notification.fade);
    if (this.props.notification.type === 'process') {
      this.timeouts.push(setTimeout(() => {
        this.props.setNotifications();
      }, 2600));
      // setTimeout is only temporary, and included to simulate what will happen 
      // when the user creates a composition (i.e. display process message
      // then success notification); this should be updated
      // when composition creation is fully implemented
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setFade(nextProps.notification.fade);
  }

  componentWillUnmount() {
    this.clearTimeouts();
  }

  clearTimeouts() {
    this.timeouts.forEach(clearTimeout);
  }

  setFade(fade) {
    if (fade === true) {
      this.timeouts.push(setTimeout(() => {
        NotificationsApi.closeNotification(this.props.id);
        this.props.setNotifications();
      }, 8000));
    }
  }

  handleClose = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    NotificationsApi.closeNotification(id);
    this.props.setNotifications();
  }

  render() {
    const { notification } = this.props;

    let icon = null;
    let modifier = 'alert-info';
    if (notification.type === 'success') {
      icon = <span className="pficon pficon-ok"></span>;
      modifier = 'alert-success';
    } else if (notification.type === 'process') {
      icon = <span className="pficon"><div className="spinner spinner-inverse"></div></span>;
      modifier = 'alert-info';
    }

    return (
      <div
        className={`toast-pf alert ${modifier} ${notification.dismiss && 'alert-dismissable'}`}
        id={`cmpsr-toast-${this.props.id}`}
        ref="notification"
      >
        {notification.dismiss &&
          <button
            type="button"
            className="close"
            aria-hidden="true"
            onClick={(e) => this.handleClose(e, this.props.id)}
          >
            <span className="pficon pficon-close"></span>
          </button>
        }
        {notification.kebab &&
          <div className="dropdown pull-right dropdown-kebab-pf">
            <button
              className="btn btn-link dropdown-toggle"
              type="button"
              id="dropdownKebabRight"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span className="fa fa-ellipsis-v"></span>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-right"
              aria-labelledby="dropdownKebabRight"
            >
              {notification.kebab.map((action, i) =>
                <li key={i}>{action}</li>
              )}
              <li>
                <a href="#" onClick={(e) => this.handleClose(e, this.props.id)}>
                  Close
                </a>
              </li>
            </ul>
          </div>
        }
        {notification.action &&
          <div className="pull-right toast-pf-action">
            {notification.action}
          </div>
        }
        {icon}
        {notification.message}
        <p>{notification.input}</p>
      </div>
    );
  }

}

Notification.propTypes = {
  notification: React.PropTypes.object,
};

export default Notification;
