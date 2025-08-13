import { Encode_Sans } from "next/font/google"

export const encodeSans = Encode_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-encode-sans",
})
