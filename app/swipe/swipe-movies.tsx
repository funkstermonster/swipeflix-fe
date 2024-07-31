"use client";

import axiosInstance from "../utils/axios-config";
import useAuthStore from "../stores/authStore";
import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Artist } from "../models/artist";

export default function SwipeMovies() {
  const [randomMovie, setRandomMovie] = useState(null);
  const [movieId, setMovieId] = useState("");
  const { getUserId } = useAuthStore();
  const [imgSrc, setImgSrc] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const defaultImg = "/images/fallback-image.jpg";

  const fetchMovie = async () => {
    try {
      const response = await axiosInstance.get("api/movies/random");
      console.log("Fetched movie:", response.data);
      setRandomMovie(response.data);
      setMovieId(response.data.id);

      if (response.data.artists) {
        setArtists(response.data.artists);
      }
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

      console.log("movie id: ", response.data.id);
    } catch (error) {
      console.error("Error fetching movie:", error);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, []);

  useEffect(() => {
    console.log(imgSrc);
  }, [imgSrc]);

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
    if (info.offset.x > 50) {
      // Swipe right
      try {
        const response = await axiosInstance.post(
          `api/swipe/right/${getUserId()}/${movieId}`
        );
        console.log("Swipe right response:", response.data);
        fetchMovie();
      } catch (error) {
        console.error("Error swiping right: ", error);
      }
    } else if (info.offset.x < -50) {
      // Swipe left
      try {
        const response = await axiosInstance.post(
          `api/swipe/left/${getUserId()}/${movieId}`
        );
        console.log("Swipe left response:", response.data);
        fetchMovie();
      } catch (error) {
        console.error("Error swiping left: ", error);
      }
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ background }}
    >
      <h1 className="text-3xl font-bold mb-6">Swipe Movies</h1>
      {randomMovie && (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">{randomMovie.title}</h2>
          <motion.div
            className="relative mb-4"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          >
            <motion.img
              className="w-[300px] h-[427px] rounded-lg shadow-lg"
              src={imgSrc}
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
                <p className="text-white">{randomMovie.releaseDate}</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-300 mb-2">
                  Overview
                </h2>
                <p className="text-white">{randomMovie.overview}</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-300 mb-2">
                  IMDb Rating
                </h2>
                <p className="text-white">{randomMovie.rating}</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-300 mb-2">
                  Main Cast
                </h2>
                {artists.length > 0 ? (
                  <ul className="text-white">
                    {artists.map((artist) => (
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
      )}
    </motion.div>
  );
}
