import React from 'react';

import { render, screen, userEvent } from '~/testUtils';

import { ProductCard } from '../../common/ProductCard/ProductCard';
import { PRODUCT_CARD_TEST_CASES } from '../components/fixtures';

import '@testing-library/jest-dom';

describe('<ProductCard />', () => {
  it('renders an unselected card', async () => {
    render(<ProductCard {...PRODUCT_CARD_TEST_CASES.UNSELECTED} />);

    const { title, description, logo, labelText, drawerPanelContent, openLearnMore } =
      PRODUCT_CARD_TEST_CASES.UNSELECTED;

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByText(labelText)).toBeInTheDocument();

    const cardLogo = screen.getByTestId(logo);
    expect(cardLogo).toHaveAttribute('src', `${logo}`);

    expect(screen.getByTestId('open-right-drawer-icon')).toBeInTheDocument();

    expect(
      screen.getByTestId('product-overview-card__learn-more-button-some-id'),
    ).toBeInTheDocument();
    const readMoreBtn = screen.getByText(/Learn more/i);
    await userEvent.click(readMoreBtn);
    expect(openLearnMore).toHaveBeenCalled();
    expect(openLearnMore).toHaveBeenCalledWith(title, drawerPanelContent);

    const card = screen.getByTestId('product-overview-card');
    expect(card).not.toHaveClass('pf-m-selected-raised');
  });

  it('renders a selected card', () => {
    render(<ProductCard {...PRODUCT_CARD_TEST_CASES.SELECTED} />);

    const card = screen.getByTestId('product-overview-card');
    expect(card).toHaveClass('pf-m-selected-raised');
  });

  it('renders a card without a labelText', () => {
    render(<ProductCard {...PRODUCT_CARD_TEST_CASES.WITHOUT_LABEL_TEXT} />);

    const { labelText } = PRODUCT_CARD_TEST_CASES.SELECTED;

    expect(screen.queryByText(labelText)).not.toBeInTheDocument();
    expect(screen.queryByTestId('label-text')).not.toBeInTheDocument();
  });
});
