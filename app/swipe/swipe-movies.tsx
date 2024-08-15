"use client";

import axiosInstance from "../utils/axios-config";
import useAuthStore from "../stores/authStore";
import { useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { fetchAndProcessPosters } from "../service/movie-service";
import { useRouter } from "next/navigation";
import useSwipeStore from "../stores/swipeStore";

export default function SwipeMovies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [posterBase64Map, setPosterBase64Map] = useState<{ [key: string]: string }>({});
  const { getUserId } = useAuthStore();
  const [isFetching, setIsFetching] = useState(false);
  const { incrementSwipe, displayModal, setDisplayModal } = useSwipeStore();
  const router = useRouter();

  const fetchMovies = async () => {
    if (isFetching) return;
    setIsFetching(true);

    try {
      // Fetch a batch of movies
      const response = await axiosInstance.get("api/movies/random");
      const moviesData = response.data;
      //setMovies((prevMovies) => [...prevMovies, ...moviesData]);
      setMovies(moviesData)
      // Process each movie's poster
      const posterMap = await fetchAndProcessPosters(moviesData);
      // setPosterBase64Map((prevMap) => ({
      //   ...prevMap,
      //   ...posterMap,
      // }));
      setPosterBase64Map(posterMap)
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const loadMoreMoviesIfNeeded = useCallback(() => {
    if (currentMovieIndex == 10 && !isFetching) {
      setCurrentMovieIndex(0);
      fetchMovies();
    }
  }, [currentMovieIndex, movies.length, isFetching]);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    console.log('currmovie index: ', currentMovieIndex)
    loadMoreMoviesIfNeeded();
  }, [currentMovieIndex, loadMoreMoviesIfNeeded]);

  const x = useMotionValue(0);
  const xInput = [-100, 0, 100];
  const background = useTransform(x, xInput, [
    "linear-gradient(180deg, #ff0000 0%, #ffaaaa 100%)",
    "linear-gradient(180deg, #7700ff 0%, rgb(9, 24, 225) 100%)",
    "linear-gradient(180deg, #00ff00 0%, #aaffaa 100%)",
  ]);
  const crossPathA = useTransform(x, [-10, -55], [0, 1]);
  const crossPathB = useTransform(x, [-50, -100], [0, 1]);

  const handleDragEnd = async (_, info) => {
    const currentMovie = movies[currentMovieIndex];
    if (info.offset.x > 50) {
      // Swipe right
      try {
        const response = await axiosInstance.post(
          `api/swipe/right/${getUserId()}/${currentMovie.id}`
        );
        console.log("Swipe right response:", response.data);
        incrementSwipe();
        nextMovie();
      } catch (error) {
        console.error("Error swiping right: ", error);
      }
    } else if (info.offset.x < -50) {
      // Swipe left
      try {
        const response = await axiosInstance.post(
          `api/swipe/left/${getUserId()}/${currentMovie.id}`
        );
        console.log("Swipe left response:", response.data);
        incrementSwipe();
        nextMovie();
      } catch (error) {
        console.error("Error swiping left: ", error);
      }
    }
  };

  const nextMovie = () => {
    setCurrentMovieIndex((prevIndex) => (prevIndex + 1));
  };

  const handleContinueSwiping = () => {
    setDisplayModal(false);
  };

  const handleGetRecommendations = () => {
    setDisplayModal(false);
    router.push("/recommendation");
  };

  const currentMovie = movies[currentMovieIndex];
  const posterBase64 = posterBase64Map[currentMovie?.id] || "/images/fallback-image.jpg";

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ background }}
    >
      <h1 className="text-3xl font-bold mb-6">Swipe Movies</h1>
      {currentMovie ? (
        <div className="flex flex-col items-center pb-20">
          <h2 className="text-2xl font-semibold mb-4">{currentMovie.title}</h2>
          <motion.div
            className="relative mb-4"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          >
            <motion.img
              className="w-[300px] h-[427px] rounded-lg shadow-lg"
              src={posterBase64}
              width={300}
              height={427}
            />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 50 50">
              <motion.path
                fill="none"
                strokeWidth="2"
                d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
                style={{ translateX: 5, translateY: 5 }}
              />
              <motion.path
                fill="none"
                strokeWidth="2"
                d="M17,17 L33,33"
                strokeDasharray="0 1"
                style={{ pathLength: crossPathA }}
              />
              <motion.path
                fill="none"
                strokeWidth="2"
                d="M33,17 L17,33"
                strokeDasharray="0 1"
                style={{ pathLength: crossPathB }}
              />
            </svg>
          </motion.div>
          <div className="w-full max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">
              Movie Details
            </h2>
            <div className="space-y-6">
              <div className="p-4 bg-gray-700 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-300 mb-2">
                  Release Date
                </h2>
                <p className="text-white">
                  {currentMovie.releaseDate || "Unknown Release Date"}
                </p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-300 mb-2">
                  Overview
                </h2>
                <p className="text-white">
                  {currentMovie.overview || "No overview available"}
                </p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-300 mb-2">
                  IMDb Rating
                </h2>
                <p className="text-white">
                  {currentMovie.rating || "No rating available"}
                </p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-300 mb-2">
                  Main Cast
                </h2>
                {currentMovie.artists?.length > 0 ? (
                  <ul className="text-white">
                    {currentMovie.artists.map((artist: any) => (
                      <li key={artist.id}>{artist.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white">Unknown Cast</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading movies...</p>
      )}
      <Modal isOpen={displayModal} className="dark">
        <ModalContent>
          <ModalHeader>What would you like to do?</ModalHeader>
          <ModalBody>
            <p>
              If you would like to continue swiping movies, click on "Continue
              Swiping." If you would like to check the movie recommendations
              based on your swipes, click on "Get Recommendations."
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-4"
              onClick={handleContinueSwiping}
            >
              Continue Swiping
            </Button>
            <Button
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
              onClick={handleGetRecommendations}
            >
              Get Recommendations
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </motion.div>
  );
}
