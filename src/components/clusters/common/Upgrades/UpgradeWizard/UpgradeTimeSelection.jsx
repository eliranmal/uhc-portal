import React from 'react';
import PropTypes from 'prop-types';

import {
  DatePicker,
  Form,
  FormGroup,
  MenuToggle,
  Radio,
  Select,
  SelectList,
  SelectOption,
  Split,
  SplitItem,
  Title,
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import './UpgradeWizard.scss';

class UpgradeTimeSelection extends React.Component {
  state = { timeSelectionOpen: false };

  static getDefaultTimestamp = () => {
    const HOUR_IN_MS = 60 * 60 * 1000;
    const atLeastOneHourFromNow = new Date(new Date().getTime() + HOUR_IN_MS);
    if (atLeastOneHourFromNow.getMinutes() > 5) {
      atLeastOneHourFromNow.setHours(atLeastOneHourFromNow.getHours() + 1);
    }
    atLeastOneHourFromNow.setSeconds(0);
    atLeastOneHourFromNow.setMilliseconds(0);
    atLeastOneHourFromNow.setMinutes(0);

    return atLeastOneHourFromNow;
  };

  modeChange = (event) => {
    const { onSet, timestamp } = this.props;
    if (event.target.value === 'now') {
      onSet({ type: 'now' }); // empty timestamp = now
    } else {
      const defaultTimeStamp =
        timestamp || UpgradeTimeSelection.getDefaultTimestamp().toISOString();
      onSet({ type: 'time', timestamp: defaultTimeStamp });
    }
  };

  setDate = (selectedDate) => {
    const { onSet } = this.props;
    const minimum = UpgradeTimeSelection.getDefaultTimestamp();
    /* set the selected date. If the date + time is lower tha minimum,
      set it to the minimum instead */
    const selected = selectedDate < minimum ? minimum : selectedDate;
    onSet({ type: 'time', timestamp: selected });
  };

  setTime = (_, selectedTime) => {
    const { onSet, timestamp } = this.props;
    // Take the time from the time picker, combine it with the date in the current timestamp
    const date = new Date(timestamp);
    const [hour, minute] = selectedTime.split(':');
    date.setHours(hour);
    date.setMinutes(minute);
    onSet({ type: 'time', timestamp: date.toISOString() });
    this.setState({ timeSelectionOpen: false });
  };

  render() {
    const { type, timestamp } = this.props;
    const { timeSelectionOpen } = this.state;

    const formattedDate = (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const localDate = `${year}-${month}-${day}`;
      return localDate;
    };

    if (timeSelectionOpen) {
      // scroll to the selected item when the Select is opened
      setTimeout(() => {
        requestAnimationFrame(() => {
          const selected = document.querySelector(
            '#upgrade-time-select-dropdown .pf-v5-c-menu__item.pf-m-selected',
          );
          if (selected) {
            selected.scrollIntoView({ block: 'center' });
          }
        });
      }, 1);
    }

    const makeSelectOptions = () => {
      const ret = [];
      for (let hour = 0; hour < 24; hour += 1) {
        const value = `${hour.toString().padStart(2, 0)}:00`;
        const date = new Date(timestamp);
        date.setHours(hour);
        date.setMinutes(0);
        ret.push(
          <SelectOption
            value={value}
            key={value}
            isDisabled={UpgradeTimeSelection.getDefaultTimestamp() > date}
          >
            {value}
          </SelectOption>,
        );
      }
      return ret;
    };

    const getSelectedTime = () => {
      const date = new Date(timestamp);
      const hour = date.getHours().toString().padStart(2, 0);
      const minute = date.getMinutes().toString().padStart(2, 0);
      return `${hour}:${minute}`;
    };

    // minDate with no time-of-day details
    const minDate = new Date(new Date().toDateString());
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);

    const rangeValidator = (date) => {
      if (date < minDate) {
        return 'The selected date is before the allowable range.';
      }

      if (date > maxDate) {
        return 'The selected date is after the allowable range.';
      }
      return '';
    };

    const onToggle = (timeSelectionOpen) => this.setState({ timeSelectionOpen });

    const toggle = (toggleRef) => (
      <MenuToggle
        ref={toggleRef}
        onClick={() => onToggle(!timeSelectionOpen)}
        isExpanded={timeSelectionOpen}
        aria-label="Upgrade time menu"
        className="upgrade-time-select"
      >
        {getSelectedTime()}
      </MenuToggle>
    );

    return (
      <>
        <Title className="wizard-step-title" size="lg" headingLevel="h3">
          Schedule update
        </Title>
        <Form className="wizard-step-body" onSubmit={(e) => e.preventDefault()}>
          <FormGroup fieldId="upgrade-schedule-now">
            <Radio
              isChecked={type === 'now'}
              name="upgrade-schedule-type"
              id="upgrade-schedule-now"
              value="now"
              label="Update now (update will begin within the next hour)"
              onChange={this.modeChange}
            />
          </FormGroup>
          <FormGroup fieldId="upgrade-schedule-time">
            <Radio
              isChecked={type === 'time'}
              name="upgrade-schedule-type"
              id="upgrade-schedule-time"
              value="time"
              label="Schedule a different time"
              onChange={this.modeChange}
            />
          </FormGroup>
          {type === 'time' && (
            <>
              <FormGroup>
                <Split className="upgrade-schedule-datepicker-split">
                  <SplitItem>
                    <DatePicker
                      id="upgrade-schedule-datepicker"
                      className="upgrade-schedule-datepicker-input"
                      validators={[rangeValidator]}
                      onChange={(_, __, date) =>
                        date instanceof Date && !Number.isNaN(date) && this.setDate(date)
                      }
                      isDisabled={!timestamp}
                      value={formattedDate(timestamp)}
                      invalidFormatText={"Invalid date format. Use 'YYYY-MM-DD' format."}
                    />
                  </SplitItem>
                  <SplitItem>
                    <Select
                      isOpen={timeSelectionOpen}
                      selected={getSelectedTime()}
                      onOpenChange={(timeSelectionOpen) => onToggle(timeSelectionOpen)}
                      toggle={toggle}
                      onSelect={this.setTime}
                      isScrollable
                    >
                      <SelectList id="upgrade-time-select-dropdown">
                        {makeSelectOptions()}
                      </SelectList>
                    </Select>
                  </SplitItem>
                  <SplitItem />
                </Split>
              </FormGroup>

              <dl className="cluster-upgrade-dl">
                <dt>UTC </dt>
                <dd>
                  <DateFormat type="exact" date={new Date(timestamp)} />
                </dd>
              </dl>
            </>
          )}
        </Form>
      </>
    );
  }
}

UpgradeTimeSelection.propTypes = {
  onSet: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['now', 'time']),
  timestamp: PropTypes.string,
};

export default UpgradeTimeSelection;
