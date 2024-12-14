import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadBooksFromLocalStorage, setBooks } from "@/store/booksSlice";

const LOCAL_STORAGE_KEY = "books";

const LoadBooksOnClient = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedBooks = loadBooksFromLocalStorage();
    if (storedBooks.length > 0) {
      dispatch(setBooks(storedBooks));
    }
  }, [dispatch]);

  return null;
};

export default LoadBooksOnClient;
