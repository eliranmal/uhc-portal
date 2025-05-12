/* eslint-disable custom-rules/restrict-react-router-imports */
import React from 'react';
import { Navigate as RouterNavigate } from 'react-router-dom';

import { withBasename } from './getBaseName';

type NavigateProps = React.ComponentProps<typeof RouterNavigate>;

export const Navigate = ({ to, ...rest }: NavigateProps) => (
  <RouterNavigate {...rest} to={withBasename(to)} />
);

export default Navigate;
