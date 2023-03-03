import Head from "next/head";

// @source: https://www.ohmycrawl.com/nextjs-head/

const globalMeta = {
  siteName: "Your Site Name",
  description: "Default site description.",
};

type SEOHeadProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

const SEOHead: React.FC<SEOHeadProps> = ({
  title = globalMeta.siteName,
  description = globalMeta.description,
  children,
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />

      {children}
    </Head>
  );
};
export default SEOHead;
