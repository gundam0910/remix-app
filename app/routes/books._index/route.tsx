import { Form, json, redirect, useLoaderData } from '@remix-run/react';
import CreateBookForm from '../../components/createForm';
import UpdateBookForm from '../../components/updateForm';
import { useState } from 'react';
import { db } from "~/utils/db.server";

export const loader = async () => {
  const response = await db.book.findMany({
    orderBy: { createdAt: "desc" },
      select: { id: true, title: true, author: true},
      take: 5,
  });
  const data: { id: string; title: string; author: string; }[] = response;
  console.log('data :>> ', data);
  return json({ books: data});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function action({ request }: { request: any }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const author = formData.get("author");
  const description = 'sample description';
  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  if (
    typeof title !== 'string' ||
    typeof author !== 'string' ||
    typeof description !== 'string'
  ) {
    throw new Error("Form not submitted correctly.");
  }

  const fields = { title, author, description };
  const bookData = await db.book.create({ data: fields});
  console.log('bookData :>> ', bookData);
  return redirect("/books");
}

export default function Book() {
  const {books} = useLoaderData<typeof loader>();
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateClick = (book: any) => {
    setSelectedBook(book);
    setShowUpdateForm(true);
  };
  
  return (
    <div className="container mx-auto px-4">
      <div className="books">
        <h1>Books</h1>
        <CreateBookForm />
        <ul className="books-list divide-y divide-gray-100">
          {books?.map((book) => (
            <li key={book.id} className="book-item flex justify-between gap-x-6 py-5">
              <div className="min-w-0 flex-auto">
                <div className="book-title">{book.title}</div>
                <div className="book-author">by {book.author}</div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <div className="book-buttons">
                  <Form method="delete" action={"/books?id=" + book.id}>
                    <button type="submit">Delete</button>
                  </Form>
                  <button onClick={() => handleUpdateClick(book)}>Update</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {showUpdateForm && (
          <UpdateBookForm
            book={selectedBook}
            onClose={() => setShowUpdateForm(false)}
          />
        )}
      </div>
    </div>
  );
}