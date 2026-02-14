import { useMemo, useState } from 'react';
import {
  HStack,
  Input,
  Text,
  IconButton,
  Box,
  Button,
  Dialog,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import type { Record, ComputedValues } from '../types';
import { RecordImage } from './RecordImage';

interface RecordRowProps {
  record: Record;
  unitName: string;
  onChange: (record: Record) => void;
  onDelete: () => void;
}

export function RecordRow({ record, unitName, onChange, onDelete }: RecordRowProps) {
  const { t } = useTranslation();
  const [showImage, setShowImage] = useState(false);

  const computed = useMemo((): ComputedValues => {
    const waterUsage = Math.max(0, record.waterMeterEnd - record.waterMeterStart);
    const electricUsage = Math.max(0, record.electricMeterEnd - record.electricMeterStart);
    const waterFeeTotal = waterUsage * record.waterUnitPrice;
    const electricFeeTotal = electricUsage * record.electricUnitPrice;
    const allFeeTotal = waterFeeTotal + electricFeeTotal + record.extraFee;

    return {
      waterFeeTotal: Math.round(waterFeeTotal * 100) / 100,
      electricFeeTotal: Math.round(electricFeeTotal * 100) / 100,
      allFeeTotal: Math.round(allFeeTotal * 100) / 100,
    };
  }, [record]);

  const handleChange = (field: keyof Record, value: string | number) => {
    onChange({
      ...record,
      [field]: value,
    });
  };

  const handleDownloadImage = async () => {
    setShowImage(true);
    // Wait for dialog to render
    setTimeout(async () => {
      const element = document.getElementById('record-image-content');
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2,
        });
        const link = document.createElement('a');
        link.download = `${unitName}_${record.startDate}_${record.endDate}_fees.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
      setShowImage(false);
    }, 100);
  };

  return (
    <>
      <Box
        as="tr"
        _odd={{ bg: 'gray.50' }}
        _hover={{ bg: 'gray.100' }}
      >
      <Box as="td" py={2} px={2}>
        <Input
          size="sm"
          type="date"
          value={record.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
        />
      </Box>
      <Box as="td" py={2} px={2}>
        <Input
          size="sm"
          type="date"
          value={record.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
        />
      </Box>
      <Box as="td" py={2} px={2}>
        <HStack>
          <Input
            size="sm"
            type="number"
            width="80px"
            value={record.waterMeterStart}
            onChange={(e) => handleChange('waterMeterStart', Number(e.target.value))}
          />
          <Text fontSize="xs">{t('common.arrow')}</Text>
          <Input
            size="sm"
            type="number"
            width="80px"
            value={record.waterMeterEnd}
            onChange={(e) => handleChange('waterMeterEnd', Number(e.target.value))}
          />
        </HStack>
      </Box>
      <Box as="td" py={2} px={2}>
        <Input
          size="sm"
          type="number"
          step="0.01"
          width="70px"
          value={record.waterUnitPrice}
          onChange={(e) => handleChange('waterUnitPrice', Number(e.target.value))}
        />
      </Box>
      <Box as="td" py={2} px={2} fontWeight="medium" color="blue.600">
        {computed.waterFeeTotal.toFixed(2)}
      </Box>
      <Box as="td" py={2} px={2}>
        <HStack>
          <Input
            size="sm"
            type="number"
            width="80px"
            value={record.electricMeterStart}
            onChange={(e) => handleChange('electricMeterStart', Number(e.target.value))}
          />
          <Text fontSize="xs">{t('common.arrow')}</Text>
          <Input
            size="sm"
            type="number"
            width="80px"
            value={record.electricMeterEnd}
            onChange={(e) => handleChange('electricMeterEnd', Number(e.target.value))}
          />
        </HStack>
      </Box>
      <Box as="td" py={2} px={2}>
        <Input
          size="sm"
          type="number"
          step="0.01"
          width="70px"
          value={record.electricUnitPrice}
          onChange={(e) => handleChange('electricUnitPrice', Number(e.target.value))}
        />
      </Box>
      <Box as="td" py={2} px={2} fontWeight="medium" color="orange.600">
        {computed.electricFeeTotal.toFixed(2)}
      </Box>
      <Box as="td" py={2} px={2}>
        <Input
          size="sm"
          type="number"
          step="0.01"
          width="70px"
          value={record.extraFee}
          onChange={(e) => handleChange('extraFee', Number(e.target.value))}
        />
      </Box>
      <Box as="td" py={2} px={2} fontWeight="bold" color="green.600">
        {computed.allFeeTotal.toFixed(2)}
      </Box>
      <Box as="td" py={2} px={2}>
        <HStack gap={1}>
          <IconButton
            aria-label={t('recordRow.deleteRecord')}
            size="sm"
            colorPalette="red"
            variant="ghost"
            onClick={onDelete}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </IconButton>
          <Button
            size="sm"
            colorPalette="blue"
            variant="ghost"
            onClick={handleDownloadImage}
            title={t('recordRow.downloadImage')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </Button>
        </HStack>
      </Box>
    </Box>

    <Dialog.Root open={showImage} onOpenChange={(e) => setShowImage(e.open)}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="transparent" boxShadow="none">
          <Dialog.CloseTrigger asChild>
            <Box position="fixed" inset={0} />
          </Dialog.CloseTrigger>
          <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
            <RecordImage record={record} unitName={unitName} />
          </Box>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  </>
  );
}
