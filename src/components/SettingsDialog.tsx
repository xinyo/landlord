import { useState } from 'react';
import {
  Button,
  Input,
  VStack,
  Field,
  Dialog,
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
                <Input
                  type="number"
                  step="0.01"
                  value={tempSettings.defaultWaterUnitPrice}
                  onChange={(e) => setTempSettings({ ...tempSettings, defaultWaterUnitPrice: Number(e.target.value) })}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>{t('settings.defaultElectricUnitPrice')}</Field.Label>
                <Input
                  type="number"
                  step="0.01"
                  value={tempSettings.defaultElectricUnitPrice}
                  onChange={(e) => setTempSettings({ ...tempSettings, defaultElectricUnitPrice: Number(e.target.value) })}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>{t('settings.defaultExtraFee')}</Field.Label>
                <Input
                  type="number"
                  step="0.01"
                  value={tempSettings.defaultExtraFee}
                  onChange={(e) => setTempSettings({ ...tempSettings, defaultExtraFee: Number(e.target.value) })}
                />
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
