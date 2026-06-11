import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'Components/Icon';
import VirtualTableRowCell from 'Components/Table/Cells/TableRowCell';
import getMovieStatusDetails from 'Movie/getMovieStatusDetails';
import styles from './ListMovieStatusCell.css';

const screenReaderOnlyStyle = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0
};

function ListMovieStatusCell(props) {
  const {
    className,
    status,
    component: Component,
    ...otherProps
  } = props;

  const statusDetails = getMovieStatusDetails(status);
  const statusLabel = `${statusDetails.title}: ${statusDetails.message}`;

  return (
    <Component
      className={className}
      aria-label={statusLabel}
      {...otherProps}
    >
      <span style={screenReaderOnlyStyle}>{statusLabel}</span>

      <Icon
        className={styles.statusIcon}
        name={statusDetails.icon}
        title={`${statusDetails.title}: ${statusDetails.message}`}
      />

    </Component>
  );
}

ListMovieStatusCell.propTypes = {
  className: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  component: PropTypes.elementType
};

ListMovieStatusCell.defaultProps = {
  className: styles.status,
  component: VirtualTableRowCell
};

export default ListMovieStatusCell;
