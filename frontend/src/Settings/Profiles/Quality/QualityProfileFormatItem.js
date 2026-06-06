import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NumberInput from 'Components/Form/NumberInput';
import styles from './QualityProfileFormatItem.css';

class QualityProfileFormatItem extends Component {

  //
  // Listeners

  onScoreChange = ({ value }) => {
    const {
      formatId
    } = this.props;

    this.props.onScoreChange(formatId, value);
  };

  //
  // Render

  render() {
    const {
      name,
      score
    } = this.props;
    const scoreLabel = `${name} custom format score. Increase to make this format more preferred; decrease to make it less preferred.`;

    return (
      <div
        className={styles.qualityProfileFormatItemContainer}
      >
        <div
          className={styles.qualityProfileFormatItem}
        >
          <label
            className={styles.formatNameContainer}
          >
            <div className={styles.formatName}>
              {name}
            </div>
            <NumberInput
              containerClassName={styles.scoreContainer}
              className={styles.scoreInput}
              name={name}
              value={score}
              ariaLabel={scoreLabel}
              title={scoreLabel}
              onChange={this.onScoreChange}
            />
          </label>

        </div>
      </div>
    );
  }
}

QualityProfileFormatItem.propTypes = {
  formatId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  onScoreChange: PropTypes.func
};

QualityProfileFormatItem.defaultProps = {
  // To handle the case score is deleted during edit
  score: 0
};

export default QualityProfileFormatItem;
