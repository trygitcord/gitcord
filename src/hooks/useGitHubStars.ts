import { useState, useEffect } from 'react';

export const useGitHubStars = (repo: string) => {
  const [stars, setStars] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.github.com/repos/${repo}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch repository data');
        }
        
        const data = await response.json();
        setStars(data.stargazers_count || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setStars(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStars();
  }, [repo]);

  return { stars, loading, error };
};