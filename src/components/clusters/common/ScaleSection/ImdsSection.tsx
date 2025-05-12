import React from 'react';
import { Field } from 'formik';

import { FormGroup } from '@patternfly/react-core';

import { IMDSType } from '~/components/clusters/wizards/common';
import { imdsOptions } from '~/components/clusters/wizards/common/ClusterSettings/MachinePool/ImdsSectionField/imdsOptions';
import { ImdsSectionAlert } from '~/components/clusters/wizards/common/ClusterSettings/MachinePool/ImdsSectionField/ImdsSectionAlert';
import { ImdsSectionHint } from '~/components/clusters/wizards/common/ClusterSettings/MachinePool/ImdsSectionField/ImdsSectionHint';
import RadioButtons from '~/components/common/ReduxFormComponents_deprecated/RadioButtons';

const ImdsSection = ({
  isDisabled,
  onChangeImds,
  imds,
}: {
  isDisabled: boolean;
  onChangeImds: (value: IMDSType) => void;
  imds: IMDSType;
}) => {
  React.useEffect(() => {
    if (isDisabled && imds !== IMDSType.V1AndV2) {
      // The user can go back and change the cluster version
      onChangeImds(IMDSType.V1AndV2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisabled, imds]);

  return (
    <FormGroup label="Instance Metadata Service" fieldId="imds" labelIcon={<ImdsSectionHint />}>
      {isDisabled ? (
        <ImdsSectionAlert />
      ) : (
        // @ts-ignore
        <Field
          component={RadioButtons}
          name="imds"
          ariaLabel="Instance Metadata Service"
          props={{
            value: imds,
            onChange: onChangeImds,
          }}
          isDisabled={isDisabled}
          className="pf-v5-u-mb-md"
          options={imdsOptions}
          disableDefaultValueHandling
        />
      )}
    </FormGroup>
  );
};

export default ImdsSection;
