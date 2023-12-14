'use client';
import NavLink from "@/components/ui/NavLink";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function Chat() {

  const [textAreaHeight, setTextAreaHeight] = useState(52)

  const inputKeyDownHandler = (e:React.KeyboardEvent<HTMLTextAreaElement>)=>{
    if(e.shiftKey && e.key === 'Enter'){
      setTextAreaHeight(textAreaHeight + 24)
    }    
    if(textAreaHeight > 52 && e.key === "Backspace" && e.currentTarget.value.replace(/\s/g, '') === ''){
      setTextAreaHeight(textAreaHeight - 24)
    }
  }

  return (
    <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
      <main className="relative h-full w-full flex-1 overflow-auto transition-width">
        <div role="presentation" className="flex h-full flex-col">
          <div className="flex-1 overflow-hidden">
            <div className="relative h-full">
              <div className="absolute left-0 right-0">
                <div className="sticky top-0 mb-1.5 flex items-center justify-between z-10 h-14 bg-white/95 p-2 font-semibold dark:bg-zinc-800/90">
                  <div className="flex items-center gap-2">
                    <div
                      className="group flex cursor-pointer items-center gap-1 rounded-xl py-2 px-3 text-lg font-medium hover:bg-zinc-50 radix-state-open:bg-zinc-50 dark:hover:bg-black/10 dark:radix-state-open:bg-black/20"
                      id="radix-:r1l:"
                      aria-haspopup="menu"
                      aria-expanded="false"
                      data-state="closed">
                      <div>
                        v{" "}
                        <span className="text-token-text-secondary">0.1</span>
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
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="flex gap-2 pr-1"></div>
                </div>
              </div>
              <div className="flex h-full flex-col items-center justify-center">
                <div className="relative">
                  <div className="mb-3 h-[72px] w-[72px]">
                    <div className="gizmo-shadow-stroke relative flex h-full items-center justify-center rounded-full bg-white text-black">
                      <img src="/images/logo.svg"/>
                    </div>
                  </div>
                </div>
                <div className="mb-5 text-2xl font-medium">
                  How can I help you today?
                </div>
              </div>
            </div>
          </div>
          <div className="w-full pt-2 md:pt-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:w-[calc(100%-.5rem)]">
            <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
              <div className="relative flex h-full flex-1 items-stretch md:flex-col">
                <div className="flex w-full items-center">
                  <div className="overflow-hidden [&amp;:has(textarea:focus)]:border-token-border-xheavy [&amp;:has(textarea:focus)]:shadow-[0_2px_6px_rgba(0,0,0,.05)] flex flex-col w-full dark:border-token-border-heavy flex-grow relative border border-token-border-heavy dark:text-white rounded-2xl bg-white dark:bg-zinc-800 shadow-[0_0_0_2px_rgba(255,255,255,0.95)] dark:shadow-[0_0_0_2px_rgba(52,53,65,0.95)]">
                    <textarea
                      id="prompt-textarea"
                      tabIndex={0}
                      data-id="root"
                      rows={1}
                      onKeyDown={inputKeyDownHandler}
                      style={{height:textAreaHeight,maxHeight:200}}
                      placeholder="Message FleetFox…"
                      className="m-0 w-full resize-none border-0 bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:py-3.5 md:pr-12 placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4"></textarea>
                    <button
                      className="absolute md:bottom-3 md:right-3 dark:hover:opacity-70 transition dark:disabled:hover:bg-transparent right-2 dark:disabled:bg-white disabled:bg-black disabled:opacity-10 disabled:text-zinc-400 enabled:bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-0.5 border border-black rounded-lg dark:border-yellow-400 dark:bg-white bottom-1.5 transition-colors"
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
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div className="relative px-2 py-2 text-center text-xs text-zinc-600 dark:text-zinc-300 md:px-[60px]">
              <span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">FleetFox</span> can make mistakes. Consider checking important
                information.
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
      </main>
    </div>
  );
}
