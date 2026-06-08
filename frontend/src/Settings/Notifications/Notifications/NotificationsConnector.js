import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { deleteNotification, fetchNotifications, testNotification } from 'Store/Actions/settingsActions';
import createSortedSectionSelector from 'Store/Selectors/createSortedSectionSelector';
import createTagsSelector from 'Store/Selectors/createTagsSelector';
import sortByProp from 'Utilities/Array/sortByProp';
import Notifications from './Notifications';

function createMapStateToProps() {
  return createSelector(
    createSortedSectionSelector('settings.notifications', sortByProp('name')),
    createTagsSelector(),
    (notifications, tagList) => {
      return {
        ...notifications,
        tagList
      };
    }
  );
}

const mapDispatchToProps = {
  fetchNotifications,
  deleteNotification,
  testNotification
};

class NotificationsConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    this.props.fetchNotifications();
  }

  //
  // Listeners

  onConfirmDeleteNotification = (id) => {
    this.props.deleteNotification({ id });
  };

  onTestNotificationPress = (id) => {
    this.props.testNotification({ id });
  };

  //
  // Render

  render() {
    return (
      <Notifications
        {...this.props}
        onConfirmDeleteNotification={this.onConfirmDeleteNotification}
        onTestNotificationPress={this.onTestNotificationPress}
      />
    );
  }
}

NotificationsConnector.propTypes = {
  fetchNotifications: PropTypes.func.isRequired,
  deleteNotification: PropTypes.func.isRequired,
  testNotification: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(NotificationsConnector);
