import { useState } from 'react';
import {
  Button,
  Input,
  VStack,
  Field,
  Dialog,
  HStack,
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
  const { t, i18n } = useTranslation();
  const [tempSettings, setTempSettings] = useState<Settings>(settings);

  const handleSave = () => {
    onSave(tempSettings);
    onClose();
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          width={{ base: "100%", sm: "90vw", md: "400px" }}
          maxWidth={{ base: "100%", sm: "90vw", md: "400px" }}
          maxHeight={{ base: "100vh", md: "90vh" }}
          display="flex"
          flexDirection="column"
        >
          <Dialog.Header flexShrink={0}>
            <HStack justify="space-between" width="100%">
              <Dialog.Title>{t('settings.title')}</Dialog.Title>
              <Button variant="outline" size="sm" onClick={toggleLanguage}>
                {i18n.language === 'en' ? t('language.zh') : t('language.en')}
              </Button>
            </HStack>
          </Dialog.Header>
          <Dialog.Body
            overflowY="auto"
            flex="1"
            css={{
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#CBD5E0',
                borderRadius: '3px',
              },
            }}
          >
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
          <Dialog.Footer flexShrink={0}>
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
