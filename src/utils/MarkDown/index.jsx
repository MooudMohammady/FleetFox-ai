/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export const MarkDownDefault = {
  a: ({ node, children, ...props }) => (
    <a
      {...props}
      className="text-blue-500 hover:text-blue-400"
      style={{ textDecoration: "1px solid blue underline" }}>
      {children}
    </a>
  ),
  pre: ({ node, children, ...props }) => (
    <pre {...props} className="rounded-lg overflow-hidden">
      {children}
    </pre>
  ),
  ol: ({ node, children, ...props }) => (
    <ol {...props} className="list-decimal px-4 ms-2">
      {children}
    </ol>
  ),
  ul: ({ node, children, ...props }) => (
    <ul {...props} className="list-disc px-4 ms-2">
      {children}
    </ul>
  ),
  h1: ({ node, children, ...props }) => (
    <h1 {...props} className="text-3xl py-3 mb-3 border-b border-b-slate-500/50">
      {children}
    </h1>
  ),
  h2: ({ node, children, ...props }) => (
    <h2 {...props} className="text-2xl py-3 mb-3 border-b border-b-slate-500/50">
      {children}
    </h2>
  ),
  h3: ({ node, children, ...props }) => (
    <h3 {...props} className="text-xl py-3 mb-3 border-b border-b-slate-500/50">
      {children}
    </h3>
  ),
  img: ({ node, children, ...props }) => (
    <img {...props} className="w-full sm:w-1/2 p-2"/>
  ),
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        {...props}
        style={materialDark}
        language={match[1]}
        PreTag="div" dir='ltr' className='rounded-lg'>
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code {...props} className={`${className} bg-slate-500/50 px-1 py-[2px] rounded-md`}>
        {children}
      </code>
    );
  },
};
