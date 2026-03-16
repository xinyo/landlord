import { useMemo, useState, useRef } from 'react';
import {
  HStack,
  VStack,
  Input,
  NumberInput,
  Text,
  IconButton,
  Box,
  Button,
  Dialog,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import { ImageDown } from 'lucide-react';
import type { Record, ComputedValues } from '../types';
import { RecordImage } from './RecordImage';
import { isWechatRuntime } from '../runtime/wechat';

interface RecordRowProps {
  record: Record;
  unitName: string;
  onChange: (record: Record) => void;
  onDelete: () => void;
  isMobile?: boolean;
}

export function RecordRow({ record, unitName, onChange, onDelete, isMobile }: RecordRowProps) {
  const { t } = useTranslation();
  const [showImage, setShowImage] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const handlePreview = () => {
    setShowImage(true);
  };

  const handleDownloadImage = async () => {
    if (contentRef.current) {
      try {
        const canvas = await html2canvas(contentRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
        });
        const imageUrl = canvas.toDataURL('image/png');

        if (isWechatRuntime()) {
          window.open(imageUrl, '_blank', 'noopener,noreferrer');
          alert(t('recordRow.wechatSaveHint'));
          setShowImage(false);
          return;
        }

        const link = document.createElement('a');
        link.download = `${unitName}_${record.startDate}_${record.endDate}_fees.png`;
        link.href = imageUrl;
        link.click();
        setShowImage(false);
      } catch (error) {
        console.error('Failed to generate image:', error);
      }
    } else {
      console.error('Content element not found');
    }
  };

  return (
    <>
      {isMobile ? (
        <Box
          borderWidth="1px"
          borderRadius="md"
          p={3}
          bg="gray.50"
          _hover={{ bg: "gray.100" }}
          mb={2}
        >
          <VStack gap={3} align="stretch">
              {/* Section 1: Date */}
              <Box>
                <Text fontWeight="bold" fontSize="sm" mb={1}>{t('recordTable.startDate')} - {t('recordTable.endDate')}</Text>
                <HStack>
                  <Input
                    size="sm"
                    type="date"
                    value={record.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                  />
                  <Input
                    size="sm"
                    type="date"
                    value={record.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                  />
                </HStack>
              </Box>

              {/* Section 2: Water */}
              <Box>
                <Text fontWeight="bold" fontSize="sm" mb={1} color="blue.600">{t('recordTable.waterMeter')} ({computed.waterFeeTotal.toFixed(2)})</Text>
                <VStack gap={1}>
                  <HStack>
                    <NumberInput.Root
                      size="sm"
                      value={record.waterMeterStart.toString()}
                      onValueChange={(e) => handleChange('waterMeterStart', Number(e.value))}
                    >
                      <NumberInput.Input placeholder={t('recordTable.waterMeter')} />
                    </NumberInput.Root>
                    <Text fontSize="xs">{t('common.arrow')}</Text>
                    <NumberInput.Root
                      size="sm"
                      value={record.waterMeterEnd.toString()}
                      onValueChange={(e) => handleChange('waterMeterEnd', Number(e.value))}
                    >
                      <NumberInput.Input />
                    </NumberInput.Root>
                  </HStack>
                  <HStack>
                    <NumberInput.Root
                      size="sm"
                      step={0.1}
                      value={record.waterUnitPrice.toString()}
                      onValueChange={(e) => handleChange('waterUnitPrice', Number(e.value))}
                    >
                      <NumberInput.Input placeholder={t('recordTable.waterPrice')} />
                    </NumberInput.Root>
                    <Text fontSize="sm" color="gray.500">=</Text>
                    <Text fontSize="sm" fontWeight="medium" color="blue.600">{computed.waterFeeTotal.toFixed(2)}</Text>
                  </HStack>
                </VStack>
              </Box>

              {/* Section 3: Electric */}
              <Box>
                <Text fontWeight="bold" fontSize="sm" mb={1} color="orange.600">{t('recordTable.electricMeter')} ({computed.electricFeeTotal.toFixed(2)})</Text>
                <VStack gap={1}>
                  <HStack>
                    <NumberInput.Root
                      size="sm"
                      value={record.electricMeterStart.toString()}
                      onValueChange={(e) => handleChange('electricMeterStart', Number(e.value))}
                    >
                      <NumberInput.Input placeholder={t('recordTable.electricMeter')} />
                    </NumberInput.Root>
                    <Text fontSize="xs">{t('common.arrow')}</Text>
                    <NumberInput.Root
                      size="sm"
                      value={record.electricMeterEnd.toString()}
                      onValueChange={(e) => handleChange('electricMeterEnd', Number(e.value))}
                    >
                      <NumberInput.Input />
                    </NumberInput.Root>
                  </HStack>
                  <HStack>
                    <NumberInput.Root
                      size="sm"
                      step={0.1}
                      value={record.electricUnitPrice.toString()}
                      onValueChange={(e) => handleChange('electricUnitPrice', Number(e.value))}
                    >
                      <NumberInput.Input placeholder={t('recordTable.electricPrice')} />
                    </NumberInput.Root>
                    <Text fontSize="sm" color="gray.500">=</Text>
                    <Text fontSize="sm" fontWeight="medium" color="orange.600">{computed.electricFeeTotal.toFixed(2)}</Text>
                  </HStack>
                </VStack>
              </Box>

              {/* Section 4: Extra & Total */}
              <Box>
                <Text fontWeight="bold" fontSize="sm" mb={1}>{t('recordTable.extraFee')} & {t('recordTable.total')}</Text>
                <HStack>
                  <NumberInput.Root
                    size="sm"
                    step={1}
                    value={record.extraFee.toString()}
                    onValueChange={(e) => handleChange('extraFee', Number(e.value))}
                  >
                    <NumberInput.Input placeholder={t('recordTable.extraFee')} />
                  </NumberInput.Root>
                  <Text fontSize="sm" color="gray.500">=</Text>
                  <Text fontSize="lg" fontWeight="bold" color="green.600">{computed.allFeeTotal.toFixed(2)}</Text>
                </HStack>
              </Box>

              {/* Actions */}
              <HStack justify="flex-end" gap={2}>
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
                  onClick={handlePreview}
                  title={t('recordRow.previewImage')}
                >
                  <ImageDown size={16} />
                </Button>
              </HStack>
            </VStack>
        </Box>
      ) : (
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
            <NumberInput.Root
              size="sm"
              width="80px"
              value={record.waterMeterStart.toString()}
              onValueChange={(e) => handleChange('waterMeterStart', Number(e.value))}
            >
              <NumberInput.Input />
            </NumberInput.Root>
            <Text fontSize="xs">{t('common.arrow')}</Text>
            <NumberInput.Root
              size="sm"
              width="80px"
              value={record.waterMeterEnd.toString()}
              onValueChange={(e) => handleChange('waterMeterEnd', Number(e.value))}
            >
              <NumberInput.Input />
            </NumberInput.Root>
          </HStack>
        </Box>
        <Box as="td" py={2} px={2}>
          <NumberInput.Root
            size="sm"
            step={0.1}
            width="70px"
            value={record.waterUnitPrice.toString()}
            onValueChange={(e) => handleChange('waterUnitPrice', Number(e.value))}
          >
            <NumberInput.Input />
          </NumberInput.Root>
        </Box>
        <Box as="td" py={2} px={2} fontWeight="medium" color="blue.600">
          {computed.waterFeeTotal.toFixed(2)}
        </Box>
        <Box as="td" py={2} px={2}>
          <HStack>
            <NumberInput.Root
              size="sm"
              width="80px"
              value={record.electricMeterStart.toString()}
              onValueChange={(e) => handleChange('electricMeterStart', Number(e.value))}
            >
              <NumberInput.Input />
            </NumberInput.Root>
            <Text fontSize="xs">{t('common.arrow')}</Text>
            <NumberInput.Root
              size="sm"
              width="80px"
              value={record.electricMeterEnd.toString()}
              onValueChange={(e) => handleChange('electricMeterEnd', Number(e.value))}
            >
              <NumberInput.Input />
            </NumberInput.Root>
          </HStack>
        </Box>
        <Box as="td" py={2} px={2}>
          <NumberInput.Root
            size="sm"
            step={0.1}
            width="70px"
            value={record.electricUnitPrice.toString()}
            onValueChange={(e) => handleChange('electricUnitPrice', Number(e.value))}
          >
            <NumberInput.Input />
          </NumberInput.Root>
        </Box>
        <Box as="td" py={2} px={2} fontWeight="medium" color="orange.600">
          {computed.electricFeeTotal.toFixed(2)}
        </Box>
        <Box as="td" py={2} px={2}>
          <NumberInput.Root
            size="sm"
            step={1}
            width="70px"
            value={record.extraFee.toString()}
            onValueChange={(e) => handleChange('extraFee', Number(e.value))}
          >
            <NumberInput.Input />
          </NumberInput.Root>
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
              onClick={handlePreview}
              title={t('recordRow.previewImage')}
            >
              <ImageDown size={16} />
            </Button>
          </HStack>
        </Box>
      </Box>
      )}

    <Dialog.Root open={showImage} onOpenChange={(e) => setShowImage(e.open)}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="transparent" boxShadow="none" maxH="90vh">
          <Box display="flex" justifyContent="center" alignItems="center" minH="100vh" p={4}>
            <Box ref={contentRef}>
              <RecordImage record={record} unitName={unitName} onDownload={handleDownloadImage} />
            </Box>
          </Box>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  </>
  );
}
