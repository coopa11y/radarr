import React from 'react';
import IconButton from 'Components/Link/IconButton';
import { icons } from 'Helpers/Props';
import translate from 'Utilities/String/translate';

interface HealthItemLinkProps {
  source: string;
  label: string;
}

function HealthItemLink(props: HealthItemLinkProps) {
  const { source, label } = props;
  const settingsLabel = `${translate('Settings')}: ${label}`;

  switch (source) {
    case 'IndexerRssCheck':
    case 'IndexerSearchCheck':
    case 'IndexerStatusCheck':
    case 'IndexerJackettAllCheck':
    case 'IndexerLongTermStatusCheck':
      return (
        <IconButton
          name={icons.SETTINGS}
          title={translate('Settings')}
          aria-label={settingsLabel}
          to="/settings/indexers"
        />
      );
    case 'DownloadClientCheck':
    case 'DownloadClientStatusCheck':
    case 'ImportMechanismCheck':
      return (
        <IconButton
          name={icons.SETTINGS}
          title={translate('Settings')}
          aria-label={settingsLabel}
          to="/settings/downloadclients"
        />
      );
    case 'NotificationStatusCheck':
      return (
        <IconButton
          name={icons.SETTINGS}
          title={translate('Settings')}
          aria-label={settingsLabel}
          to="/settings/connect"
        />
      );
    case 'MovieCollectionRootFolderCheck':
      return (
        <IconButton
          name={icons.MOVIE_CONTINUING}
          title={translate('Collections')}
          aria-label={`${translate('Collections')}: ${label}`}
          to="/collections"
        />
      );
    case 'RootFolderCheck':
      return (
        <IconButton
          name={icons.MOVIE_CONTINUING}
          title={translate('MovieEditor')}
          aria-label={`${translate('MovieEditor')}: ${label}`}
          to="/"
        />
      );
    case 'UpdateCheck':
      return (
        <IconButton
          name={icons.UPDATE}
          title={translate('Updates')}
          aria-label={`${translate('Updates')}: ${label}`}
          to="/system/updates"
        />
      );
    default:
      return null;
  }
}

export default HealthItemLink;
