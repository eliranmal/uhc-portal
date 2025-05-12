import React from 'react';
import { useField } from 'formik';

import { Checkbox, FormGroup } from '@patternfly/react-core';

import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import { ClusterFromSubscription } from '~/types/types';

const fieldId = 'auto_repair';

type AutoRepairFieldProps = {
  cluster: ClusterFromSubscription;
};

const AutoRepairField = ({ cluster }: AutoRepairFieldProps) => {
  const [field] = useField(fieldId);
  const canAutoRepair = isHypershiftCluster(cluster);

  return canAutoRepair ? (
    <FormGroup label="AutoRepair">
      <Checkbox
        label="Enable AutoRepair"
        isChecked={field.value as boolean}
        onChange={(event, checked) => {
          field.onChange(event);
        }}
        id={fieldId}
        description="If the node is unhealthy, a repair process will drain and recreate the node(s)."
      />
    </FormGroup>
  ) : null;
};

export default AutoRepairField;
