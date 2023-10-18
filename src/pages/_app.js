import "@/styles/globals.css";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Script src="https://unpkg.com/ionicons@latest/dist/ionicons.js" />
    </>
  );
}
