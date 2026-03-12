import { useState } from 'react';
import { Box, Button, Table, NativeSelect, HStack, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { RecordRow } from './RecordRow';
import { useMobile } from '../hooks/useMobile';
import type { DatePeriod, Record, Settings } from '../types';

interface RecordTableProps {
  records: Record[];
  unitName: string;
  onRecordsChange: (records: Record[]) => void;
  settings: Settings;
  initialRecordId?: string;
}

export function RecordTable({ records, unitName, onRecordsChange, settings, initialRecordId }: RecordTableProps) {
  const { t } = useTranslation();
  const isMobile = useMobile();
  const [selectedRecordId, setSelectedRecordId] = useState<string>('');

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const addMonths = (date: Date, months: number) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  };

  const getPeriodEndDate = (startDate: Date, period: DatePeriod) => {
    if (period === 'weekly') {
      return addDays(startDate, 6);
    }

    if (period === 'fortnightly') {
      return addDays(startDate, 13);
    }

    return addDays(addMonths(startDate, 1), -1);
  };

  const inferPeriodFromRecord = (record: Record, fallback: DatePeriod): DatePeriod => {
    const startDate = parseDate(record.startDate);
    const endDate = parseDate(record.endDate);
    const durationInDays = Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1;

    if (durationInDays === 7) {
      return 'weekly';
    }

    if (durationInDays === 14) {
      return 'fortnightly';
    }

    const expectedMonthlyEnd = addDays(addMonths(startDate, 1), -1);
    if (formatDate(endDate) === formatDate(expectedMonthlyEnd)) {
      return 'monthly';
    }

    return fallback;
  };

  // Derive effective selected record - use initialRecordId if provided, otherwise first record
  const effectiveSelectedRecordId = records.length > 0
    ? (selectedRecordId || initialRecordId || records[records.length - 1].id)
    : '';

  const handleAddRecord = () => {
    let startDate: Date;
    let endDate: Date;
    let waterUnitPrice = settings.defaultWaterUnitPrice;
    let electricUnitPrice = settings.defaultElectricUnitPrice;
    let extraFee = settings.defaultExtraFee;
    let waterMeterStart = 0;
    let electricMeterStart = 0;

    if (records.length > 0) {
      const lastRecord = records[records.length - 1];
      const nextPeriod = inferPeriodFromRecord(lastRecord, settings.defaultDatePeriod);
      startDate = addDays(parseDate(lastRecord.endDate), 1);
      endDate = getPeriodEndDate(startDate, nextPeriod);

      waterUnitPrice = lastRecord.waterUnitPrice;
      electricUnitPrice = lastRecord.electricUnitPrice;
      extraFee = lastRecord.extraFee;

      waterMeterStart = lastRecord.waterMeterEnd;
      electricMeterStart = lastRecord.electricMeterEnd;
    } else {
      const today = new Date();
      if (settings.defaultDatePeriod === 'monthly') {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      } else {
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        endDate = getPeriodEndDate(startDate, settings.defaultDatePeriod);
      }
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
    setSelectedRecordId(newRecord.id);
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
      {isMobile ? (
        <>
          <HStack mb={4} w="full" justify="space-between">
            {records.length > 1 && (
              <Box flex={1}>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={effectiveSelectedRecordId}
                    onChange={(e) => setSelectedRecordId(e.target.value)}
                  >
                    {records.map((record) => (
                      <option key={record.id} value={record.id}>
                        {record.startDate} - {record.endDate}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
            )}
            <Button onClick={handleAddRecord} colorPalette="green">
              {t('recordTable.addRecord')}
            </Button>
          </HStack>
          <VStack gap={2} align="stretch">
            {(records.length > 1 ? records.filter(r => r.id === effectiveSelectedRecordId) : records).map((record) => (
              <RecordRow
                key={record.id}
                record={record}
                unitName={unitName}
                onChange={handleUpdateRecord}
                onDelete={() => handleDeleteRecord(record.id)}
                isMobile={isMobile}
              />
            ))}
          </VStack>
          {records.length === 0 && (
            <Box py={8} textAlign="center" color="gray.500">
              {t('recordTable.noRecords')}
            </Box>
          )}
        </>
      ) : (
        <>
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
                  isMobile={isMobile}
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
        </>
      )}
    </Box>
  );
}
