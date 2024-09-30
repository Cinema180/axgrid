import React from 'react';
import { TextField, Box } from '@mui/material';
import { FormField, FormData } from '../types/formTypes';

interface RenderFieldsProps {
  fieldsToRender: FormField[];
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

function renderFields({
  fieldsToRender,
  formData,
  setFormData,
}: RenderFieldsProps) {
  return (
    <>
      {fieldsToRender
        .filter((field) => field.name !== 'energySource') // Exclude energySource from being rendered
        .map((field: FormField) => {
          if (field.type === 'select') {
            // Render select dropdown for select type fields
            return (
              <Box
                key={field.name}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              >
                <TextField
                  select
                  label={field.label}
                  value={formData[field.name]}
                  required={field.required || false}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  SelectProps={{
                    native: true,
                  }}
                  fullWidth
                  margin="dense"
                  size="small"
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: '0.9rem',
                    },
                  }}
                >
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </TextField>
              </Box>
            );
          }

          return (
            <Box
              key={field.name}
              sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
            >
              <TextField
                label={field.label}
                type={field.type}
                value={formData[field.name]?.toString() || ''}
                required={field.required || false}
                onChange={(e) => {
                  const value =
                    field.type === 'number' ? +e.target.value : e.target.value;
                  setFormData({ ...formData, [field.name]: value });
                }}
                fullWidth
                margin="dense"
                size="small"
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '0.9rem',
                  },
                }}
              />
            </Box>
          );
        })}
    </>
  );
}

function initialiseFormData(
  commonFields: FormField[],
  dynamicFields: FormField[],
  formData: FormData
): FormData {
  const initialFormData: FormData = { ...formData };
  [...commonFields, ...dynamicFields].forEach((field) => {
    if (
      field.name !== 'energySource' &&
      initialFormData[field.name] === undefined
    ) {
      if (field.type === 'number') {
        initialFormData[field.name] = 0; // Initialise number fields with 0
      } else if (
        field.type === 'select' &&
        field.options &&
        field.options.length > 0
      ) {
        const [firstOption] = field.options;
        initialFormData[field.name] = firstOption; // Initialise select fields with the first option
      } else {
        initialFormData[field.name] = ''; // Initialise other fields with empty string
      }
    }
  });
  return initialFormData;
}

export default renderFields;
export { initialiseFormData };
