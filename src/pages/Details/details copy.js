import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDetailMovie } from '../../Api/api';
import Loading from '../../components/Loading/loading';
import './details.css';
import { Link } from 'react-router-dom';
import Modal from '../../components/Modal/modal';
import SimilarMovie from "../SimilarMovie/similarmovie";

const DetailsMovie = () => {
    const { slug } = useParams();
    const [details, setDetails] = useState(null);
    const [category, setCategory] = useState(null);
    const [country, setCountry] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showIframe, setShowIframe] = useState(false);
    const [commentUrl, setCommentUrl] = useState('');
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const detailsLS = localStorage.getItem(`details_${slug}`);
                const categoryLS = localStorage.getItem(`category_${slug}`);
                const countryLS = localStorage.getItem(`country_${slug}`);
                const episodesLS = localStorage.getItem(`episodes_${slug}`);

                if (detailsLS && categoryLS && countryLS && episodesLS) {
                    setDetails(JSON.parse(detailsLS));
                    setCategory(JSON.parse(categoryLS));
                    setCountry(JSON.parse(countryLS));
                    setEpisodes(JSON.parse(episodesLS));
                    setCommentUrl(`https://vinhdat04.github.io/movie/detailsmovie/${slug}`);
                } else {
                    const { details, category, country, episodes } = await getDetailMovie(slug);
                    setDetails(details);
                    setCategory(category);
                    setCountry(country);
                    setEpisodes(episodes);
                    setCommentUrl(`https://vinhdat04.github.io/movie/detailsmovie/${slug}`);

                    localStorage.setItem(`details_${slug}`, JSON.stringify(details));
                    localStorage.setItem(`category_${slug}`, JSON.stringify(category));
                    localStorage.setItem(`country_${slug}`, JSON.stringify(country));
                    localStorage.setItem(`episodes_${slug}`, JSON.stringify(episodes));
                }

                if (window.FB) {
                    window.FB.XFBML.parse();
                }
            } catch (error) {
                console.error('Error fetching movie details:', error);
                if (error) {
                    const error = "Hiện không có dữ liệu phim!";
                    setError(error);
                }
            }
        };

        fetchData();
    }, [slug]);

    useEffect(() => {
        if (window.FB) {
            window.FB.XFBML.parse();
        }
    }, [commentUrl]);

    const getEmbedUrl = (url) => {
        try {
            if (url.includes('v=')) {
                return url.split('v=')[1].split('&')[0];
            } else if (url.includes('youtu.be/')) {
                return url.split('youtu.be/')[1].split('?')[0];
            } else {
                const params = new URLSearchParams(new URL(url).search);
                return params.get('v') || "dQw4w9WgXcQ"; // Default video ID
            }
        } catch {
            return "dQw4w9WgXcQ";
        }
    };


    const handleShowModal = () => {
        setShowModal(true);
        setShowIframe(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowIframe(false);
    };

    return (
        <div>
            {error ? (
                <div className='not_found'>
                    <p>{error}</p>
                    <button>
                        <Link to={"/Movix"}>Về Trang Chủ</Link>
                    </button>
                </div>
            ) : (
                <>
                    {details ? (
                        <>
                            <div className='details_container'>
                                <div className='content' style={{ backgroundImage: `url('${details.thumb_url}')` }}>
                                    <div className='content_item'>
                                        <img src={`${details.poster_url}`} alt={details.name} />
                                    </div>
                                    <div className='content_item1'>
                                        <h5>{details.name}</h5>
                                        <p>{details.origin_name}</p>
                                        <div>
                                            {category && category.map(item => (
                                                <span key={item.id}>{item.name}</span>
                                            ))}
                                        </div>
                                        <div className='watch'>
                                            <div className='quality'>
                                                {details.episode_current && details.episode_current === 'Full' ? (
                                                    <h3 style={{ fontSize: "18px" }}>{details.episode_current}</h3>
                                                ) : (
                                                    <h3>{details.episode_current}</h3>
                                                )}
                                            </div>
                                            {details.trailer_url === "" ? (
                                                ""
                                            ) : (
                                                <div className='trailer' onClick={handleShowModal}>
                                                    <button>Trailer <i className="fa-brands fa-youtube fa-beat-fade"></i></button>
                                                </div>
                                            )}
                                            {episodes.length > 0 ? (
                                                <div className='watch_now'>
                                                    <Link to={`/movie/detailsmovie/watch/${details.slug}`}>
                                                        <button>Xem Phim <i className="fa-solid fa-play fa-shake"></i></button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <p>No episodes available.</p>
                                            )}
                                        </div>
                                        <div className='overview'>
                                            <h5>Mô tả phim</h5>
                                            <p>{details.content}</p>
                                        </div>
                                        <div className='info'>
                                            {details.status && (
                                                <div className='info_item'>
                                                    <h5>Trạng thái:<p>{details.status}</p></h5>
                                                    <h5>Tập phim:<p>{details.episode_current}</p></h5>
                                                    <h5>Thời lượng:<p>{details.time}</p></h5>
                                                </div>
                                            )}
                                            {details.country && (
                                                <div className='info_item'>
                                                    <h5>Quốc gia:{country && country.map(item => (<p key={item.id}>{item.name}</p>))}</h5>
                                                </div>
                                            )}
                                            {details.actor && (
                                                <div className='info_item'>
                                                    <h5>Diễn viên:<p>{details.actor + ""}</p></h5>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='trailer_container'>
                                    <Modal show={showModal} handleClose={handleCloseModal}>
                                        {showIframe && details.trailer_url && (
                                            <iframe
                                                title="YouTube Video"
                                                width="900"
                                                height="500"
                                                src={`https://www.youtube.com/embed/${getEmbedUrl(details.trailer_url)}?autoplay=1`}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>

                                        )}
                                    </Modal>
                                </div>
                            </div>

                        </>
                    ) : (
                        <div className='loading'>
                            <Loading />
                        </div>
                    )}
                    <SimilarMovie />
                    <>
                        <div className='comment_container'>
                            <div className="fb-comments" data-href={commentUrl} data-width="1000" data-numposts="5"></div>
                        </div>
                    </>
                </>
            )}

        </div>
    );
};

export default DetailsMovie;
