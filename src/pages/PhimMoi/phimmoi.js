/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/loading'
import { getPhimCapNhat } from '../../Api/api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import FilterForm from '../../components/FilterForm/filterform';

const SeriesMovie = () => {
    const [phimCapNhat, setPhimCapNhat] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [favourite, setFavourite] = useState(() => {
        const storedFavourites = localStorage.getItem('favourite');
        return storedFavourites ? JSON.parse(storedFavourites) : [];
    });

    const handleClick = async (pageNumber) => {

        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const phimCapNhatLS = localStorage.getItem("phimCapNhat");

            if (phimCapNhatLS) {
                setPhimCapNhat(JSON.parse(phimCapNhatLS));
            }

            const { phimCapNhat, pagination } = await getPhimCapNhat(pageNumber);
            setPhimCapNhat(phimCapNhat);
            setPagination(pagination);

            localStorage.setItem('phimCapNhat', JSON.stringify(phimCapNhat));


            console.log("PhimCapNhat:", phimCapNhat);
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
            {phimCapNhat ? (
                <div className='film_component'>
                    <FilterForm></FilterForm>
                    <div className='category' style={{ color: "#f89e00" }}>#Phim mới cập nhật</div>
                    <div className="list">
                        {phimCapNhat && phimCapNhat.map(movie => (
                            <div key={movie.id} className="movie">
                                <Link to={`/movie/detailsmovie/${movie.slug}`}>
                                    <div className="image-container">
                                        <LazyLoadImage
                                            src={`${movie.poster_url}`}
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
