import { SimilarityScores } from "@/types";
import { dot } from "mathjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import words from "@/data/words.json";
import traitEmbeddings from "@/data/traitEmbeddings.json";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type Body = {
  inputs: string[];
};

export async function POST(request: Request) {
  let { inputs }: Body = await request.json();

  if (inputs == null || inputs.length === 0) {
    inputs = [words[Math.floor(Math.random() * words.length)]];
  }

  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: inputs,
  });

  const scores: SimilarityScores = {};

  inputs.forEach((input, i) => {
    scores[input] = {};
    let emotionKeys = Object.keys(traitEmbeddings);

    for (let emotion of emotionKeys) {
      scores[input][emotion] = dot(
        embeddingResponse.data.data[i].embedding,
        traitEmbeddings[emotion as keyof typeof traitEmbeddings]
      );
    }
  });

  return NextResponse.json(scores);
}
