import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script src="https://unpkg.com/ionicons@latest/dist/ionicons.js" />
      </body>
    </Html>
  );
}
