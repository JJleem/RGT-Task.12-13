"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addSale } from "@/store/saleSlice";
import { addBook } from "@/store/booksSlice";
import { useRouter } from "next/navigation";

const AddBookPage = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [salesCount, setSalesCount] = useState<number>(0);
  const [stockCount, setStockCount] = useState<number>(0);

  const dispatch = useDispatch();
  const router = useRouter();

  // Cloudinary 이미지 업로드 함수
  const handleImageUpload = async (): Promise<string> => {
    if (!image) return "";

    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || ""
    );

    setIsUploading(true);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_ID}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("이미지 업로드 실패");

      const data = await response.json();
      return data.secure_url || "";
    } catch (error) {
      console.error("이미지 업로드 중 오류:", error);
      return "";
    } finally {
      setIsUploading(false);
    }
  };

  // 새 책과 판매 데이터 추가 함수
  const handleAddBook = async () => {
    const imageUrl = await handleImageUpload();

    const newBook = {
      id: crypto.randomUUID(),
      volumeInfo: {
        title,
        subtitle,
        authors: authors.split(",").map((author) => author.trim()),
        publisher,
        publishedDate,
        description,
        imageLinks: imageUrl ? { thumbnail: imageUrl } : undefined,
      },
    };

    const newSale = {
      id: newBook.id,
      salesCount: Math.max(0, salesCount),
      stockCount: Math.max(0, stockCount),
    };

    dispatch(addBook(newBook));
    dispatch(addSale(newSale));

    alert("책이 성공적으로 추가되었습니다!");
    router.push("/");
  };

  return (
    <div className="w-full sm:h-[calc(100vh)] h-full flex flex-col items-center gap-6 py-12 px-6 overflow-x-hidden relative">
      <h1 className="text-2xl font-bold">책 추가하기</h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        {/* 책 정보 입력 폼 */}
        <label>
          <span>책 제목:</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </label>
        <label>
          <span>서브타이틀:</span>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </label>
        <label>
          <span>저자:</span>
          <input
            type="text"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            placeholder="쉼표(,)로 구분하여 입력"
            className="w-full border rounded px-2 py-1"
          />
        </label>
        <label>
          <span>출판사:</span>
          <input
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </label>
        <label>
          <span>출판일:</span>
          <input
            type="date"
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </label>
        <label>
          <span>설명:</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </label>
        <label>
          <span>이미지:</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setImage(e.target.files[0])}
            className="w-full"
          />
        </label>
        {/* 판매 데이터 입력 */}
        <label>
          <span>판매 수량:</span>
          <input
            type="number"
            value={salesCount}
            onChange={(e) => setSalesCount(Number(e.target.value))}
            className="w-full border rounded px-2 py-1"
          />
        </label>
        <label>
          <span>남은 수량:</span>
          <input
            type="number"
            value={stockCount}
            onChange={(e) => setStockCount(Number(e.target.value))}
            className="w-full border rounded px-2 py-1"
          />
        </label>
        {/* 제출 버튼 */}
        <button
          onClick={handleAddBook}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded"
          disabled={isUploading || !title.trim()}
        >
          {isUploading ? "이미지 업로드 중..." : "책 추가하기"}
        </button>
      </div>
    </div>
  );
};

export default AddBookPage;
