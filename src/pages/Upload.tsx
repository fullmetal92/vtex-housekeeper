import * as React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import FileUpload from "react-material-file-upload";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CircularProgress, { circularProgressClasses, CircularProgressProps } from "@mui/material/CircularProgress";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
import axios from "axios";
import Papa from "papaparse";
import axiosThrottle from "axios-request-throttle";
import { chunk, reject } from "lodash";
import MUIDataTable from "mui-datatables";

type UploadProps = {
  isConfigAvailable: boolean;
  formValues: any;
};

type Data = {
  index: number;
  couponCode: string;
  utmSource: string;
  utmCampaign: string;
};

const columns = [
  {
    name: "index",
    label: "Index",
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: "couponCode",
    label: "Coupon Code",
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: "utmSource",
    label: "UTM Source",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "utmCampaign",
    label: "UTM Campaign",
    options: {
      filter: true,
      sort: false,
    },
  },
];

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

async function createCoupon(endpointUrl: string, appKey: string, appToken: string, couponConfigurations: any) {
  return await axios({
    method: "POST",
    url: "/api/coupon",
    data: {
      url: endpointUrl,
      appKey: appKey,
      appToken: appToken,
      payload: couponConfigurations,
    },
  })
    .then((res) => res.data)
    .catch((err) => console.log(err.message));
}

// Inspired by the former Facebook spinners.
function FacebookCircularProgress(props: CircularProgressProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) => theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) => (theme.palette.mode === "light" ? "#1a90ff" : "#308fe8"),
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={40}
        thickness={4}
        //   {...props}
      />
    </Box>
  );
}

function parseFile(file: File) {
  return new Promise((resolve, object) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: function (results) {
        resolve(results.data);
      },
      error(err, file) {
        reject(err);
      },
    });
  });
}

function mask(text: string, length: number) {
  if (text.length <= length) {
    return text;
  } else {
    var masked =
      text.substring(0, text.length - length).replace(/[a-z\d]/gi, "#") +
      text.substring(text.length - length, text.length);
    return masked;
  }
}

export default function Upload(props: UploadProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [data, setData] = React.useState<Data[]>([]);
  const [uploadPercentage, setUploadPercentage] = React.useState<number>(0);

  const handleFilesChange = (files: File[]) => {
    // Update chosen files
    setFiles(files);

    if (files && files.length > 0) {
      parseFile(files[0]).then(async (results: any) => {
        const totalRecords = results.length;
        const batchSize = props.formValues.batchSize | 1000;
        const couponData: any = chunk(results, batchSize);

        let processedRecords: Data[] = [];
        let processedRecordCount = 0;
        let index = 0;

        for (let rows of couponData) {
          let couponConfigurations = [];

          // Build coupon batch
          for (let row of rows) {
            couponConfigurations.push({
              quantity: 1,
              couponConfiguration: {
                utmSource: props.formValues.utmSource,
                utmCampaign: props.formValues.utmCampaign,
                couponCode: row[0].trim(),
                isArchived: false,
                maxItemsPerClient: 1,
                expirationIntervalPerUse: "00:00:00",
              },
            });
          }

          let url = `https://${props.formValues.accountName}.myvtex.com/api/rnb/pvt/multiple-coupons`;

          // Execute coupon import
          const response = await createCoupon(
            url,
            props.formValues.appKey,
            props.formValues.appToken,
            couponConfigurations
          );

          processedRecordCount = processedRecordCount + response.length;

          for (let item of response) {
            index++;
            processedRecords.push({
              index: index,
              couponCode: item,
              utmSource: props.formValues.utmSource,
              utmCampaign: props.formValues.utmCampaign,
            });
          }

          setData(processedRecords);
          setUploadPercentage((processedRecordCount / totalRecords) * 100);
        }
      });
    }
  };

  React.useEffect(() => {
    if (uploadPercentage === 100) {
      setTimeout(() => {
        setUploadPercentage(0);
        setFiles([]);
      }, 2000);
    }
  });

  return (
    <Grid container>
      {files.length > 0 && (
        <Box sx={{ flexGrow: 1, marginTop: "2rem" }}>
          <FacebookCircularProgress />
          <br />
          <BorderLinearProgress variant="determinate" value={uploadPercentage} />
          <br />
          <Button
            onClick={() => {
              setFiles([]);
              setUploadPercentage(0);
            }}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
        </Box>
      )}
      {data && data.length > 0 && files.length < 1 && (
        <Box sx={{ flexGrow: 1, marginTop: "2rem" }}>
          <MUIDataTable title={"Results"} data={data} columns={columns} />
          <Typography
            style={{ fontWeight: "500", fontStyle: "italic" }}
            mt={2}
            variant="caption"
            display="block"
            gutterBottom
          >
            Refresh the page to restart the process
          </Typography>
        </Box>
      )}

      {data.length < 1 && files.length < 1 && (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item>
            {files.length < 1 && (
              <FileUpload
                title="Drag 'n' drop a CSV file here, or click to select a file"
                value={files}
                onChange={handleFilesChange}
                disabled={!props.isConfigAvailable}
              />
            )}
            {!props.formValues && files.length < 1 && (
              <Typography style={{ fontWeight: "500" }} mt={2} variant="caption" display="block" gutterBottom>
                Click on the "Settings" button to configure application settings
              </Typography>
            )}
            {props.formValues && (
              <Typography style={{ fontWeight: "400" }} mt={2} variant="caption" display="block" gutterBottom>
                Account: <span style={{ fontWeight: "bold" }}>{props.formValues.accountName}.myvtex.com</span>
              </Typography>
            )}
            {props.formValues && (
              <Typography style={{ fontWeight: "400" }} mt={1} variant="caption" display="block" gutterBottom>
                App Key: <span style={{ fontWeight: "bold" }}>{mask(props.formValues.appKey, 6)}</span>
              </Typography>
            )}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
