import { normalizedProducts } from '~/common/subscriptionTypes';

import { IClusterRequestTranslator } from './IClusterRequestTranslator';
import { NotDefinedRequestTranslator } from './NotDefinedRequestTranslator';
import { RosaRequestTranslator } from './RosaRequestTranslator';

class ClusterRequestTranslatorFactory {
  static createClusterRequestTranslator(
    product: keyof typeof normalizedProducts,
  ): IClusterRequestTranslator {
    switch (product) {
      case normalizedProducts.ROSA:
        return new RosaRequestTranslator();
      default:
        return new NotDefinedRequestTranslator();
    }
  }
}

export { ClusterRequestTranslatorFactory };
