import { Language } from '@patternfly/react-code-editor';

import { DefaultSyncEditorLoader } from './DefaultSyncEditorLoader';
import { ISyncEditorLoader } from './ISyncEditorLoader';
import { YamlSyncEditorLoader } from './YamlSyncEditorLoader';

class SyncEditorLoaderFactory {
  static createrLoader(language: Language): ISyncEditorLoader {
    switch (language) {
      case Language.yaml:
        return new YamlSyncEditorLoader();
      default:
        return new DefaultSyncEditorLoader();
    }
  }
}

export { SyncEditorLoaderFactory };
