/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/loading'
import { getHoatHinh } from '../../Api/api';
import Filterform from '../../components/FilterForm/filterform';

const SeriesMovie = () => {
    const [phimhh, setPhimHH] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [favourite, setFavourite] = useState(() => {
        const storedFavourites = localStorage.getItem('favourite');
        return storedFavourites ? JSON.parse(storedFavourites) : [];
    });

    const handleClick = async (pageNumber) => {

        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const phimhhLS = localStorage.getItem('phimhh');
            const paginationLS = localStorage.getItem('pagination');

            if (phimhhLS && paginationLS) {
                setPhimHH(JSON.parse(phimhhLS));
                setPagination(JSON.parse(paginationLS))
            }

            const { hoatHinh, pagination } = await getHoatHinh(pageNumber);
            setPhimHH(hoatHinh);
            setPagination(pagination);

            localStorage.setItem('phimhh', JSON.stringify(hoatHinh));
            localStorage.setItem('pagination', JSON.stringify(pagination));

            console.log("PhimHH:", hoatHinh);
            console.log("Pagination:", pagination);
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
            {phimhh ? (
                <div className='film_component'>
                    <Filterform />
                    <div className='category' style={{ color: "#f89e00" }}>#Phim Hoạt Hình</div>
                    <div className="list">
                        {phimhh && phimhh.map(movie => (
                            <div key={movie.id} className="movie">
                                <Link to={`/movie/detailsmovie/${movie.slug}`}>
                                    <div className="image-container">
                                        <img
                                            src={`https://img.phimapi.com/${movie.poster_url}`}
                                            alt={movie.title}
                                            placeholderSrc='https://movix-taupe.vercel.app/assets/movix-logo-d720c325.svg'
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
                            <button hidden={pagination.currentPage <= 1} onClick={() => handleClick(pagination.currentPage - 1)}><i class="fa-sharp fa-solid fa-arrow-left"></i></button>
                            <button hidden={pagination.currentPage <= 2} onClick={() => handleClick(pagination.currentPage - 2)}>{pagination.currentPage - 2}</button>
                            <button hidden={pagination.currentPage <= 1} onClick={() => handleClick(pagination.currentPage - 1)}>{pagination.currentPage - 1}</button>
                            <button style={{ backgroundColor: 'rgb(139 92 246 )', color: "#fff" }}>{pagination.currentPage}</button>
                            <button hidden={pagination.currentPage >= pagination.totalPages} onClick={() => handleClick(pagination.currentPage + 1)}>{pagination.currentPage + 1}</button>
                            <button hidden={pagination.currentPage >= pagination.totalPages} onClick={() => handleClick(pagination.currentPage + 2)}>{pagination.currentPage + 2}</button>
                            <button onClick={() => handleClick(pagination.currentPage + 1)}><i class="fa-sharp fa-solid fa-arrow-right"></i></button>
                        </div>
                        <div className='result'>
                            <p>Trang {pagination.currentPage}/{pagination.totalPages} | Tổng {pagination.totalItems} Kết quả</p>
                        </div>
                    </div>
                </div>
            ) : (
                <Loading></Loading>
            )}

        </div>
    );
};

export default SeriesMovie;
