import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDetailMovie } from '../../Api/api';
import Loading from '../../components/Loading/loading';
import Hls from 'hls.js';
import './watch.css';

const DetailsMovie = () => {
    const { slug } = useParams();
    const [details, setDetails] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const videoRef = useRef(null);
    const [activeLink, setActiveLink] = useState('');
    const [watchedEpisodes, setWatchedEpisodes] = useState(new Set(JSON.parse(localStorage.getItem('watchedEpisodes')) || []));

    const handleClick = (link) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveLink(link);
        setWatchedEpisodes((prevWatched) => {
            const updatedWatched = new Set(prevWatched).add(link);
            localStorage.setItem('watchedEpisodes', JSON.stringify([...updatedWatched]));
            return updatedWatched;
        });

        const video = videoRef.current;
        if (video) {
            console.log("Setting video source to:", link);
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(link);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play();
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = link;
                video.addEventListener('loadedmetadata', () => {
                    video.play();
                });
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { details, episodes } = await getDetailMovie(slug);
                console.log('Fetched details:', details);
                console.log('Fetched episodes:', episodes);
                setDetails(details);
                setEpisodes(episodes);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };

        fetchData();
    }, [slug]);

    useEffect(() => {
        if (episodes.length > 0 && episodes[0].server_data.length > 0) {
            console.log('Auto-playing first episode:', episodes[0].server_data[0].link_m3u8);
            handleClick(episodes[0].server_data[0].link_m3u8);
        }
    }, [episodes]);

    return (
        <div>
            {details ? (
                <div className='details_container'>
                    <div style={{ backgroundImage: `url('${details.thumb_url}')` }} className='video'>
                        <video ref={videoRef} width="100%" height="auto" controls>
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className='episodes'>
                        <div className='title'>
                            <h5>Danh sách phim</h5>
                        </div>
                        {episodes.length > 0 ? episodes.map((server, index) => (
                            <div key={index} className='info_item'>
                                {server.server_data.map((item, idx) => (
                                    <div key={idx} className='button_container'>
                                        <button
                                            onClick={() => handleClick(item.link_m3u8)}
                                            style={{
                                                background: activeLink === item.link_m3u8
                                                    ? "#359000"
                                                    : watchedEpisodes.has(item.link_m3u8)
                                                    ? "#444"
                                                    : "linear-gradient(98.37deg, #f89e00 .99%, #da2f68 100%)"
                                            }}
                                        >
                                            {item.name}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )) : <p>No episodes available.</p>}
                    </div>
                </div>
            ) : (
                <div className='loading'>
                    <Loading />
                </div>
            )}
        </div>
    );
};

export default DetailsMovie;
