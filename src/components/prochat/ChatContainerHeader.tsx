import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PenLine } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onNewChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewChat,
}) => {
  return (
    <header className="flex justify-between items-center p-2 sm:p-4 sticky top-0 bg-[#2F2D2D] z-10">
      <div className="flex items-center gap-2">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/assets/pawa-logo.png"
              height={50}
              width={69}
              alt="Pawa Logo"
              className="w-14 h-10 md:w-14 md:h-10 lg:w-16 lg:h-12 max-[300px]:h-8 max-[300px]:w-10"
            />
            <span className="text-[#FFA200] font-semibold text-base sm:text-lg hidden sm:inline">
              Pawa Chat
            </span>
          </div>
        </Link>
      </div>

      <h1 className="text-lg font-semibold flex items-center">
        <span
          className="text-gray-300 truncate max-w-[50vw] sm:max-w-xs md:max-w-sm lg:max-w-md"
          style={{ fontFamily: "Avenir-Medium" }}
        >
          New Chat
        </span>
      </h1>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="outline"
          onClick={onNewChat}
          className="text-white border-zinc-600 flex items-center gap-2 px-2 sm:px-4 h-8 sm:h-10"
        >
          <span
            className="hidden sm:inline"
            style={{ fontFamily: "Avenir-Medium" }}
          >
            New Chat
          </span>
          <PenLine className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>

        <Link href="/dev">
          <Button
            variant="outline"
            className="border-[#DC8F0A] text-white px-2 sm:px-4 h-8 sm:h-10"
          >
            <span
              className="hidden sm:inline"
              style={{ fontFamily: "Avenir-Medium" }}
            >
              Build your Ai
            </span>
            <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </Link>
      </div>
    </header>
  );
};
