import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import { Alert, Button, Divider, Drawer, Grid, Snackbar, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { Box } from "@mui/system";
import * as React from "react";
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui";
import { FormProps } from ".";

const drawerWidth = 400;

export default function Settings({
  setConfigAvailable,
  isConfigAvailable,
  setFormValues,
}: {
  setConfigAvailable: any;
  isConfigAvailable?: boolean;
  setFormValues: any;
}) {
  const APP_SETTINGS_KEY = "AppSettings";
  const [open, setOpen] = React.useState(false);
  const [storedAppSettings, setStoredAppSettings] = React.useState(
    typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem(APP_SETTINGS_KEY) || "{}") : {}
  );
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onApplicationSettingsSave = (data: FormProps) => {
    setFormValues(data);
    setStoredAppSettings(data);
    if (data.accountName && data.appKey && data.appToken) {
      setConfigAvailable(true);
      setSnackbarOpen(true);
    }
  };

  const onSnackbarAutoHide = () => {
    setSnackbarOpen(false);
  };

  React.useEffect(() => {
    sessionStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(storedAppSettings));
    if (Object.keys(storedAppSettings).length !== 0) {
      console.log("00000");
      setFormValues(storedAppSettings);
      setConfigAvailable(true);
    } else {
      setConfigAvailable(false);
      setFormValues(null);
    }
  }, [storedAppSettings]);

  const onDownload = () => {
    const link = document.createElement("a");
    link.download = `template.csv`;
    link.href = "./template.csv";
    link.click();
  };

  const settingsList = () => (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ p: 2, my: 2, borderRadius: 2 }}>
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

        <Typography
          style={{ fontWeight: "600", fontStyle: "italic" }}
          mt={1}
          variant="caption"
          display="block"
          gutterBottom
        >
          Note: Settings are only saved locally in session storage and are not saved on the server.
        </Typography>

        <FormContainer defaultValues={storedAppSettings} onSuccess={onApplicationSettingsSave}>
          <div>
            <TextFieldElement
              name="accountName"
              label="Account Name"
              helperText=".myvtex.com"
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

            <TextFieldElement
              name="utmSource"
              label="UTM Source"
              helperText="utm_source"
              style={{ width: "100%", marginTop: "2rem" }}
            />

            <TextFieldElement
              name="utmCampaign"
              label="UTM Campaign"
              helperText="utm_campaign"
              style={{ width: "100%", marginTop: "2rem" }}
            />

            <TextFieldElement
              name="batchSize"
              label="Batch Size"
              type="number"
              helperText="Batch Size (default is 1000)"
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

        <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={onSnackbarAutoHide}>
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
      <Button
        style={{ marginLeft: "1rem" }}
        variant="outlined"
        color="primary"
        onClick={onDownload}
        startIcon={<DownloadIcon />}
      >
        Download Template
      </Button>
      <Button
        variant="outlined"
        color="primary"
        style={{ marginLeft: "1rem" }}
        onClick={handleDrawerOpen}
        startIcon={<SettingsIcon />}
      >
        Settings
      </Button>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        anchor="right"
        open={open}
        variant="temporary"
      >
        {settingsList()}
      </Drawer>
    </Grid>
  );
}
