import React from 'react';
import Home from '../pages/Home/home';
import DetailsMovie from '../pages/Details/details';
import WatchMovie from '../pages/Watch/watch';
import Search from "../pages/Search/search";
import PhimLe from '../pages/PhimLe/phimle';
import PhimBo from '../pages/PhimBo/phimbo';
import PhimHoatHinh from '../pages/PhimHoatHinh/phimhoathinh';
import PhimMoi from '../pages/PhimMoi/phimmoi';
import TvShow from '../pages/TvShow/tvshow';
import { Link, Route, Routes } from 'react-router-dom';
import GenresMovie from '../pages/GenresMovie/genresmovie';
import FilterMovie from '../pages/FilterMovie/filtermovie';
import Info from '../pages/Info/info';
import ListFavourite from '../pages/FavouriteMovie/favouritemovie'


const Router = () => {
    return (
        <div>
            <Routes>
                <Route path="/Movix" element={<Home />} />
                <Route path="/" element={<Home />} />
                <Route path="/movie/detailsmovie/:slug" element={<DetailsMovie />} />
                <Route path="/movie/detailsmovie/watch/:slug" element={<WatchMovie />} />
                <Route path="/movie/search/keyword/:keyword" element={<Search />} />
                <Route path="/movie/phim_le" element={<PhimLe />} />
                <Route path="/movie/phim_bo" element={<PhimBo />} />
                <Route path="/movie/phim_hoat_hinh" element={<PhimHoatHinh />} />
                <Route path="/movie/tvshow" element={<TvShow />} />
                <Route path="/movie/phim_moi_cap_nhat" element={<PhimMoi />} />
                <Route path="/movie/genres/:slug" element={<GenresMovie />} />
                <Route path="/movie/filter" element={<FilterMovie />} />
                <Route path="/info/:slug" element={<Info />} />
                <Route path="/movie/list_favourite_movie" element={<ListFavourite />} />
                {/* Neu khong tim thay route */}
                <Route path="*" element={
                    <div className='not_found'>
                        <p>Không tìm thấy trang!</p>
                        <button>
                            <Link to={"/Movix"}>Về Trang Chủ</Link>
                        </button>
                    </div>
                } />
            </Routes>
        </div>

    );
};

export default Router;
