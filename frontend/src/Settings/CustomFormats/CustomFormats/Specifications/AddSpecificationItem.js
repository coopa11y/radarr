import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ActionCard from 'Components/Link/ActionCard';
import Button from 'Components/Link/Button';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import { sizes } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import AddSpecificationPresetMenuItem from './AddSpecificationPresetMenuItem';
import styles from './AddSpecificationItem.css';

class AddSpecificationItem extends Component {

  //
  // Listeners

  onSpecificationSelect = () => {
    const {
      implementation
    } = this.props;

    this.props.onSpecificationSelect({ implementation });
  };

  //
  // Render

  render() {
    const {
      implementation,
      implementationName,
      infoLink,
      presets,
      onSpecificationSelect
    } = this.props;

    const hasPresets = !!presets && !!presets.length;
    const addLabel = translate('AddConditionImplementation', {
      implementationName
    });

    return (
      <ActionCard
        className={styles.specification}
        underlayClassName={styles.underlay}
        overlayClassName={styles.overlay}
        nameClassName={styles.name}
        actionsClassName={styles.actions}
        label={addLabel}
        title={implementationName}
        name={implementationName}
        onPress={this.onSpecificationSelect}
      >
        {
          hasPresets &&
            <span>
              <Button
                size={sizes.SMALL}
                onPress={this.onSpecificationSelect}
              >
                {translate('Custom')}
              </Button>

              <Menu className={styles.presetsMenu}>
                <Button
                  className={styles.presetsMenuButton}
                  size={sizes.SMALL}
                >
                  {translate('Presets')}
                </Button>

                <MenuContent>
                  {
                    presets.map((preset, index) => {
                      return (
                        <AddSpecificationPresetMenuItem
                          key={index}
                          name={preset.name}
                          implementation={implementation}
                          onPress={onSpecificationSelect}
                        />
                      );
                    })
                  }
                </MenuContent>
              </Menu>
            </span>
        }

        <Button
          to={infoLink}
          size={sizes.SMALL}
        >
          {translate('MoreInfo')}
        </Button>
      </ActionCard>
    );
  }
}

AddSpecificationItem.propTypes = {
  implementation: PropTypes.string.isRequired,
  implementationName: PropTypes.string.isRequired,
  infoLink: PropTypes.string.isRequired,
  presets: PropTypes.arrayOf(PropTypes.object),
  onSpecificationSelect: PropTypes.func.isRequired
};

export default AddSpecificationItem;
