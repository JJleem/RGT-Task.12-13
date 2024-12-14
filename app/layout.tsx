"use client";

import { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/common/header/Header";
import Footer from "@/components/common/footer/Footer";
import "./scrollCss.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import LoadBooksOnClient from "./LocalBooksOnCLient";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <head>
        <title>Book Application</title>
        <meta name="description" content="RGT과제 Book Application입니다." />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-gov-dynamic-subset.min.css"
        />
      </head>
      <body className="h-auto">
        <Provider store={store}>
          <Header />
          <LoadBooksOnClient />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
