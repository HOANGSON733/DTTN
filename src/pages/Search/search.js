import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSearch } from '../../Api/api';
import './search.css';
import Loading from '../../components/Loading/loading';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ReactPaginate from 'react-paginate';
import Filterform from '../../components/FilterForm/filterform';

const Search = () => {
    const { keyword } = useParams();
    console.log("Keyword", keyword);
    const [timkiem, setTimKiem] = useState(null);
    const [titlePage, setTitlePage] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(15);
    const [favourite, setFavourite] = useState(() => {
        const storedFavourites = localStorage.getItem('favourite');
        return storedFavourites ? JSON.parse(storedFavourites) : [];
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { timkiem, titlePage } = await getSearch(keyword);
                setTimKiem(timkiem);
                setTitlePage(titlePage);
                console.log("sssssssssss", titlePage);
                console.log("Kết quả tìm kiếm:", timkiem);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };

        fetchData();
    }, [keyword]);

    const handlePageClick = (data) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentPage(data.selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentPageData = timkiem ? timkiem.slice(offset, offset + itemsPerPage) : [];

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
            {timkiem ? (
                timkiem.length > 0 ? (
                    <div className="film_component">
                        <Filterform />
                        {timkiem.length > 0 && (
                            <div >
                                <div className='category' style={{ color: "#f89e00" }}>#{titlePage} | <span style={{ color: "rgb(139 92 246)" }}>{timkiem.length} Kết quả </span></div>
                            </div>
                        )}
                        <div className='list'>
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
                                pageCount={Math.ceil(timkiem.length / itemsPerPage)}
                                marginPagesDisplayed={0}
                                pageRangeDisplayed={5}
                                breakLabel={""}
                                onPageChange={handlePageClick}
                                containerClassName={"paginate"}
                                subContainerClassName={"pages pagination"}
                                activeClassName={"active"}
                            />
                            <div className='result'>
                                <p>Trang {currentPage + 1}/{Math.ceil(timkiem.length / itemsPerPage)} | Tổng {timkiem.length} Kết quả</p>
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
                )
            ) : (
                <Loading />
            )}
        </div>
    );
};

export default Search;
