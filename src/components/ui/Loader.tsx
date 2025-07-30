import React from "react";
import Image from "next/image";

export const LoadingDots: React.FC = () => {
  return (
    <div className="flex flex-col bg-[#1c1a1a] items-center justify-center space-y-1 rounded-[5px] py-1 px-2 shadow-lg">
      <div className="w-6 h-6 relative">
        <Image
          src="/assets/pawa-logo.png"
          alt="Loading Logo"
          fill
          sizes="24px"
          objectFit="contain"
        />
      </div>

      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-[#FFA200] rounded-full animate-bounce delay-0"></div>
        <div className="w-1.5 h-1.5 bg-[#FFA200] rounded-full animate-bounce delay-100"></div>
        <div className="w-1.5 h-1.5 bg-[#FFA200] rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  );
};
