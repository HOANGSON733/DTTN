import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailMovie } from "../../Api/api";
import Loading from "../../components/Loading/loading";
import Hls from "hls.js";
import "./watch.css";
const DetailsMovie = () => {
  const { slug } = useParams();
  const [details, setDetails] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
 
  const [isLightsOff, setIsLightsOff] = useState(false);
  
  const videoRef = useRef(null);
  const [activeLink, setActiveLink] = useState("");
  const [watchedEpisodes, setWatchedEpisodes] = useState(
    new Set(JSON.parse(localStorage.getItem("watchedEpisodes")) || [])
  );

  const handleClick = (link) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveLink(link);
    setWatchedEpisodes((prevWatched) => {
      const updatedWatched = new Set(prevWatched).add(link);
      localStorage.setItem(
        "watchedEpisodes",
        JSON.stringify([...updatedWatched])
      );
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
          video.play().catch((error) => {
            console.error("Error attempting to play:", error);
          });
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = link;
        video.addEventListener("loadedmetadata", () => {
          video.play().catch((error) => {
            console.error("Error attempting to play:", error);
          });
        });
      }
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredEpisodes(
      episodes.map((server) => ({
        ...server,
        server_data: server.server_data.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        ),
      }))
    );
  };


  const toggleLights = () => {
    setIsLightsOff(!isLightsOff);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { details, episodes } = await getDetailMovie(slug);
        console.log("Fetched details:", details);
        console.log("Fetched episodes:", episodes);
        setDetails(details);
        setEpisodes(episodes);
        setFilteredEpisodes(episodes);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    if (episodes.length > 0 && episodes[0].server_data.length > 0) {
      console.log(
        "Auto-playing first episode:",
        episodes[0].server_data[0].link_m3u8
      );
      handleClick(episodes[0].server_data[0].link_m3u8);
    }
  }, [episodes]);

  return (
    <div className={`details_container ${isLightsOff ? "lights-off" : ""}`}>
      {details ? (
        <div>
          <div
            style={{ backgroundImage: `url('${details.thumb_url}')` }}
            className="video"
          >
            <video ref={videoRef} width="100%" height="auto" controls>
              Your browser does not support the video tag.
            </video>
            <button onClick={toggleLights} className="toggle-lights">
              {isLightsOff ? "Turn On Lights" : "Turn Off Lights"}
            </button>
          </div>
          <div className="episodes">
            <h1 className="Name">{details.name}</h1>
            <p className="title1">Chất lượng: {details.quality}</p>
            <div className="title">
              <h5>Danh sách phim</h5>
            </div>
            <input
              type="text"
              placeholder="Search episodes..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-bar"
            />
            {filteredEpisodes.length > 0 ? (
              filteredEpisodes.map((server, index) => (
                <div key={index} className="info_item">
                  {server.server_data.map((item, idx) => (
                    <div key={idx} className="button_container">
                      <button
                        onClick={() => handleClick(item.link_m3u8)}
                        style={{
                          background:
                            activeLink === item.link_m3u8
                              ? "#de1b1f"
                              : watchedEpisodes.has(item.link_m3u8)
                              ? "#242424"
                              : "#474747",
                        }}
                      >
                        {item.name}
                      </button>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p>No episodes available.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="loading">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default DetailsMovie;
