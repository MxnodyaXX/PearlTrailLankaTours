import type { Metadata } from "next";
import CalibrateClient from "./CalibrateClient";

export const metadata: Metadata = {
  title: "Map Calibrator",
  robots: { index: false, follow: false },
};

export default function MapCalibratePage() {
  return <CalibrateClient />;
}
