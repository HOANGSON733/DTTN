import axios from 'axios';
import LRU from 'lru-cache';

const BASE_URL = 'https://phimapi.com';
const cache = new LRU({ max: 100, maxAge: 1000 * 60 * 5 });

const movieApi = axios.create({
    baseURL: BASE_URL,
});

// Helper function to get data with caching
const fetchWithCache = async (url, params) => {
    const cacheKey = `${url}-${JSON.stringify(params)}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }
    const response = await movieApi.get(url, { params });
    cache.set(cacheKey, response.data);
    return response.data;
};

export const getPhimCapNhat = async (pageNumber) => {
    try {
        const data = await fetchWithCache('/danh-sach/phim-moi-cap-nhat', { page: pageNumber });
        return {
            phimCapNhat: data.items,
            pagination: data.pagination,
        };
    } catch (error) {
        throw error;
    }
};

export const getDetailMovie = async (slug) => {
    try {
        const data = await fetchWithCache(`/phim/${slug}`, {});
        return {
            details: data.movie,
            category: data.movie.category,
            country: data.movie.country,
            episodes: data.episodes,
        };
    } catch (error) {
        throw error;
    }
};

export const getPhimLe = async (pageNumber) => {
    try {
        const data = await fetchWithCache('/v1/api/danh-sach/phim-le', { page: pageNumber });
        return {
            phimLe: data.data.items,
            titlePL: data.data,
            pagination: data.data.params.pagination,
        };
    } catch (error) {
        throw error;
    }
};

export const getPhimBo = async (pageNumber) => {
    try {
        const data = await fetchWithCache('/v1/api/danh-sach/phim-bo', { page: pageNumber });
        return {
            phimBo: data.data.items,
            titlePB: data.data,
            pagination: data.data.params.pagination,
        };
    } catch (error) {
        throw error;
    }
};

export const getTvShow = async (pageNumber) => {
    try {
        const data = await fetchWithCache('/v1/api/danh-sach/tv-shows', { page: pageNumber });
        return {
            tvShow: data.data.items,
            titleTv: data.data,
            pagination: data.data.params.pagination,
        };
    } catch (error) {
        throw error;
    }
};

export const getHoatHinh = async (pageNumber) => {
    try {
        const data = await fetchWithCache('/v1/api/danh-sach/hoat-hinh', { page: pageNumber });
        return {
            hoatHinh: data.data.items,
            titleHH: data.data,
            pagination: data.data.params.pagination,
        };
    } catch (error) {
        throw error;
    }
};

// Debounced search function
let searchTimeout;
export const getSearch = (keyword) => {
    clearTimeout(searchTimeout);
    return new Promise((resolve, reject) => {
        searchTimeout = setTimeout(async () => {
            try {
                const data = await fetchWithCache('/v1/api/tim-kiem', { keyword, limit: 100 });
                resolve({
                    timkiem: data.data.items,
                    titlePage: data.data.titlePage,
                });
            } catch (error) {
                reject(error);
            }
        }, 300); // Debounce delay of 300ms
    });
};

export const getSimilarMovie = async () => {
    try {
        const data = await fetchWithCache('/v1/api/tim-kiem', { keyword: "a", limit: 10000 });
        return {
            similar: data.data.items,
        };
    } catch (error) {
        throw error;
    }
};

export const getGenres = async () => {
    try {
        const data = await fetchWithCache('/the-loai');
        return {
            genres: data,
        };
    } catch (error) {
        throw error;
    }
};

export const getGenresMovie = async () => {
    try {
        const data = await fetchWithCache('/v1/api/tim-kiem', { keyword: "a", limit: 20000 });
        return {
            genresMovie: data.data.items,
        };
    } catch (error) {
        throw error;
    }
};

export const getCountry = async () => {
    try {
        const data = await fetchWithCache('/quoc-gia');
        return {
            country: data,
        };
    } catch (error) {
        throw error;
    }
};

export const getFilterMovie = async () => {
    try {
        const data = await fetchWithCache('/v1/api/tim-kiem', { keyword: "a", limit: 20000 });
        return {
            filterMovie: data.data.items,
        };
    } catch (error) {
        throw error;
    }
};