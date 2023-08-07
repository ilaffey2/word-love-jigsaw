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

  const fetchScores = useCallback(
    (
      inputs: string[],
      callback: React.Dispatch<React.SetStateAction<SimilarityScores>>
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
        })
        .catch((error) => {
          if (error.name !== "AbortError") throw error;
        })
        .finally(() => setIsLoading(false));
    },
    [isLoading]
  );

  const onSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      //@ts-ignore
      textLeft && fetchScores([textLeft], setScoresLeft);
      //@ts-ignore
      textRight && fetchScores([textRight], setScoresRight);
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
            style={{ backgroundColor: "#bae6fd" }}
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
