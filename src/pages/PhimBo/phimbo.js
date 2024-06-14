// SeriesMovie.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/loading';
import { getPhimBo } from '../../Api/api';
import Filterform from '../../components/FilterForm/filterform';

const SeriesMovie = () => {
    const [phimBo, setPhimBo] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [favourite, setFavourite] = useState(() => {
        const storedFavourites = localStorage.getItem('favourite');
        return storedFavourites ? JSON.parse(storedFavourites) : [];
    });

    const handleClick = async (pageNumber) => {
        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const { phimBo, pagination } = await getPhimBo(pageNumber);
            setPhimBo(phimBo);
            setPagination(pagination);

            localStorage.setItem('phimBo', JSON.stringify(phimBo));
            localStorage.setItem('pagination', JSON.stringify(pagination));
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    useEffect(() => {
        handleClick(1);
    }, []);

    const handleClickFavourite = (slug) => {
        let updatedFavourites;

        if (favourite.includes(slug)) {
            updatedFavourites = favourite.filter(item => item !== slug);
        } else {
            updatedFavourites = [...favourite, slug];
        }

        setFavourite(updatedFavourites);
        localStorage.setItem('favourite', JSON.stringify(updatedFavourites));
    };

    return (
        <div>
            {phimBo ? (
                <div className='film_component'>
                    <Filterform />
                    <div className='category' style={{ color: "#f89e00" }}>#Phim Bộ</div>
                    <div className="list">
                        {phimBo.map(movie => (
                            <div key={movie.id} className="movie">
                                <Link to={`/movie/detailsmovie/${movie.slug}`}>
                                    <div className="image-container">
                                        <img
                                            src={`https://img.phimapi.com/${movie.poster_url}`}
                                            alt={movie.title}
                                        />
                                        <div className="image-overlay">
                                            <p>{movie.name}</p>
                                        </div>
                                    </div>
                                </Link>
                                <div className='favourite'>
                                    <div className='year'>
                                        <p>{movie.year}</p>
                                    </div>
                                    {favourite.includes(movie.slug) ? (
                                        <i
                                            style={{ color: "#f89e00" }}
                                            onClick={() => handleClickFavourite(movie.slug)}
                                            className="fa-solid fa-bookmark"
                                        ></i>
                                    ) : (
                                        <i
                                            onClick={() => handleClickFavourite(movie.slug)}
                                            className="fa-regular fa-bookmark"
                                        ></i>
                                    )}
                                </div>
                                <div className='title'>
                                    <Link to={`/movie/detailsmovie/${movie.slug}`}>{movie.name}</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='pagination'>
                        <div className='page'>
                            <button hidden={pagination.currentPage <= 1} onClick={() => handleClick(pagination.currentPage - 1)}>
                                <i className="fa-sharp fa-solid fa-arrow-left"></i>
                            </button>
                            <button hidden={pagination.currentPage <= 2} onClick={() => handleClick(pagination.currentPage - 2)}>
                                {pagination.currentPage - 2}
                            </button>
                            <button hidden={pagination.currentPage <= 1} onClick={() => handleClick(pagination.currentPage - 1)}>
                                {pagination.currentPage - 1}
                            </button>
                            <button style={{ backgroundColor: 'rgb(139 92 246)', color: "#fff" }}>
                                {pagination.currentPage}
                            </button>
                            <button hidden={pagination.currentPage >= pagination.totalPages} onClick={() => handleClick(pagination.currentPage + 1)}>
                                {pagination.currentPage + 1}
                            </button>
                            <button hidden={pagination.currentPage >= pagination.totalPages - 1} onClick={() => handleClick(pagination.currentPage + 2)}>
                                {pagination.currentPage + 2}
                            </button>
                            <button hidden={pagination.currentPage >= pagination.totalPages} onClick={() => handleClick(pagination.currentPage + 1)}>
                                <i className="fa-sharp fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                        <div className='result'>
                            <p>Trang {pagination.currentPage}/{pagination.totalPages} | Tổng {pagination.totalItems} Kết quả</p>
                        </div>
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
};

export default SeriesMovie;
