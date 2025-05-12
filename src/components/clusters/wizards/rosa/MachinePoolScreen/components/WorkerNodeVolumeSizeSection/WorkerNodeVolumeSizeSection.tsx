import React, { useEffect } from 'react';
import { Field } from 'formik';

import { FormGroup } from '@patternfly/react-core';

import { validateWorkerVolumeSize } from '~/common/validators';
import { defaultWorkerNodeVolumeSizeGiB } from '~/components/clusters/common/machinePools/constants';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '~/components/clusters/wizards/rosa/constants';
import FormNumberInput from '~/components/common/FormComponents/FormNumberInput';
import PopoverHint from '~/components/common/PopoverHint';

import './WorkerNodeVolumeSizeSection.scss';

type WorkerNodeVolumeSizeSectionProps = {
  minWorkerVolumeSizeGiB: number;
  maxWorkerVolumeSizeGiB: number;
};

const WorkerNodeVolumeSizeSection = ({
  minWorkerVolumeSizeGiB,
  maxWorkerVolumeSizeGiB,
}: WorkerNodeVolumeSizeSectionProps) => {
  const {
    values: { [FieldId.WorkerVolumeSizeGib]: workerVolumeSizeGib },
    setFieldValue,
    setFieldTouched,
    getFieldProps,
    getFieldMeta,
  } = useFormState();

  useEffect(() => {
    if (workerVolumeSizeGib === undefined) {
      setFieldValue(FieldId.WorkerVolumeSizeGib, defaultWorkerNodeVolumeSizeGiB, true);
    }
  }, [setFieldValue, workerVolumeSizeGib]);

  return (
    <FormGroup
      className="worker-node-volume-size-section"
      label="Root disk size"
      isRequired
      fieldId={FieldId.WorkerVolumeSizeGib}
      labelIcon={
        <PopoverHint
          hint={`Root disks are AWS EBS volumes attached as the primary disk for AWS EC2 instances. The root disk size for this machine pool group of nodes must be between ${minWorkerVolumeSizeGiB}GiB and ${maxWorkerVolumeSizeGiB}GiB.`}
        />
      }
    >
      <Field
        component={FormNumberInput}
        name={FieldId.WorkerVolumeSizeGib}
        inputName={FieldId.WorkerVolumeSizeGib}
        inputAriaLabel="Worker root disk size"
        validate={(value: number) =>
          validateWorkerVolumeSize(value, {}, { minWorkerVolumeSizeGiB, maxWorkerVolumeSizeGiB })
        }
        min={minWorkerVolumeSizeGiB}
        max={maxWorkerVolumeSizeGiB}
        widthChars={5}
        unit="GiB"
        input={{
          ...getFieldProps(FieldId.WorkerVolumeSizeGib),
          value: workerVolumeSizeGib,
          onChange: (value: string) => {
            setFieldValue(FieldId.WorkerVolumeSizeGib, parseFloat(value), true);
            setTimeout(() => setFieldTouched(FieldId.WorkerVolumeSizeGib, false), 1);
          },
        }}
        meta={getFieldMeta(FieldId.WorkerVolumeSizeGib)}
      />
    </FormGroup>
  );
};

export default WorkerNodeVolumeSizeSection;
