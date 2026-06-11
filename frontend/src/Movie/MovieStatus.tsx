import React, { CSSProperties, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import QueueDetails from 'Activity/Queue/QueueDetails';
import Icon from 'Components/Icon';
import ProgressBar from 'Components/ProgressBar';
import { icons, kinds, sizes } from 'Helpers/Props';
import Movie from 'Movie/Movie';
import useMovie, { MovieEntity } from 'Movie/useMovie';
import useMovieFile from 'MovieFile/useMovieFile';
import { createQueueItemSelectorForHook } from 'Store/Selectors/createQueueItemSelector';
import translate from 'Utilities/String/translate';
import MovieQuality from './MovieQuality';
import styles from './MovieStatus.css';

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

interface MovieStatusProps {
  movieId: number;
  movieEntity?: MovieEntity;
  movieFileId: number | undefined;
}

function StatusContent({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.center} aria-label={label}>
      <span style={screenReaderOnlyStyle}>{label}</span>
      {children}
    </div>
  );
}

function MovieStatus({ movieId, movieFileId }: MovieStatusProps) {
  const {
    isAvailable,
    monitored,
    grabbed = false,
  } = useMovie(movieId) as Movie;

  const queueItem = useSelector(createQueueItemSelectorForHook(movieId));
  const movieFile = useMovieFile(movieFileId);

  const hasMovieFile = !!movieFile;
  const isQueued = !!queueItem;

  if (isQueued) {
    const { sizeleft, size } = queueItem;

    const progress = size ? 100 - (sizeleft / size) * 100 : 0;

    return (
      <StatusContent label={translate('MovieIsDownloading')}>
        <QueueDetails
          {...queueItem}
          progressBar={
            <ProgressBar
              progress={progress}
              kind={kinds.PURPLE}
              size={sizes.MEDIUM}
            />
          }
        />
      </StatusContent>
    );
  }

  if (grabbed) {
    return (
      <StatusContent label={translate('MovieIsDownloading')}>
        <Icon
          name={icons.DOWNLOADING}
          title={translate('MovieIsDownloading')}
        />
      </StatusContent>
    );
  }

  if (hasMovieFile) {
    const quality = movieFile.quality;
    const isCutoffNotMet = movieFile.qualityCutoffNotMet;

    return (
      <StatusContent label={translate('MovieDownloaded')}>
        <MovieQuality
          quality={quality}
          size={movieFile.size}
          isCutoffNotMet={isCutoffNotMet}
          title={translate('MovieDownloaded')}
        />
      </StatusContent>
    );
  }

  if (!monitored) {
    return (
      <StatusContent label={translate('MovieIsNotMonitored')}>
        <Icon
          name={icons.UNMONITORED}
          kind={kinds.DISABLED}
          title={translate('MovieIsNotMonitored')}
        />
      </StatusContent>
    );
  }

  if (isAvailable) {
    return (
      <StatusContent label={translate('MovieMissingFromDisk')}>
        <Icon name={icons.MISSING} title={translate('MovieMissingFromDisk')} />
      </StatusContent>
    );
  }

  return (
    <StatusContent label={translate('MovieIsNotAvailable')}>
      <Icon name={icons.NOT_AIRED} title={translate('MovieIsNotAvailable')} />
    </StatusContent>
  );
}

export default MovieStatus;
