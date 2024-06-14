/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import './banner.css';
import { getPhimCapNhat } from '../../Api/api';
import { useNavigate } from 'react-router-dom';
import { GoChevronRight } from "react-icons/go";
const Banner = () => {
    const [phimCapNhat, setPhimCapNhat] = useState([]);
    const [slideIndex, setSlideIndex] = useState(0);
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate(`/movie/search/keyword/${keyword}`);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {

                const phimCapNhatLS = localStorage.getItem('phimCapNhat');

                if (phimCapNhatLS) {
                    setPhimCapNhat(JSON.parse(phimCapNhatLS));
                }
                const { phimCapNhat } = await getPhimCapNhat();
                setPhimCapNhat(phimCapNhat);
                console.log("phimCapNhat:", phimCapNhat);


                localStorage.setItem('phimCapNhat', JSON.stringify(phimCapNhat));
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex(prevIndex => (prevIndex + 1) % phimCapNhat.length);
        }, 30000);

        return () => clearInterval(interval);
    }, [phimCapNhat]);

    return (
        <div className="slideshow-container">
            {
                phimCapNhat ? (
                    phimCapNhat.map((item, index) => (
                        <div
                            className={`mySlides fade ${index === slideIndex ? 'active' : ''}`}
                            key={item.id || index} // Use a unique key
                        >
                            <img src={`${item.thumb_url}`} style={{ width: '100%', height: '100%' }} alt={`${item.thumb_url}`} />
                            <div className="text">
                                <h1>Unlimited movies, TV shows, and more</h1>
                                <p>Watch anywhere. Cancel anytime.</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className='search'>
                                    <input required value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder='Search movies...' />
                                    <button type='submit'>Search <GoChevronRight className='icon'/></button>
                                </div>
                            </form>
                        </div>
                    ))
                ) : (
                    <></>
                )
            }
        </div>
    );
};

export default Banner;

