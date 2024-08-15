"use server";

import axios from "axios";
import { JSDOM } from "jsdom";

export async function checkPoster(movieId: string): Promise<string | null> {
  console.log("checking for existing poster");
  try {
    const response = await fetch(`http://localhost:8080/api/movies/${movieId}`);
    const movie = await response.json();

    if (movie.poster && movie.poster.imgData) {
      return movie.poster.imgData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error checking poster:", error);
    return null;
  }
}

async function convertImageToBase64(imageUrl: string): Promise<string | null> {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error("Error converting image to Base64:", error);
    return null;
  }
}

export async function scrapeAndSavePoster(
  imdbId: string,
  movieId: string,
  title: string
): Promise<string | null> {
  console.log("scraping and saving poster");
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens

  const url = `https://www.movieposterdb.com/${sanitizedTitle}-i${imdbId.replaceAll(
    "tt",
    ""
  )}`;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const imgElement = document.querySelector(`img[alt="${title.replaceAll(' Of ', ' of ')}"]`);

    console.log("imgElement", imgElement)

    if (imgElement) {
      const imgSrc = imgElement.src;

      const base64Image = await convertImageToBase64(imgSrc);
      if (base64Image) {
        const saveResponse = await fetch(`http://localhost:8080/api/movies/${movieId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imgData: base64Image }),
        });
        console.log("saving poster: ", saveResponse)
        if (saveResponse.ok) {
          return base64Image;
        } else {
          const errorText = await saveResponse.text();
          console.error("Error saving poster:", errorText);
          return null;
        }
      } else {
        console.error("Error converting image to Base64.");
        return null;
      }
    } else {
      console.error("No image found for the movie.");
      return null;
    }
  } catch (error) {
    console.error("Error scraping poster:", error);
    return null;
  }
}

  export async function fetchAndProcessPosters(movies: Array<{ imdbId: string, id: string, originalTitle: string }>): Promise<{ [key: string]: string | null }> {
    console.log("fetching and processing posters for batch");
  
    const posterPromises = movies.map(async (movie) => {
      let posterBase64 = await checkPoster(movie.id);
      if (!posterBase64) {
        posterBase64 = await scrapeAndSavePoster(
          movie.imdbId,
          movie.id,
          movie.originalTitle
        );
      }
      return { id: movie.id, posterBase64 };
    });
  
    const posters = await Promise.all(posterPromises);
    return posters.reduce((acc, { id, posterBase64 }) => {
      acc[id] = posterBase64;
      return acc;
    }, {} as { [key: string]: string | null });
  }

