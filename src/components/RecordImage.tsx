import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import type { Record } from '../types';

interface RecordImageProps {
  record: Record;
  unitName: string;
}

export function RecordImage({ record, unitName }: RecordImageProps) {
  const { t, i18n } = useTranslation();

  const computed = {
    waterUsage: Math.max(0, record.waterMeterEnd - record.waterMeterStart),
    electricUsage: Math.max(0, record.electricMeterEnd - record.electricMeterStart),
    waterFeeTotal: Math.round(record.waterUnitPrice * Math.max(0, record.waterMeterEnd - record.waterMeterStart) * 100) / 100,
    electricFeeTotal: Math.round(record.electricUnitPrice * Math.max(0, record.electricMeterEnd - record.electricMeterStart) * 100) / 100,
    allFeeTotal: Math.round((record.waterUnitPrice * Math.max(0, record.waterMeterEnd - record.waterMeterStart) + record.electricUnitPrice * Math.max(0, record.electricMeterEnd - record.electricMeterStart) + record.extraFee) * 100) / 100,
  };

  return (
    <Box
      id="record-image-content"
      p={6}
      bg="white"
      borderRadius="lg"
      boxShadow="xl"
      maxW="500px"
      mx="auto"
    >
      <VStack gap={4} align="stretch">
        <Box textAlign="center" pb={2} borderBottom="2px" borderColor="gray.200">
          <Text fontSize="2xl" fontWeight="bold" color="gray.700">
            {t('app.title')}
          </Text>
          <Text fontSize="lg" color="gray.600">
            {unitName}
          </Text>
        </Box>

        <HStack justify="space-between" py={2} borderBottom="1px" borderColor="gray.100">
          <Text fontWeight="medium" color="gray.600">{t('recordTable.startDate')}:</Text>
          <Text fontWeight="bold">{record.startDate}</Text>
        </HStack>

        <HStack justify="space-between" py={2} borderBottom="1px" borderColor="gray.100">
          <Text fontWeight="medium" color="gray.600">{t('recordTable.endDate')}:</Text>
          <Text fontWeight="bold">{record.endDate}</Text>
        </HStack>

        <Box pt={2} pb={1}>
          <Text fontWeight="bold" color="blue.600" fontSize="lg">{t('recordTable.waterMeter')}</Text>
        </Box>
        <HStack justify="space-between" py={1} pl={4}>
          <Text color="gray.600">{t('recordTable.waterMeter')} ({t('recordRow.meterUsage')}):</Text>
          <Text fontWeight="bold">{computed.waterUsage} m³</Text>
        </HStack>
        <HStack justify="space-between" py={1} pl={4}>
          <Text color="gray.600">{t('recordTable.waterPrice')}:</Text>
          <Text fontWeight="bold">¥{record.waterUnitPrice}/m³</Text>
        </HStack>
        <HStack justify="space-between" py={2} pl={4} borderBottom="1px" borderColor="gray.100">
          <Text fontWeight="medium" color="gray.700">{t('recordTable.waterFee')}:</Text>
          <Text fontWeight="bold" color="blue.600" fontSize="lg">¥{computed.waterFeeTotal.toFixed(2)}</Text>
        </HStack>

        <Box pt={2} pb={1}>
          <Text fontWeight="bold" color="orange.600" fontSize="lg">{t('recordTable.electricMeter')}</Text>
        </Box>
        <HStack justify="space-between" py={1} pl={4}>
          <Text color="gray.600">{t('recordTable.electricMeter')} ({t('recordRow.meterUsage')}):</Text>
          <Text fontWeight="bold">{computed.electricUsage} kWh</Text>
        </HStack>
        <HStack justify="space-between" py={1} pl={4}>
          <Text color="gray.600">{t('recordTable.electricPrice')}:</Text>
          <Text fontWeight="bold">¥{record.electricUnitPrice}/kWh</Text>
        </HStack>
        <HStack justify="space-between" py={2} pl={4} borderBottom="1px" borderColor="gray.100">
          <Text fontWeight="medium" color="gray.700">{t('recordTable.electricFee')}:</Text>
          <Text fontWeight="bold" color="orange.600" fontSize="lg">¥{computed.electricFeeTotal.toFixed(2)}</Text>
        </HStack>

        <HStack justify="space-between" py={2} borderBottom="1px" borderColor="gray.100">
          <Text fontWeight="medium" color="gray.600">{t('recordTable.extraFee')}:</Text>
          <Text fontWeight="bold">¥{record.extraFee.toFixed(2)}</Text>
        </HStack>

        <Box pt={2} pb={1} bg="green.50" borderRadius="md" px={4} py={3}>
          <HStack justify="space-between">
            <Text fontWeight="bold" color="gray.700" fontSize="xl">{t('recordTable.total')}:</Text>
            <Text fontWeight="bold" color="green.600" fontSize="2xl">¥{computed.allFeeTotal.toFixed(2)}</Text>
          </HStack>
        </Box>

        <Box textAlign="center" pt={2} borderTop="2px" borderColor="gray.200">
          <Text fontSize="sm" color="gray.400">
            Generated on {new Date().toLocaleDateString(i18n.language === 'zh' ? 'zh-CN' : 'en-US')}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
