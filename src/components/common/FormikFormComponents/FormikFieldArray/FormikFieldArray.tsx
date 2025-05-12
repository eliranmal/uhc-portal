import React from 'react';
import { FieldArray } from 'formik';

import { Button, Grid, GridItem, Stack, StackItem } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';

import { useFormState } from '~/components/clusters/wizards/hooks';

import { LabelGridItem } from './CompoundFieldArray';
import { FieldArrayTextInput } from './FieldArrayTextInput';

type FormikFieldArrayProps = {
  fieldID: string;
  label: string;
  helpText?: string;
  placeHolderText?: string;
  isRequired?: boolean;
};

const FieldArrayErrorGridItem = ({ isLast, errorMessage, touched, isGroupError }: any) => {
  if (errorMessage && isLast && (touched || isGroupError)) {
    return (
      <GridItem className="field-grid-item pf-v5-c-form__helper-text pf-m-error">
        {errorMessage}
      </GridItem>
    );
  }
  return null;
};

export const FormikFieldArray = (props: FormikFieldArrayProps) => {
  const { fieldID, label, helpText, placeHolderText, isRequired } = props;
  const { values, errors, getFieldMeta, setFieldTouched } = useFormState();
  const fieldData = values[fieldID];
  const { touched } = getFieldMeta(fieldID);

  return (
    <Stack hasGutter label={label}>
      <StackItem span={6}>
        <LabelGridItem
          fieldSpan={6}
          isRequired={isRequired}
          label={`${label} (${fieldData?.length})`}
          helpText={helpText}
        />
      </StackItem>
      <FieldArray
        name={fieldID}
        validateOnChange
        render={({ push, remove }) => (
          <>
            <StackItem span={6} className="field-grid-item">
              <Button
                icon={<PlusCircleIcon />}
                onClick={() => {
                  push('');
                  setFieldTouched(fieldID);
                }}
                variant="link"
                isInline
                isDisabled={fieldData?.some((el: string) => el === '')}
              >
                Add more
              </Button>
            </StackItem>
            {fieldData?.map((_: any, index: number) => {
              const isRemoveDisabled = index === 0 && fieldData?.length === 1;
              const name = `${fieldID}.${index}`;
              return (
                // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={name}>
                  <Grid>
                    <Grid hasGutter span={6}>
                      <GridItem span={4}>
                        <FieldArrayTextInput
                          placeHolderText={`${placeHolderText} ${index + 1}`}
                          name={name}
                          formGroup={{ isRequired: false }}
                          textInputClassName="field-grid-item"
                        />
                      </GridItem>
                      <GridItem span={2} className="field-grid-item minus-button">
                        <Button
                          onClick={() => remove(index)}
                          icon={<MinusCircleIcon />}
                          variant="link"
                          isInline
                          isDisabled={isRemoveDisabled}
                        />
                      </GridItem>
                    </Grid>
                  </Grid>
                  <GridItem>
                    <FieldArrayErrorGridItem
                      isLast={index === fieldData.length - 1}
                      errorMessage={errors[fieldID]}
                      touched={touched}
                      isGroupError={false}
                    />
                  </GridItem>
                </React.Fragment>
              );
            })}
          </>
        )}
      />
    </Stack>
  );
};
