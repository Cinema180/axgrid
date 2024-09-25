import { useState, useEffect } from 'react';
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
  energySources,
} from '../types/types';
import CustomDialog from './CustomDialog';

function TradeForm() {
  const [formData, setFormData] = useState<FormData>({});
  const [commonFields, setCommonFields] = useState<FormField[]>([]);
  const [dynamicFields, setDynamicFields] = useState<FormField[]>([]);
  const [energySource, setEnergySource] = useState<EnergySource>('solar');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

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
  };

  // Dynamic input field renderer
  const renderFields = (fieldsToRender: FormField[]) =>
    fieldsToRender
      .filter((field) => field.name !== 'energySource') // Exclude energySource from being rendered
      .map((field: FormField) => {
        if (field.type === 'select') {
          // Render select dropdown for select fields like currency
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
      });

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

        <Divider sx={{ my: 2 }} />

        {/* Dynamic Fields Section */}
        <Typography variant="h6" gutterBottom>
          Energy Source-Specific Information
        </Typography>
        {/* Use Box with CSS Grid for layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(12, 1fr)' },
            gap: 2,
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
