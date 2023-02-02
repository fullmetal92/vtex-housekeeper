import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import { Alert, Button, Divider, Drawer, Grid, Snackbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui";
import { FormProps } from ".";

export default function Settings({
  setConfigAvailable,
  isConfigAvailable,
  setFormValues,
}: {
  setConfigAvailable: any;
  isConfigAvailable?: boolean;
  setFormValues: any;
}) {
  const [open, setOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onApplicationSettingsSave = (data: FormProps) => {
    setFormValues(data);
    if (data.accountName && data.appKey && data.appToken) {
      setConfigAvailable(true);
      setSnackbarOpen(true);
    }
  };

  const onSnackbarAutoHide = () => {
    setSnackbarOpen(false);
  };

  const settingsList = () => (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ width: 400, p: 2, my: 2, borderRadius: 2 }}>
        <CloseIcon
          style={{
            cursor: "pointer",
            marginTop: "0rem",
          }}
          onClick={handleDrawerClose}
        />

        <Typography
          style={{
            textAlign: "center",
            fontWeight: "400",
            marginTop: "0rem",
            marginBottom: "1rem",
          }}
          variant="h5"
          component="h5"
          color="primary"
        >
          Application Configuration
        </Typography>

        <FormContainer onSuccess={onApplicationSettingsSave}>
          <div>
            <TextFieldElement
              name="accountName"
              label="Account Name"
              helperText="*.myvtex.com"
              style={{ width: "100%", marginTop: "2rem" }}
              required
            />

            <TextFieldElement
              name="appKey"
              label="App Key"
              helperText="X-VTEX-AppKey"
              style={{ width: "100%", marginTop: "2rem" }}
              required
            />

            <TextFieldElement
              name="appToken"
              label="App Token"
              helperText="X-VTEX-AppToken"
              style={{ width: "100%", marginTop: "2rem" }}
              required
            />

            <Divider style={{ marginTop: "1.5rem" }} />

            <TextFieldElement
              name="utmSource"
              label="UTM Source"
              helperText="utm_source"
              style={{ width: "100%", marginTop: "2rem" }}
              required
            />

            <TextFieldElement
              name="utmCampaign"
              label="UTM Campaign"
              helperText="utm_campaign"
              style={{ width: "100%", marginTop: "2rem" }}
            />

            <TextFieldElement
              name="requestsPerSecond"
              label="Requests Per Second"
              helperText="requestsPerSecond"
              style={{ width: "100%", marginTop: "2rem" }}
            />

            <div
              style={{
                textAlign: "center",
              }}
            >
              <Button
                type="submit"
                style={{
                  alignSelf: "center",
                  marginTop: "2.5rem",
                  width: "100%",
                }}
                variant="contained"
              >
                Save
              </Button>
            </div>
          </div>
        </FormContainer>

        <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={onSnackbarAutoHide}>
          <Alert severity="success" sx={{ width: "100%" }}>
            Configuration Settings Saved!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );

  return (
    <Grid
      container
      style={{
        marginTop: "2rem",
        justifyContent: "flex-end",
      }}
    >
      <Button variant="outlined" color="secondary" onClick={handleDrawerOpen} startIcon={<SettingsIcon />}>
        Settings
      </Button>
      <Drawer anchor="right" open={open} variant="persistent">
        {settingsList()}
      </Drawer>
    </Grid>
  );
}
