import { useState } from 'react';
import { ChakraProvider, Box, Heading, Container, HStack, Button, defaultSystem } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { UnitList, Toolbar } from './components';
import type { AppData, Unit } from './types';
import './i18n';

const initialData: AppData = {
  units: [],
};

function App() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<AppData>(initialData);

  const handleUnitsChange = (units: Unit[]) => {
    setData({ units });
  };

  const handleDataLoad = (loadedData: AppData) => {
    setData(loadedData);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <ChakraProvider value={defaultSystem}>
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="container.xl">
          <HStack justify="space-between" mb={2}>
            <Heading size="lg" color="gray.700">{t('app.title')}</Heading>
            <Button onClick={toggleLanguage} variant="outline" size="sm">
              {i18n.language === 'en' ? t('language.zh') : t('language.en')}
            </Button>
          </HStack>
          <Toolbar data={data} onDataLoad={handleDataLoad} />
          <UnitList units={data.units} onUnitsChange={handleUnitsChange} />
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
