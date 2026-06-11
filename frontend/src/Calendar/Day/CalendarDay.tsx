import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import AppState from 'App/State/AppState';
import * as calendarViews from 'Calendar/calendarViews';
import CalendarEvent from 'Calendar/Events/CalendarEvent';
import { CalendarEvent as CalendarEventModel } from 'typings/Calendar';
import styles from './CalendarDay.css';

function sort(items: CalendarEventModel[]) {
  return items.sort((a, b) => {
    const aDate = moment(a.inCinemas).unix();
    const bDate = moment(b.inCinemas).unix();

    return aDate - bDate;
  });
}

function createCalendarEventsConnector(date: string) {
  return createSelector(
    (state: AppState) => state.calendar.items,
    (state: AppState) => state.calendar.options,
    (items, options) => {
      const { showCinemaRelease, showDigitalRelease, showPhysicalRelease } =
        options;
      const momentDate = moment(date);

      const filtered = items.filter(
        ({ inCinemas, digitalRelease, physicalRelease }) => {
          return (
            (showCinemaRelease &&
              inCinemas &&
              momentDate.isSame(moment(inCinemas), 'day')) ||
            (showDigitalRelease &&
              digitalRelease &&
              momentDate.isSame(moment(digitalRelease), 'day')) ||
            (showPhysicalRelease &&
              physicalRelease &&
              momentDate.isSame(moment(physicalRelease), 'day'))
          );
        }
      );

      return sort(filtered);
    }
  );
}

interface CalendarDayProps {
  date: string;
  isTodaysDate: boolean;
}

function CalendarDay({ date, isTodaysDate }: CalendarDayProps) {
  const { time, view } = useSelector((state: AppState) => state.calendar);
  const events = useSelector(createCalendarEventsConnector(date));

  const ref = React.useRef<HTMLDivElement>(null);
  const dayLabel = `${moment(date).format('dddd, LL')}, ${events.length} ${
    events.length === 1 ? 'event' : 'events'
  }`;

  React.useEffect(() => {
    if (isTodaysDate && view === calendarViews.MONTH && ref.current) {
      ref.current.scrollIntoView();
    }
  }, [time, isTodaysDate, view]);

  return (
    <div
      ref={ref}
      role="gridcell"
      aria-label={dayLabel}
      aria-current={isTodaysDate ? 'date' : undefined}
      className={classNames(
        styles.day,
        view === calendarViews.DAY && styles.isSingleDay
      )}
    >
      {view === calendarViews.MONTH && (
        <div
          className={classNames(
            styles.dayOfMonth,
            isTodaysDate && styles.isToday,
            !moment(date).isSame(moment(time), 'month') &&
              styles.isDifferentMonth
          )}
        >
          {moment(date).date()}
        </div>
      )}
      <div role="list" aria-label={`Events for ${moment(date).format('LL')}`}>
        {events.map((event) => {
          return (
            <CalendarEvent key={event.id} {...event} date={date as string} />
          );
        })}
      </div>
    </div>
  );
}

export default CalendarDay;
