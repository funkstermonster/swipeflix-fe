"use client";

import { useEffect, useState } from "react";
import RecommendationSkeleton from "../components/skeletons/recommendation-skeleton";
import useAuthStore from "../stores/authStore";
import axiosInstance from "../utils/axios-config";
;
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { checkPoster, scrapeAndSavePoster } from "../service/movie-service";
import { Movie } from "../models/movie";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Image } from "@nextui-org/image";

export default function GetRecommendations() {
  const { getUserId } = useAuthStore();
  const [movies, setMovies] = useState<Movie[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [skeletonVisible, setSkeletonVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [clickedCardId, setClickedCardId] = useState(null);

  const handleHeartClick = (id) => {
    setClickedCardId(id);
    // Reset clicked state after animation ends
    setTimeout(() => setClickedCardId(null), 650); // Match this duration with your animation
  };
  
  const defaultImg = "/images/fallback-image.jpg";
  const getRecommendedMovies = async () => {
    try {
      console.log("userid: ", getUserId());
      const response = await axiosInstance.get(`/api/recommendations/${getUserId()}`);
      const moviesData = response.data;
      setMovies(moviesData);
      setSkeletonVisible(false);
      setLoading(false);

      for (let movie of moviesData) {
        let posterBase64 = await checkPoster(movie.id);
        if (!posterBase64) {
          posterBase64 = await scrapeAndSavePoster(movie.imdbId, movie.id, movie.originalTitle);
        }
        movie.posterBase64 = posterBase64 || defaultImg;
      }
      setMovies([...moviesData]);
    } catch (error) {
      console.error("Error getting movies: ", error);
      setError("Failed to load recommendations");
      setLoading(false);
    }
  };

  useEffect(() => {
    setSkeletonVisible(true);
    getRecommendedMovies();
  }, [getUserId]);

  if (skeletonVisible) {
    return <RecommendationSkeleton />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
<div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold mb-4">Your Recommended Movies</h1>
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-screen-lg">
        {movies && movies.map((movie) => (
          <Card key={movie.id} className="p-4 shadow-lg">
            <CardHeader className="flex justify-center">
              <h2 className="text-xl font-semibold">{movie.title}</h2>
            </CardHeader>
            <CardBody className="flex-1">
              <Image className="object-cover" 
                  isZoomed  
                  src={movie.posterBase64} width="240px" height="360px"/>
            </CardBody>
            <CardFooter 
              className="border-t border-gray-200 mt-4 flex justify-between items-center"
              onMouseEnter={() => setHoveredCardId(movie.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              <p className="text-sm text-gray-600">
                IMDb Rating: {movie.rating}
              </p>
              <div className="relative">
                {/* Main Heart Icon */}
                <motion.div
                  onClick={() => handleHeartClick(movie.id)}
                  className="p-4 cursor-pointer transition-all ease-in-out duration-300"
                >
                  <Heart
                    size={24}
                    fill={hoveredCardId === movie.id ? "red" : "none"}
                    className="transition-transform duration-300 hover:scale-125 active:scale-95"
                    style={{ stroke: "currentColor", strokeWidth: 2 }}
                  />
                </motion.div>
                {/* Mini Hearts */}
                {clickedCardId === movie.id && (
                  <>
                    {Array.from({ length: 5 }).map((_, index) => {
                      // Calculate position for radial spread in a star pattern
                      const angle = (index / 5) * 2 * Math.PI;
                      const x = 30 * Math.cos(angle); // Adjust the radius as needed
                      const y = 30 * Math.sin(angle); // Adjust the radius as needed
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                          animate={{ opacity: 1, scale: 0.2, x, y }}
                          transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered effect
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                          <Heart size={12} fill="red" strokeWidth={1} />
                        </motion.div>
                      );
                    })}
                  </>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};