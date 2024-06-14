import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFilterMovie } from '../../Api/api';
import Loading from '../../components/Loading/loading';

import ReactPaginate from 'react-paginate';
import Filterform from '../../components/FilterForm/filterform';
import { LazyLoadImage } from 'react-lazy-load-image-component';


const FilterMovie = () => {
    const [filterMovie, setFilterMovie] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(15);
    const [favourite, setFavourite] = useState(() => {
        const storedFavourites = localStorage.getItem('favourite');
        return storedFavourites ? JSON.parse(storedFavourites) : [];
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { filterMovie } = await getFilterMovie();
                setFilterMovie(filterMovie);

            } catch (error) {
                console.error('Error fetching movie details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const genresFilter = localStorage.getItem("genresFilter");
    const countryFilter = localStorage.getItem("countryFilter");
    const yearFilter = localStorage.getItem("yearFilter");
    const typeFilter = localStorage.getItem("typeFilter");


    const filteredMovies = filterMovie.filter(movie =>
        (genresFilter ? movie.category.some(item => item.slug === genresFilter) : true) &&
        (countryFilter ? movie.country.some(item => item.slug === countryFilter) : true) &&
        (yearFilter ? movie.year.toString() === yearFilter : true) &&
        (typeFilter ? movie.type.toString() === typeFilter : true)
    );

    const handlePageClick = (data) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentPage(data.selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentPageData = filteredMovies ? filteredMovies.slice(offset, offset + itemsPerPage) : [];

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
            {loading ? (
                <Loading />
            ) : (
                filteredMovies.length > 0 ? (
                    <div className='film_component'>
                        <Filterform></Filterform>
                        <div className='category'>
                            kết quả đã lọc: <span style={{ color: "rgb(139 92 246)" }}>{filteredMovies.length} Kết quả</span>
                        </div>
                        <div className="list">

                            {currentPageData.map((movie) => (
                                <div key={movie.id} className="movie">
                                    <Link to={`/movie/detailsmovie/${movie.slug}`}>
                                        <div className="image-container">
                                            <LazyLoadImage
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
                            <ReactPaginate
                                previousLabel={<i className="fa-sharp fa-solid fa-arrow-left"></i>}
                                nextLabel={<i className="fa-sharp fa-solid fa-arrow-right"></i>}
                                pageCount={Math.ceil(filteredMovies.length / itemsPerPage)}
                                marginPagesDisplayed={0}
                                pageRangeDisplayed={5}
                                breakLabel={""}
                                onPageChange={handlePageClick}
                                containerClassName={"paginate"}
                                subContainerClassName={"pages pagination"}
                                activeClassName={"active"}
                            />
                            <div className='result'>
                                <p>Trang {currentPage + 1}/{Math.ceil(filteredMovies.length / itemsPerPage)} | Tổng {filteredMovies.length} Kết quả</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='not_found'>
                        <p>Không tìm thấy phim!</p>
                        <button>
                            <Link to={"/Movix"}>Về Trang Chủ</Link>
                        </button>
                    </div>
                ))
            }
        </div>
    );
};

export default FilterMovie;
