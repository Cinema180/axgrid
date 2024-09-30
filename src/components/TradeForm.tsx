import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTabContext } from '../store/TabContext';
import { tradeService } from '../services/tradeService';
import formConfig from '../resources/formConfig.json';
import CustomDialog from './CustomDialog';
import { EnergySource, energySources } from '../types/commonTypes';
import {
  FormData,
  FormField,
  FormConfig,
  EnergySourceConfig,
} from '../types/formTypes';
import { OfferingDetails } from '../types/tradeTypes';
import renderFields from './TradeForm.helpers';

function TradeForm() {
  const [formData, setFormData] = useState<FormData>({});
  const [commonFields, setCommonFields] = useState<FormField[]>([]);
  const [dynamicFields, setDynamicFields] = useState<FormField[]>([]);
  const [energySource, setEnergySource] = useState<EnergySource>('solar');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { setSelectedTab } = useTabContext();
  const navigate = useNavigate();

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

    // Initialize formData with default values
    const initialFormData: FormData = { ...formData };
    [...config.commonFields, ...(energySourceConfig?.fields || [])].forEach(
      (field) => {
        if (
          field.name !== 'energySource' &&
          initialFormData[field.name] === undefined
        ) {
          if (field.type === 'number') {
            initialFormData[field.name] = 0; // Initialize number fields with 0
          } else if (
            field.type === 'select' &&
            field.options &&
            field.options.length > 0
          ) {
            const [firstOption] = field.options;
            initialFormData[field.name] = firstOption; // Initialize select fields with the first option
          } else {
            initialFormData[field.name] = ''; // Initialize other fields with empty string
          }
        }
      }
    );
    setFormData(initialFormData);
  }, [energySource, config, formData]);

  const handleSubmit = () => {
    setConfirmDialogOpen(true); // Open confirmation dialog
  };

  const handleConfirmSubmit = () => {
    const offeringDetails: OfferingDetails = {
      energySource,
      price: Number(formData.price),
      minPurchaseQuantity: Number(formData.minPurchaseQuantity),
      contractTerms: formData.contractTerms as string,
      currency: formData.currency as string,
      paymentTerms: formData.paymentTerms as string,
      ...formData, // Include any additional dynamic fields
    };
    tradeService.addTrade(offeringDetails);
    setFormData({}); // Reset the form
    setConfirmDialogOpen(false);
    setSelectedTab(0); // Set the selected tab to "Trade Manager" after trade submission
    navigate('/trade-manager'); // Redirect to the TradeManager page after trade submission
  };

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

          {/* Render Common Fields */}
          {renderFields({
            fieldsToRender: commonFields,
            formData,
            setFormData,
          })}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Dynamic Fields Section */}
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
          {/* Render the energy source-specific dynamic fields */}
          {renderFields({
            fieldsToRender: dynamicFields,
            formData,
            setFormData,
          })}
        </Box>
        {/* Submit Button */}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Trade
          </Button>
        </Box>
      </Card>

      {/* Confirmation Dialog for Submit Trade */}
      <CustomDialog
        title="Confirm Trade Submission"
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        actions={
          <>
            <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleConfirmSubmit}
              variant="contained"
              color="primary"
            >
              OK
            </Button>
          </>
        }
      >
        <Typography>Are you sure you want to submit this trade?</Typography>
      </CustomDialog>
    </Box>
  );
}

export default TradeForm;
