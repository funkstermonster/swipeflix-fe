import { Artist } from "./artist";

export interface Movie {
    id: string;
    imdbId: string;
    overview: string;
    releaseDate: Date;
    runtime: number;
    title: String;
    rating: number;
    artists: Artist;

}
