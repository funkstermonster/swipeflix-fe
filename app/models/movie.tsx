import { Artist } from "./artist";

export interface Movie {
    posterBase64: string;
    id: string;
    imdbId: string;
    overview: string;
    releaseDate: Date;
    runtime: number;
    title: String;
    rating: number;
    artists: Artist;

}
