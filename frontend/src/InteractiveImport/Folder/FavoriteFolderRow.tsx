import React, { SyntheticEvent, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import ActionGroup from 'Components/Link/ActionGroup';
import IconButton from 'Components/Link/IconButton';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRowButton from 'Components/Table/TableRowButton';
import { icons } from 'Helpers/Props';
import { removeFavoriteFolder } from 'Store/Actions/interactiveImportActions';
import translate from 'Utilities/String/translate';
import styles from './FavoriteFolderRow.css';

interface FavoriteFolderRowProps {
  folder: string;
  onPress: (folder: string) => unknown;
}

function FavoriteFolderRow({ folder, onPress }: FavoriteFolderRowProps) {
  const dispatch = useDispatch();

  const handlePress = useCallback(() => {
    onPress(folder);
  }, [folder, onPress]);

  const handleRemoveFavoritePress = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation();

      dispatch(removeFavoriteFolder({ folder }));
    },
    [folder, dispatch]
  );

  return (
    <TableRowButton onPress={handlePress}>
      <TableRowCell>{folder}</TableRowCell>

      <TableRowCell className={styles.actions}>
        <ActionGroup context={folder}>
          <IconButton
            title={translate('FavoriteFolderRemove')}
            context={folder}
            kind="danger"
            name={icons.HEART}
            onPress={handleRemoveFavoritePress}
          />
        </ActionGroup>
      </TableRowCell>
    </TableRowButton>
  );
}

export default FavoriteFolderRow;
