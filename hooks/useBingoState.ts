"use client";

import { useState, useCallback, useEffect } from "react";
import { cardIds } from "@/data/bingoCards";

export type CellState = {
  note: string;
};

export type BingoState = {
  cells: CellState[];
};

export type AllCardsState = Record<string, BingoState>;

const STORAGE_KEY = "bingo-state";

const getInitialCardState = (): BingoState => ({
  cells: Array(25)
    .fill(null)
    .map(() => ({
      note: "",
    })),
});

// Initialize state for all cards
const getInitialAllCardsState = (): AllCardsState => {
  const state: AllCardsState = {};
  for (const cardId of cardIds) {
    state[cardId] = getInitialCardState();
  }
  return state;
};

const loadState = (): AllCardsState => {
  if (typeof window === "undefined") return getInitialAllCardsState();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getInitialAllCardsState();
    const parsed = JSON.parse(stored) as AllCardsState;
    // Merge with defaults to handle new cards added after storage was saved
    const defaults = getInitialAllCardsState();
    for (const cardId of cardIds) {
      if (!parsed[cardId]) {
        parsed[cardId] = defaults[cardId];
      }
    }
    return parsed;
  } catch {
    return getInitialAllCardsState();
  }
};

export function useBingoState() {
  const [allCardsState, setAllCardsState] = useState<AllCardsState>(getInitialAllCardsState);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage after mount to avoid SSR hydration mismatch
  useEffect(() => {
    setAllCardsState(loadState());
    setHydrated(true);
  }, []);

  // Persist to localStorage on state changes (skip initial server-rendered state)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allCardsState));
    } catch {
      // Storage full or unavailable — silently ignore
    }
  }, [allCardsState, hydrated]);

  const updateNote = useCallback((cardId: string, index: number, note: string) => {
    setAllCardsState((prev) => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        cells: prev[cardId].cells.map((cell, i) =>
          i === index ? { ...cell, note } : cell
        ),
      },
    }));
  }, []);

  const resetCard = useCallback((cardId: string) => {
    setAllCardsState((prev) => ({
      ...prev,
      [cardId]: getInitialCardState(),
    }));
  }, []);

  const getCheckedCells = useCallback((cardId: string, freeSpaces: number[]) => {
    const cardState = allCardsState[cardId] ?? getInitialCardState();
    const freeSet = new Set(freeSpaces);
    return cardState.cells.map((cell, index) => {
      if (freeSet.has(index)) return true;
      return cell.note.trim().length > 0;
    });
  }, [allCardsState]);

  const getCardState = useCallback((cardId: string) => {
    return allCardsState[cardId] ?? getInitialCardState();
  }, [allCardsState]);

  return {
    allCardsState,
    getCardState,
    getCheckedCells,
    updateNote,
    resetCard,
  };
}

