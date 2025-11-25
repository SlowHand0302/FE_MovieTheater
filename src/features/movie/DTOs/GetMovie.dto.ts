export interface MovieBaseResultData {
    id: string; // Guid → string
    name: string;
    description: string | null; // assuming it can be null; adjust if it's required
    releaseDate: string; // DateOnly → ISO date string (e.g., "2023-04-15")
    duration: string; // TimeSpan → ISO duration string (e.g., "PT2H15M") or "HH:mm:ss"
    publisher: string | null;
    country: string | null;
    language: string | null;
    poster: string | null; // URL or path
    trailerUrl: string | null;
    status: string;

    genres: MovieGenreDataResult[];
    persons: MoviePersonDataResult[];
}

export interface MovieGenreDataResult {
    genreId: string; // UUIDs are represented as strings in TypeScript
    genreName: string;
}

export interface MoviePersonDataResult {
    personId: string; // UUID as string
    fullName: string;
    role: string;
}
