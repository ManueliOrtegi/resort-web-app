import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Solara resort experience', () => {
  render(<App />);
  expect(screen.getByText(/Arrive at/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /find your room/i })).toBeInTheDocument();
});
