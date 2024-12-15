# 📱 RGT

- ✏️ Web front-end S/W 개발 직무 면접 전 과제
- ⏱️ 프로젝트 기간: `2024/12/13 ~ 2023/12/15`
- ⛓️ 배포 링크: [프로젝트 결과물](https://rgt-task-12-13-mke9-livid.vercel.app/)
- 특이사항 : 모바일 반응형까진 작업하지못했음.

  <br>

  책 정보를 관리하고 판매 및 재고 데이터를 기록할 수 있는 도서 관리 시스템입니다. 사용자는 책의 기본 정보(제목, 저자, 출판사, 출판일 등)와 이미지, 판매 수량, 재고 수량을 효율적으로 관리할 수 있습니다. 주요 기능으로는 도서 정보 추가, 수정, 삭제와 Cloudinary API를 이용한 이미지 업로드 및 Redux 기반의 상태 관리가 포함되어 있습니다.

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

## 🌍서비스 배포 환경

- Vercel

<br>

# ✅ 주요 기능

## 1. 책 목록 페이지 구현

### 1. Google Books API 호출

- 주어진 ISBN 목록을 기반으로 /api/books 엔드포인트를 호출하여 책 정보를 가져옵니다.

<br>

### 2. 에러 처리

- API 호출 중 에러가 발생하면 이를 콘솔에 출력하고 사용자에게 메시지를 표시합니다.

<br>

### 3. Redux로 상태 저장

- API 호출 결과로 얻은 데이터를 Redux 상태 관리(store/booksSlice.tsx)에 저장합니다.

<br>

### 4. 로컬 스토리지 동기화

- 책 데이터를 로컬 스토리지에 저장하여 캐싱하거나 이후에 재사용할 수 있도록 합니다.

<br>

### 5. 로딩 상태 관리

- setLoading으로 API 호출 중인지 여부를 상태로 관리하여 사용자에게 로딩 상태를 시각적으로 전달할 수 있습니다.

<br>

### 6. Pagination 구현

- filterBooks.length와 booksPerPage로 총 페이지 수(totalPages)를 계산합니다.

- 현재 페이지(currentPage)와 booksPerPage에 따라 currentBooks를 슬라이싱하여 보여줄 데이터를 추출합니다.

- 이전/다음 버튼을 통해 페이지를 전환하며, 페이지 이동에 따른 상태 업데이트를 처리합니다.

<br>

### 7. 목록 UI 구현

- 각 책 데이터를 map 함수로 순회하며, Tailwind CSS를 활용해 반응형 그리드 레이아웃으로 책 목록을 표시합니다.

- 책 표지, 제목, 서브 타이틀, 저자, 출판사, 출판일자, 설명, 판매량, 남은 수량 등의 정보를 렌더링합니다.

- router.push를 이용해 상세 페이지로 이동할 수 있는 버튼을 구현합니다.

<br>

### 8. 검색어 입력 처리

- 사용자가 입력한 검색어(searchTerm)를 toLowerCase로 변환하여 대소문자 구분 없이 필터링을 수행합니다.
- 책 제목(title)과 저자(authors)를 검색어와 비교합니다.
- 저자 정보가 없는 경우 || ""로 기본값을 처리합니다.
- 검색어가 비어 있거나 공백만 포함된 경우, 전체 책 목록(books)을 반환합니다.
- 검색어가 포함된 책 제목 또는 저자를 기준으로 필터링된 결과를 반환합니다.
- useMemo를 사용하여 searchTerm나 books가 변경될 때만 필터링을 재계산합니다. 이로 인해 불필요한 렌더링을 방지합니다.

<br>

## 2. 책 상세 정보 페이지/뷰 구현

### 1. 데이터 로드 및 상태 관리

- params로 전달된 id 값을 기반으로 Redux에서 책(book)과 판매 정보(sale) 데이터를 로드합니다.
- useState로 각종 상태를 관리:
  - editableBook: 수정 가능한 책 정보.
  - salesCount & stockCount: 판매량 및 재고 수량.
  - newImage & isUploading: 이미지 업로드 상태.

<br>

### 2. 책 데이터 수정

- 사용자가 책 제목, 서브 타이틀, 저자, 판매량, 재고 수량을 수정 가능.
- 이미지 파일을 업로드하여 Cloudinary API를 통해 저장 후, 썸네일 URL 업데이트.

<br>

### 3. Redux 및 로컬 스토리지 업데이트

- 수정 완료 후, Redux의 updateBook 및 updateSale 액션을 통해 상태를 업데이트.
- 수정된 데이터를 localStorage에도 동기화.

<br>

## 3. 책 추가/제거 및 수량 조절 기능

### 1. 사용자 입력 데이터 관리

- useState를 사용해 책 정보 및 판매 데이터를 상태로 관리.
  - 책 정보: 제목, 서브타이틀, 저자, 출판사, 출판일, 설명, 이미지.
  - 판매 데이터: 판매 수량, 남은 수량.

<br>

### 2. 이미지 업로드

- 사용자가 이미지를 업로드하면 Cloudinary API를 통해 서버에 업로드한 후, 반환된 URL을 책 데이터에 추가.
- 업로드 진행 상태를 isUploading 상태로 관리하여 중복 요청 방지 및 사용자에게 상태를 표시.

<br>

### 3. Redux 상태 업데이트

- 입력된 데이터를 기반으로 Redux의 addBook 및 addSale 액션을 호출하여 새로운 책과 판매 데이터를 전역 상태에 추가.

<br>

### 4. 삭제 기능

- dispatch(removeBook(id))와 dispatch(removeSale(id))를 호출하여 Redux 상태에서 책과 판매 데이터를 제거.
- 책 목록과 판매 데이터를 필터링하여 삭제된 데이터를 제외한 새 목록을 localStorage 에 저장.

<br>

# 📋 폴더 구조

```
rgt-task
├─ .gitignore
├─ app
│  ├─ addBook
│  │  └─ page.tsx
│  ├─ api
│  │  └─ books
│  │     └─ route.ts
│  ├─ bookDetail
│  │  └─ [id]
│  │     ├─ edit
│  │     │  └─ page.tsx
│  │     └─ page.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ LocalBooksOnCLient.tsx
│  ├─ page.tsx
│  └─ scrollCss.css
├─ assets
│  └─ icon
│     ├─ arrow_Peach.png
│     ├─ search.svg
│     └─ settings.png
├─ components
│  └─ common
│     ├─ aside
│     │  └─ Aside.tsx
│     ├─ books
│     │  ├─ Books.tsx
│     │  └─ BooksSpinner.css
│     ├─ footer
│     │  └─ Footer.tsx
│     ├─ header
│     │  └─ Header.tsx
│     └─ profile
│        └─ ProfileSection.tsx
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ store
│  ├─ booksSlice.tsx
│  ├─ isbnSlice.tsx
│  ├─ saleSlice.tsx
│  ├─ store.tsx
│  └─ toggleSlice.tsx
├─ tailwind.config.ts
└─ tsconfig.json

```
