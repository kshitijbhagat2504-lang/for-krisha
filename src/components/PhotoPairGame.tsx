"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";




/* ---------------- CONFIG ---------------- */

const TOTAL_PAIRS = 18;

/* 18 unique images */
const baseImages = Array.from(
  { length: TOTAL_PAIRS },
  (_, i) => `/game-photos/${i + 1}.jpeg`
);

/* Heart layout: 36 visible slots */
const heartLayout = [
  [null, null, 0, 1, null, 2, 3, null, null],
  [null, 4, 5, 6, 7, 8, 9, 10, null],
  [11, 12, 13, 14, 15, 16, 17, 18, 19],
  [null, 20, 21, 22, 23, 24, 25, 26, null],
  [null, null, 27, 28, 29, 30, 31, null, null],
  [null, null, null, 32, 33, 34, null, null, null],
  [null, null, null, null, 35, null, null, null, null],
];

/* ---------------- TYPES ---------------- */

type PhotoPairGameProps = {
  handleShowProposal: () => void;
};

/* ---------------- COMPONENT ---------------- */

export default function PhotoPairGame({
  handleShowProposal,
}: PhotoPairGameProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [incorrect, setIncorrect] = useState<number[]>([]);
  


  /* 🔒 Shuffle ONCE and lock it */
  const [shuffledImages] = useState(() => {
    const imgs = [...baseImages, ...baseImages]; // 36
    for (let i = imgs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
    }
    return imgs;
  });

  useEffect(() => {
    console.log("IMAGES:", shuffledImages);
  }, []);

  const handleClick = async (cardIndex: number) => {
    if (
      selected.length === 2 ||
      selected.includes(cardIndex) ||
      matched.includes(cardIndex)
    )
      return;

    if (selected.length === 1) {
      const first = selected[0];
      setSelected([first, cardIndex]);

      if (shuffledImages[first] === shuffledImages[cardIndex]) {
        setMatched((prev) => [...prev, first, cardIndex]);
        setSelected([]);
      } else {
        setIncorrect([first, cardIndex]);
        setTimeout(() => {
          setIncorrect([]);
          setSelected([]);
        }, 800);
      }
    } else {
      setSelected([cardIndex]);
    }
  };

  /* Game completed */
 useEffect(() => {
  console.log("MATCHED:", matched.length);
  if (matched.length === shuffledImages.length) {
    handleShowProposal();
  }
}, [matched, shuffledImages.length, handleShowProposal]);


  /* ---------------- RENDER ---------------- */

  let cardCounter = 0;

  return (
  <div className="grid grid-cols-9 gap-1 lg:gap-2 max-w-[95vw] mx-auto place-items-center">


      {heartLayout.flat().map((slot, i) => {
        if (slot === null) {
          return (
            <div
              key={i}
              className="w-[11vh] h-[11vh] lg:w-20 lg:h-20"
            />
          );
        }

        const cardIndex = cardCounter;
        cardCounter++;

        return (
          <motion.div
            key={i}
            className="w-[11vh] h-[11vh] lg:w-20 lg:h-20 relative cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={() => handleClick(cardIndex)}
            style={{ perspective: "1000px" }}
          >
            {/* Card back */}
            {!selected.includes(cardIndex) &&
              !matched.includes(cardIndex) && (
                <div className="absolute inset-0 bg-gray-300 rounded-md" />
              )}

            {/* Card front */}
            {(selected.includes(cardIndex) ||
              matched.includes(cardIndex)) && (
              <motion.div
                className="absolute inset-0"
                initial={{ rotateY: -180 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.4 }}
                style={{ backfaceVisibility: "hidden" }}
              >
                <Image
                  src={shuffledImages[cardIndex]}
                  alt=""
                  fill
                  className="object-cover rounded-md"
                />
              </motion.div>
            )}

            {/* Incorrect animation */}
            {incorrect.includes(cardIndex) && (
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.1, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full h-full bg-red-500 rounded-md" />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
