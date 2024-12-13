"use client";

import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BookDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setId] = useState<string | null>(null);
  const books = useSelector((state: RootState) => state.books.list);
  const sales = useSelector((state: RootState) => state.sales.sales);
  // `params` 처리
  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  const book = books.find((book) => book.id === id);
  const sale = sales.find((sale) => sale.id === id);
  if (!book) {
    return (
      <p className="text-center text-red-500">해당 책을 찾을 수 없습니다.</p>
    );
  }

  return (
    <div className="w-full sm:h-[calc(100vh-130px)] flex flex-col items-center gap-12 2xl:pl-[240px] 2xl:pr-[240px] xl:pl-[160px] xl:pr-[160px] pb-[150px] lg:pl-[120px] lg:pr-[120px] xxs:pl-[24px] xxs:pr-[24px] overflow-x-hidden relative mt-12 ">
      <div className="flex sm:flex-row xs:flex-col gap-10 ">
        {book.volumeInfo.imageLinks?.thumbnail && (
          <img
            className=" w-[400px] h-auto shadow-lg"
            src={book.volumeInfo.imageLinks.thumbnail}
            alt={`${book.volumeInfo.title} cover`}
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{book.volumeInfo.title}</h1>
          {book.volumeInfo.subtitle && (
            <h2 className="text-xl text-gray-500">
              {book.volumeInfo.subtitle}
            </h2>
          )}
          <p className="mt-4">
            <strong>저자:</strong>{" "}
            {book.volumeInfo.authors?.join(", ") || "알 수 없음"}
          </p>
          <p>
            <strong>출판사:</strong> {book.volumeInfo.publisher || "알 수 없음"}
          </p>
          <p>
            <strong>출판일:</strong>{" "}
            {book.volumeInfo.publishedDate || "알 수 없음"}
          </p>
          <p>
            <strong>페이지 수:</strong>{" "}
            {book.volumeInfo.pageCount || "알 수 없음"}
          </p>
          <p>
            <strong>인쇄 방법:</strong>{" "}
            {book.volumeInfo.printType || "알 수 없음"}
          </p>
          <p>
            <strong>종류:</strong> {book.volumeInfo.categories || "알 수 없음"}
          </p>
          <p>
            <strong>언어:</strong> {book.volumeInfo.language || "알 수 없음"}
          </p>
          <p className="mt-4">
            <strong>설명:</strong>{" "}
            {book.volumeInfo.description || "설명이 제공되지 않았습니다."}
          </p>
          <div className="mt-6">
            <p>
              <strong>판매 수량:</strong> {sale?.salesCount || "데이터 없음"}
            </p>
            <p>
              <strong>남은 수량:</strong> {sale?.stockCount || "데이터 없음"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
