/* eslint-disable custom-rules/restrict-react-router-imports */
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { withBasename } from './getBaseName';

type LinkProps = React.ComponentProps<typeof RouterLink>;

export const Link = ({ to, ...rest }: LinkProps) => <RouterLink {...rest} to={withBasename(to)} />;

export default Link;
