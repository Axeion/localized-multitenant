import React from 'react';

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="test-layout">
          {children}
        </div>
      </body>
    </html>
  );
}