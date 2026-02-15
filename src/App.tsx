import { useState } from 'react';
import { ChakraProvider, Box, Heading, Container, HStack, defaultSystem, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { UnitList, Toolbar, SettingsDialog } from './components';
import type { AppData, Unit, Settings } from './types';
import './i18n';

const defaultSettings: Settings = {
  defaultWaterUnitPrice: 3.5,
  defaultElectricUnitPrice: 0.6,
  defaultExtraFee: 10,
};

const initialData: AppData = {
  units: [],
  settings: defaultSettings,
};

function App() {
  const { t } = useTranslation();
  const [data, setData] = useState<AppData>(initialData);
  const [showSettings, setShowSettings] = useState(false);

  const handleUnitsChange = (units: Unit[]) => {
    setData({ ...data, units });
  };

  const handleDataLoad = (loadedData: AppData) => {
    // Ensure loaded data has settings, otherwise use defaults
    const mergedData = {
      ...initialData,
      ...loadedData,
      settings: loadedData.settings ? { ...defaultSettings, ...loadedData.settings } : defaultSettings,
    };
    setData(mergedData);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const saveSettings = (settings: Settings) => {
    setData({ ...data, settings });
  };

  return (
    <ChakraProvider value={defaultSystem}>
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="container.xl">
          <HStack justify="space-between" mb={2}>
            <Heading size="2xl" color="gray.700">{t('app.title')}</Heading>
            <HStack gap={4}>
              <Toolbar data={data} onDataLoad={handleDataLoad} />
              <Button
                aria-label={t('settings.title')}
                variant="outline"
                onClick={openSettings}
              >
                {t('settings.title')}
              </Button>
            </HStack>
          </HStack>
          
          <UnitList units={data.units} onUnitsChange={handleUnitsChange} />
        </Container>
      </Box>

      <SettingsDialog
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={data.settings}
        onSave={saveSettings}
      />
    </ChakraProvider>
  );
}

export default App;
