import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { FilterSection } from './FilterSection';

describe('FilterSection', () => {
  it('GIVEN FilterSection WHEN rendered THEN should display title and children', () => {
    // GIVEN
    const title = 'Test Section';
    const childText = 'Test Content';

    // WHEN
    render(
      <FilterSection title={title}>
        <div>{childText}</div>
      </FilterSection>
    );

    // THEN
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  it('GIVEN FilterSection with onClearAll WHEN rendered THEN should display clear all button', () => {
    // GIVEN
    const title = 'Test Section';
    const onClearAll = vi.fn();

    // WHEN
    render(
      <FilterSection title={title} onClearAll={onClearAll}>
        <div>Test Content</div>
      </FilterSection>
    );

    // THEN
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByLabelText('Clear all selections')).toBeInTheDocument();
  });

  it('GIVEN FilterSection WHEN clear all button is clicked THEN should call onClearAll', () => {
    // GIVEN
    const title = 'Test Section';
    const onClearAll = vi.fn();

    render(
      <FilterSection title={title} onClearAll={onClearAll}>
        <div>Test Content</div>
      </FilterSection>
    );

    const clearButton = screen.getByLabelText('Clear all selections');

    // WHEN
    fireEvent.click(clearButton);

    // THEN
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it('GIVEN FilterSection without onClearAll WHEN rendered THEN should not display clear all button', () => {
    // GIVEN
    const title = 'Test Section';

    // WHEN
    render(
      <FilterSection title={title}>
        <div>Test Content</div>
      </FilterSection>
    );

    // THEN
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.queryByLabelText('Clear all selections')).not.toBeInTheDocument();
  });

  it('GIVEN FilterSection with hasSelection true WHEN rendered THEN should show clear all button as active', () => {
    // GIVEN
    const title = 'Test Section';
    const onClearAll = vi.fn();

    // WHEN
    render(
      <FilterSection title={title} onClearAll={onClearAll} hasSelection={true}>
        <div>Test Content</div>
      </FilterSection>
    );

    // THEN
    const clearButton = screen.getByLabelText('Clear all selections');
    expect(clearButton).toHaveClass('filter-section__clear--active');
  });

  it('GIVEN FilterSection with hasSelection false WHEN rendered THEN should show clear all button as inactive', () => {
    // GIVEN
    const title = 'Test Section';
    const onClearAll = vi.fn();

    // WHEN
    render(
      <FilterSection title={title} onClearAll={onClearAll} hasSelection={false}>
        <div>Test Content</div>
      </FilterSection>
    );

    // THEN
    const clearButton = screen.getByLabelText('Clear all selections');
    expect(clearButton).not.toHaveClass('filter-section__clear--active');
  });

  it('GIVEN FilterSection WHEN rendered THEN should have proper structure', () => {
    // GIVEN
    const title = 'Test Section';

    // WHEN
    render(
      <FilterSection title={title}>
        <div>Test Content</div>
      </FilterSection>
    );

    // THEN
    const section = screen.getByRole('region', { name: title });
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('filter-section');
  });
});
