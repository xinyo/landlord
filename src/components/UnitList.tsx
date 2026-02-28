import { useState } from 'react';
import { Box, Button, Input, HStack, VStack, Text, NativeSelect } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { UnitCard } from './UnitCard';
import { useMobile } from '../hooks/useMobile';
import type { Unit, Settings } from '../types';

interface UnitListProps {
  units: Unit[];
  settings: Settings;
  onUnitsChange: (units: Unit[]) => void;
}

export function UnitList({ units, settings, onUnitsChange }: UnitListProps) {
  const { t } = useTranslation();
  const [newUnitName, setNewUnitName] = useState('');
  const isMobile = useMobile();
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');

  // Derive effective selected unit - fall back to first unit if selection is invalid
  const effectiveSelectedUnitId = units.length > 0
    ? (units.find(u => u.id === selectedUnitId) ? selectedUnitId : units[0].id)
    : '';

  const handleAddUnit = () => {
    if (!newUnitName.trim()) return;

    const newUnit: Unit = {
      id: uuidv4(),
      name: newUnitName.trim(),
      records: [],
    };

    onUnitsChange([...units, newUnit]);
    setNewUnitName('');
    if (isMobile) {
      setSelectedUnitId(newUnit.id);
    }
  };

  const handleUpdateUnit = (updatedUnit: Unit) => {
    onUnitsChange(
      units.map((u) => (u.id === updatedUnit.id ? updatedUnit : u))
    );
  };

  const handleDeleteUnit = (id: string) => {
    onUnitsChange(units.filter((u) => u.id !== id));
  };

  return (
    <Box>
      <VStack gap={4} mb={6}>
        <HStack w="full" maxW="400px">
          <Input
            placeholder={t('unitList.placeholder')}
            value={newUnitName}
            onChange={(e) => setNewUnitName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddUnit()}
          />
          <Button onClick={handleAddUnit} colorPalette="blue">
            {t('unitList.addUnit')}
          </Button>
        </HStack>
      </VStack>

      {units.length === 0 ? (
        <Box textAlign="center" py={12} color="gray.500">
          <Text fontSize="lg">{t('unitList.noUnits')}</Text>
          <Text>{t('unitList.noUnitsHint')}</Text>
        </Box>
      ) : isMobile && units.length > 1 ? (
        <Box mb={4}>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
            >
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>
      ) : null}

      {units.length > 0 && (
        isMobile && units.length > 1 ? (
          <UnitCard
            unit={units.find(u => u.id === effectiveSelectedUnitId) || units[0]}
            settings={settings}
            onUnitChange={handleUpdateUnit}
            onDelete={() => handleDeleteUnit(effectiveSelectedUnitId)}
          />
        ) : (
          units.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              settings={settings}
              onUnitChange={handleUpdateUnit}
              onDelete={() => handleDeleteUnit(unit.id)}
            />
          ))
        )
      )}
    </Box>
  );
}
