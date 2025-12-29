import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header and new note button', () => {
  render(<App />);
  expect(screen.getByText(/note keeper/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /new note/i })).toBeInTheDocument();
});
