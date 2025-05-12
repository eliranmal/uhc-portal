import React, { ReactNode } from 'react';

interface ChildrenProps {
  children: ReactNode | string | undefined;
}

/* ******************************************
 * So I need to mock the ReactMarkdown component in jest.config.js -> moduleNameMapper because it does not play nice with jest
 * However, I did not want to rewrite all the tests that use ReactMarkdown, so I created this mock to return the correct data sent in
 * My version has gotten far too complicated, but now we won't have to fix tests when we fix using the actual ReactMarkdown component
 * ***************************************** */
function ReactMarkdownMock({ children }: ChildrenProps) {
  if (typeof children === 'string') {
    if (children.includes('http')) {
      const url = children.match(/(http[^\s]+)/g);
      if (url) {
        // remove trailing punctuation from url, if it exists
        if (url[0].endsWith('.') || url[0].endsWith(',')) {
          url[0] = url[0].slice(0, -1);
        }
        // Grab the part of the string that is not the url
        const text = children.split(url[0]);
        return (
          <>
            {text}
            <a data-testid="openInNewWindowIcon" href={url.join(' ')}>
              {url}
            </a>
          </>
        );
      }
      return <a href="./#">{children}</a>;
    }

    return <div>{children}</div>;
  }
  if (typeof children === 'object') {
    return children;
  }
  return { children };
}

export default ReactMarkdownMock;
