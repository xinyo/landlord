import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecordTable } from '../components/RecordTable';
import type { Record } from '../types';
import { I18nextProvider } from 'react-i18next';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import i18n from '../i18n';

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid-1234',
}));

const renderRecordTable = (
  records: Record[],
  unitName = 'Unit A',
  onRecordsChange = () => {}
) => {
  return render(
    <ChakraProvider value={defaultSystem}>
      <I18nextProvider i18n={i18n}>
        <RecordTable
          records={records}
          unitName={unitName}
          onRecordsChange={onRecordsChange}
        />
      </I18nextProvider>
    </ChakraProvider>
  );
};

describe('RecordTable', () => {
  it('should render table headers', () => {
    renderRecordTable([]);
    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('End Date')).toBeInTheDocument();
    expect(screen.getByText('Water Meter')).toBeInTheDocument();
    expect(screen.getByText('Water Price')).toBeInTheDocument();
  });

  it('should render add record button', () => {
    renderRecordTable([]);
    expect(screen.getByRole('button', { name: /add record/i })).toBeInTheDocument();
  });

  it('should show empty message when no records', () => {
    renderRecordTable([]);
    expect(screen.getByText(/no records yet/i)).toBeInTheDocument();
  });

  it('should call onRecordsChange when adding a record', () => {
    const onRecordsChange = vi.fn();
    renderRecordTable([], 'Unit A', onRecordsChange);

    const addButton = screen.getByRole('button', { name: /add record/i });
    fireEvent.click(addButton);

    expect(onRecordsChange).toHaveBeenCalled();
    const newRecords = onRecordsChange.mock.calls[0][0];
    expect(newRecords).toHaveLength(1);
    expect(newRecords[0].id).toBe('mock-uuid-1234');
  });

  it('should add record with default values', () => {
    const onRecordsChange = vi.fn();
    renderRecordTable([], 'Unit A', onRecordsChange);

    const addButton = screen.getByRole('button', { name: /add record/i });
    fireEvent.click(addButton);

    const newRecords = onRecordsChange.mock.calls[0][0];
    expect(newRecords[0].waterUnitPrice).toBe(3.5);
    expect(newRecords[0].electricUnitPrice).toBe(0.8);
    expect(newRecords[0].extraFee).toBe(0);
  });

  it('should carry forward values from previous record', () => {
    const existingRecords: Record[] = [
      {
        id: '1',
        startDate: '2026-01-10',
        endDate: '2026-02-10',
        waterMeterStart: 100,
        waterMeterEnd: 150,
        waterUnitPrice: 5.5,
        electricMeterStart: 500,
        electricMeterEnd: 700,
        electricUnitPrice: 1.2,
        extraFee: 30,
      },
    ];
    const onRecordsChange = vi.fn();
    renderRecordTable(existingRecords, 'Unit A', onRecordsChange);

    const addButton = screen.getByRole('button', { name: /add record/i });
    fireEvent.click(addButton);

    const newRecords = onRecordsChange.mock.calls[0][0];
    expect(newRecords[1].waterUnitPrice).toBe(5.5);
    expect(newRecords[1].electricUnitPrice).toBe(1.2);
    expect(newRecords[1].extraFee).toBe(30);
    expect(newRecords[1].waterMeterStart).toBe(150);
    expect(newRecords[1].electricMeterStart).toBe(700);
  });
});
