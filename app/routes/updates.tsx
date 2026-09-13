import { useNavigate } from "react-router";
import { UpdatesPage } from "../../src/Footer";
import type { Route } from "./+types/updates";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Updates — Geodle" },
    { tagName: "link", rel: "canonical", href: "https://geodle.me/updates" },
  ];
}

export default function Updates() {
  const navigate = useNavigate();
  return <UpdatesPage onBack={() => navigate('/')} />;
}
