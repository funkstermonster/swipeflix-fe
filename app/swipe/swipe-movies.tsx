"use client";

import axiosInstance from "../utils/axios-config";
import useAuthStore from '../stores/authStore';
import { useState, useEffect } from "react";

export default function SwipeMovies() {
    const [randomMovie, setRandomMovie] = useState(null);
    const [movieId, setMovieId] = useState('');
    const { getUserId } = useAuthStore();
    const [imgSrc, setImgSrc] = useState('');
    let imgUrl = "";
    const defaultImg = "/images/fallback-image.jpg";
    const fetchMovie = async () => {
        try {
            const response = await axiosInstance.get('api/movies/random');
            console.log('Fetched movie:', response.data);
            setRandomMovie(response.data);
            setMovieId(response.data.id);

            try {
                const posterResponse = await axiosInstance.post('http://localhost:3000/api/poster', { title: response.data.originalTitle, id: response.data.imdbId });
                setImgSrc(posterResponse.data.src);
                console.log('poster res', posterResponse);
            } catch (error) {
                if (error.response && error.response.status === 500 || error.response.status === 403) {
                    setImgSrc(defaultImg);
                } else {
                    console.error('Error fetching poster:', error);
                }
            }

            console.log('movie id: ', response.data.id);
        } catch (error) {
            console.error('Error fetching movie:', error);
        }
    };

    useEffect(() => {
        fetchMovie();
    }, []); 

    useEffect(() => {
        console.log(imgSrc);
    }, [imgSrc]);

    const swipeRight = async () => {
        console.log(getUserId())
        try {
            const response = await axiosInstance.post(`api/swipe/right/${getUserId()}/${movieId}`);
            console.log('Swipe right response:', response.data);
            fetchMovie();
        } catch (error) {
            console.error('Error swiping right: ', error);
        }
    };

    const swipeLeft = async () => {
        try {
            const response = await axiosInstance.post(`api/swipe/left/${getUserId()}/${movieId}`);
            console.log('Swipe left response:', response.data);
            fetchMovie();
        } catch (error) {
            console.error('Error swiping left: ', error);
        }
    };

    return (
        <div>
            <h1>Swipe Movies</h1>
            {randomMovie && (
                <div>
                    <h2>{randomMovie.title}</h2>

                    <img className="w-[300px] h-[427px]" src={imgSrc} width={300} height={427}/>

                    <button onClick={swipeRight}>Swipe Right</button>
                    <button onClick={swipeLeft}>Swipe Left</button>
                </div>
            )}
        </div>
    );
}
