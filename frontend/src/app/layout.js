import "./globals.css";

const GOOGLE_VERIFY = process.env.GOOGLE_VERIFY_ID;

export const metadata = {
  title: "AI GPA Calculator | Upload Marksheet to Get CGPA Instantly",
  description:
    "AI-powered CGPA calculator for students. Upload your mark sheet and instantly compute accurate GPA and CGPA.",
  keywords: [
    "GPA Calculator",
    "CGPA Tool",
    "Student Calculator",
    "Marksheet Analyzer",
    "Grade Calculator",
    "GPA",
    "GPA Calcy",
    "CGPA",
    "CGPA calcy",
    "cgpa calculator",
    "gpa calculator",
    "anna university calculator",
    "grtiet calculator",
    "India AI GPA Calculator",
    "PDF GPA Calculator",
    "ai based cgpa calcuator",
    ""
  ],
  metadataBase: new URL("https://ai-cgpa-calculator.vercel.app"),
  openGraph: {
    title: "AI GPA Calcy",
    description: "Calculate GPA automatically by uploading your mark sheet.",
    url: "https://ai-cgpa-calculator.vercel.app",
    type: "website",
    images: [
      {
        url: "/chrome-512px.png", // Make sure this exists in public folder
        width: 1200,
        height: 630,
        alt: "AI GPA Calcy Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI GPA Calcy",
    description: "Upload your mark sheet and get your GPA instantly with AI.",
    images: ["/chrome-512px.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="canonical" href="https://ai-cgpa-calculator.vercel.app/" />
        {GOOGLE_VERIFY && (
          <meta name="google-site-verification" content={GOOGLE_VERIFY} />
        )}
      </head>
      <body className="bg-black antialiased">{children}</body>
    </html>
  );
}
