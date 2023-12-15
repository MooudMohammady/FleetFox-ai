/* eslint-disable @next/next/no-img-element */
"use client";
import { MarkDownDefault } from "@/utils/MarkDown";
import Image from "next/image";
import React, { LegacyRef, MutableRefObject, createElement, useEffect, useRef, useState } from "react";
import Markdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
// import { fakeChat } from "@/data/fakeChat";
import axios from "axios";
import Typing from "react-typing-effect";

type MessageType = {
  bot: boolean;
  message: string;
};

export default function Chat() {
  const [textAreaHeight, setTextAreaHeight] = useState(52);
  const [messages, setMessages] = useState<MessageType[] | []>([]);
  const [loading, setLoading] = useState(false);

  const chatsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatsContainerRef.current?.scrollTo(
      0,
      chatsContainerRef.current.scrollHeight
    );
  }, [messages]);

  const submitMessage = async (question: string) => {
    setLoading(true);
    setMessages([...messages, { bot: false, message: question }]);
    await axios
      .post("/api/chat", {
        question: question,
      })
      .then((res) => {
        console.log(res);
        setMessages((m) => [...m, { bot: true, message: res.data.answer }]);
        chatsContainerRef.current?.scrollTo(
          0,
          chatsContainerRef.current.scrollHeight
        );
      });
    setLoading(false);
  };

  const inputKeyDownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      setTextAreaHeight(52);
      submitMessage(e.currentTarget.value);
      e.currentTarget.value = "";
    }
    if (e.shiftKey && e.key === "Enter" && +e.currentTarget.style.height.split('px')[0] < 196) {
      setTextAreaHeight(textAreaHeight + 24);
    }
    if (
      textAreaHeight > 52 &&
      e.key === "Backspace" &&
      e.currentTarget.value.replace(/\s/g, "") === ""
    ) {
      setTextAreaHeight(textAreaHeight - 24);
    }
  };

  return (
    <>
      <div role="presentation" className="flex h-full flex-col">
        <div
          className="flex-1 overflow-auto chat-scrollbar"
          ref={chatsContainerRef}>
          <div className="sticky top-0 mb-1.5 flex items-center justify-between z-10 h-14 bg-white/95 p-2 font-semibold dark:bg-zinc-800/90">
            <div className="flex items-center gap-2">
              <div
                className="group flex cursor-pointer items-center gap-1 rounded-xl py-2 px-3 text-lg font-medium hover:bg-zinc-50 radix-state-open:bg-zinc-50 dark:hover:bg-black/10 dark:radix-state-open:bg-black/20"
                id="radix-:r1l:"
                aria-haspopup="menu"
                aria-expanded="false"
                data-state="closed">
                <div>
                  v <span className="text-token-text-secondary">0.1</span>
                </div>
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  className="text-token-text-tertiary">
                  <path
                    d="M11.3346 7.83203L8.00131 11.1654L4.66797 7.83203"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"></path>
                </svg>
              </div>
            </div>
            <div className="flex gap-2 pr-1"></div>
          </div>
          <div className="relative h-full">
            {messages && messages.length > 0 ? (
              <div className="flex flex-col gap-5 pb-10 mx-auto max-w-4xl">
                {messages.map((m, i) =>
                  m.bot ? (
                    <div
                      key={i}
                      className="flex flex-1 text-base gap-2 px-5 lg:px-10 xl:px-10 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] group">
                      <div>
                        <Image
                          src={"/images/logo.svg"}
                          width={30}
                          height={30}
                          alt="avatar"
                          className="rounded-full"
                        />
                      </div>
                      <div className="bg-border-gradient border border-transparent p-2 rounded-lg rounded-tl-none shadow-md">
                        <div className="mb-1 font-bold">FleetFox</div>
                        <Typing
                          text={[m.message]}
                          cursor=" "
                          speed={50}
                          eraseDelay={9999999}
                          typingDelay={0}
                          displayTextRenderer={(text) => (
                            <Markdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw]}
                              className="h-full overflow-y-auto break-words"
                              components={
                                MarkDownDefault as Partial<Components>
                              }>
                              {text}
                            </Markdown>
                          )}></Typing>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={i}
                      className="flex flex-1 text-base gap-2 px-5 lg:px-10 xl:px-10 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] group">
                      <div>
                        <Image
                          src={"/images/avatar.jpg"}
                          width={30}
                          height={30}
                          alt="avatar"
                          className="rounded-full"
                        />
                      </div>
                      <div className="bg-zinc-700 p-2 rounded-lg rounded-tl-none shadow-md">
                        <div className="mb-1 font-bold">You</div>
                        <Markdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          className="h-full overflow-y-auto break-words whitespace-pre-line"
                          components={MarkDownDefault as Partial<Components>}>
                          {m.message}
                        </Markdown>
                      </div>
                    </div>
                  )
                )}
                {loading ? (
                  <div className="flex flex-1 text-base gap-2 px-5 lg:px-10 xl:px-10 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] group">
                    <div>
                      <Image
                        src={"/images/logo.svg"}
                        width={30}
                        height={30}
                        alt="avatar"
                        className="rounded-full"
                      />
                    </div>
                    <div className="bg-border-gradient border border-transparent p-2 rounded-lg rounded-tl-none shadow-md">
                      <div className="mb-1 font-bold">FleetFox</div>
                      <img
                        src="/images/loading.svg"
                        alt="loading..."
                        className="w-10"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center">
                <div className="relative">
                  <div className="mb-3 h-[72px] w-[72px]">
                    <div className="gizmo-shadow-stroke relative flex h-full items-center justify-center rounded-full bg-white text-black">
                      <img src="/images/logo.svg" alt="FleetFox" />
                    </div>
                  </div>
                </div>
                <div className="mb-5 text-2xl font-medium">
                  How can I help you today?
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full pt-2 md:pt-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:w-[calc(100%-.5rem)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              //@ts-ignore
              submitMessage(e.target?.elements[0]!.value);
            }}
            className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
            <div className="relative flex h-full flex-1 items-stretch md:flex-col">
              <div className="flex w-full items-center">
                <div className="overflow-hidden [&:has(textarea:focus)]:border-token-border-xheavy [&:has(textarea:focus)]:shadow-[0_2px_6px_rgba(0,0,0,.05)] flex flex-col w-full dark:border-token-border-heavy flex-grow relative border border-token-border-heavy dark:text-white rounded-2xl bg-white dark:bg-zinc-800 shadow-[0_0_0_2px_rgba(255,255,255,0.95)] dark:shadow-[0_0_0_2px_rgba(52,53,65,0.95)]">
                  <textarea
                    id="prompt-textarea"
                    tabIndex={0}
                    data-id="root"
                    rows={1}
                    disabled={loading}
                    onKeyDown={inputKeyDownHandler}
                    style={{ height: textAreaHeight, maxHeight: 200 }}
                    placeholder="Type message for FleetFox…"
                    className="m-0 w-full resize-none border-0 bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:py-3.5 md:pr-12 placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4 whitespace-pre-line"></textarea>
                  <button
                    disabled={loading}
                    className="absolute md:bottom-3 md:right-3 dark:hover:opacity-70 transition dark:disabled:hover:bg-transparent right-2 dark:disabled:bg-white disabled:bg-black disabled:opacity-10 disabled:text-zinc-400 enabled:bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-0.5 border border-black rounded-lg dark:border-yellow-400 dark:bg-white bottom-1.5"
                    data-testid="send-button">
                    <span className="" data-state="closed">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-white">
                        <path
                          d="M7 11L12 6L17 11M12 18V7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div className="relative px-2 py-2 text-center text-xs text-zinc-600 dark:text-zinc-300 md:px-[60px]">
            <span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                FleetFox
              </span>{" "}
              can make mistakes. Consider checking important information.
            </span>
          </div>
        </div>
      </div>
      <div className="group fixed bottom-3 right-3 z-10 hidden gap-1 lg:flex">
        <div className="group relative" data-headlessui-state="">
          <button
            className="flex items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-200"
            id="headlessui-menu-button-:r1o:"
            type="button"
            aria-haspopup="true"
            aria-expanded="false"
            data-headlessui-state="">
            <div className="flex h-6 w-6 items-center justify-center text-xs">
              ?
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
