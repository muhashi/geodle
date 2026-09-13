import { useNavigate } from "react-router";
import { TermsPage } from "../../src/Footer";
import type { Route } from "./+types/terms";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Terms of Service — Geodle" },
    { tagName: "link", rel: "canonical", href: "https://geodle.me/terms" },
  ];
}

export default function Terms() {
  const navigate = useNavigate();
  return <TermsPage onBack={() => navigate('/')} />;
}
