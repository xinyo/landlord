import { useEffect, useState } from 'react';
import {
  Button,
  VStack,
  Field,
  Dialog,
  NativeSelect,
  NumberInput,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import type { Settings } from '../types';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export function SettingsDialog({ isOpen, onClose, settings, onSave }: SettingsDialogProps) {
  const { t } = useTranslation();
  const [tempSettings, setTempSettings] = useState<Settings>(settings);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings, isOpen]);

  const handleSave = () => {
    onSave(tempSettings);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{t('settings.title')}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body overflowY="auto" maxH="80vh">
            <VStack gap={4} align="stretch">
              <Field.Root>
                <Field.Label>{t('settings.defaultWaterUnitPrice')}</Field.Label>
                <NumberInput.Root
                  step="0.01"
                  value={tempSettings.defaultWaterUnitPrice.toString()}
                  onValueChange={(e) => setTempSettings({ ...tempSettings, defaultWaterUnitPrice: Number(e.value) })}
                >
                  <NumberInput.Input />
                </NumberInput.Root>
              </Field.Root>
              <Field.Root>
                <Field.Label>{t('settings.defaultElectricUnitPrice')}</Field.Label>
                <NumberInput.Root
                  step="0.01"
                  value={tempSettings.defaultElectricUnitPrice.toString()}
                  onValueChange={(e) => setTempSettings({ ...tempSettings, defaultElectricUnitPrice: Number(e.value) })}
                >
                  <NumberInput.Input />
                </NumberInput.Root>
              </Field.Root>
              <Field.Root>
                <Field.Label>{t('settings.defaultExtraFee')}</Field.Label>
                <NumberInput.Root
                  step="0.01"
                  value={tempSettings.defaultExtraFee.toString()}
                  onValueChange={(e) => setTempSettings({ ...tempSettings, defaultExtraFee: Number(e.value) })}
                >
                  <NumberInput.Input />
                </NumberInput.Root>
              </Field.Root>
              <Field.Root>
                <Field.Label>{t('settings.defaultDatePeriod')}</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={tempSettings.defaultDatePeriod}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        defaultDatePeriod: e.target.value as Settings['defaultDatePeriod'],
                      })
                    }
                  >
                    <option value="monthly">{t('settings.datePeriod.monthly')}</option>
                    <option value="fortnightly">{t('settings.datePeriod.fortnightly')}</option>
                    <option value="weekly">{t('settings.datePeriod.weekly')}</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>
            </VStack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button colorPalette="blue" onClick={handleSave}>
              {t('common.save')}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
