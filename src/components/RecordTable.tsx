import { useState } from 'react';
import { Box, Button, Table, NativeSelect, HStack, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { RecordRow } from './RecordRow';
import { useMobile } from '../hooks/useMobile';
import type { Record, Settings } from '../types';
import { createNextRecord } from '@landlord/core';

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

  // Derive effective selected record - use initialRecordId if provided, otherwise first record
  const effectiveSelectedRecordId = records.length > 0
    ? (selectedRecordId || initialRecordId || records[records.length - 1].id)
    : '';

  const handleAddRecord = () => {
    const newRecord = createNextRecord(records, settings, uuidv4());

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
