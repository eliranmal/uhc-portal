import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IMarkdownString } from 'monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { type MonacoEditor as MonacoEditorType } from 'monaco-types';
import MonacoEditor, { ChangeHandler, EditorDidMount } from 'react-monaco-editor';

import { Language } from '@patternfly/react-code-editor';

import { SyncEditorLoaderFactory } from './SyncEditorLoaderFactory/SyncEditorLoaderFactory';

type SyncEditorProps = {
  content?: string;
  onChange: (content: string) => void;
  isReadOnly?: boolean;
  readOnlyMessage?: IMarkdownString;
  schemas: any[];
  isSideBarVisible: boolean;
  language: Language;
  isDarkTheme?: boolean;
  setValidationErrors?: (errorMessages: string[]) => void;
};
const SyncEditor = ({
  content,
  onChange,
  isReadOnly,
  readOnlyMessage,
  schemas,
  isSideBarVisible,
  language,
  isDarkTheme,
  setValidationErrors,
}: SyncEditorProps) => {
  const [editorContent, setEditorContent] = useState(content);
  const [monacoLoaderDispose, setMonacoLoaderDispose] = useState<() => void>();
  const [editor, setEditor] = useState<monacoEditor.editor.IStandaloneCodeEditor>();
  const [initialLayoutInfo, setInitialLayoutInfo] = useState<{ width: number; height: number }>();

  const validationListener = useCallback(
    (uris: readonly monacoEditor.Uri[], monaco: MonacoEditorType) => {
      if (setValidationErrors && uris.length && monaco) {
        setValidationErrors(
          uris.reduce(
            (acc: string[], uri: monacoEditor.Uri) => [
              ...acc,
              ...monaco.editor.getModelMarkers({ resource: uri }).map((e) => e.message),
            ],
            [],
          ),
        );
      }
    },
    [setValidationErrors],
  );

  const handleEditorDidMount: EditorDidMount = useCallback(
    (editor, monaco) => {
      const dispose = SyncEditorLoaderFactory.createrLoader(language).configure(monaco, {
        schemas,
      });
      setMonacoLoaderDispose(() => () => dispose());
      editor.focus();
      setEditor(editor);
      monaco.editor.onDidChangeMarkers((uris) => validationListener(uris, monaco));
      const { width, height } = editor.getLayoutInfo();
      setInitialLayoutInfo({ width, height });
    },
    [language, schemas, validationListener],
  );

  const handleChange: ChangeHandler = useCallback(
    (value, _event) => {
      setEditorContent(value);
      onChange(value);
    },
    [onChange],
  );

  useEffect(
    () => () => {
      if (monacoLoaderDispose) {
        monacoLoaderDispose();
      }
    },
    [monacoLoaderDispose],
  );

  // To avoid width error on automaticLayout
  useEffect(() => {
    if (editor) {
      editor.layout(initialLayoutInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSideBarVisible]);

  const monacoEditor = useMemo(
    () => (
      <MonacoEditor
        width="100%"
        height="100%"
        language={language}
        theme={isDarkTheme ? 'vs-dark' : 'vs-light'}
        options={{
          selectOnLineNumbers: true,
          minimap: { enabled: true },
          quickSuggestions: { other: true, comments: true, strings: true },
          readOnly: isReadOnly,
          readOnlyMessage,
          fixedOverflowWidgets: true,
          automaticLayout: true,
        }}
        value={editorContent}
        editorDidMount={handleEditorDidMount}
        onChange={handleChange}
      />
    ),
    [
      language,
      isDarkTheme,
      isReadOnly,
      readOnlyMessage,
      editorContent,
      handleEditorDidMount,
      handleChange,
    ],
  );

  return <div style={{ height: '100%' }}>{monacoEditor}</div>;
};

export { SyncEditor };
