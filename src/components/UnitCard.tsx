import { useState } from 'react';
import {
  Heading,
  Input,
  HStack,
  IconButton,
  CardRoot,
  CardBody,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { RecordTable } from './RecordTable';
import type { Unit, Record, Settings } from '../types';

interface UnitCardProps {
  unit: Unit;
  settings: Settings;
  onUnitChange: (unit: Unit) => void;
  onDelete: () => void;
}

export function UnitCard({ unit, settings, onUnitChange, onDelete }: UnitCardProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(unit.name);

  const handleNameSubmit = () => {
    if (editName.trim()) {
      onUnitChange({ ...unit, name: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleRecordsChange = (records: Record[]) => {
    onUnitChange({ ...unit, records });
  };

  return (
    <CardRoot variant="outline" mb={4}>
      <CardBody>
        <HStack justify="space-between" mb={4}>
          <HStack flex={1}>
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                autoFocus
                size="lg"
                width="200px"
              />
            ) : (
              <Heading
                size="md"
                cursor="pointer"
                onClick={() => setIsEditing(true)}
                _hover={{ color: 'blue.500' }}
              >
                {unit.name}
              </Heading>
            )}
          </HStack>
          <IconButton
            aria-label={t('unitCard.deleteUnit')}
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
        </HStack>
        <RecordTable
          records={unit.records}
          unitName={unit.name}
          onRecordsChange={handleRecordsChange}
          settings={settings}
        />
      </CardBody>
    </CardRoot>
  );
}
