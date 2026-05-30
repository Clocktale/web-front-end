import type { AnimeCategory } from './anime-category.type';
import type { AnimeGenre } from './anime-genre.type';
import type { Author } from './author.type';
import type { PaginatedResult } from './paginated-result.type';
import type { Streaming } from './streaming.type';
import type { Studio } from './studio.type';

export type AnimeStatus = 'ongoing' | 'completed';

export type AnimeStorySize = 'small' | 'medium' | 'long' | 'very_long';

export interface Anime {
  id: number;
  title: string;
  releaseDate: Date;
  cardBackgroundUrl: string;
  bannerUrl: string;
  updatedAt: Date;
  status: AnimeStatus;
  stars: number;
  description: string;
  storySize: AnimeStorySize;
  seasonCount: number;
  totalEpisodes: number;
  streamings: Streaming[];
  authors: Author[];
  studios: Studio[];
  genres: AnimeGenre[];
  categories: AnimeCategory[];
}

export type AnimePaginatedResult = PaginatedResult<Anime>;

export interface AnimeListQuery {
  page?: number;
  pageSize?: number;
  title?: string;
  status?: AnimeStatus;
  storySize?: AnimeStorySize;
  genreId?: number;
  categoryId?: number;
  studioId?: number;
  authorId?: number;
}
