/**
 * Toast Service Tests
 */

import toast from 'react-hot-toast';
import { 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo, 
  showLoading,
  dismissToast,
  dismissAll 
} from '../toastService';

// Mock react-hot-toast
jest.mock('react-hot-toast');

describe('ToastService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('showSuccess', () => {
    it('should call toast.success with correct message and options', () => {
      const mockToastId = 'toast-123';
      toast.success.mockReturnValue(mockToastId);

      const result = showSuccess('Success message');

      expect(toast.success).toHaveBeenCalledWith(
        'Success message',
        expect.objectContaining({
          position: 'top-right',
          duration: 4000,
        })
      );
      expect(result).toBe(mockToastId);
    });

    it('should accept custom options', () => {
      showSuccess('Custom success', { duration: 6000 });

      expect(toast.success).toHaveBeenCalledWith(
        'Custom success',
        expect.objectContaining({
          duration: 6000,
        })
      );
    });
  });

  describe('showError', () => {
    it('should call toast.error with correct message and longer duration', () => {
      showError('Error message');

      expect(toast.error).toHaveBeenCalledWith(
        'Error message',
        expect.objectContaining({
          duration: 5000, // Errors haben längere Duration
        })
      );
    });

    it('should have error-specific styling', () => {
      showError('Test error');

      expect(toast.error).toHaveBeenCalledWith(
        'Test error',
        expect.objectContaining({
          style: expect.objectContaining({
            border: '1px solid #ff6b6b',
          }),
        })
      );
    });
  });

  describe('showWarning', () => {
    it('should call toast with warning icon', () => {
      showWarning('Warning message');

      expect(toast).toHaveBeenCalledWith(
        'Warning message',
        expect.objectContaining({
          icon: '⚠️',
        })
      );
    });
  });

  describe('showInfo', () => {
    it('should call toast with info icon and shorter duration', () => {
      showInfo('Info message');

      expect(toast).toHaveBeenCalledWith(
        'Info message',
        expect.objectContaining({
          icon: 'ℹ️',
          duration: 3000,
        })
      );
    });
  });

  describe('showLoading', () => {
    it('should call toast.loading with infinite duration', () => {
      showLoading('Loading...');

      expect(toast.loading).toHaveBeenCalledWith(
        'Loading...',
        expect.objectContaining({
          duration: Infinity,
        })
      );
    });
  });

  describe('dismissToast', () => {
    it('should call toast.dismiss with toastId', () => {
      const toastId = 'toast-123';
      
      dismissToast(toastId);

      expect(toast.dismiss).toHaveBeenCalledWith(toastId);
    });
  });

  describe('dismissAll', () => {
    it('should call toast.dismiss without arguments', () => {
      dismissAll();

      expect(toast.dismiss).toHaveBeenCalledWith();
    });
  });
});





