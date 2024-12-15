# 📱 RGT

- ✏️ Web front-end S/W 개발 직무 면접 전 과제
- ⏱️ 프로젝트 기간: `2024/12/13 ~ 2023/12/15`
- ⛓️ 배포 링크: [프로젝트 결과물](https://rgt-task-12-13-mke9-livid.vercel.app/)

<br />

# 📝 Routing 구조

1. "/" : 책 목록 페이지 구현
2. "/bookDetail/[id]" : 책 상세 정보 페이지/뷰 구현
3. "/bookDetail/[id]/edit" : 책 정보 수정 페이지 구현
4. "/addBook" : 책 추가 페이지 구현

<br />

# 🎩 Tech Stack

## 📤 FrontEnd

|                                                                                    TypeScript                                                                                     |                                                                                       Next                                                                                       |                                                                                    Redux                                                                                     |                                                                                    TailwindCss                                                                                     |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <div style="display: flex; align-items: flex-start; justify-content: center;"><img src="https://cdn.simpleicons.org/typescript/3178C6" alt="icon" width="75" height="75" /></div> | <div style="display: flex; align-items: flex-start; justify-content: center;"><img src="https://cdn.simpleicons.org/nextdotjs/000000" alt="icon" width="75" height="75" /></div> | <div style="display: flex; align-items: flex-start; justify-content: center;"><img src="https://cdn.simpleicons.org/redux/764abc" alt="icon" width="75" height="75" /></div> | <div style="display: flex; align-items: flex-start; justify-content: center;"><img src="https://cdn.simpleicons.org/tailwindcss/06b6d4" alt="icon" width="75" height="75" /></div> |

<br />

# ✅ 주요 기능

## 책 목록 페이지 구현

# 1. Google Books API 호출

- 주어진 ISBN 목록을 기반으로 /api/books 엔드포인트를 호출하여 책 정보를 가져옵니다.

<br>

# 2. 에러 처리

- API 호출 중 에러가 발생하면 이를 콘솔에 출력하고 사용자에게 메시지를 표시합니다.

<br>

# 3. Redux로 상태 저장

- API 호출 결과로 얻은 데이터를 Redux 상태 관리(store/booksSlice.tsx)에 저장합니다.

<br>

# 4. 로컬 스토리지 동기화

- 책 데이터를 로컬 스토리지에 저장하여 캐싱하거나 이후에 재사용할 수 있도록 합니다.

<br>

# 5. 로딩 상태 관리

- setLoading으로 API 호출 중인지 여부를 상태로 관리하여 사용자에게 로딩 상태를 시각적으로 전달할 수 있습니다.

<br>

# 6. Pagination 구현

- filterBooks.length와 booksPerPage로 총 페이지 수(totalPages)를 계산합니다.
- 현재 페이지(currentPage)와 booksPerPage에 따라 currentBooks를 슬라이싱하여 보여줄 데이터를 추출합니다. -이전/다음 버튼을 통해 페이지를 전환하며, 페이지 이동에 따른 상태 업데이트를 처리합니다.

<br>

```bash
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
```

<br>
