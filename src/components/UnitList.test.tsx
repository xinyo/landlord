import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UnitList } from './UnitList';
import type { Unit, Settings } from '../types';
import { I18nextProvider } from 'react-i18next';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import i18n from '../i18n';
import { useState } from 'react';

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid-1234',
}));

const defaultSettings: Settings = {
  defaultWaterUnitPrice: 3.5,
  defaultElectricUnitPrice: 0.6,
  defaultExtraFee: 10,
};

describe('UnitList mobile add', () => {
  let originalMatchMedia: (query: string) => MediaQueryList;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    // @ts-expect-error - testing mock for matchMedia
    window.matchMedia = (query: string) => ({
      matches: true,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as MediaQueryList);
  });

  afterEach(() => {
    // Restore matchMedia
    window.matchMedia = originalMatchMedia;
  });

  it('should select newly added unit on mobile', async () => {
    const existingUnits: Unit[] = [
      { id: 'u1', name: 'A', records: [] },
      { id: 'u2', name: 'B', records: [] },
    ];

    // Create a component that re-renders when units change
    function TestComponent() {
      const [units, setUnits] = useState(existingUnits);
      return <UnitList units={units} settings={defaultSettings} onUnitsChange={setUnits} />;
    }

    render(
      <ChakraProvider value={defaultSystem}>
        <I18nextProvider i18n={i18n}>
          <TestComponent />
        </I18nextProvider>
      </ChakraProvider>
    );

    // combobox should exist
    const combo = screen.getByRole('combobox') as HTMLSelectElement;
    expect(combo).toBeInTheDocument();

    // fill input and click add
    const input = screen.getByPlaceholderText(/unit name/i);
    fireEvent.change(input, { target: { value: 'New Unit' } });
    const addButton = screen.getByRole('button', { name: /add unit/i });
    fireEvent.click(addButton);

    // wait for state to update and re-render - the new unit should be selected
    await waitFor(() => {
      expect(combo.value).toBe('mock-uuid-1234');
    });
  });

  it('should select latest record when switching units on mobile', async () => {
    const existingUnits: Unit[] = [
      {
        id: 'u1',
        name: 'Unit A',
        records: [
          { id: 'r1', startDate: '2024-01-01', endDate: '2024-01-31', waterMeterStart: 0, waterMeterEnd: 10, waterUnitPrice: 3.5, electricMeterStart: 0, electricMeterEnd: 100, electricUnitPrice: 0.6, extraFee: 10 },
          { id: 'r2', startDate: '2024-02-01', endDate: '2024-02-29', waterMeterStart: 10, waterMeterEnd: 25, waterUnitPrice: 3.5, electricMeterStart: 100, electricMeterEnd: 250, electricUnitPrice: 0.6, extraFee: 10 },
        ],
      },
      {
        id: 'u2',
        name: 'Unit B',
        records: [
          { id: 'r3', startDate: '2024-01-01', endDate: '2024-01-31', waterMeterStart: 0, waterMeterEnd: 5, waterUnitPrice: 3.5, electricMeterStart: 0, electricMeterEnd: 50, electricUnitPrice: 0.6, extraFee: 10 },
          { id: 'r4', startDate: '2024-02-01', endDate: '2024-02-29', waterMeterStart: 5, waterMeterEnd: 12, waterUnitPrice: 3.5, electricMeterStart: 50, electricMeterEnd: 120, electricUnitPrice: 0.6, extraFee: 10 },
          { id: 'r5', startDate: '2024-03-01', endDate: '2024-03-31', waterMeterStart: 12, waterMeterEnd: 20, waterUnitPrice: 3.5, electricMeterStart: 120, electricMeterEnd: 200, electricUnitPrice: 0.6, extraFee: 10 },
        ],
      },
    ];

    function TestComponent() {
      const [units, setUnits] = useState(existingUnits);
      return <UnitList units={units} settings={defaultSettings} onUnitsChange={setUnits} />;
    }

    render(
      <ChakraProvider value={defaultSystem}>
        <I18nextProvider i18n={i18n}>
          <TestComponent />
        </I18nextProvider>
      </ChakraProvider>
    );

    // Get the unit selection dropdown (first combobox)
    const unitCombo = screen.getAllByRole('combobox')[0];
    expect(unitCombo).toBeInTheDocument();

    // Initially Unit A is selected (first unit)
    expect(unitCombo).toHaveValue('u1');

    // Verify Unit A heading is shown
    expect(screen.getByRole('heading', { name: 'Unit A' })).toBeInTheDocument();

    // Switch to Unit B
    fireEvent.change(unitCombo, { target: { value: 'u2' } });

    // After switching to Unit B:
    // 1. The unit dropdown should show Unit B
    await waitFor(() => {
      expect(unitCombo).toHaveValue('u2');
    });

    // 2. The unit card heading should show Unit B (not Unit A)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Unit B' })).toBeInTheDocument();
    });

    // 3. The latest record (r5 - March 2024) should be selected
    // Check that we see the latest record dates in the UI
    await waitFor(() => {
      expect(screen.getByDisplayValue('2024-03-01')).toBeInTheDocument();
    });
  });

  it('should show correct unit card content after switching units', async () => {
    const existingUnits: Unit[] = [
      {
        id: 'u1',
        name: 'Unit A',
        records: [
          { id: 'r1', startDate: '2024-01-01', endDate: '2024-01-31', waterMeterStart: 0, waterMeterEnd: 10, waterUnitPrice: 3.5, electricMeterStart: 0, electricMeterEnd: 100, electricUnitPrice: 0.6, extraFee: 10 },
        ],
      },
      {
        id: 'u2',
        name: 'Unit B',
        records: [
          { id: 'r2', startDate: '2024-02-01', endDate: '2024-02-29', waterMeterStart: 5, waterMeterEnd: 15, waterUnitPrice: 3.5, electricMeterStart: 50, electricMeterEnd: 150, electricUnitPrice: 0.6, extraFee: 10 },
        ],
      },
    ];

    function TestComponent() {
      const [units, setUnits] = useState(existingUnits);
      return <UnitList units={units} settings={defaultSettings} onUnitsChange={setUnits} />;
    }

    render(
      <ChakraProvider value={defaultSystem}>
        <I18nextProvider i18n={i18n}>
          <TestComponent />
        </I18nextProvider>
      </ChakraProvider>
    );

    const unitCombo = screen.getAllByRole('combobox')[0];

    // Verify initial state - Unit A is shown
    expect(screen.getByRole('heading', { name: 'Unit A' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument(); // Unit A's record

    // Switch to Unit B
    fireEvent.change(unitCombo, { target: { value: 'u2' } });

    // Verify Unit B's content is shown (not Unit A's)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Unit B' })).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue('2024-02-01')).toBeInTheDocument(); // Unit B's record, not Unit A's
    });

    // Verify Unit A's record is NOT displayed
    expect(screen.queryByDisplayValue('2024-01-01')).not.toBeInTheDocument();
  });
});
