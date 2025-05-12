import { type MonacoEditor } from 'monaco-types';

interface ISyncEditorLoader {
  configure(monaco: MonacoEditor, options?: any): () => void;
}

export { ISyncEditorLoader };
