"use client";

import { useState } from "react";
import { BingoCard } from "@/components/BingoCard";
import { bingoCards, cardIds } from "@/data/bingoCards";
import { useBingoState } from "@/hooks/useBingoState";

export function BingoCardSelector() {
  const [activeCardId] = useState(cardIds[0]);
  const activeCard = bingoCards[activeCardId];

  const { getCardState, getCheckedCells, updateNote, resetCard } =
    useBingoState();

  return (
    <BingoCard
      cardData={activeCard}
      state={getCardState(activeCardId)}
      checkedCells={getCheckedCells(activeCardId, activeCard.freeSpaces)}
      onNoteChange={(index, note) => updateNote(activeCardId, index, note)}
      onReset={() => resetCard(activeCardId)}
    />
  );
}
