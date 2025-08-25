"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Typography, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RecommendationIcon from "@mui/icons-material/Lightbulb";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";

type RecsApiResponse = {
  redirectUrl?: string;
  ai?: {
    explain_short?: string;
  } | null;
};

async function fetchRecommendations(ids: number[]) {
  const res = await fetch("/api/ia/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  const json: RecsApiResponse = await res.json();
  return json;
}

const FIVE_MIN = 1000 * 60 * 5;

export default function RecommendationPopup({ userId }: { userId?: string }) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  const byUser = useRecentlyViewedStore((s) => s.byUser);
  const recently = useMemo(
    () => (byUser?.[userId ?? "guest"] ? byUser[userId ?? "guest"] : []),
    [byUser, userId]
  );

  const ids = useMemo(() => {
    return recently
      .map((p) => p.id)
      .slice()
      .sort((a, b) => a - b);
  }, [recently]);

  const storageKey = `recs_cache_${userId ?? "guest"}`;

  const cachedInitialData = useMemo(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { ts: number; data: RecsApiResponse };
      if (Date.now() - parsed.ts < FIVE_MIN) return parsed.data;
      console.log(parsed.data);
      return null;
    } catch {
      return null;
    }
  }, [storageKey, ids.join(",")]);

  const queryKey = ["recommendations", userId ?? "guest"];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchRecommendations(ids),
    enabled: ids.length > 0 && !cachedInitialData,
    initialData: cachedInitialData ?? undefined,
    staleTime: FIVE_MIN,
    gcTime: FIVE_MIN,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({ ts: Date.now(), data: query.data })
        );
      } catch {}
    }
  }, [query.isSuccess, query.data, storageKey]);

  const shouldShow = !!(
    query.isSuccess &&
    query.data?.redirectUrl &&
    query.data.redirectUrl !== "/"
  );

  if (!ids.length) return null;
  if (!shouldShow || dismissed) return null;

  return (
    <Slide direction="up" in={shouldShow} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          right: 20,
          bottom: 24,
          zIndex: 1400,
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "background.paper",
            boxShadow: 3,
            borderRadius: 2,
            px: 2,
            py: 1,
            minWidth: 260,
          }}
        >
          <RecommendationIcon sx={{ mr: 1 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2">
              We found recommended filters for you
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {query.data?.ai?.explain_short ?? "See similar products"}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="small"
            onClick={() => {
              try {
                sessionStorage.setItem(
                  "recs_shown_for",
                  query.data?.redirectUrl ?? ""
                );
              } catch {}
              console.log("--->", query.data?.redirectUrl);
              router.push(
                query.data?.redirectUrl
                  ? `/products${query.data?.redirectUrl}`
                  : "/"
              );
            }}
            sx={{ ml: 1 }}
          >
            Apply
          </Button>

          <IconButton
            size="small"
            onClick={() => {
              setDismissed(true);
              try {
                sessionStorage.setItem(
                  "recs_shown_for",
                  query.data?.redirectUrl ?? ""
                );
              } catch {}
            }}
            sx={{ ml: 1 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Slide>
  );
}
