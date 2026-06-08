import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Card from 'Components/Card';
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import TagList from 'Components/TagList';
import { icons, kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import EditDownloadClientModalConnector from './EditDownloadClientModalConnector';
import styles from './DownloadClient.css';

class DownloadClient extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isEditDownloadClientModalOpen: false,
      isDeleteDownloadClientModalOpen: false
    };
  }

  //
  // Listeners

  onEditDownloadClientPress = () => {
    this.setState({ isEditDownloadClientModalOpen: true });
  };

  onEditDownloadClientModalClose = () => {
    this.setState({ isEditDownloadClientModalOpen: false });
  };

  onDeleteDownloadClientPress = () => {
    this.setState({
      isEditDownloadClientModalOpen: false,
      isDeleteDownloadClientModalOpen: true
    });
  };

  onDeleteDownloadClientModalClose = () => {
    this.setState({ isDeleteDownloadClientModalOpen: false });
  };

  onConfirmDeleteDownloadClient = () => {
    this.props.onConfirmDeleteDownloadClient(this.props.id);
  };

  onTestDownloadClientPress = () => {
    this.props.onTestDownloadClientPress(this.props.id);
  };

  //
  // Render

  render() {
    const {
      id,
      name,
      enable,
      isTestDisabled,
      isTesting,
      priority,
      tags,
      tagList,
      testError
    } = this.props;

    return (
      <Card
        className={styles.downloadClient}
        overlayContent={true}
        onPress={this.onEditDownloadClientPress}
      >
        <div className={styles.nameContainer}>
          <div className={styles.name}>
            {name}
          </div>

          <div className={styles.actionButtons}>
            <IconButton
              className={styles.actionButton}
              title={translate('Test')}
              context={name}
              name={icons.TEST}
              isSpinning={isTesting}
              isDisabled={isTestDisabled}
              announceCompletion={true}
              error={testError}
              onPress={this.onTestDownloadClientPress}
            />
          </div>
        </div>

        <div className={styles.enabled}>
          {
            enable ?
              <Label kind={kinds.SUCCESS}>
                {translate('Enabled')}
              </Label> :
              <Label
                kind={kinds.DISABLED}
                outline={true}
              >
                {translate('Disabled')}
              </Label>
          }

          {
            priority > 1 &&
              <Label
                kind={kinds.DISABLED}
                outline={true}
              >
                {translate('PrioritySettings', { priority })}
              </Label>
          }
        </div>

        <TagList
          tags={tags}
          tagList={tagList}
        />

        <EditDownloadClientModalConnector
          id={id}
          isOpen={this.state.isEditDownloadClientModalOpen}
          onModalClose={this.onEditDownloadClientModalClose}
          onDeleteDownloadClientPress={this.onDeleteDownloadClientPress}
        />

        <ConfirmModal
          isOpen={this.state.isDeleteDownloadClientModalOpen}
          kind={kinds.DANGER}
          title={translate('DeleteDownloadClient')}
          message={translate('DeleteDownloadClientMessageText', { name })}
          confirmLabel={translate('Delete')}
          onConfirm={this.onConfirmDeleteDownloadClient}
          onCancel={this.onDeleteDownloadClientModalClose}
        />
      </Card>
    );
  }
}

DownloadClient.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  enable: PropTypes.bool.isRequired,
  isTestDisabled: PropTypes.bool.isRequired,
  isTesting: PropTypes.bool.isRequired,
  priority: PropTypes.number.isRequired,
  tags: PropTypes.arrayOf(PropTypes.number).isRequired,
  tagList: PropTypes.arrayOf(PropTypes.object).isRequired,
  testError: PropTypes.object,
  onConfirmDeleteDownloadClient: PropTypes.func.isRequired,
  onTestDownloadClientPress: PropTypes.func.isRequired
};

export default DownloadClient;
