import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div>
            <div className='footer_container'>
                <div className='navbar_footer'>
                    <ul>
                        <li><Link to={"/info/terms-of-use"} onClick={handleClick}>terms of use</Link></li>
                        <li><Link to={"/info/privacy-policy"} onClick={handleClick}>privacy policy</Link></li>
                        <li><Link to={"/info/about"} onClick={handleClick}>about</Link></li>
                        <li><Link to={"/info/blog"} onClick={handleClick}>blog</Link></li>
                        <li><Link to={"/info/faq"} onClick={handleClick}>faq</Link></li>
                    </ul>
                </div>
                <div className='footer_text'>
                    <p>Movix là một trang web chuyên cung cấp các bộ phim và chương trình truyền hình chất lượng cao. Với giao diện thân thiện và dễ sử dụng, Movix mang đến cho người dùng một trải nghiệm xem phim tuyệt vời với hàng ngàn tựa phim đa dạng thuộc nhiều thể loại như hành động, hài, kinh dị, lãng mạn, và khoa học viễn tưởng. Người dùng có thể dễ dàng tìm kiếm và khám phá các bộ phim yêu thích, cập nhật những bộ phim mới nhất và các chương trình truyền hình nổi tiếng. Đặc biệt, Movix còn cung cấp thông tin chi tiết về từng bộ phim, bao gồm nội dung, diễn viên, và đánh giá, giúp người xem có cái nhìn tổng quan trước khi quyết định xem phim. Hãy truy cập Movix để tận hưởng thế giới giải trí phong phú và đa dạng ngay hôm nay!</p>
                </div>
                <div className='social'>
                    <ul>
                        <li><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f"></i></a></li>
                        <li><a href="https://x.com/?lang=vi" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-twitter"></i></a></li>
                        <li><a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin-in"></i></a></li>
                        <li><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Footer;
