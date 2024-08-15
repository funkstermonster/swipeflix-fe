"use client";

import { useState, useEffect } from "react";
import useAuthStore from "../stores/authStore";
import axiosInstance from "../utils/axios-config";
import { Movie } from "../models/movie";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Trash2 } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function FavoriteMovies() {
  const { getUserId } = useAuthStore();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[] | null>([]);
  const [error, setError] = useState<string | null>(null);

  const getFavoriteMovies = async () => {
    try {
      const response = await axiosInstance.get(`/api/favorites/user/${getUserId()}`);
      const data = response.data;
      setFavoriteMovies(data);
    } catch (error) {
      setError("Failed to load favorite movies");
      console.error("Error fetching favorite movies:", error);
    }
  };

  const removeFavoriteMovie = async (movieId: string) => {
    const userId = getUserId();
    
    try {
      const response = await axiosInstance.delete(`/api/favorites/remove`, {
        params: {
          userId,
          movieId
        }
      });
      setFavoriteMovies((prevMovies) => prevMovies?.filter(movie => movie.id !== movieId) || []);
      const data = response.data;
      console.log('Movie removed from favorites:', data);
      toast.success("Successfully removed from your favorites!");
  
    } catch (error) {
      toast.error("An error occurred while removing the movie from your favorites.");
    }
  };
  

  useEffect(() => {
    getFavoriteMovies();
  }, []);


  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (favoriteMovies && favoriteMovies.length === 0) {
    return <div>You have no favorite movies yet.</div>;
  }

  return (
      <>
      <Toaster/>
      <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold mb-4">Your Favorite Movies</h1>
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-screen-lg">
        {favoriteMovies && favoriteMovies.map((movie) => (
          <Card key={movie.id} className="p-4 shadow-lg relative">
            <CardHeader className="flex justify-center">
              <h2 className="text-xl font-semibold">{movie.title}</h2>
            </CardHeader>
            <CardBody className="flex-1">
            <Image className="object-cover"
                isZoomed 
                src={movie.posterBase64} 
                width="240px" 
                height="360px"
                alt={`Poster of ${movie.title}`} />
            </CardBody>
            <CardFooter className="border-t border-gray-200 mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">IMDb Rating: {movie.rating}</p>
              <Trash2 className="cursor-pointer" onClick={() => removeFavoriteMovie(movie.id)}/>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
    </>
    
  );
}
