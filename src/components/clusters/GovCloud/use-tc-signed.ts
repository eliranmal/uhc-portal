import * as React from 'react';

import { authorizationsService } from '~/services';

export const useTCSigned = (): [boolean, string, boolean, string | undefined] => {
  const [tcSigned, setTCSigned] = React.useState(false);
  const [redirectURL, setRedirectURL] = React.useState('');
  const [error, setError] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const execute = async () => {
      setIsLoading(true);
      try {
        const response = await authorizationsService.selfTermsReview({
          check_optional_terms: true,
          event_code: 'govCloud',
          site_code: 'cloudServices',
        });
        setTCSigned(!response.data.terms_required);
        setRedirectURL(response.data.redirect_url || '');
      } catch (err) {
        setError('Failed to detect Enterprise agreement & Appendix 4 status.');
      } finally {
        setIsLoading(false);
      }
    };
    execute();
  }, []);
  return [tcSigned, redirectURL, isLoading, error];
};
