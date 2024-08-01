"use client";

import { useEffect, useState } from 'react';
import RecommendationSkeleton from '../components/skeletons/recommendation-skeleton';
import useAuthStore from '../stores/authStore';
import axiosInstance from '../utils/axios-config';
import { Movie } from '../models/movie';
import { Artist } from '../models/artist';

export default function GetRecommendations() {
  const { getUserId } = useAuthStore();
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [skeletonVisible, setSkeletonVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);

  const getRandomMovies = async () => {
    try {
        console.log("userid: ", getUserId());
      const response = await axiosInstance.get(`/api/recommendations/${getUserId()}`);
      setMovies(response.data);
        setSkeletonVisible(false);
        setLoading(false);
    } catch (error) {
      console.error("Error getting movies: ", error);
      setError("Failed to load recommendations");
      setLoading(false);
    }
  };

  useEffect(() => {
    setSkeletonVisible(true);
    getRandomMovies();
  }, [getUserId]);

  if (skeletonVisible) {
    return <RecommendationSkeleton />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold mb-4">Recommended Movies</h1>
      <div className="flex flex-wrap gap-4 w-full max-w-screen-lg">
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="w-60 h-80 bg-gray-200 p-4">
              <h2 className="text-xl font-semibold">{movie.title}</h2>
              <p>{movie.overview}</p>
              <p>{movie.rating}</p>

            </div>
          ))
        ) : (
          <p>No recommendations available</p>
        )}
      </div>
    </div>
  );
}
