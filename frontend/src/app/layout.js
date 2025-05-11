import "./globals.css";
const GOOGLE_VERIFY = process.env.GOOGLE_VERIFY_ID;

export const metadata = {
  title: "GPA Calculator",
  description: "AI based CGPA calculator for College Students ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content={GOOGLE_VERIFY} />
      </head>
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
