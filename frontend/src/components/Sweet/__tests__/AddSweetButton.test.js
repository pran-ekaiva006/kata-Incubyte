import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// We'll reset modules between tests and mock the AuthContext and sweetService
const mockSweetService = {
  getAllSweets: jest.fn().mockResolvedValue({ sweets: [] }),
  searchSweets: jest.fn().mockResolvedValue({ sweets: [] }),
};

describe('Add New Sweet button (admin only)', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('shows Add New Sweet button for admin users', async () => {
    // Mock AuthContext as admin and sweetService
    jest.doMock('../../../context/AuthContext', () => ({
      useAuth: () => ({ isAdmin: () => true }),
    }));
    jest.doMock('../../../services/sweetService', () => mockSweetService);

    const SweetList = require('../SweetList').default;

    render(<SweetList />);

    await waitFor(() => {
      expect(screen.getByText('+ Add New Sweet')).toBeInTheDocument();
    });
  });

  test('does NOT show Add New Sweet button for normal users', async () => {
    // Mock AuthContext as non-admin and sweetService
    jest.doMock('../../../context/AuthContext', () => ({
      useAuth: () => ({ isAdmin: () => false }),
    }));
    jest.doMock('../../../services/sweetService', () => mockSweetService);

    const SweetList = require('../SweetList').default;

    render(<SweetList />);

    await waitFor(() => {
      expect(screen.queryByText('+ Add New Sweet')).not.toBeInTheDocument();
    });
  });
});
