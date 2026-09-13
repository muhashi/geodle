import { useNavigate } from "react-router";
import { GamePage } from "../components/GamePage";
import type { Route } from "./+types/daily";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `Daily Geodle - Geography Wordle` },
    { name: "description", content: "Geodle Daily — Guess today's mystery country based on demographics such as population, temperature, and religion." },
    { tagName: "link", rel: "canonical", href: "https://geodle.me/daily" },
  ];
}

export default function Daily() {
  const navigate = useNavigate();
  return <GamePage mode="daily" onHome={() => navigate('/')} onRandom={() => navigate('/random')} />;
}
