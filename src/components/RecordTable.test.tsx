import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecordTable } from '../components/RecordTable';
import type { Record } from '../types';
import { I18nextProvider } from 'react-i18next';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import i18n from '../i18n';

const renderRecordTable = (records: Record[], unitName = 'Unit A') => {
  return render(
    <ChakraProvider value={defaultSystem}>
      <I18nextProvider i18n={i18n}>
        <RecordTable
          records={records}
          unitName={unitName}
          onRecordsChange={() => {}}
        />
      </I18nextProvider>
    </ChakraProvider>
  );
};

describe('RecordTable', () => {
  describe('Add Record - Default values (no existing records)', () => {
    it('should create new record on button click', () => {
      const records: Record[] = [];
      renderRecordTable(records);

      const addButton = screen.getByRole('button', { name: /add record/i });
      fireEvent.click(addButton);

      expect(screen.getByDisplayValue(/mock-uuid-1234/)).toBeInTheDocument();
    });

    it('should use default water unit price (3.5)', () => {
      const records: Record[] = [];
      renderRecordTable(records);

      const addButton = screen.getByRole('button', { name: /add record/i });
      fireEvent.click(addButton);

      expect(screen.getByDisplayValue('3.5')).toBeInTheDocument();
    });

    it('should use default electric unit price (0.8)', () => {
      const records: Record[] = [];
      renderRecordTable(records);

      const addButton = screen.getByRole('button', { name: /add record/i });
      fireEvent.click(addButton);

      expect(screen.getByDisplayValue('0.8')).toBeInTheDocument();
    });

    it('should use default extra fee of 0', () => {
      const records: Record[] = [];
      renderRecordTable(records);

      const addButton = screen.getByRole('button', { name: /add record/i });
      fireEvent.click(addButton);

      expect(screen.getAllByDisplayValue('0').length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Add Record - Carry forward from previous record', () => {
    it('should use previous end date as new start date', () => {
      const records: Record[] = [
        {
          id: '1',
          startDate: '2026-01-10',
          endDate: '2026-02-10',
          waterMeterStart: 100,
          waterMeterEnd: 150,
          waterUnitPrice: 3.5,
          electricMeterStart: 500,
          electricMeterEnd: 600,
          electricUnitPrice: 0.8,
          extraFee: 50,
        },
      ];
      renderRecordTable(records);

      const addButton = screen.getByRole('button', { name: /add record/i });
      fireEvent.click(addButton);

      // New record start date should be previous end date
      expect(screen.queryByDisplayValue('2026-02-10')).not.toBeNull();
    });

    it('should set end date to start date + 1 month', () => {
      const records: Record[] = [
        {
          id: '1',
          startDate: '2026-01-10',
          endDate: '2026-02-10',
          waterMeterStart: 100,
          waterMeterEnd: 150,
          waterUnitPrice: 3.5,
          electricMeterStart: 500,
          electricMeterEnd: 600,
          electricUnitPrice: 0.8,
          extraFee: 50,
        },
      ];
      renderRecordTable(records);

      const addButton = screen.getByRole('button', { name: /add record/i });
      fireEvent.click(addButton);

      expect(screen.getByDisplayValue('2026-03-10')).toBeInTheDocument();
    });

    it('should handle cross-year increment (Dec -> Jan)', () => {
      const records: Record[] = [
        {
          id: '1',
          startDate: '2026-11-10',
          endDate: '2026-12-10',
          waterMeterStart: 100,
          waterMeterEnd: 150,
          waterUnitPrice: 3.5,
          electricMeterStart: 500,
          electricMeterEnd: 600,
          electricUnitPrice: 0.8,
          extraFee: 50,
        },
      ];
      renderRecordTable(records);

      const addButton = screen.getByRole('button', { name: /add record/i });
      fireEvent.click(addButton);

      expect(screen.getByDisplayValue('2027-01-10')).toBeInTheDocument();
    });

    it('should carry forward water unit price', () => {
      const records: Record[] = [
        {
          id: '1',
          startDate: '2026-01-10',
          endDate: '2026-02-10',
          waterMeterStart: 100,
          waterMeterEnd: 150,
          waterUnitPrice: 5.5,
          electricMeterStart: 500,
          electricMeterEnd: 600,
          electricUnitPrice: 0.8,
          extraFee: 50,
        },
      ];
      renderRecordTable(records);

      const addButton = screen.getByRole('button', { name: /add record/i });
      fireEvent.click(addButton);

      expect(screen.getByDisplayValue('5.5')).toBeInTheDocument();
    });

    it('should carry forward electric unit price', () => {
      const records: Record[] = [
        {
          id: '1',
          startDate: '2026-01-10',
          endDate: '2026-02-10',
          waterMeterStart: 100,
          waterMeterEnd: 150,
          waterUnitPrice: 3.5,
          electricMeterStart: 500,
          electricMeterEnd: 600,
          electricUnitPrice: 1.2,
          extraFee: 50,
        },
      ];
      renderRecordTable(records);

      const addButton = screen.getByRole('button', { name: /add record/i });
      fireEvent.click(addButton);

      expect(screen.getByDisplayValue('1.2')).toBeInTheDocument();
    });

    it('should carry forward extra fee', () => {
      const records: Record[] = [
        {
          id: '1',
          startDate: '2026-01-10',
          endDate: '2026-02-10',
          waterMeterStart: 100,
          waterMeterEnd: 150,
          waterUnitPrice: 3.5,
          electricMeterStart: 500,
          electricMeterEnd: 600,
          electricUnitPrice: 0.8,
          extraFee: 100,
        },
      ];
      renderRecordTable(records);

      const addButton = screen.getByRole('button', { name: /add record/i });
      fireEvent.click(addButton);

      expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    });

    it('should carry forward water meter end as new start', () => {
      const records: Record[] = [
        {
          id: '1',
          startDate: '2026-01-10',
          endDate: '2026-02-10',
          waterMeterStart: 100,
          waterMeterEnd: 250,
          waterUnitPrice: 3.5,
          electricMeterStart: 500,
          electricMeterEnd: 600,
          electricUnitPrice: 0.8,
          extraFee: 50,
        },
      ];
      renderRecordTable(records);

      const addButton = screen.getByRole('button', { name: /add record/i });
      fireEvent.click(addButton);

      expect(screen.getByDisplayValue('250')).toBeInTheDocument();
    });

    it('should carry forward electric meter end as new start', () => {
      const records: Record[] = [
        {
          id: '1',
          startDate: '2026-01-10',
          endDate: '2026-02-10',
          waterMeterStart: 100,
          waterMeterEnd: 150,
          waterUnitPrice: 3.5,
          electricMeterStart: 500,
          electricMeterEnd: 850,
          electricUnitPrice: 0.8,
          extraFee: 50,
        },
      ];
      renderRecordTable(records);

      const addButton = screen.getByRole('button', { name: /add record/i });
      fireEvent.click(addButton);

      expect(screen.getByDisplayValue('850')).toBeInTheDocument();
    });
  });
});
