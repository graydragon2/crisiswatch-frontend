import Head from 'next/head';
import DarkWebChecker from '@/components/DarkWebChecker';

export default function DarkWebPage() {
  return (
    <>
      <Head>
        <title>Dark Web Monitoring | CrisisWatch</title>
        <meta name="description" content="Check if your email has been exposed on the dark web using CrisisWatch." />
      </Head>

      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        <div className="container mx-auto px-4 py-8">
          <DarkWebChecker />
        </div>
      </div>
    </>
  );
}
