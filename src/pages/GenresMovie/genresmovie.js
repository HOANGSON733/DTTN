import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getGenres, getGenresMovie } from '../../Api/api';
import Loading from '../../components/Loading/loading';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ReactPaginate from 'react-paginate';
import Filterform from '../../components/FilterForm/filterform';

const GenresMovie = () => {
    const { slug } = useParams();
    const [genresMovie, setGenresMovie] = useState([]);
    const [genres, setGenres] = useState([]);
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
                // const genresMovieLS = localStorage.getItem('genresMovie');

                // if (genresMovieLS) {
                //     setGenresMovie(JSON.parse(genresMovieLS));
                // }

                const { genresMovie } = await getGenresMovie();
                const { genres } = await getGenres();

                setGenresMovie(genresMovie);
                // localStorage.setItem('genresMovie', JSON.stringify(genresMovie));
                setGenres(genres);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    const filteredMovies = genresMovie.filter(movie =>
        movie.category.some(item => item.slug === slug)
    );

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                <div className='film_component'>
                    <Filterform />
                    <div className='category'>
                        {genres.map(genre => (
                            genre.slug === slug && (
                                <div key={genre.slug} style={{ color: "#f89e00" }}>
                                    #{genre.name} | <span style={{ color: "rgb(139 92 246)", fontSize: "20px" }}>{filteredMovies.length} Kết quả</span>
                                </div>
                            )
                        ))}

                    </div>
                    <div className="list">
                        {currentPageData.map(movie => (
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
            )}
        </div>
    );
};

export default GenresMovie;
