import React, { CSSProperties, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Icon from 'Components/Icon';
import MonitorToggleButton from 'Components/MonitorToggleButton';
import VirtualTableRowCell from 'Components/Table/Cells/TableRowCell';
import { icons } from 'Helpers/Props';
import getMovieStatusDetails from 'Movie/getMovieStatusDetails';
import { MovieStatus } from 'Movie/Movie';
import { toggleMovieMonitored } from 'Store/Actions/movieActions';
import translate from 'Utilities/String/translate';
import styles from './MovieStatusCell.css';

const screenReaderOnlyStyle: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

interface MovieStatusCellProps {
  className: string;
  movieId: number;
  monitored: boolean;
  status: MovieStatus;
  isSelectMode: boolean;
  isSaving: boolean;
  component?: React.ElementType;
}

function MovieStatusCell(props: MovieStatusCellProps) {
  const {
    className,
    movieId,
    monitored,
    status,
    isSelectMode,
    isSaving,
    component: Component = VirtualTableRowCell,
    ...otherProps
  } = props;

  const statusDetails = getMovieStatusDetails(status);
  const monitoredLabel = monitored
    ? translate('MovieIsMonitored')
    : translate('MovieIsUnmonitored');
  const statusLabel = `${monitoredLabel}. ${statusDetails.title}: ${statusDetails.message}`;

  const dispatch = useDispatch();

  const onMonitoredPress = useCallback(() => {
    dispatch(toggleMovieMonitored({ movieId, monitored: !monitored }));
  }, [movieId, monitored, dispatch]);

  return (
    <Component className={className} aria-label={statusLabel} {...otherProps}>
      <span style={screenReaderOnlyStyle}>{statusLabel}</span>

      {isSelectMode ? (
        <MonitorToggleButton
          className={styles.statusIcon}
          monitored={monitored}
          isSaving={isSaving}
          onPress={onMonitoredPress}
        />
      ) : (
        <Icon
          className={styles.statusIcon}
          name={monitored ? icons.MONITORED : icons.UNMONITORED}
          title={
            monitored
              ? translate('MovieIsMonitored')
              : translate('MovieIsUnmonitored')
          }
        />
      )}

      <Icon
        className={styles.statusIcon}
        name={statusDetails.icon}
        title={`${statusDetails.title}: ${statusDetails.message}`}
      />
    </Component>
  );
}

export default MovieStatusCell;
