/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form } from "@remix-run/react";
import { useState } from "react";

export default function UpdateBookForm({
  book,
  onClose,
}: {
  book: any;
  onClose: any;
}) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  return (
    <div className="overlay">
      <div className="modal">
        <h2>Update Book</h2>
        <Form method="patch" action={"/books?id=" + book.id}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <br />
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          <br />
          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </Form>
      </div>
    </div>
  );
}