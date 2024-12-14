"use client";

import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { BookData, removeBook } from "@/store/booksSlice";
import { removeSale, Sale } from "@/store/saleSlice";
import Image from "next/image";

const BookDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setId] = useState<string | null>(null);
  const [book, setBook] = useState<BookData | null>(null);
  const [sale, setSale] = useState<Sale | null>(null);

  const dispatch = useDispatch();
  const books = useSelector((state: RootState) => state.books.list || []);
  const sales = useSelector((state: RootState) => state.sales.sales || []);
  const router = useRouter();

  // `params` 처리 및 데이터 설정
  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      const foundBook = books.find((book) => book.id === id) || null;
      const foundSale = sales.find((sale) => sale.id === id) || null;
      setBook(foundBook);
      setSale(foundSale);
    });
  }, [params, books, sales]);

  const handleDelete = () => {
    if (!id) return;

    // Redux 상태 업데이트
    dispatch(removeBook(id));
    dispatch(removeSale(id));

    // localStorage 업데이트
    if (typeof window !== "undefined") {
      const updatedBooks = books.filter((book) => book.id !== id);
      localStorage.setItem("books", JSON.stringify(updatedBooks));

      const updatedSales = sales.filter((sale) => sale.id !== id);
      localStorage.setItem("sales", JSON.stringify(updatedSales));
    }

    alert("책이 삭제되었습니다.");
    router.push("/"); // 메인 페이지로 이동
  };

  if (!book) {
    return (
      <p className="text-center text-red-500">해당 책을 찾을 수 없습니다.</p>
    );
  }

  return (
    <div className="w-full sm:h-[calc(100vh-130px)] flex flex-col items-center gap-12 2xl:pl-[240px] 2xl:pr-[240px] xl:pl-[160px] xl:pr-[160px] pb-[150px] lg:pl-[120px] lg:pr-[120px] xxs:pl-[24px] xxs:pr-[24px] overflow-x-hidden relative mt-12">
      <div className="flex sm:flex-row xs:flex-col gap-10 ">
        {book.volumeInfo.imageLinks?.thumbnail && (
          <Image
            className="w-[400px] h-[600px] shadow-lg"
            src={book.volumeInfo.imageLinks.thumbnail}
            alt={`${book.volumeInfo.title} cover`}
            width={400}
            height={600}
            unoptimized
          />
        )}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">{book.volumeInfo.title}</h1>
            <div className="flex gap-2">
              <div
                className="right-0 rounded-md bg-NauticalBlue px-4 py-2 text-white cursor-pointer"
                onClick={() => router.push(`/bookDetail/${book.id}/edit`)}
              >
                수정하기
              </div>
              <div
                className="right-0 rounded-md bg-red-700 px-4 py-2 text-white cursor-pointer"
                onClick={handleDelete}
              >
                삭제하기
              </div>
            </div>
          </div>
          {book.volumeInfo.subtitle && (
            <h2 className="text-xl text-gray-500">
              {book.volumeInfo.subtitle}
            </h2>
          )}
          <p>
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
          <p>
            <strong>설명:</strong>{" "}
            {book.volumeInfo.description || "설명이 제공되지 않았습니다."}
          </p>
          <div>
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
