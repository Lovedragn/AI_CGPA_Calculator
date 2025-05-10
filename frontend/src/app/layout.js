import "./globals.css";

export const metadata = {
  title: "AI CGPA Calculator",
  description: "AI based CGPA calculator for College Students ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
