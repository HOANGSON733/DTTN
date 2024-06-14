import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './navbar.css';
import ModalSearch from '../ModalSearch/modalsearch';
import { getGenres } from '../../Api/api';

const Navbar = () => {
    const [menu, setMenu] = useState(null);
    const [menuGenres, setMenuGenres] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [genres, setGenres] = useState('');
    const navigate = useNavigate();
    const searchInputRef = useRef(null);
    const dropdownRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
  

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { genres } = await getGenres();
                setGenres(genres);
                console.log("Genres", genres);
            } catch (error) {
                console.error('Error fetching Genres:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (showModal) {
            searchInputRef.current.focus();
        }
    }, [showModal]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate(`/movie/search/keyword/${keyword}`);
        setShowModal(false);
        setKeyword('');
    };

    const handleClick = (category) => {
        setMenu(category);
        setMenuOpen(false);
        window.scrollTo({ top: 0 });
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDropdownToggle = (category) => {
        setDropdownOpen(!dropdownOpen);
        setMenu(category);
    };

    const handleClickGenres = (cate) => {
        setDropdownOpen(!dropdownOpen);
        window.scrollTo({ top: 0 });
        setMenuOpen(!menuOpen);
        setMenuGenres(cate);
    };

    localStorage.setItem("logo", "https://movix-taupe.vercel.app/assets/movix-logo-d720c325.svg")
    const logo = localStorage.getItem("logo");

    return (
        <>
            <div className='navbar_container'>
                <div className={`navbar ${menuOpen ? 'active' : ''}`}>
                    <div className='logo'>
                        <Link style={menu === "trang_chu" ? { borderBottom: "none" } : {}} onClick={() => handleClick('trang_chu')} to={'/Movix'}>
                            <img
                                className="logo"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
                                alt="Netflix Logo"
                            />
                        </Link>
                    </div>
                    <button className='menu-toggle' onClick={toggleMenu}>
                        {menuOpen ? <i class="fa-solid fa-xmark"></i> : <i class="fa-solid fa-bars"></i>}
                    </button>
                    <div className={`bar ${menuOpen ? 'active' : ''}`}>
                        <ul>
                            <li><Link style={menu === "trang_chu" ? { borderBottom: "none" } : {}} onClick={() => handleClick('trang_chu')} to='/Movix'>Trang Chủ</Link></li>
                            <li><Link style={menu === "phim_moi_cap_nhat" ? { borderBottom: "3px solid rgb(139 92 246 )" } : {}} onClick={() => handleClick('phim_moi_cap_nhat')} to='/movie/phim_moi_cap_nhat'>Tất Cả Phim</Link></li>
                            <li><Link style={menu === "phim_le" ? { borderBottom: "3px solid rgb(139 92 246 )" } : {}} onClick={() => handleClick('phim_le')} to='/movie/phim_le'>Phim Lẻ</Link></li>
                            <li><Link style={menu === "phim_bo" ? { borderBottom: "3px solid rgb(139 92 246 )" } : {}} onClick={() => handleClick('phim_bo')} to='/movie/phim_bo'>Phim Bộ</Link></li>
                            <li><Link style={menu === "tvshow" ? { borderBottom: "3px solid rgb(139 92 246 )" } : {}} onClick={() => handleClick('tvshow')} to='/movie/tvshow'>Tv Show</Link></li>
                            <li><Link style={menu === "phim_hoat_hinh" ? { borderBottom: "3px solid rgb(139 92 246 )" } : {}} onClick={() => handleClick('phim_hoat_hinh')} to='/movie/phim_hoat_hinh'>
                                Phim Hoạt Hình</Link></li>
                            <li className='dropdown' ref={dropdownRef}>
                                <Link style={menu === "genres" ? { borderBottom: "3px solid rgb(139 92 246 )" } : {}} onClick={() => handleDropdownToggle('genres')}>
                                    Thể Loại <i className="fa-solid fa-caret-down"></i>
                                </Link>
                                <div className={`dropdown_content ${dropdownOpen ? 'active' : ''}`}>
                                    <div className='genres_content'>
                                        {genres && genres.map(item => (
                                            <Link style={menuGenres === item.slug ? { backgroundColor: "#fff", color: "#000" } : {}} onClick={() => handleClickGenres(item.slug)} key={item.slug} to={`/movie/genres/${item.slug}`}>{item.name}</Link>
                                        ))}
                                    </div>
                                </div>
                            </li>
                            <li><Link style={menu === "list_favourite_movie" ? { borderBottom: "3px solid rgb(139 92 246 )" } : {}} onClick={() => handleClick('list_favourite_movie')} to="/movie/list_favourite_movie">Yêu Thích</Link></li>
                            <li className='find' onClick={handleShowModal} style={{ color: "#fff", cursor: "pointer" }}><i className="fa-solid fa-magnifying-glass"></i></li>
                        </ul>
                    </div>
                </div>
            </div>
            <ModalSearch show={showModal} handleClose={handleCloseModal}>
                <form onSubmit={handleSubmit}>
                    <div className='modal_search'>
                        <input ref={searchInputRef} required value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder='Tìm kiếm phim hoặc tv show...'></input>
                        <button onClick={() => handleClick()} type='submit'><i className="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                </form>
            </ModalSearch>
        </>
    );
};

export default Navbar;
