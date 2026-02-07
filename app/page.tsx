"use client";

import { useState } from "react";
import PhotoPairGame from "@/components/PhotoPairGame";
import ValentinesProposal from "@/components/ValentinesProposal";

export default function Home() {
  const [showProposal, setShowProposal] = useState(false);

  return (
    <main className="min-h-screen px-8">
      {!showProposal ? (
        /* -------- GAME SCREEN -------- */
        <div className="flex min-h-screen items-center justify-center gap-12">
          {/* LEFT TEXT */}
          <div className="max-w-md text-white">
            <h1 className="text-4xl font-serif mb-4">
              match the photos for a surprise :p
            </h1>
            <p className="opacity-80">
              (ik its dysfunctional dont complain 😡) 
            </p>
          </div>

          {/* HEART GAME */}
          <PhotoPairGame
            handleShowProposal={() => setShowProposal(true)}
          />
        </div>
      ) : (
        /* -------- PROPOSAL SCREEN -------- */
        <div className="min-h-screen flex items-center justify-center text-center px-4">
          <ValentinesProposal />
        </div>
      )}
    </main>
  );
}
