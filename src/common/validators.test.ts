import { MAX_NODES_DEFAULT } from '~/components/clusters/common/clusterAutoScalingValues';

import {
  checkHostDomain,
  composeValidators,
  validateMaxNodes,
  validatePositive,
  validateSecureURL,
} from './validators';

describe('validators', () => {
  describe('checkHostDomain', () => {
    it('should return undefined if the host domain is valid', () => {
      expect(checkHostDomain('example.com')).toEqual(undefined);
    });

    it('should return error if the host domain is invalid', () => {
      expect(checkHostDomain('example')).toBeDefined();
    });
    it('should return error if the host domain contains protocol', () => {
      expect(checkHostDomain('https://example.com')).toBeDefined();
    });
    it('should return error if the host domain is empty', () => {
      expect(checkHostDomain('')).toBeDefined();
    });
    it('should return undefined if subdomain host domain is valid', () => {
      expect(checkHostDomain('sub.example.com')).toEqual(undefined);
    });
  });
  describe('validateSecureURL', () => {
    it('should return false if no secure protocol', () => {
      expect(validateSecureURL('example.com')).toEqual(false);
    });

    it('should return false if the host domain is invalid', () => {
      expect(validateSecureURL('example')).toEqual(false);
    });
    it('should return true if the host domain contains secure protocol', () => {
      expect(validateSecureURL('https://example.com')).toEqual(true);
    });
    it('should return false if the host domain is empty', () => {
      expect(validateSecureURL('')).toEqual(false);
    });
    it('should return false if subdomain host domain is valid but unsecure', () => {
      expect(validateSecureURL('http://sub.example.com')).toEqual(false);
    });
  });
  describe('composeValidators', () => {
    const validateFnc1 = () => 'Error 1';
    const validateFnc2 = () => 'Error 2';
    const validateFnc3 = () => undefined;

    it('should return the first encountered error string', () => {
      expect(composeValidators(validateFnc1, validateFnc2, validateFnc3)('')).toEqual('Error 1');
      expect(composeValidators(validateFnc3, validateFnc2, validateFnc1)('')).toEqual('Error 2');
    });
  });

  describe('Cluster autosacler validators', () => {
    describe('Max nodes total', () => {
      it('should not allow a value larger than the max nodes', () => {
        expect(validateMaxNodes(MAX_NODES_DEFAULT + 5, MAX_NODES_DEFAULT)).toEqual(
          `Value must not be greater than ${MAX_NODES_DEFAULT}.`,
        );
      });
      it('should allow a value less than or equal to the max nodes', () => {
        expect(validateMaxNodes(MAX_NODES_DEFAULT - 5, MAX_NODES_DEFAULT)).toEqual(undefined);
        expect(validateMaxNodes(MAX_NODES_DEFAULT, MAX_NODES_DEFAULT)).toEqual(undefined);
      });
    });
  });

  describe('validatePositive', () => {
    it.each([
      ['should not allow a negative value', -5, 'Input must be a positive number.'],
      ['should not allow 0', 0, 'Input must be a positive number.'],
      ['should allow a positive value', 5, undefined],
    ])('%s', (_title: string, value: number | string, expected: string | undefined) =>
      expect(validatePositive(value)).toBe(expected),
    );
  });
});
