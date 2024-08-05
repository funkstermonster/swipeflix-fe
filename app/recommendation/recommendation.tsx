"use client";

import { useEffect, useState } from "react";
import RecommendationSkeleton from "../components/skeletons/recommendation-skeleton";
import useAuthStore from "../stores/authStore";
import axiosInstance from "../utils/axios-config";
import { Movie } from "../models/movie";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";

export default function GetRecommendations() {
  const { getUserId } = useAuthStore();
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [skeletonVisible, setSkeletonVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultImg = "/images/fallback-image.jpg";
  const [imgSrc, setImgSrc] = useState("");

  const getRandomMovies = async () => {
    try {
      console.log("userid: ", getUserId());
      const response = await axiosInstance.get(
        `/api/recommendations/${getUserId()}`
      );
      setMovies(response.data);
      console.log(response.data)
      setSkeletonVisible(false);
      setLoading(false);
      try {
        const posterResponse = await axiosInstance.post(
          "http://localhost:3000/api/poster",
          { title: response.data.originalTitle, id: response.data.imdbId }
        );
        setImgSrc(posterResponse.data.src);
        console.log("poster res", posterResponse);
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 500 || error.response.status === 403)
        ) {
          setImgSrc(defaultImg);
        } else {
          console.error("Error fetching poster:", error);
        }
      }
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
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-screen-lg">
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            <Card key={movie.id} className="w-60 h-80 p-4 shadow-lg">
              <CardHeader className="flex justify-center">
                <h2 className="text-xl font-semibold">{movie.title}</h2>
              </CardHeader>
              <CardBody className="flex-1">
                <img className="w-[300px] h-[427px]" src={imgSrc}
              width={300}
              height={427}/>
              </CardBody>
              <CardFooter className="border-t border-gray-200 mt-4">
                <p className="text-sm text-gray-600">
                  IMDb Rating: {movie.rating}
                </p>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No recommendations available</p>
        )}
      </div>
    </div>
  );
}
