import React, { useState } from 'react';
import { Box, TextField, Button, Chip, Typography } from '@mui/material';
import { getTagColor } from '../utils/tagColors';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  helperText?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  label = 'Tags',
  helperText = 'Digite uma tag e pressione Enter ou clique em Adicionar',
}) => {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setInput('');
      return;
    }
    onChange([...tags, trimmed]);
    setInput('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      addTag();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <TextField
          label={label}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          variant="outlined"
          placeholder="Ex: reunião, trabalho..."
          helperText={helperText}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <Button
          variant="outlined"
          onClick={addTag}
          disabled={!input.trim()}
          sx={{ mt: 1, borderRadius: 2, minWidth: 100, height: 56 }}
        >
          Adicionar
        </Button>
      </Box>
      {tags.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
          {tags.map((tag) => {
            const colors = getTagColor(tag);
            return (
              <Chip
                key={tag}
                label={tag}
                size="small"
                onDelete={() => removeTag(tag)}
                sx={{ backgroundColor: colors.bg, color: colors.text }}
              />
            );
          })}
        </Box>
      )}
      {tags.length === 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Nenhuma tag adicionada
        </Typography>
      )}
    </Box>
  );
};

export default TagInput;
