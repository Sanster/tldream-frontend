import '@fontsource/recursive'
import Head from 'next/head'
import type React from 'react'
import '~styles/globals.css'

const APP_NAME = 'tldream'
const APP_DESCRIPTION = 'A tiny little diffusion drawing app.'
const APP_URL = 'https://github.com/Sanster/tldream'
const IMAGE = 'https://github.com/Sanster/tldream-frontend/blob/tldream/assets/tldream.png'

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <Head>
        <meta name="application-name" content={APP_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#fafafa" />

        <meta name="twitter:url" content={APP_URL} />
        <meta name="twitter:title" content={APP_NAME} />
        <meta name="twitter:description" content={APP_DESCRIPTION} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@tldream" />
        <meta name="twitter:site" content="@tldream" />
        <meta name="twitter:image" content={IMAGE} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={APP_NAME} />
        <meta property="og:description" content={APP_DESCRIPTION} />
        <meta property="og:site_name" content={APP_NAME} />
        <meta property="og:url" content={APP_URL} />
        <meta property="og:image" content={IMAGE} />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />

        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />

        <title>tldream</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
