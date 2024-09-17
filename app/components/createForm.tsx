import {Form} from "@remix-run/react";

export default function CreateBookForm() {
    return (
      <Form method="post">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" required />
        <br />
        <label htmlFor="author">Author</label>
        <input type="text" id="author" name="author" required />
        <br />
        <button type="submit">Create</button>
      </Form>
    );
  }