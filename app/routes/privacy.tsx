import { useNavigate } from "react-router";
import { PrivacyPage } from "../../src/Footer";
import type { Route } from "./+types/privacy";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy Policy — Geodle" },
    { tagName: "link", rel: "canonical", href: "https://geodle.me/privacy" },
  ];
}

export default function Privacy() {
  const navigate = useNavigate();
  return <PrivacyPage onBack={() => navigate('/')} />;
}
