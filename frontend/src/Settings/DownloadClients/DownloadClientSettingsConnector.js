import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { testAllDownloadClients } from 'Store/Actions/settingsActions';
import DownloadClientSettings from './DownloadClientSettings';

function createMapStateToProps() {
  return createSelector(
    (state) => state.settings.downloadClients.isTestingAll,
    (state) => state.settings.downloadClients.saveError,
    (isTestingAll, testAllError) => {
      return {
        isTestingAll,
        testAllError
      };
    }
  );
}

const mapDispatchToProps = {
  dispatchTestAllDownloadClients: testAllDownloadClients
};

export default connect(createMapStateToProps, mapDispatchToProps)(DownloadClientSettings);
