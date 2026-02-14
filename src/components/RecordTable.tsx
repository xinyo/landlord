import { Box, Button, Table } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { RecordRow } from './RecordRow';
import type { Record } from '../types';

interface RecordTableProps {
  records: Record[];
  unitName: string;
  onRecordsChange: (records: Record[]) => void;
}

export function RecordTable({ records, unitName, onRecordsChange }: RecordTableProps) {
  const { t } = useTranslation();
  const handleAddRecord = () => {
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    let startDate: Date;
    let endDate: Date;
    let waterUnitPrice = 3.5;
    let electricUnitPrice = 0.8;
    let extraFee = 0;
    let waterMeterStart = 0;
    let electricMeterStart = 0;

    if (records.length > 0) {
      // Use the last record's end date and increment by 1 month
      const lastRecord = records[records.length - 1];
      const lastEndDate = new Date(lastRecord.endDate);

      startDate = new Date(lastEndDate);
      endDate = new Date(lastEndDate);
      endDate.setMonth(endDate.getMonth() + 1);

      // Carry forward unit prices and extra fee from previous record
      waterUnitPrice = lastRecord.waterUnitPrice;
      electricUnitPrice = lastRecord.electricUnitPrice;
      extraFee = lastRecord.extraFee;

      // Carry forward meter end values as new record's meter start values
      waterMeterStart = lastRecord.waterMeterEnd;
      electricMeterStart = lastRecord.electricMeterEnd;
    } else {
      // Default to current month if no records exist
      const today = new Date();
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    const newRecord: Record = {
      id: uuidv4(),
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      waterMeterStart,
      waterMeterEnd: 0,
      waterUnitPrice,
      electricMeterStart,
      electricMeterEnd: 0,
      electricUnitPrice,
      extraFee,
    };

    onRecordsChange([...records, newRecord]);
  };

  const handleUpdateRecord = (updatedRecord: Record) => {
    onRecordsChange(
      records.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
    );
  };

  const handleDeleteRecord = (id: string) => {
    onRecordsChange(records.filter((r) => r.id !== id));
  };

  return (
    <Box overflowX="auto">
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row bg="gray.200">
            <Table.ColumnHeader py={3} px={2}>{t('recordTable.startDate')}</Table.ColumnHeader>
            <Table.ColumnHeader py={3} px={2}>{t('recordTable.endDate')}</Table.ColumnHeader>
            <Table.ColumnHeader py={3} px={2}>{t('recordTable.waterMeter')}</Table.ColumnHeader>
            <Table.ColumnHeader py={3} px={2}>{t('recordTable.waterPrice')}</Table.ColumnHeader>
            <Table.ColumnHeader py={3} px={2}>{t('recordTable.waterFee')}</Table.ColumnHeader>
            <Table.ColumnHeader py={3} px={2}>{t('recordTable.electricMeter')}</Table.ColumnHeader>
            <Table.ColumnHeader py={3} px={2}>{t('recordTable.electricPrice')}</Table.ColumnHeader>
            <Table.ColumnHeader py={3} px={2}>{t('recordTable.electricFee')}</Table.ColumnHeader>
            <Table.ColumnHeader py={3} px={2}>{t('recordTable.extraFee')}</Table.ColumnHeader>
            <Table.ColumnHeader py={3} px={2}>{t('recordTable.total')}</Table.ColumnHeader>
            <Table.ColumnHeader py={3} px={2} width="50px"></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {records.map((record) => (
            <RecordRow
              key={record.id}
              record={record}
              unitName={unitName}
              onChange={handleUpdateRecord}
              onDelete={() => handleDeleteRecord(record.id)}
            />
          ))}
        </Table.Body>
      </Table.Root>
      {records.length === 0 && (
        <Box py={8} textAlign="center" color="gray.500">
          {t('recordTable.noRecords')}
        </Box>
      )}
      <Button mt={4} onClick={handleAddRecord} size="sm" colorPalette="green">
        {t('recordTable.addRecord')}
      </Button>
    </Box>
  );
}
