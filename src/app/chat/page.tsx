//chat/page.tsx
'use client';
import { ChatContainer } from "@/components/ProChat/ChatContainer";
import { useEffect, useState } from 'react';
import Loading from './loading';

export default function Page() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <Loading />;
  }

  return <ChatContainer /> ;
}

