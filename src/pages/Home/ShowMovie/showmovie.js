/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import { getPhimLe, getPhimCapNhat, getPhimBo, getTvShow, getHoatHinh } from '../../../Api/api';
import { Link } from 'react-router-dom';
import Loading from '../../../components/Loading/loading';
import Slider from "react-slick";
import './showmovie.css';
import Banner from '../../../components/banner/banner';
import { HiChevronRight } from "react-icons/hi";
const ShowHomePage = () => {
    const [phimCapNhat, setPhimCapNhat] = useState(null);
    const [phimLe, setPhimLe] = useState(null);
    const [titlePL, settitlePL] = useState(null);

    const [phimBo, setPhimBo] = useState(null);
    const [titlePB, settitlePB] = useState(null);

    const [tvShow, setTvShow] = useState(null);
    const [titleTv, setTitleTv] = useState(null);

    const [hoatHinh, setHoatHinh] = useState(null);
    const [titleHH, setTitleHH] = useState(null);

    const [favourite, setFavourite] = useState(() => {
        const storedFavourites = localStorage.getItem('favourite');
        return storedFavourites ? JSON.parse(storedFavourites) : [];
    });

    const settings = {
        dots: false,
        infinite: false,
        speed: 1000,
        slidesToShow: 6,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const phimCapNhatLS = localStorage.getItem('phimCapNhat');
                const phimLeLS = localStorage.getItem('phimLe');
                const phimBoLS = localStorage.getItem('phimBo');
                const tvShowLS = localStorage.getItem('tvShow');
                const hoatHinhLS = localStorage.getItem('hoatHinh');

                if (phimCapNhatLS && phimLeLS && phimBoLS && tvShowLS && hoatHinhLS) {
                    setPhimCapNhat(JSON.parse(phimCapNhatLS));
                    setPhimLe(JSON.parse(phimLeLS));
                    setPhimBo(JSON.parse(phimBoLS));
                    setTvShow(JSON.parse(tvShowLS));
                    setHoatHinh(JSON.parse(hoatHinhLS));
                    settitlePL(JSON.parse(localStorage.getItem('titlePL')));
                    settitlePB(JSON.parse(localStorage.getItem('titlePB')));
                    setTitleTv(JSON.parse(localStorage.getItem('titleTv')));
                    setTitleHH(JSON.parse(localStorage.getItem('titleHH')));
                }
                const { phimCapNhat } = await getPhimCapNhat();
                setPhimCapNhat(phimCapNhat);
                localStorage.setItem('phimCapNhat', JSON.stringify(phimCapNhat));

                const { phimLe, titlePL } = await getPhimLe();
                setPhimLe(phimLe);
                settitlePL(titlePL);
                localStorage.setItem('phimLe', JSON.stringify(phimLe));
                localStorage.setItem('titlePL', JSON.stringify(titlePL));

                const { phimBo, titlePB } = await getPhimBo();
                setPhimBo(phimBo);
                settitlePB(titlePB);
                localStorage.setItem('phimBo', JSON.stringify(phimBo));
                localStorage.setItem('titlePB', JSON.stringify(titlePB));

                const { tvShow, titleTv } = await getTvShow();
                setTvShow(tvShow);
                setTitleTv(titleTv);
                localStorage.setItem('tvShow', JSON.stringify(tvShow));
                localStorage.setItem('titleTv', JSON.stringify(titleTv));

                const { hoatHinh, titleHH } = await getHoatHinh();
                setHoatHinh(hoatHinh);
                setTitleHH(titleHH);
                localStorage.setItem('hoatHinh', JSON.stringify(hoatHinh));
                localStorage.setItem('titleHH', JSON.stringify(titleHH));
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };
        fetchData();
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
            {phimCapNhat && phimBo && phimLe && tvShow && hoatHinh ? (
                <>
                    <Banner />

                    <div className="show_series">
                        <div className='category'>
                            <Link to={"/movie/phim_moi_cap_nhat"}>
                                Phim mới cập nhật <HiChevronRight className='icon'/>
                            </Link>
                        </div>
                        <Slider {...settings}>
                            {phimCapNhat.map(movie => (
                                <div key={movie.id} className="movie">
                                    <Link to={`/movie/detailsmovie/${movie.slug}`}>
                                        <div className="image-container">
                                            <img
                                                src={`${movie.poster_url}`}
                                                alt="hinh-anh"
                                                placeholderSrc='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEN3UB3h1qrRON7O1XZxgqETeyN5OlV8_wsg&s'
                                            />
                                            <div className="image-overlay">
                                                <p>{movie.name}</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className='favourite'>
                                       
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
                            
                        </Slider>
                    </div>
                    <div className="show_series">
                        <div className='category'><Link to={"/movie/phim_bo"}>{titlePB.titlePage} <HiChevronRight className='icon'/></Link></div>
                        <Slider {...settings}>
                            {phimBo.map(movie => (
                                <div key={movie.id} className="movie">
                                    <Link to={`/movie/detailsmovie/${movie.slug}`}>
                                        <div className="image-container">
                                            <img
                                                src={`https://img.phimapi.com/${movie.poster_url}`}
                                                alt="hinh-anh"
                                                placeholderSrc='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEN3UB3h1qrRON7O1XZxgqETeyN5OlV8_wsg&s'
                                            />
                                            <div className="image-overlay">
                                                <p>{movie.name}</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className='favourite'>
                                        
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
                                <Link to={"/movie/phim_bo"}><button>Xem Thêm</button></Link>
                            </div>
                        </Slider>
                    </div>
                    <div className="show_series">
                        <div className='category'><Link to={"/movie/phim_le"} >{titlePL.titlePage}<HiChevronRight className='icon'/></Link></div>
                        <Slider {...settings}>
                            {phimLe.map(movie => (
                                <div key={movie.id} className="movie">
                                    <Link to={`/movie/detailsmovie/${movie.slug}`}>
                                        <div className="image-container">
                                            <img
                                                src={`https://img.phimapi.com/${movie.poster_url}`}
                                                alt="hinh-anh"
                                                placeholderSrc='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEN3UB3h1qrRON7O1XZxgqETeyN5OlV8_wsg&s'
                                            />
                                            <div className="image-overlay">
                                                <p>{movie.name}</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className='favourite'>
                                      
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
                                <Link to={"/movie/phim_le"}><button>Xem Thêm</button></Link>
                            </div>
                        </Slider>
                    </div>
                    <div className="show_series">
                        <div className='category'><Link to={"/movie/tvshow"}>{titleTv.titlePage}<HiChevronRight className='icon'/></Link></div>
                        <Slider {...settings}>
                            {tvShow.map(movie => (
                                <div key={movie.id} className="movie">
                                    <Link to={`/movie/detailsmovie/${movie.slug}`}>
                                        <div className="image-container">
                                            <img
                                                src={`https://img.phimapi.com/${movie.poster_url}`}
                                                alt="hinh-anh"
                                                placeholderSrc='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEN3UB3h1qrRON7O1XZxgqETeyN5OlV8_wsg&s'
                                            />
                                            <div className="image-overlay">
                                                <p>{movie.name}</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className='favourite'>
                                      
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
                                <Link to={"/movie/tvshow"}><button>Xem Thêm</button></Link>
                            </div>
                        </Slider>
                    </div>
                    <div className="show_series">
                        <div className='category'><Link to={"/movie/phim_hoat_hinh"}>{titleHH.titlePage}<HiChevronRight className='icon'/></Link></div>
                        <Slider {...settings}>
                            {hoatHinh.map(movie => (
                                <div key={movie.id} className="movie">
                                    <Link to={`/movie/detailsmovie/${movie.slug}`}>
                                        <div className="image-container">
                                            <img
                                                src={`https://img.phimapi.com/${movie.poster_url}`}
                                                alt="hinh-anh"
                                                placeholderSrc='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEN3UB3h1qrRON7O1XZxgqETeyN5OlV8_wsg&s'
                                            />
                                            <div className="image-overlay">
                                                <p>{movie.name}</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className='favourite'>
                                       
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
                                <Link to={"/movie/phim_hoat_hinh"}><button>Xem Thêm</button></Link>
                            </div>
                        </Slider>
                    </div>
                </>
            ) : (
                <div className='loading'>
                    <Loading />
                </div>
            )}
        </div>
    );
};

export default ShowHomePage;
