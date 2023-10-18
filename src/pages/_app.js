import "@/styles/globals.css";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      {/* <Script src="https://unpkg.com/ionicons@latest/dist/ionicons/ionicons.esm.js" />
      <Script src="https://unpkg.com/ionicons@latest/dist/ionicons/ionicons.js"  /> */}
      <Script
        type="module"
        src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
      ></Script>
      <Script
        noModule
        src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
      ></Script>
    </>
  );
}
