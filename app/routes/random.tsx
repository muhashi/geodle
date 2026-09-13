import { useState } from "react";
import { useNavigate } from "react-router";
import { GamePage } from "../components/GamePage";
import type { Route } from "./+types/random";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Random Geodle - Unlimited Practice" },
    { name: "description", content: "Play Geodle unlimited — guess a random country based on continent, population, religion and more." },
    { tagName: "link", rel: "canonical", href: "https://geodle.me/random" },
  ];
}

export default function Random() {
  const navigate = useNavigate();
  const [seed, setSeed] = useState(0);
  return <GamePage key={seed} mode="random" onHome={() => navigate('/')} onRandom={() => setSeed(s => s + 1)} />;
}
