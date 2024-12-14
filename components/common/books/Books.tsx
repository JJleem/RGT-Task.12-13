"use client";

import "./BooksSpinner.css";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setBooks } from "@/store/booksSlice";
import { useRouter } from "next/navigation";
import { addSale } from "@/store/saleSlice";
import Image from "next/image";

interface BookData {
  id?: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
  };
}

interface BooksProps {
  id?: string;
  filterBooks: BookData[];
}

const Books: React.FC<BooksProps> = ({ filterBooks }: BooksProps) => {
  const isbns = useSelector((state: RootState) => state.isbn.list || []);
  const sales = useSelector((state: RootState) => state.sales.sales || []);
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10; // 한 페이지에 표시할 책 수
  const router = useRouter();
  const LOCAL_STORAGE_KEY = "books";

  // 책 데이터를 로컬 스토리지에 저장하는 함수
  const saveBooksToLocalStorage = useCallback((books: BookData[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
    }
  }, []);

  // API 호출 및 로컬 스토리지 저장
  const fetchBooks = useCallback(
    async (isbnList: string[]) => {
      setLoading(true);
      setError(null);

      try {
        const promises = isbnList.map(async (isbn) => {
          const response = await fetch(`/api/books?isbn=${isbn}`);
          if (!response.ok) {
            throw new Error(`Error fetching book for ISBN: ${isbn}`);
          }
          const data = await response.json();
          return data;
        });

        const results = await Promise.all(promises);
        const flattenedBooks = results.flat();

        dispatch(setBooks(flattenedBooks));
        saveBooksToLocalStorage(flattenedBooks);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch book data. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [dispatch, saveBooksToLocalStorage]
  );

  // 로컬 스토리지 또는 API에서 데이터 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBooks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedBooks) {
        dispatch(setBooks(JSON.parse(storedBooks)));
        setLoading(false);
      } else if (isbns.length > 0) {
        fetchBooks(isbns);
      }
    }
  }, [isbns, dispatch, fetchBooks]);

  // 랜덤 판매 수량 및 남은 수량 생성
  useEffect(() => {
    filterBooks.forEach((book) => {
      if (book.id && !sales.find((sale) => sale.id === book.id)) {
        const salesCount = Math.floor(Math.random() * 901) + 100; // 100~1000
        const stockCount = Math.floor(Math.random() * 451) + 50; // 50~500
        dispatch(addSale({ id: book.id, salesCount, stockCount }));
      }
    });
  }, [filterBooks, sales, dispatch]);

  // Pagination 계산
  const totalPages = Math.ceil(filterBooks.length / booksPerPage);
  const reversedBooks = [...filterBooks].reverse(); // 역순으로 정렬
  const currentBooks = reversedBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  return (
    <div className="flex justify-center items-center w-full">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <div className="flex justify-center items-center h-[100vh]">
          <div className="spinner"></div> {/* 로딩 스피너 */}
        </div>
      ) : (
        <div className="w-full flex flex-col gap-20">
          <div className="grid grid-flow-row md:grid-cols-2 w-full sm:grid-cols-1 gap-4">
            {currentBooks.map((book) => {
              const sale = sales.find((sale) => sale.id === book.id);
              return (
                <div
                  key={book.id}
                  className="w-[100%] shadow-xl rounded-md flex flex-row p-6 gap-4 border border-AlmondPeach"
                >
                  <Image
                    className="w-[128px] h-[198px] object-cover shadow-xl"
                    src={
                      book.volumeInfo.imageLinks?.thumbnail ||
                      "https://cdn-icons-png.flaticon.com/512/85/85488.png"
                    }
                    alt={`${book.volumeInfo.title} cover`}
                    width={400}
                    height={600}
                  />
                  <div className="h-full w-full">
                    <strong>책 제목 : {book.volumeInfo.title}</strong>
                    {book.volumeInfo.subtitle && (
                      <h4>서브 타이틀 : {book.volumeInfo.subtitle}</h4>
                    )}
                    <p>
                      <strong>저자 : </strong>{" "}
                      {book.volumeInfo.authors?.join(", ") || "알수없음"}
                    </p>
                    <p>
                      <strong>출판사 : </strong>{" "}
                      {book.volumeInfo.publisher || "알수없음"}
                    </p>
                    <p>
                      <strong>출판일자 : </strong>{" "}
                      {book.volumeInfo.publishedDate || "알수없음"}
                    </p>
                    <div className="flex flex-row gap-5">
                      <p>
                        <strong>판매 수량 : </strong>
                        {sale?.salesCount || "N/A"}
                      </p>
                      <p>
                        <strong>남은 수량 : </strong>
                        {sale?.stockCount || "N/A"}
                      </p>
                    </div>
                    <p className="mt-4">
                      {book.volumeInfo.description
                        ? book.volumeInfo.description.length > 80
                          ? `${book.volumeInfo.description.substring(0, 80)}...`
                          : book.volumeInfo.description
                        : "알수없음"}
                    </p>
                    <div className="mt-4 flex justify-end items-center cursor-pointer">
                      <div
                        className="flex items-center border border-PeachFuzz rounded-md px-3 py-1 gap-2"
                        onClick={() => router.push(`/bookDetail/${book.id}`)}
                      >
                        자세히 보기
                        <span className="w-[10px] h-[30px] bg-[url('../assets/icon/arrow_Peach.png')] bg-center bg-fill cursor-pointer -rotate-90"></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pagination flex justify-center items-center gap-4">
            <div
              className="w-[30px] h-[30px] bg-[url('../assets/icon/arrow_Peach.png')] bg-center bg-fill cursor-pointer rotate-90"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            ></div>
            <span className="text-xl">
              {currentPage} of {totalPages}
            </span>
            <div
              className="w-[30px] h-[30px] bg-[url('../assets/icon/arrow_Peach.png')] bg-center bg-fill cursor-pointer -rotate-90"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
