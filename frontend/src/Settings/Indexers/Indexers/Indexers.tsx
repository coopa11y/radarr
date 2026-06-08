import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IndexerAppState } from 'App/State/SettingsAppState';
import Card from 'Components/Card';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { icons } from 'Helpers/Props';
import {
  cloneIndexer,
  fetchIndexers,
  testIndexer,
} from 'Store/Actions/settingsActions';
import createSortedSectionSelector from 'Store/Selectors/createSortedSectionSelector';
import IndexerModel from 'typings/Indexer';
import sortByProp from 'Utilities/Array/sortByProp';
import translate from 'Utilities/String/translate';
import AddIndexerModal from './AddIndexerModal';
import EditIndexerModal from './EditIndexerModal';
import Indexer from './Indexer';
import styles from './Indexers.css';

function Indexers() {
  const dispatch = useDispatch();

  const {
    isFetching,
    isPopulated,
    isTesting = false,
    items,
    error,
    saveError,
  } = useSelector(
    createSortedSectionSelector<IndexerModel, IndexerAppState>(
      'settings.indexers',
      sortByProp('name')
    )
  );

  const [isAddIndexerModalOpen, setIsAddIndexerModalOpen] = useState(false);
  const [isEditIndexerModalOpen, setIsEditIndexerModalOpen] = useState(false);
  const [testingIndexerId, setTestingIndexerId] = useState<number | null>(null);

  const showPriority = items.some((index) => index.priority !== 25);

  const handleAddIndexerPress = useCallback(() => {
    setIsAddIndexerModalOpen(true);
  }, []);

  const handleCloneIndexerPress = useCallback(
    (id: number) => {
      dispatch(cloneIndexer({ id }));
      setIsEditIndexerModalOpen(true);
    },
    [dispatch]
  );

  const handleTestIndexerPress = useCallback(
    (id: number) => {
      setTestingIndexerId(id);
      dispatch(testIndexer({ id }));
    },
    [dispatch]
  );

  const handleIndexerSelect = useCallback(() => {
    setIsAddIndexerModalOpen(false);
    setIsEditIndexerModalOpen(true);
  }, []);

  const handleAddIndexerModalClose = useCallback(() => {
    setIsAddIndexerModalOpen(false);
  }, []);

  const handleEditIndexerModalClose = useCallback(() => {
    setIsEditIndexerModalOpen(false);
  }, []);

  useEffect(() => {
    dispatch(fetchIndexers());
  }, [dispatch]);

  return (
    <FieldSet legend={translate('Indexers')}>
      <PageSectionContent
        errorMessage={translate('IndexersLoadError')}
        error={error}
        isFetching={isFetching}
        isPopulated={isPopulated}
      >
        <div className={styles.indexers}>
          {items.map((item) => {
            return (
              <Indexer
                key={item.id}
                {...item}
                showPriority={showPriority}
                isTesting={testingIndexerId === item.id && isTesting}
                isTestDisabled={testingIndexerId !== item.id && isTesting}
                testError={testingIndexerId === item.id ? saveError : undefined}
                onCloneIndexerPress={handleCloneIndexerPress}
                onTestIndexerPress={handleTestIndexerPress}
              />
            );
          })}

          <Card
            className={styles.addIndexer}
            ariaLabel={translate('AddIndexer')}
            title={translate('AddIndexer')}
            onPress={handleAddIndexerPress}
          >
            <div className={styles.center}>
              <Icon name={icons.ADD} size={45} />
            </div>
          </Card>
        </div>

        <AddIndexerModal
          isOpen={isAddIndexerModalOpen}
          onIndexerSelect={handleIndexerSelect}
          onModalClose={handleAddIndexerModalClose}
        />

        <EditIndexerModal
          isOpen={isEditIndexerModalOpen}
          onModalClose={handleEditIndexerModalClose}
        />
      </PageSectionContent>
    </FieldSet>
  );
}

export default Indexers;
