export const REVIEW_LOCATIONS = {
  "nowa-wies-rzeczna": {
    label: "Centrum Zielińscy · Nowa Wieś Rzeczna",
    reviewUrl: "https://g.page/r/CXQrUVozvjjYEAE/review",
  },
  "arthro-cure-clinic": {
    label: "Arthro Cure Clinic · Starogard Gdański",
    reviewUrl: "https://g.page/r/CWx8GJ9jp6bTEAE/review",
  },
} as const;

export type ReviewLocationId = keyof typeof REVIEW_LOCATIONS;

export function isReviewLocationId(value: string | null | undefined): value is ReviewLocationId {
  return Boolean(value && value in REVIEW_LOCATIONS);
}

export function getReviewLocation(value: string | null | undefined) {
  return isReviewLocationId(value) ? REVIEW_LOCATIONS[value] : null;
}
