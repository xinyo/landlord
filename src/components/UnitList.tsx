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
  // Track the last selected record ID for each unit
  const [unitRecordSelections, setUnitRecordSelections] = useState<Record<string, string>>({});

  // Derive effective selected unit - always use a valid unit id
  const effectiveSelectedUnitId = units.length > 0
    ? (selectedUnitId || units[0].id)
    : '';

  // Get the selected record ID for the current unit
  const effectiveSelectedRecordId = (() => {
    const unit = units.find(u => u.id === effectiveSelectedUnitId);
    if (!unit || unit.records.length === 0) return '';
    const savedRecordId = unitRecordSelections[effectiveSelectedUnitId];
    if (savedRecordId && unit.records.some(r => r.id === savedRecordId)) {
      return savedRecordId;
    }
    // Default to last record
    return unit.records[unit.records.length - 1].id;
  })();

  // Handle unit selection change
  const handleUnitChange = (newUnitId: string) => {
    setSelectedUnitId(newUnitId);

    setUnitRecordSelections(prev => {
      const newSelections = { ...prev };
      delete newSelections[newUnitId];
      return newSelections;
    });
  };

  const handleAddUnit = () => {
    if (!newUnitName.trim()) return;

    const newUnit: Unit = {
      id: uuidv4(),
      name: newUnitName.trim(),
      records: [],
    };

    onUnitsChange([...units, newUnit]);
    setNewUnitName('');
    setSelectedUnitId(newUnit.id);
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
              value={effectiveSelectedUnitId}
              onChange={(e) => handleUnitChange(e.target.value)}
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
            key={effectiveSelectedUnitId}
            unit={units.find(u => u.id === effectiveSelectedUnitId) || units[0]}
            settings={settings}
            onUnitChange={handleUpdateUnit}
            onDelete={() => handleDeleteUnit(effectiveSelectedUnitId)}
            initialRecordId={effectiveSelectedRecordId}
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
