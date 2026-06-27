import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { DEFAULT_EVENT_COLOR, getContrastTextColor } from '../utils/tagColors';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  '#1976d2', '#d32f2f', '#388e3c', '#f57c00',
  '#7b1fa2', '#0097a7', '#c2185b', '#455a64',
];

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  label = 'Cor do evento',
}) => {
  const displayColor = color || DEFAULT_EVENT_COLOR;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            backgroundColor: displayColor,
            border: '2px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: getContrastTextColor(displayColor), fontWeight: 'bold' }}>
            Aa
          </Typography>
        </Box>
        <TextField
          type="color"
          value={displayColor}
          onChange={(e) => onChange(e.target.value)}
          sx={{ width: 80 }}
          inputProps={{ style: { height: 40, cursor: 'pointer' } }}
        />
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {PRESET_COLORS.map((preset) => (
            <Box
              key={preset}
              onClick={() => onChange(preset)}
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1,
                backgroundColor: preset,
                cursor: 'pointer',
                border: displayColor === preset ? '2px solid #000' : '1px solid #ccc',
                '&:hover': { opacity: 0.85 },
              }}
            />
          ))}
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Esta cor será usada no calendário e nos detalhes do evento
      </Typography>
    </Box>
  );
};

export default ColorPicker;
