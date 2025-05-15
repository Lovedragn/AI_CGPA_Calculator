import "./globals.css";
const GOOGLE_VERIFY = process.env.GOOGLE_VERIFY_ID;

export const metadata = {
  title: "GPA Calculator",
  description: "AI-powered CGPA calculator for precise grade evaluation and result tracking. Quickly compute semester-wise and cumulative GPAs with accuracy"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="icon" href="/logo.svg"/>
        <meta name="google-site-verification" content={GOOGLE_VERIFY} />
        <meta name="description" content="Free AI GPA calculator for students. Upload mark sheets and get instant CGPA results." />
        <meta name="keywords" content="GPA Calculator, CGPA Tool, Student Calculator, Marksheet Analyzer, Grade Calculator" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="CGPA Calculator" />
        <meta property="og:description" content="Calculate GPA automatically by uploading your mark sheet." />
        <meta property="og:url" content="https://ai-cgpa-calculator.vercel.app/" />
        <meta property="og:type" content="website" />
      </head>
      <body
        className={`bg-black antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
