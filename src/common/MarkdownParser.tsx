import React, { useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import ExternalLink from '~/components/common/ExternalLink';

import './MarkdownParser.scss';

type MarkdownParserProps = {
  rehypePlugins?: import('unified').PluggableList | undefined;
  children?: string;
};

const MarkdownParser = ({ children, rehypePlugins }: MarkdownParserProps) => {
  const LinkComponent = useCallback(
    (props: any) => (
      <ExternalLink {...props} href={props.href ?? ''}>
        {props.children}
      </ExternalLink>
    ),
    [],
  );

  return children ? (
    <ReactMarkdown
      className="markdown"
      rehypePlugins={rehypePlugins ?? [remarkGfm, rehypeRaw]}
      components={{
        // map a link to ExternalLink
        a: LinkComponent,
      }}
    >
      {children}
    </ReactMarkdown>
  ) : null;
};

export default MarkdownParser;
