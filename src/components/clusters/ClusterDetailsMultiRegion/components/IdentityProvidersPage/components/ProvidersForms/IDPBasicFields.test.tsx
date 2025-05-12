import React from 'react';
import { Formik } from 'formik';

import { checkAccessibility, render, screen } from '~/testUtils';

import { FieldId } from '../../constants';

import IDPBasicFields from './IDPBasicFields';

const idpBasicFieldsData = {
  [FieldId.CLIENT_ID]: 'mockClientID',
  [FieldId.CLIENT_SECRET]: 'mockClientSecret',
};

const initialValues = {
  [FieldId.CLIENT_ID]: '',
  [FieldId.CLIENT_SECRET]: '',
};

const buildTestComponent = (children: React.ReactNode, formValues = {}) => (
  <Formik
    initialValues={{
      ...initialValues,
      ...formValues,
    }}
    onSubmit={() => {}}
  >
    {children}
  </Formik>
);

describe('IDPBasicFields', () => {
  it('is accessible', async () => {
    const { container } = render(buildTestComponent(<IDPBasicFields isPending />));

    await checkAccessibility(container);
  });

  it('shows disabled inputs while loading', () => {
    render(buildTestComponent(<IDPBasicFields isPending />));

    expect(screen.getByLabelText('Client ID *')).toBeDisabled();
    expect(screen.getByLabelText('Client secret *')).toBeDisabled();
  });

  it('check properties when isPending false', () => {
    render(buildTestComponent(<IDPBasicFields isPending={false} />));
    expect(screen.getByLabelText('Client ID *').getAttribute('disabled')).toBe(null);
    expect(screen.getByLabelText('Client secret *').getAttribute('disabled')).toBe(null);
  });

  it('check properties when isPending is undefined', () => {
    render(buildTestComponent(<IDPBasicFields />));
    expect(screen.getByLabelText('Client ID *').getAttribute('disabled')).toBe(null);
    expect(screen.getByLabelText('Client secret *').getAttribute('disabled')).toBe(null);
  });

  it('check that correct values are in the input fields', () => {
    render(buildTestComponent(<IDPBasicFields />, idpBasicFieldsData));
    expect(screen.getByRole('textbox', { name: 'Client ID' })).toHaveDisplayValue('mockClientID');
  });
});
