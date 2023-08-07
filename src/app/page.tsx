"use client";

import { useState, useCallback, SyntheticEvent, useEffect } from "react";
import clsx from "clsx";
import { GitHubLogoIcon, ShuffleIcon } from "@radix-ui/react-icons";
import ScoreRadar from "@/components/ScoreRadar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SimilarityScores } from "@/types";
import Footer from "@/components/Footer";

export default function Home() {
  const [textLeft, setTextLeft] = useState("");
  const [textRight, setTextRight] = useState("");
  const [scoresLeft, setScoresLeft] = useState<SimilarityScores>();
  const [scoresRight, setScoresRight] = useState<SimilarityScores>();
  const [isLoading, setIsLoading] = useState(false);

  // Add a new state hook to control the transition
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Modify your fetchScores to trigger transition after API call completes
  const fetchScores = useCallback(
    (
      callback: React.Dispatch<React.SetStateAction<SimilarityScores>>,
      inputs?: string[]
    ) => {
      if (isLoading) return;

      setIsLoading(true);
      fetch("/api/scores", {
        method: "POST",
        body: JSON.stringify({ inputs }),
      })
        .then((res) => res.json())
        .then((res) => {
          callback(res);
          // After the response is received, start a timer to trigger transition
          setTimeout(() => setIsTransitioning(true), 2000);
        })
        .catch((error) => {
          if (error.name !== "AbortError") throw error;
        })
        .finally(() => setIsLoading(false));
    },
    [isLoading]
  );

  useEffect(() => {
    // fetch on first load
    //@ts-ignore
    fetchScores(setScoresLeft);
    //@ts-ignore
    fetchScores(setScoresRight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      //@ts-ignore
      textLeft && fetchScores(setScoresLeft, [textLeft.toLocaleLowerCase()]);
      //@ts-ignore
      textRight && fetchScores(setScoresRight, [textRight.toLocaleLowerCase()]);
    },
    [fetchScores, textLeft, textRight]
  );

  return (
    <main className="flex h-[90vh] md:h-screen flex-col items-center px-8 justify-center">
      <div className="flex flex-grow" />

      <div className="flex flex-row space-x-4">
        <div className="flex flex-col items-center">
          <div className="h-[500px] w-[500px] max-w-[100vw] max-h-[100vh] font-mono p-4">
            <ScoreRadar
              scores={scoresLeft}
              isLoading={isLoading}
              invert={false}
            />
          </div>
          <Input
            className="text-lg h-12 md:text-base md:h-10 mt-4"
            value={textLeft}
            onChange={(e) => setTextLeft(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center">
          <div
            className="h-[500px] w-[500px] max-w-[100vw] max-h-[100vh] font-mono p-4"
            style={{ backgroundColor: "#e05780" }}
          >
            <ScoreRadar
              scores={scoresRight}
              isLoading={isLoading}
              invert={true}
            />
          </div>
          <Input
            className="text-lg h-12 md:text-base md:h-10 mt-4"
            value={textRight}
            onChange={(e) => setTextRight(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-grow items-center justify-center w-full max-w-md">
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={!textLeft || !textRight}
          className="text-lg h-12 md:text-base md:h-10"
        >
          Calculate
        </Button>
      </div>

      <Footer />
    </main>
  );
}
