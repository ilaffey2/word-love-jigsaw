"use client";

import { useState, useCallback, SyntheticEvent, useEffect } from "react";
import ScoreRadar from "@/components/ScoreRadar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SimilarityScores } from "@/types";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

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
    <main className="flex flex-col min-h-screen items-center justify-center px-4 md:px-8 py-8 md:py-0 bg-rose-100 overflow-y-auto">
      <div className="w-full p-4">
        <Hero />
      </div>
      <div className="w-full flex flex-col space-y-4 md:space-y-0 items-center flex-grow md:flex-row md:space-x-20">
        <div className="flex flex-col items-center w-full">
          <div className="h-[300px] md:h-[500px] w-full md:w-[500px] max-w-full md:max-w-[500px] max-h-full md:max-h-[500px] font-mono p-4 rounded-full">
            <ScoreRadar
              scores={scoresLeft}
              isLoading={isLoading}
              invert={false}
            />
          </div>
          <Input
            className="text-base h-10 w-full mt-4"
            value={textLeft}
            onChange={(e) => setTextLeft(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div className="flex flex-col items-center w-full">
          <div
            className="h-[300px] md:h-[500px] w-full md:w-[500px] max-w-full md:max-w-[500px] max-h-full md:max-h-[500px] font-mono p-4 rounded-full"
            // style={{ backgroundColor: "#e05780" }}
          >
            <ScoreRadar
              scores={scoresRight}
              isLoading={isLoading}
              invert={true}
            />
          </div>
          <Input
            className="text-base h-10 w-full mt-4"
            value={textRight}
            onChange={(e) => setTextRight(e.target.value)}
            placeholder="Partner's name"
          />
        </div>
      </div>
      <div className="flex justify-center w-full max-w-md mt-4">
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={!textLeft || !textRight}
          className="text-base h-10 bg-rose-300"
        >
          Calculate
        </Button>
      </div>
      <Footer />
    </main>
  );
}
