"use client";

import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Sale, updateSale } from "@/store/saleSlice";
import { BookData, updateBook } from "@/store/booksSlice";
import Image from "next/image";

const BookDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setId] = useState<string | null>(null);
  const [book, setBook] = useState<BookData | null>(null);
  const [sale, setSale] = useState<Sale | null>(null);

  const books = useSelector((state: RootState) => state.books.list || []);
  const sales = useSelector((state: RootState) => state.sales.sales || []);

  const dispatch = useDispatch();
  const router = useRouter();

  // 수정 가능한 상태
  const [editableBook, setEditableBook] = useState<
    Partial<BookData["volumeInfo"]>
  >({});
  const [salesCount, setSalesCount] = useState<number>(0);
  const [stockCount, setStockCount] = useState<number>(0);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // `params` 처리 및 데이터 설정
  useEffect(() => {
    params.then(({ id }) => {
      setId(id);

      const foundBook = books.find((book) => book.id === id) || null;
      const foundSale = sales.find((sale) => sale.id === id) || null;

      setBook(foundBook);
      setSale(foundSale);

      if (foundBook) setEditableBook({ ...foundBook.volumeInfo });
      if (foundSale) {
        setSalesCount(foundSale.salesCount);
        setStockCount(foundSale.stockCount);
      }
    });
  }, [params, books, sales]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);

      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append(
        "upload_preset",
        `${process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}`
      );

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_ID}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (data.secure_url) {
          setEditableBook((prev) => ({
            ...prev,
            imageLinks: { thumbnail: data.secure_url },
          }));
        } else {
          alert("이미지 업로드 실패. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("이미지 업로드 중 오류:", error);
        alert("이미지 업로드 중 오류가 발생했습니다.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!id) return;

    // Redux 상태 업데이트
    dispatch(
      updateBook({
        id,
        volumeInfo: editableBook,
      })
    );

    dispatch(
      updateSale({
        id,
        salesCount,
        stockCount,
      })
    );

    // localStorage 업데이트
    if (typeof window !== "undefined") {
      const updatedBooks = books.map((book) =>
        book.id === id ? { ...book, volumeInfo: editableBook } : book
      );
      localStorage.setItem("books", JSON.stringify(updatedBooks));
    }

    alert("수정 사항이 저장되었습니다!");
    router.push(`/bookDetail/${id}`);
  };

  const handleCancel = () => {
    router.push(`/bookDetail/${id}`);
  };

  if (!book) {
    return (
      <p className="text-center text-red-500">해당 책을 찾을 수 없습니다.</p>
    );
  }

  return (
    <div className="w-full sm:h-[calc(100vh-130px)] h-full flex md:flex-row xs:flex-col items-center gap-12 2xl:pl-[240px] 2xl:pr-[240px] xl:pl-[160px] xl:pr-[160px] pb-[150px] lg:pl-[120px] lg:pr-[120px] xxs:pl-[24px] xxs:pr-[24px] overflow-x-hidden relative mt-12">
      {isUploading ? (
        <p className="text-center text-blue-500">이미지를 업로드 중입니다...</p>
      ) : (
        editableBook.imageLinks?.thumbnail && (
          <Image
            src={editableBook.imageLinks.thumbnail}
            alt="Preview"
            className="w-[400px] h-[600px] shadow-lg"
            width={400}
            height={600}
          />
        )
      )}
      <div className="flex flex-col gap-6 w-[300px]">
        <label className="flex flex-col gap-2">
          <span>책 제목:</span>
          <input
            type="text"
            value={editableBook.title || ""}
            onChange={(e) =>
              setEditableBook((prev) => ({ ...prev, title: e.target.value }))
            }
            className="border rounded px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span>서브타이틀:</span>
          <input
            type="text"
            value={editableBook.subtitle || ""}
            onChange={(e) =>
              setEditableBook((prev) => ({ ...prev, subtitle: e.target.value }))
            }
            className="border rounded px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span>저자:</span>
          <input
            type="text"
            value={editableBook.authors?.join(", ") || ""}
            onChange={(e) =>
              setEditableBook((prev) => ({
                ...prev,
                authors: e.target.value
                  .split(",")
                  .map((author) => author.trim()),
              }))
            }
            className="border rounded px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span>이미지 교체:</span>
          <input
            type="file"
            onChange={handleImageChange}
            className="border rounded px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span>판매 수량:</span>
          <input
            type="number"
            value={salesCount}
            onChange={(e) => setSalesCount(Number(e.target.value))}
            className="border rounded px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span>남은 수량:</span>
          <input
            type="number"
            value={stockCount}
            onChange={(e) => setStockCount(Number(e.target.value))}
            className="border rounded px-2 py-1"
          />
        </label>
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            저장
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
