import { Box, Text, VStack, HStack, Flex } from '@chakra-ui/react';
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
      p={6}
      bg="white"
      borderRadius="lg"
      boxShadow="xl"
      maxW="800px"
      minW="50vw"
      width="100%"
      mx="auto"
      style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
    >
      <VStack gap={1} align="stretch">
        <Flex pb={4}>
          <Box flex="1" textAlign="left">
            <Text fontSize="2xl" fontWeight="bold" style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151' }}>
              {t('app.title')}
            </Text>
          </Box>
          <Box textAlign="right">
            <Text fontSize="lg" fontWeight="bold" style={{ fontSize: '18px', color: '#4b5563' }}>
              {unitName}
            </Text>
          </Box>          
        </Flex>

        <HStack justify="space-between" py={2} borderBottom="1px" borderColor="gray.100" style={{ paddingTop: '8px', paddingBottom: '8px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
          <Text fontWeight="medium" color="gray.600" style={{ fontWeight: '500', color: '#4b5563' }}>{t('recordTable.startDate')}:</Text>
          <Text fontWeight="bold" style={{ fontWeight: 'bold' }}>{record.startDate}</Text>
        </HStack>

        <HStack justify="space-between" py={2} borderBottom="1px" borderColor="gray.100" style={{ paddingTop: '8px', paddingBottom: '8px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
          <Text fontWeight="medium" color="gray.600" style={{ fontWeight: '500', color: '#4b5563' }}>{t('recordTable.endDate')}:</Text>
          <Text fontWeight="bold" style={{ fontWeight: 'bold' }}>{record.endDate}</Text>
        </HStack>

        <Box pt={2} pb={1} style={{ paddingTop: '8px', paddingBottom: '4px' }}>
          <Text fontWeight="bold" color="blue.600" fontSize="lg" style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '18px' }}>{t('recordTable.waterMeter')}</Text>
        </Box>
        <HStack justify="space-between" py={1} pl={4} style={{ paddingTop: '4px', paddingBottom: '4px', paddingLeft: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Text color="gray.600" style={{ color: '#4b5563' }}>{t('recordTable.waterMeter')} ({t('recordRow.meterUsage')}):</Text>
          <Text fontWeight="bold" style={{ fontWeight: 'bold' }}>{computed.waterUsage} m³</Text>
        </HStack>
        <HStack justify="space-between" py={1} pl={4} style={{ paddingTop: '4px', paddingBottom: '4px', paddingLeft: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Text color="gray.600" style={{ color: '#4b5563' }}>{t('recordTable.waterPrice')}:</Text>
          <Text fontWeight="bold" style={{ fontWeight: 'bold' }}>¥{record.waterUnitPrice}/m³</Text>
        </HStack>
        <HStack justify="space-between" py={2} pl={4} borderBottom="1px" borderColor="gray.100" style={{ paddingTop: '8px', paddingBottom: '8px', paddingLeft: '16px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
          <Text fontWeight="medium" color="gray.700" style={{ fontWeight: '500', color: '#374151' }}>{t('recordTable.waterFee')}:</Text>
          <Text fontWeight="bold" color="blue.600" fontSize="lg" style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '18px' }}>¥{computed.waterFeeTotal.toFixed(2)}</Text>
        </HStack>

        <Box pt={2} pb={1} style={{ paddingTop: '8px', paddingBottom: '4px' }}>
          <Text fontWeight="bold" color="orange.600" fontSize="lg" style={{ fontWeight: 'bold', color: '#ea580c', fontSize: '18px' }}>{t('recordTable.electricMeter')}</Text>
        </Box>
        <HStack justify="space-between" py={1} pl={4} style={{ paddingTop: '4px', paddingBottom: '4px', paddingLeft: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Text color="gray.600" style={{ color: '#4b5563' }}>{t('recordTable.electricMeter')} ({t('recordRow.meterUsage')}):</Text>
          <Text fontWeight="bold" style={{ fontWeight: 'bold' }}>{computed.electricUsage} kWh</Text>
        </HStack>
        <HStack justify="space-between" py={1} pl={4} style={{ paddingTop: '4px', paddingBottom: '4px', paddingLeft: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Text color="gray.600" style={{ color: '#4b5563' }}>{t('recordTable.electricPrice')}:</Text>
          <Text fontWeight="bold" style={{ fontWeight: 'bold' }}>¥{record.electricUnitPrice}/kWh</Text>
        </HStack>
        <HStack justify="space-between" py={2} pl={4} borderBottom="1px" borderColor="gray.100" style={{ paddingTop: '8px', paddingBottom: '8px', paddingLeft: '16px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
          <Text fontWeight="medium" color="gray.700" style={{ fontWeight: '500', color: '#374151' }}>{t('recordTable.electricFee')}:</Text>
          <Text fontWeight="bold" color="orange.600" fontSize="lg" style={{ fontWeight: 'bold', color: '#ea580c', fontSize: '18px' }}>¥{computed.electricFeeTotal.toFixed(2)}</Text>
        </HStack>

        <HStack justify="space-between" py={2} borderBottom="1px" borderColor="gray.100" style={{ paddingTop: '8px', paddingBottom: '8px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
          <Text fontWeight="medium" color="gray.600" style={{ fontWeight: '500', color: '#4b5563' }}>{t('recordTable.extraFee')}:</Text>
          <Text fontWeight="bold" style={{ fontWeight: 'bold' }}>¥{record.extraFee.toFixed(2)}</Text>
        </HStack>

        <Box pt={2} pb={1} bg="green.50" borderRadius="md" px={4} py={3} style={{ backgroundColor: '#f0fdf4', borderRadius: '6px', paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}>
          <HStack justify="space-between" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text fontWeight="bold" color="gray.700" fontSize="xl" style={{ fontWeight: 'bold', color: '#374151', fontSize: '20px' }}>{t('recordTable.total')}:</Text>
            <Text fontWeight="bold" color="green.600" fontSize="2xl" style={{ fontWeight: 'bold', color: '#16a34a', fontSize: '24px' }}>¥{computed.allFeeTotal.toFixed(2)}</Text>
          </HStack>
        </Box>

        <Box textAlign="center" pt={2} borderTop="2px" borderColor="gray.200" style={{ paddingTop: '8px', textAlign: 'center', borderTop: '2px solid #e5e7eb' }}>
          <Text fontSize="sm" color="gray.400" style={{ fontSize: '12px', color: '#9ca3af' }}>
            Generated on {new Date().toLocaleDateString(i18n.language === 'zh' ? 'zh-CN' : 'en-US')}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
