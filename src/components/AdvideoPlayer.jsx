import {useEffect, useRef} from "react";
import styled from "styled-components";


const Player = styled.div`
    max-width: 640px; 
    max-height: 480px; 
    margin-left: auto; 
    margin-right: auto;
`;

export const AdvideoPlayer = (mediaSrc, userId, playerId) => {
    const playerEl = useRef(null);

    useEffect(() => {
        const cfg = [{
            playerElement: document.querySelector(".advideo-player"),
            userId: "4",
            playerId: "105",
            mediaSrc,
        }];
        const script = document.createElement("script");
        script.async = true;
        // script.src = "https://beta.advideo.ru/videocontent/global/js/novia/v3/nvp_loader.js?"+(new Date().getTime());
        script.src = "https://cdn.tvno.ru/videocontent/global/js/novia/prod/v3/nvp_loader.js?"+(new Date().getTime());
        script.onload = function() {
            const start = function(createNvpPlayer) {
                createNvpPlayer(cfg);
            };
            window.NVP_PLR = window.NVP_PLR ? start(window.NVP_PLR.createNvpPlayer) : { onPlayerLoad: start };
        };
        document.head.appendChild(script);
    }, []);

    return (
        <Player className="advideo-player"></Player>
    );
}
