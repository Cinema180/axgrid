import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { tradeService } from '../services/tradeService';
import formConfig from '../resources/formConfig.json';
import {
  FormField,
  FormData,
  FormConfig,
  EnergySource,
  EnergySourceConfig,
  OfferingDetails,
} from '../types';

function TradeForm() {
  const [formData, setFormData] = useState<FormData>({});
  const [fields, setFields] = useState<FormField[]>([]);
  const [energySource, setEnergySource] = useState<EnergySource>('solar');

  // Load JSON form configuration
  const config: FormConfig = formConfig as FormConfig;

  // Load both common fields and specific fields based on the selected energy source
  useEffect(() => {
    const energySourceConfig = config[energySource] as EnergySourceConfig;
    if (energySourceConfig && Array.isArray(energySourceConfig.fields)) {
      setFields([...config.commonFields, ...energySourceConfig.fields]);
    }
  }, [energySource, config]);

  const handleSubmit = () => {
    const offeringDetails: OfferingDetails = {
      energySource, // Set energy source
      price: Number(formData.price),
      minPurchaseQuantity: Number(formData.minPurchaseQuantity),
      contractTerms: formData.contractTerms as string,
      currency: formData.currency as string,
      energyUnit: formData.energyUnit as string,
      paymentTerms: formData.paymentTerms as string,

      ...formData, // Include the dynamic fields
    };

    tradeService.addTrade(offeringDetails);

    setFormData({}); // Reset the form
  };

  // Dynamic input field renderer
  const renderFields = () =>
    fields.map((field: FormField) => (
      <TextField
        key={field.name}
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
        margin="normal"
      />
    ));

  return (
    <Box>
      <Typography variant="h6">Create a New Trade</Typography>

      <TextField
        select
        label="Energy Source"
        value={energySource}
        onChange={(e) => setEnergySource(e.target.value as EnergySource)} // Cast to EnergySource
        SelectProps={{
          native: true,
        }}
        fullWidth
        margin="normal"
      >
        <option value="solar">Solar</option>
        <option value="gas">Gas</option>
        <option value="wind">Wind</option>
        <option value="hydro">Hydro</option>
        <option value="kinetic">Kinetic</option>
        <option value="thermal">Thermal</option>
      </TextField>

      {/* Render dynamic fields based on the selected energy source */}
      {renderFields()}

      <Button onClick={handleSubmit} variant="contained" color="primary">
        Submit Trade
      </Button>
    </Box>
  );
}

export default TradeForm;
