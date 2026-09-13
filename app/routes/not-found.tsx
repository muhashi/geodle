import { useNavigate } from "react-router";
import { Button, Stack, Text } from "@mantine/core";
import type { Route } from "./+types/not-found";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "404 — Geodle" },
  ];
}

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Stack align="center" py="xl" gap="md">
      <Text fz="xl" fw={700}>Page not found</Text>
      <Text c="dimmed">The page you're looking for doesn't exist.</Text>
      <Button onClick={() => navigate('/')}>Go home</Button>
    </Stack>
  );
}
