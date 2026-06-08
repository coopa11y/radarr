import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Card from 'Components/Card';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { icons } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import AddDownloadClientModal from './AddDownloadClientModal';
import DownloadClient from './DownloadClient';
import EditDownloadClientModalConnector from './EditDownloadClientModalConnector';
import styles from './DownloadClients.css';

class DownloadClients extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isAddDownloadClientModalOpen: false,
      isEditDownloadClientModalOpen: false,
      testingDownloadClientId: null
    };
  }

  //
  // Listeners

  onAddDownloadClientPress = () => {
    this.setState({ isAddDownloadClientModalOpen: true });
  };

  onAddDownloadClientModalClose = ({ downloadClientSelected = false } = {}) => {
    this.setState({
      isAddDownloadClientModalOpen: false,
      isEditDownloadClientModalOpen: downloadClientSelected
    });
  };

  onEditDownloadClientModalClose = () => {
    this.setState({ isEditDownloadClientModalOpen: false });
  };

  onTestDownloadClientPress = (id) => {
    this.setState({ testingDownloadClientId: id });
    this.props.onTestDownloadClientPress(id);
  };

  //
  // Render

  render() {
    const {
      items,
      isTesting,
      onConfirmDeleteDownloadClient,
      saveError,
      tagList,
      ...otherProps
    } = this.props;

    const {
      isAddDownloadClientModalOpen,
      isEditDownloadClientModalOpen,
      testingDownloadClientId
    } = this.state;

    return (
      <FieldSet legend={translate('DownloadClients')}>
        <PageSectionContent
          errorMessage={translate('DownloadClientsLoadError')}
          {...otherProps}
        >
          <div className={styles.downloadClients}>
            {
              items.map((item) => {
                return (
                  <DownloadClient
                    key={item.id}
                    {...item}
                    isTesting={testingDownloadClientId === item.id && isTesting}
                    isTestDisabled={testingDownloadClientId !== item.id && isTesting}
                    testError={testingDownloadClientId === item.id ? saveError : undefined}
                    tagList={tagList}
                    onConfirmDeleteDownloadClient={onConfirmDeleteDownloadClient}
                    onTestDownloadClientPress={this.onTestDownloadClientPress}
                  />
                );
              })
            }

            <Card
              className={styles.addDownloadClient}
              onPress={this.onAddDownloadClientPress}
            >
              <div className={styles.center}>
                <Icon
                  name={icons.ADD}
                  size={45}
                />
              </div>
            </Card>
          </div>

          <AddDownloadClientModal
            isOpen={isAddDownloadClientModalOpen}
            onModalClose={this.onAddDownloadClientModalClose}
          />

          <EditDownloadClientModalConnector
            isOpen={isEditDownloadClientModalOpen}
            onModalClose={this.onEditDownloadClientModalClose}
          />
        </PageSectionContent>
      </FieldSet>
    );
  }
}

DownloadClients.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isTesting: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  saveError: PropTypes.object,
  tagList: PropTypes.arrayOf(PropTypes.object).isRequired,
  onConfirmDeleteDownloadClient: PropTypes.func.isRequired,
  onTestDownloadClientPress: PropTypes.func.isRequired
};

export default DownloadClients;
