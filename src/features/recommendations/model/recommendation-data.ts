import type { getRecommendation, getRecommendations } from "../api/get-recommendations";

export type RecommendationsData = NonNullable<Awaited<ReturnType<typeof getRecommendations>>>;
export type RecommendationData = NonNullable<Awaited<ReturnType<typeof getRecommendation>>>;
