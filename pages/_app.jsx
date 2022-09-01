import Head from "next/head";
import { SSRProvider } from "react-bootstrap"

function MyApp({ Component, pageProps }) {
  return (
    <SSRProvider>
      <Head>
        <title>Top Runner Tournament</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </SSRProvider>
  );
}

export default MyApp;