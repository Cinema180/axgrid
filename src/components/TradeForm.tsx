import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Card, Divider } from '@mui/material';
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
import {
  EnergySourceSpecificInformationSection,
  GeneralInformationSection,
  initialiseFormData,
} from './TradeForm.helpers';

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

  // Load common fields and dynamically generate fields based on the selected energy source
  useEffect(() => {
    const energySourceConfig = config[energySource] as EnergySourceConfig;

    // Set common fields from the config
    setCommonFields(config.commonFields);

    // Set dynamic fields based on the selected energy source
    if (energySourceConfig && Array.isArray(energySourceConfig.fields)) {
      setDynamicFields(energySourceConfig.fields);
    }

    // Initialise formData with default values
    const initialFormData = initialiseFormData(
      config.commonFields,
      energySourceConfig?.fields || [],
      formData
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
    setConfirmDialogOpen(false); // Close the confirmation dialog
    setSelectedTab(0); // Set the selected tab to "Trade Manager" after trade submission
    navigate('/trade-manager'); // Redirect to the TradeManager page after trade submission
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Create a New Trade
      </Typography>
      <Card elevation={2} sx={{ padding: 2 }}>
        <GeneralInformationSection
          energySource={energySource}
          setEnergySource={setEnergySource}
          energySources={energySources}
          fields={commonFields}
          formData={formData}
          setFormData={setFormData}
        />
        <Divider sx={{ my: 2 }} />
        <EnergySourceSpecificInformationSection
          fields={dynamicFields}
          formData={formData}
          setFormData={setFormData}
        />
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
