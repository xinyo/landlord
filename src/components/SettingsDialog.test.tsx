import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsDialog } from '../components/SettingsDialog';
import { I18nextProvider } from 'react-i18next';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import i18n from '../i18n';
import type { Settings } from '../types';

const renderSettingsDialog = (
  isOpen: boolean,
  settings: Settings,
  onSave: (settings: Settings) => void,
  onClose: () => void
) => {
  return render(
    <ChakraProvider value={defaultSystem}>
      <I18nextProvider i18n={i18n}>
        <SettingsDialog
          isOpen={isOpen}
          settings={settings}
          onSave={onSave}
          onClose={onClose}
        />
      </I18nextProvider>
    </ChakraProvider>
  );
};

const defaultSettings: Settings = {
  defaultWaterUnitPrice: 3.5,
  defaultElectricUnitPrice: 0.6,
  defaultExtraFee: 10,
};

describe('SettingsDialog', () => {
  it('should render dialog when open', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    renderSettingsDialog(true, defaultSettings, onSave, onClose);

    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should not render dialog when closed', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    renderSettingsDialog(false, defaultSettings, onSave, onClose);

    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('should display current settings values', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    renderSettingsDialog(true, defaultSettings, onSave, onClose);

    const waterInput = screen.getByDisplayValue('3.5');
    const electricInput = screen.getByDisplayValue('0.6');
    const extraFeeInput = screen.getByDisplayValue('10');

    expect(waterInput).toBeInTheDocument();
    expect(electricInput).toBeInTheDocument();
    expect(extraFeeInput).toBeInTheDocument();
  });

  it('should call onSave with new values when save button is clicked', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    renderSettingsDialog(true, defaultSettings, onSave, onClose);

    const waterInput = screen.getByDisplayValue('3.5');
    fireEvent.change(waterInput, { target: { value: '5.0' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledWith({
      defaultWaterUnitPrice: 5,
      defaultElectricUnitPrice: 0.6,
      defaultExtraFee: 10,
    });
  });

  it('should call onClose when cancel button is clicked', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    renderSettingsDialog(true, defaultSettings, onSave, onClose);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should update water unit price', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    renderSettingsDialog(true, defaultSettings, onSave, onClose);

    const waterInput = screen.getByDisplayValue('3.5');
    fireEvent.change(waterInput, { target: { value: '4.5' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultWaterUnitPrice: 4.5,
      })
    );
  });

  it('should update electric unit price', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    renderSettingsDialog(true, defaultSettings, onSave, onClose);

    const electricInput = screen.getByDisplayValue('0.6');
    fireEvent.change(electricInput, { target: { value: '0.8' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultElectricUnitPrice: 0.8,
      })
    );
  });

  it('should update extra fee', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    renderSettingsDialog(true, defaultSettings, onSave, onClose);

    const extraFeeInput = screen.getByDisplayValue('10');
    fireEvent.change(extraFeeInput, { target: { value: '20' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultExtraFee: 20,
      })
    );
  });

  it('should not call onSave when closed without saving', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    renderSettingsDialog(true, defaultSettings, onSave, onClose);

    const waterInput = screen.getByDisplayValue('3.5');
    fireEvent.change(waterInput, { target: { value: '99' } });

    // Click outside to close (simulating backdrop click)
    const backdrop = screen.getByText('Settings').closest('.chakra-modal__backdrop');
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(onSave).not.toHaveBeenCalled();
  });
});
