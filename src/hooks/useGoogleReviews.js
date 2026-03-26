import { useState, useEffect } from "react";

let reviewsCache = null;

export default function useGoogleReviews() {
  const [data, setData] = useState(reviewsCache);
  const [loading, setLoading] = useState(!reviewsCache);

  useEffect(() => {
    if (reviewsCache) return;
    fetch("/api/reviews")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d && d.reviews?.length) {
          reviewsCache = d;
          setData(d);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
