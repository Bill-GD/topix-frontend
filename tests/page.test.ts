import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Page from '@/routes/+page.svelte';

describe('/+page.svelte', () => {
  it('should render h1', async () => {
    render(Page);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
