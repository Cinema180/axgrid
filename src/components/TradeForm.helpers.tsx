import React from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { FormData, FormField } from '../types/formTypes';
import { EnergySource } from '../types/commonTypes';

interface RenderFieldsProps {
  fields: FormField[];
  formData: FormData;
  setFormData: (formData: FormData) => void;
}

function renderFields({ fields, formData, setFormData }: RenderFieldsProps) {
  return (
    <>
      {fields
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

export function initialiseFormData(
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

interface InformationSectionProps {
  fields: FormField[];
  formData: FormData;
  setFormData: (formData: FormData) => void;
}

interface GeneralInformationSectionProps extends InformationSectionProps {
  energySource: EnergySource;
  energySources: EnergySource[];
  setEnergySource: (energySource: EnergySource) => void;
}

export function GeneralInformationSection({
  energySource,
  setEnergySource,
  energySources,
  fields,
  formData,
  setFormData,
}: GeneralInformationSectionProps) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        General Information
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(12, 1fr)' },
          gap: 2,
        }}
      >
        {/* Dropdown for selecting energy source */}
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
          <TextField
            select
            label="Energy Source"
            value={energySource}
            onChange={(e) => setEnergySource(e.target.value as EnergySource)}
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
            {/* Map over the energySources array to create options */}
            {energySources.map((source) => (
              <option key={source} value={source}>
                {source.charAt(0).toUpperCase() + source.slice(1)}
              </option>
            ))}
          </TextField>
        </Box>

        {/* Render the general information (common) fields */}
        {renderFields({
          fields,
          formData,
          setFormData,
        })}
      </Box>
    </>
  );
}

export function EnergySourceSpecificInformationSection({
  fields,
  formData,
  setFormData,
}: InformationSectionProps) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Energy Source-Specific Information
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(12, 1fr)' },
          gap: 2,
        }}
      >
        {/* Render the energy source-specific information (dynamic) fields */}
        {renderFields({
          fields,
          formData,
          setFormData,
        })}
      </Box>
    </>
  );
}
