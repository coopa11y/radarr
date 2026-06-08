import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ImportListAppState } from 'App/State/SettingsAppState';
import Card from 'Components/Card';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { icons } from 'Helpers/Props';
import { fetchRootFolders } from 'Store/Actions/rootFolderActions';
import {
  cloneImportList,
  fetchImportLists,
  testImportList,
} from 'Store/Actions/settingsActions';
import createSortedSectionSelector from 'Store/Selectors/createSortedSectionSelector';
import ImportListModel from 'typings/ImportList';
import sortByProp from 'Utilities/Array/sortByProp';
import translate from 'Utilities/String/translate';
import AddImportListModal from './AddImportListModal';
import EditImportListModal from './EditImportListModal';
import ImportList from './ImportList';
import styles from './ImportLists.css';

function ImportLists() {
  const dispatch = useDispatch();

  const {
    isFetching,
    isPopulated,
    isTesting = false,
    items,
    error,
    saveError,
  } = useSelector(
    createSortedSectionSelector<ImportListModel, ImportListAppState>(
      'settings.importLists',
      sortByProp('name')
    )
  );

  const [isAddImportListModalOpen, setIsAddImportListModalOpen] =
    useState(false);
  const [isEditImportListModalOpen, setIsEditImportListModalOpen] =
    useState(false);
  const [testingImportListId, setTestingImportListId] = useState<number | null>(
    null
  );

  const handleAddImportListPress = useCallback(() => {
    setIsAddImportListModalOpen(true);
  }, []);

  const handleAddImportListModalClose = useCallback(() => {
    setIsAddImportListModalOpen(false);
  }, []);

  const handleImportListSelect = useCallback(() => {
    setIsAddImportListModalOpen(false);
    setIsEditImportListModalOpen(true);
  }, []);

  const handleEditImportListModalClose = useCallback(() => {
    setIsEditImportListModalOpen(false);
  }, []);

  const handleCloneImportListPress = useCallback(
    (id: number) => {
      dispatch(cloneImportList({ id }));
      setIsEditImportListModalOpen(true);
    },
    [dispatch]
  );

  const handleTestImportListPress = useCallback(
    (id: number) => {
      setTestingImportListId(id);
      dispatch(testImportList({ id }));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchImportLists());
    dispatch(fetchRootFolders());
  }, [dispatch]);

  return (
    <FieldSet legend={translate('ImportLists')}>
      <PageSectionContent
        errorMessage={translate('ImportListsLoadError')}
        error={error}
        isFetching={isFetching}
        isPopulated={isPopulated}
      >
        <div className={styles.lists}>
          {items.map((item) => {
            return (
              <ImportList
                key={item.id}
                {...item}
                isTesting={testingImportListId === item.id && isTesting}
                isTestDisabled={testingImportListId !== item.id && isTesting}
                testError={
                  testingImportListId === item.id ? saveError : undefined
                }
                onCloneImportListPress={handleCloneImportListPress}
                onTestImportListPress={handleTestImportListPress}
              />
            );
          })}

          <Card
            className={styles.addList}
            ariaLabel={translate('AddImportList')}
            title={translate('AddImportList')}
            onPress={handleAddImportListPress}
          >
            <div className={styles.center}>
              <Icon name={icons.ADD} size={45} />
            </div>
          </Card>
        </div>

        <AddImportListModal
          isOpen={isAddImportListModalOpen}
          onImportListSelect={handleImportListSelect}
          onModalClose={handleAddImportListModalClose}
        />

        <EditImportListModal
          isOpen={isEditImportListModalOpen}
          onModalClose={handleEditImportListModalClose}
        />
      </PageSectionContent>
    </FieldSet>
  );
}

export default ImportLists;
