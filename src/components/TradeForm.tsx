import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  Divider,
} from '@mui/material';
import { tradeService } from '../services/tradeService';
import formConfig from '../resources/formConfig.json';
import {
  FormField,
  FormData,
  FormConfig,
  EnergySource,
  EnergySourceConfig,
  OfferingDetails,
} from '../types/types';

function TradeForm() {
  const [formData, setFormData] = useState<FormData>({});
  const [commonFields, setCommonFields] = useState<FormField[]>([]);
  const [dynamicFields, setDynamicFields] = useState<FormField[]>([]);
  const [energySource, setEnergySource] = useState<EnergySource>('solar');

  // Load JSON form configuration
  const config: FormConfig = formConfig as FormConfig;

  // Load common fields and dynamically generate fields based on energy source
  useEffect(() => {
    const energySourceConfig = config[energySource] as EnergySourceConfig;

    // Set common fields from the config
    setCommonFields(config.commonFields);

    // Set dynamic fields based on the selected energy source
    if (energySourceConfig && Array.isArray(energySourceConfig.fields)) {
      setDynamicFields(energySourceConfig.fields);
    }
  }, [energySource, config]);

  const handleSubmit = () => {
    const offeringDetails: OfferingDetails = {
      energySource,
      price: Number(formData.price),
      minPurchaseQuantity: Number(formData.minPurchaseQuantity),
      contractTerms: formData.contractTerms as string,
      currency: formData.currency as string,
      energyUnit: formData.energyUnit as string,
      paymentTerms: formData.paymentTerms as string,
      ...formData, // Include any additional dynamic fields
    };

    tradeService.addTrade(offeringDetails);
    setFormData({}); // Reset the form
  };

  // Dynamic input field renderer
  const renderFields = (fieldsToRender: FormField[]) =>
    fieldsToRender
      .filter((field) => field.name !== 'energySource') // Exclude energySource from being rendered
      .map((field: FormField) => (
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
            margin="dense" // Used to reduce vertical spacing
            size="small" // Set the size of the TextField to small
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '0.9rem',
              },
            }}
          />
        </Box>
      ));

  const energySources: EnergySource[] = [
    'solar',
    'gas',
    'wind',
    'hydro',
    'kinetic',
    'thermal',
  ];

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Create a New Trade
      </Typography>
      <Card elevation={2} sx={{ padding: 2 }}>
        {/* General Information Section */}
        <Typography variant="h6" gutterBottom>
          General Information
        </Typography>
        {/* Use Box with CSS Grid for layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(12, 1fr)' },
            gap: 2, // Adjusts space between form fields
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

          {/* Render Common Fields */}
          {renderFields(commonFields)}
        </Box>
        <Divider sx={{ my: 2 }} /> {/* Adds a divider to separate sections */}
        {/* Dynamic Fields Section */}
        <Typography variant="h6" gutterBottom>
          Energy Source-Specific Information
        </Typography>
        {/* Use Box with CSS Grid for layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(12, 1fr)' },
            gap: 2, // Adjusts space between form fields
          }}
        >
          {/* Render Dynamic Fields based on selected energy source */}
          {renderFields(dynamicFields)}
        </Box>
        {/* Submit Button */}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Trade
          </Button>
        </Box>
      </Card>
    </Box>
  );
}

export default TradeForm;
