import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { easy: { purple:"#4A148C", yellow:"#FFD600" }}, borderRadius:{'2xl':'1rem'} } },
  plugins: [],
};
export default config;
