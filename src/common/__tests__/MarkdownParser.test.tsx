import React from 'react';

import { render, screen } from '~/testUtils';

import MarkdownParser from '../MarkdownParser';

import {
  backstickContent,
  expectedBackstickContent,
  expectedMultipleHtmlElements,
  limitedSupportHtmlWithLinks,
  multipleHtmlElements,
} from './MarkdownParser.fixtures';

/* ******************************************
 * Fix unit test cases by mocking the ReactMarkdown component in jest.config.js -> moduleNameMapper (see markdownMock.tsx)
 * Since these tests do not mean anything as the mock just returns the same data sent in, we can skip them
 * Ticket OCMUI-2682 addresses the issues of react-markdown
 * ***************************************** */

describe.skip('MarkdownParser', () => {
  it('empty content', () => {
    render(
      <div data-testid="parent-div">
        <MarkdownParser />
      </div>,
    );
    expect(screen.getByTestId('parent-div').children.length).toBe(0);
  });

  it('p block', () => {
    render(<MarkdownParser>{"<p data-testid='test-id-1'>whatever the text</p>"}</MarkdownParser>);
    expect(screen.getByTestId('test-id-1')).toBeInTheDocument();
  });

  it('nested block', () => {
    render(
      <MarkdownParser>
        {"<div data-testid='test-id-1'><p data-testid='test-id-2'>whatever the text</p></div>"}
      </MarkdownParser>,
    );
    expect(screen.getByTestId('test-id-1')).toBeInTheDocument();
    expect(screen.getByTestId('test-id-2')).toBeInTheDocument();
  });

  it('content with links', () => {
    render(<MarkdownParser>{limitedSupportHtmlWithLinks}</MarkdownParser>);
    ['link1', 'link2', 'link3'].forEach((testId) => {
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });

  it('multiple html elements', () => {
    render(
      <div data-testid="parent-div">
        <MarkdownParser>{multipleHtmlElements}</MarkdownParser>
      </div>,
    );
    expect(screen.getByTestId('parent-div').innerHTML).toBe(expectedMultipleHtmlElements);
  });

  it('rendering backstick character', () => {
    render(
      <div data-testid="parent-div">
        <MarkdownParser>{backstickContent}</MarkdownParser>
      </div>,
    );
    expect(screen.getByTestId('parent-div').innerHTML).toBe(expectedBackstickContent);
  });
});
