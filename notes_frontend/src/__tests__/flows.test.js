import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';

function openNewNote() {
  const newBtn = screen.getByRole('button', { name: /new note/i });
  fireEvent.click(newBtn);
}

test('create note flow', async () => {
  render(<App />);
  openNewNote();

  const dlg = await screen.findByRole('dialog', { name: /edit note|new note/i });
  const titleInput = within(dlg).getByPlaceholderText(/title/i);
  const contentInput = within(dlg).getByPlaceholderText(/write your note/i);

  fireEvent.change(titleInput, { target: { value: 'Test Note' } });
  fireEvent.change(contentInput, { target: { value: 'Some content' } });

  const saveBtn = within(dlg).getByRole('button', { name: /save/i });
  fireEvent.click(saveBtn);

  // Note title should appear
  expect(await screen.findByText(/test note/i)).toBeInTheDocument();
});

test('delete note flow', async () => {
  render(<App />);
  openNewNote();
  const dlg = await screen.findByRole('dialog');
  const titleInput = within(dlg).getByPlaceholderText(/title/i);
  fireEvent.change(titleInput, { target: { value: 'Delete Me' } });
  fireEvent.click(within(dlg).getByRole('button', { name: /save/i }));

  const card = await screen.findByLabelText(/note delete me/i);
  // Mock confirm to auto-accept
  const origConfirm = window.confirm;
  window.confirm = () => true;
  const delBtn = within(card).getByRole('button', { name: /delete note/i });
  fireEvent.click(delBtn);
  window.confirm = origConfirm;

  expect(screen.queryByText(/delete me/i)).not.toBeInTheDocument();
});
