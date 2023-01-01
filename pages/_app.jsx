import Head from "next/head";
import Router from "next/router";
import { useState, useEffect } from "react"
import { Spinner } from 'react-bootstrap'
import { SSRProvider } from "react-bootstrap"

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const start = () => setLoading(true)
    const end = () => setLoading(false)
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);
  return (
    <SSRProvider>
      <Head>
        <title>Top Runner Tournament</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      { loading ? (
          <Spinner animation="border" style={{minHeight: "2em", minWidth: "2em", fontSize: "2em"}} />
        ) : (
          <Component {...pageProps} />
        )
      }
    </SSRProvider>
  );
}