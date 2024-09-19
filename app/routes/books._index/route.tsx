import { Form, json, useLoaderData } from '@remix-run/react';
import { LinksFunction } from '@remix-run/node';
import { useState } from 'react';
import { jsonWithSuccess, jsonWithError } from "remix-toast";

import {getBooks, createBook, deleteBook, updateBook} from '../../controllers/books'
import CreateBookForm from '../../components/createForm';
import UpdateBookForm from '../../components/updateForm';
import "./formOverlay.css?url";

export const loader = async () => {
  const response = await getBooks();
  const data: { id: string; title: string; author: string; }[] = response;
  return json({ books: data });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function action({ request }: { request: any }) {
  console.log('request.method', request.method)
  if (request.method === "DELETE") {
    const url = new URL(request.url);
    const bookId = url.searchParams.get("id");
    if (bookId) {
      const bookData = await deleteBook(bookId);
      if (bookData) {
        return jsonWithSuccess({ result: "Data saved successfully" }, { message: "You have successfully deleted!"}); 
      } else {
        return jsonWithError(null, "Delete failed.");
      }
    }
    
  } else if (request.method === "PATCH") {
    const url = new URL(request.url);
    const bookId = url.searchParams.get("id");
    const formData = await request.formData();
    const title = formData.get("title");
    const author = formData.get("author");
    const description = formData.get("description");

    if (
      typeof title !== 'string' ||
      typeof author !== 'string'
    ) {
      return jsonWithError(null, "Form not submitted correctly.");
    }

    const fields = { title, author, description };
    if (!bookId) return jsonWithError(null, "Not valid book id.");
    const bookData = await updateBook(bookId, fields);
    if (bookData) {
      return jsonWithSuccess({ result: "Data updated successfully" }, { message: "You have successfully updated!"}); 
    } else {
      return jsonWithError(null, "Fail to update book.");
    }
  } else {
    const formData = await request.formData();
    const title = formData.get("title");
    const author = formData.get("author");
    const description = formData.get("description");

    if (
      typeof title !== 'string' ||
      typeof author !== 'string'
    ) {
      return jsonWithError(null, "Form not submitted correctly.");
    }

    const fields = { title, author, description };
    const bookData = await createBook(fields);
    if (bookData) {
      return jsonWithSuccess({ result: "Data saved successfully" }, { message: "You have successfully created!"}); 
    } else {
      return jsonWithError(null, "Fail to create book.");
    }
    
  }
}

export default function Book() {
  const {books } = useLoaderData<typeof loader>();

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateClick = (book: any) => {
    setSelectedBook(book);
    setShowUpdateForm(true);
  };

  return (
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
  );
}
