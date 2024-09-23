"use client";

import React from "react";

import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-[calc(100dvh)] flex-col justify-center items-center ">
      <div className="flex w-64 flex-col items-center gap-4 ">
        <Link href="/sql" className="w-full">
          <Button className="w-full"> SQL</Button>
        </Link>
        <Link href="/documents" className="w-full">
          <Button className="w-full">Documents</Button>
        </Link>
        <Link href="/excel" className="w-full">
          <Button className="w-full">Exel</Button>
        </Link>
      </div>
    </main>
  );
}
