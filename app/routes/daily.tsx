import { useNavigate } from "react-router";
import { GamePage } from "../components/GamePage";
import { dayNumber } from "../../src/country";
import type { Route } from "./+types/daily";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `Daily Geodle #${dayNumber} - Geography Wordle` },
    { name: "description", content: `Geodle Daily #${dayNumber} — Guess today's mystery country in 7 tries!` },
    { tagName: "link", rel: "canonical", href: "https://geodle.me/daily" },
  ];
}

export default function Daily() {
  const navigate = useNavigate();
  return <GamePage mode="daily" onHome={() => navigate('/')} onRandom={() => navigate('/random')} />;
}
