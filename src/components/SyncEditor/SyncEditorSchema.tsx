import React from 'react';

type SyncEditorSchemaProps = {
  schema: string;
};
const SyncEditorSchema = ({ schema }: SyncEditorSchemaProps) => <div>{schema}</div>;

export { SyncEditorSchema };
