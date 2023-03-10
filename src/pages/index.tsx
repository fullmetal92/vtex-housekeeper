import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import * as React from "react";
import { Container } from "@mui/material";
import Settings from "./Settings";
import Upload from "./Upload";

const inter = Inter({ subsets: ["latin"] });

export type FormProps = {
  accountName: string;
  appKey: string;
  appToken: string;
  utmSource: string;
  utmCampaign: string;
  batchSize: number;
};

export default function Home() {
  const [formValues, setFormValues] = React.useState<FormProps>();
  const [isConfigAvailable, setConfigAvailable] = React.useState<boolean>(false);

  return (
    <>
      <Head>
        <title>VTEX Automatic Coupon Importer</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container>
          <Settings
            setConfigAvailable={setConfigAvailable}
            isConfigAvailable={isConfigAvailable}
            setFormValues={setFormValues}
          />
          <Upload isConfigAvailable={isConfigAvailable} formValues={formValues} />
        </Container>
      </main>
    </>
  );
}
