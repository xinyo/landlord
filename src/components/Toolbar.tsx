import { useRef } from 'react';
import { HStack, Button, Input } from '@chakra-ui/react';
import { useMobile } from '../hooks/useMobile';
import { useTranslation } from 'react-i18next';
import { Save, Upload } from 'lucide-react';
import type { AppData } from '../types';

interface ToolbarProps {
  data: AppData;
  onDataLoad: (data: AppData) => void;
}

export function Toolbar({ data, onDataLoad }: ToolbarProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMobile();

  const handleSave = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `landlord-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const loadedData = JSON.parse(json) as AppData;

        if (!loadedData.units || !Array.isArray(loadedData.units)) {
          throw new Error('Invalid data format');
        }

        onDataLoad(loadedData);
      } catch {
        alert(t('toolbar.loadError'));
      }
    };
    reader.readAsText(file);

    e.target.value = '';
  };

  return (
    <HStack gap={2}>
      <Button size={isMobile ? 'sm' : undefined} colorPalette="green" onClick={handleSave}>
        <Save size={16} />
        {t('toolbar.save')}
      </Button>
      <Button size={isMobile ? 'sm' : undefined} variant="outline" onClick={handleLoadClick}>
        <Upload size={16} />
        {t('toolbar.load')}
      </Button>
      <Input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        display="none"
      />
    </HStack>
  );
}
