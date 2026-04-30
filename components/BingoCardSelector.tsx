"use client";

import { useState } from "react";
import { BingoCard } from "@/components/BingoCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bingoCards, cardIds } from "@/data/bingoCards";
import { useBingoState } from "@/hooks/useBingoState";

export function BingoCardSelector() {
  const [activeCardId, setActiveCardId] = useState(cardIds[0]);
  const activeCard = bingoCards[activeCardId];

  const { getCardState, getCheckedCells, updateNote, resetCard } =
    useBingoState();

  const showTabs = cardIds.length > 1;

  const cardContent = (cardId: string) => {
    const card = bingoCards[cardId];
    return (
      <BingoCard
        cardData={card}
        state={getCardState(cardId)}
        checkedCells={getCheckedCells(cardId, card.freeSpaces)}
        onNoteChange={(index, note) => updateNote(cardId, index, note)}
        onReset={() => resetCard(cardId)}
      />
    );
  };

  if (!showTabs) {
    return cardContent(activeCardId);
  }

  return (
    <Tabs value={activeCardId} onValueChange={setActiveCardId}>
      <TabsList className="w-full">
        {cardIds.map((cardId) => (
          <TabsTrigger key={cardId} value={cardId} className="flex-1">
            {bingoCards[cardId].name}
          </TabsTrigger>
        ))}
      </TabsList>
      {cardIds.map((cardId) => (
        <TabsContent key={cardId} value={cardId}>
          {cardContent(cardId)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
