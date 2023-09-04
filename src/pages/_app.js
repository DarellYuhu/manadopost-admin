import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Script src="https://unpkg.com/ionicons@latest/dist/ionicons.js" />
    </>
  );
}
