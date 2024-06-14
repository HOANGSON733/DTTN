import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';  // assuming you're using react-slick for the slider
import { getDetailMovie, getPhimCapNhat, getSimilarMovie } from '../../Api/api';
import Loading from "../../components/Loading/loading";

const DetailsMovie = () => {
    const { slug } = useParams();
    const [category, setCategory] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [details, setDetails] = useState(null);
    const [phimCapNhat, setPhimCapNhat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favourite, setFavourite] = useState(() => {
        const storedFavourites = localStorage.getItem('favourite');
        return storedFavourites ? JSON.parse(storedFavourites) : [];
    });

    useEffect(() => {
        const fetchData = async () => {
            try {

                const similarLS = localStorage.getItem('similar');
                const phimCapNhatLS = localStorage.getItem('phimCapNhats');

                if (similarLS && phimCapNhatLS) {
                    setSimilar(JSON.parse(similarLS));
                    setPhimCapNhat(JSON.parse(phimCapNhatLS));
                }

                setLoading(true);
                const { category, details } = await getDetailMovie(slug);
                const { similar } = await getSimilarMovie();
                const { phimCapNhat } = await getPhimCapNhat();

                setCategory(category);
                setSimilar(similar);
                setDetails(details)
                setPhimCapNhat(phimCapNhat);
                setLoading(false);

                localStorage.setItem('similar', JSON.stringify(similar));
                localStorage.setItem('phimCapNhats', JSON.stringify(phimCapNhat));
            } catch (error) {
                console.error('Error fetching movie details:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    useEffect(() => {
        if (!loading) {
            window.scrollTo(0, 0);
        }
    }, [loading]);

    const settings = {
        dots: false,
        infinite: false,
        speed: 1000,
        slidesToShow: 5,
        slidesToScroll: 2,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    initialSlide: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 320,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ]
    };

    if (loading) {
        return <Loading />;
    }

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
        <>
            {similar.length > 0 && phimCapNhat ? (
                <>
                    <div className="show_series">
                        <div className="category">phim tương tự</div>
                        <Slider {...settings}>
                            {similar.length > 0 ? (
                                similar.map(movie => {
                                    const SimilarCategory = movie.category.filter(cate =>
                                        category.some(itemdetails => itemdetails.name === cate.name)
                                    );

                                    const SimilarType = (movie.type === details.type)
                                    const SimilarName = (movie.name !== details.name)



                                    if (SimilarType && SimilarCategory.length > 0 && SimilarName) {
                                        return (
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
                                        );
                                    }
                                    return null;
                                })
                            ) : (<>
                                <div className="no_data">Không có phim tương tự</div>
                            </>)}

                        </Slider>
                    </div>

                    <div className="show_series">
                        <div className='category'>đề xuất phim mới</div>
                        <Slider {...settings}>
                            {phimCapNhat && phimCapNhat.map(movie => (
                                <div key={movie.id} className="movie">
                                    <Link to={`/movie/detailsmovie/${movie.slug}`}>
                                        <div className="image-container">
                                            <img
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
                            <div className='view_more'>
                                <Link to={"/movie/phim_moi_cap_nhat"}><button>Xem thêm</button></Link>
                            </div>
                        </Slider>
                    </div>
                </>
            ) : (
                <div>Loading...</div>
            )}


        </>
    );
};

export default DetailsMovie;
