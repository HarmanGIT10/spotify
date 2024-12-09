let currentSong = new Audio();
let play = document.querySelector("#play");
let songs;
function convertToMinSec(seconds) {
    // Round the seconds to the nearest whole number to exclude milliseconds
    seconds = Math.floor(seconds);

    const minutes = Math.floor(seconds / 60); // Get the number of minutes
    const remainingSeconds = seconds % 60; // Get the remaining seconds

    // Format minutes and seconds to always show two digits
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Return the formatted time as "mm:ss"
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/spotify/songs/");
    let response = await a.text();
    console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = track;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }


    const songInfo = document.querySelector(".songinfo");
    const songTime = document.getElementsByClassName("songtime")[0];

    songTime.style.position = "absolute";
    songTime.style.bottom = "14px";

    songInfo.style.fontSize = "20px";
    songInfo.style.position = "absolute";
    songInfo.style.right = "20px";
    songInfo.style.bottom = "14px";
    songInfo.style.textAlign = "right";
    songInfo.style.color = "white";
    songInfo.style.margin = "0";

    let songName = track.split("/songs/")[1].replaceAll("%20", " ");
    document.querySelector(".songinfo").innerHTML = songName;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {
    songs = await getsongs();
    console.log(songs);
    playMusic(songs[0], true)

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        let songName = song.split("/songs/")[1].replaceAll("%20", " ");
        songUL.innerHTML += `
            <li>
                <img class="invert size" src="music.svg" alt="">
                <div class="info">
                    <div class="songname">${songName}</div>
                    <div class="songart">Random Person</div>
                </div>
                <div class="playnow">
                    <div>Play <br>Now</div>
                    <img class="invert size" src="play.svg" alt="">
                </div>
            </li>`;
        document.querySelector(".songlist").style.marginTop = "20px";
        document.querySelector(".songlist").style.marginLeft = "15px";
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            console.log(`Playing: ${songs[index]}`);
            playMusic(songs[index]);
        });
    });

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });
   
    


    currentSong.addEventListener("loadedmetadata", () => {

        document.querySelector(".songtime").innerHTML = `${convertToMinSec(currentSong.currentTime)}/${convertToMinSec(currentSong.duration)}`;
    });

    currentSong.addEventListener("timeupdate", () => {

        if (!isNaN(currentSong.duration)) {
            document.querySelector(".songtime").innerHTML = `${convertToMinSec(currentSong.currentTime)}/${convertToMinSec(currentSong.duration)}`;
        }
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    document.querySelector("#next").addEventListener("click", () => {
        let currentIndex = songs.indexOf(currentSong.src);
        let nextIndex = (currentIndex + 1) % songs.length;
        playMusic(songs[nextIndex]);
    });

    document.querySelector("#previous").addEventListener("click", () => {
        let currentIndex = songs.indexOf(currentSong.src);
        let prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        playMusic(songs[prevIndex]);
    });
    


    
}

main();
