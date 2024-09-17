import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  const data = await response.json();
  return data;
}

export default function Index() {
  return (
    <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
  );
}
