import { Html, Head, Main, NextScript } from "next/document"
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="VaultIQ — AI Executive Advisor. Launch your SaaS in 48 hours." />
        <meta name="theme-color" content="#08122A" />
        <meta property="og:title" content="VaultIQ — AI Executive Advisor" />
        <meta property="og:description" content="Launch your SaaS in 48 hours. 50% off founding member pricing." />
        <meta property="og:image" content="/og.png" />
      </Head>
      <body><Main /><NextScript /></body>
    </Html>
  )
}
