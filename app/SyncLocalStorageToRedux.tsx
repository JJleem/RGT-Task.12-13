import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBooks } from "@/store/booksSlice";

const SyncLocalStorageToRedux = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("books");
      if (data) {
        dispatch(setBooks(JSON.parse(data)));
      }
    }
  }, [dispatch]);

  return null;
};

export default SyncLocalStorageToRedux;
