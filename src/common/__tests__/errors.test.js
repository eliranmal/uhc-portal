import AddOnsConstants from '../../components/clusters/ClusterDetailsMultiRegion/components/AddOns/AddOnsConstants';
import { PENDING_ACTION } from '../../redux/reduxHelpers';
import { formatErrorDetails, getErrorMessage, overrideErrorMessage } from '../errors';

describe('getErrorMessage()', () => {
  it('Properly extracts error message from the Error API object', () => {
    const action = {
      payload: {
        response: {
          data: {
            kind: 'Error',
            id: 1,
            href: 'http://example.com',
            code: 'CLUSTERS-MGMT-1',
            reason: 'human readable reason',
          },
        },
      },
    };
    expect(getErrorMessage(action)).toBe('CLUSTERS-MGMT-1:\nhuman readable reason');
  });

  it('Properly extracts error message from unexpected object', () => {
    const action = {
      payload: {
        response: {
          data: {
            unexpected: 'object',
          },
        },
      },
    };
    expect(getErrorMessage(action)).toBe('{"unexpected":"object"}');
  });

  it('Fails gracefully when getting JS Error objects', () => {
    const action = {
      payload: new Error('Hello'),
    };
    expect(getErrorMessage(action)).toBe('Error: Hello');
  });
});

describe('overrideErrorMessage()', () => {
  it('handles ExcessResources error kind for cluster', () => {
    const payload = {
      details: [
        {
          kind: 'ExcessResources',
        },
      ],
    };
    const expectedMessage = `You are not authorized to create the cluster because your request exceeds available quota.
              In order to fulfill this request, you will need quota/subscriptions for:`;
    expect(overrideErrorMessage(payload)).toBe(expectedMessage);
  });

  it('handles ExcessResources error kind for cluster addon create', () => {
    const payload = {
      details: [
        {
          kind: 'ExcessResources',
        },
      ],
    };
    const expectedMessage = `You are not authorized to create the cluster add-on because your request exceeds available quota.
              In order to fulfill this request, you will need quota/subscriptions for:`;
    expect(overrideErrorMessage(payload, PENDING_ACTION(AddOnsConstants.ADD_CLUSTER_ADDON))).toBe(
      expectedMessage,
    );
  });

  it('handles ExcessResources error kind for cluster addon update', () => {
    const payload = {
      details: [
        {
          kind: 'ExcessResources',
        },
      ],
    };
    const expectedMessage = `You are not authorized to create the cluster add-on because your request exceeds available quota.
              In order to fulfill this request, you will need quota/subscriptions for:`;
    expect(
      overrideErrorMessage(payload, PENDING_ACTION(AddOnsConstants.UPDATE_CLUSTER_ADDON)),
    ).toBe(expectedMessage);
  });
});

describe('formatErrorDetails()', () => {
  it('fails gracefully when getting arbitrary error details', () => {
    const errDetails = [
      {
        kind: 'Wat',
        items: [
          'lol',
          {
            foo: 'bar',
            wat: ['wow'],
          },
        ],
      },
    ];
    const expected = `{
  "foo": "bar",
  "wat": [
    "wow"
  ]
}`;

    const errorDetails = formatErrorDetails(errDetails);
    expect(errorDetails).toHaveLength(1);
    expect(errorDetails[0]).toHaveLength(2);
    expect(errorDetails[0][1]).toBe(expected);
  });

  it('handles ExcessResources kind addon', () => {
    const errDetails = [
      {
        kind: 'ExcessResources',
        items: [
          {
            resource_type: 'addon',
            resource_name: 'addon-prow-operator',
            availability_zone_type: 'single',
            count: 5,
            billing_model: 'standard',
          },
        ],
      },
    ];

    const errorDetails = formatErrorDetails(errDetails);
    expect(errorDetails).toHaveLength(1);
    expect(errorDetails[0][0]).toBe('addon: addon-prow-operator');
  });

  it('handles AddOnParameterOptionList kind', () => {
    const errDetails = [
      {
        kind: 'AddOnParameterOptionList',
        items: [
          {
            name: 'Option 1',
            value: 'option 1',
          },
          {
            name: 'Option 2',
            value: 'option 2',
          },
        ],
      },
    ];

    const errorDetails = formatErrorDetails(errDetails);
    expect(errorDetails).toHaveLength(1);

    const expected = `[
  {
    "name": "Option 1",
    "value": "option 1"
  },
  {
    "name": "Option 2",
    "value": "option 2"
  }
]`;
    expect(errorDetails[0]).toBe(expected);
  });

  it('handles AddOnRequirementData kind', () => {
    const errDetails = [
      {
        kind: 'AddOnRequirementData',
        items: {
          'cloud_provider.id': 'gcp',
          'region.id': ['us-east-1', 'eu-west-1'],
        },
      },
    ];

    const errorDetails = formatErrorDetails(errDetails);
    expect(errorDetails).toHaveLength(1);

    const expected = `{
  "cloud_provider.id": "gcp",
  "region.id": [
    "us-east-1",
    "eu-west-1"
  ]
}`;
    expect(errorDetails[0]).toBe(expected);
  });
});
