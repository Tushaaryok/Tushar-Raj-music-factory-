

// --- Elements Selection ---
const playPauseBtn = document.querySelector('.play-pause-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const shuffleBtn = document.querySelector('.shuffle-btn');
const repeatBtn = document.querySelector('.repeat-btn');
const volumeSlider = document.querySelector('.volume-slider');
const progressBar = document.querySelector('.progress-bar');
const progressContainer = document.querySelector('.progress-container');
const albumArt = document.querySelector('.album-art');
const songTitle = document.querySelector('.song-title');
const artistName = document.querySelector('.artist-name');
const currentTimeEl = document.querySelector('.current-time');
const totalDurationEl = document.querySelector('.total-duration');
const themeToggle = document.querySelector('.theme-toggle');
const moonIcon = document.querySelector('.moon-icon');
const sunIcon = document.querySelector('.sun-icon');
const playlistToggle = document.querySelector('.playlist-toggle');
const playlistPanel = document.querySelector('.playlist-panel');
const closePlaylistBtn = document.querySelector('.close-playlist');
const playlistEl = document.querySelector('.playlist');
const musicPlayer = document.querySelector('.music-player');

// --- Global Variables ---
const audio = new Audio();
let isPlaying = false;
let currentSongIndex = 0;
let isShuffleOn = false;
let isRepeatOn = false;

// --- Song Data Array ---
const songs = [
    {
        title: "B Munnde",
        artist: "AP Dillo",
        src: "songs/B Munnde.mp4",
        img: "images/B munnde.jpeg"
    },
    {
        title: "Man Meri Jaan",
        artist: "King",
        src: "songs/Man Meri Jaan.mp4",
        img: "images/Man meri jaan.jpeg"
    },
    {
        title: "safar",
        artist: "jass",
        src: "songs/safar.mp4",
        img: "images/safer.jpeg"
    },
    {
        title: "Nadania",
        artist: "tushar",
        src: "songs/Nadania.mp4",
        img: "images/nadania.jpeg"
    },
    {
        title: "pal pal",
        artist: "tushar / afusic ",
        src: "songs/pal pal.mp4",
        img: "images/pal pal.jpeg"
    },
     {
        title: "paL paLr imix",
        artist:"fusic X talwinder",
        src: "songs/tk.mp4",
        img: "images/pal pal.jpeg"
    },
     {
        title: "te re te",
        artist: "kuldeep ",
        src: "songs/Te Re Te .mp4",
        img: "images/safer.jpeg"
    },
     {
        title: "t branded",
        artist: "yehhhhh ",
        src: "songs/lelo.mp4",
        img: "mages/safer.jpeg"
    }
    //  {
    //     title: "",
    //     artist: " ",
    //     src: "",
    //     img: ""
    // }
];

// --- Core Functions ---

/**
 * Loads a song into the audio player and updates the UI.
 * @param {number} index The index of the song to load.
 */
function loadSong(index) {
    if (index >= songs.length || index < 0) {
        console.error("Invalid song index");
        return;
    }

    currentSongIndex = index;
    const song = songs[currentSongIndex];

    audio.src = song.src;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    albumArt.src = song.img;
    updatePlaylistUI();

    audio.onloadedmetadata = () => {
        totalDurationEl.textContent = formatTime(audio.duration);
    };

    if (isPlaying) {
        audio.play();
        musicPlayer.classList.add('playing');
    }
}

/**
 * Toggles the play/pause state of the music player.
 */
function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="ri-play-fill"></i>';
        musicPlayer.classList.remove('playing');
    } else {
        audio.play();
        playPauseBtn.innerHTML = '<i class="ri-pause-fill"></i>';
        musicPlayer.classList.add('playing');
    }
    isPlaying = !isPlaying;
    saveState();
}

/**
 * Plays the next song in the playlist. Handles shuffle and repeat logic.
 */
function nextSong() {
    if (isShuffleOn) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === currentSongIndex);
        currentSongIndex = newIndex;
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    loadSong(currentSongIndex);
    audio.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="ri-pause-fill"></i>';
    musicPlayer.classList.add('playing');
    saveState();
}

/**
 * Plays the previous song in the playlist.
 */
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="ri-pause-fill"></i>';
    musicPlayer.classList.add('playing');
    saveState();
}

/**
 * Updates the progress bar and time display as the song plays.
 */
function updateProgress() {
    const { duration, currentTime } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    currentTimeEl.textContent = formatTime(currentTime);

    // Auto-play next song on finish
    if (currentTime === duration) {
        if (isRepeatOn) {
            audio.currentTime = 0;
            audio.play();
        } else {
            nextSong();
        }
    }
}

/**
 * Seeks to a new position in the song based on a click on the progress bar.
 * @param {Event} e The click event.
 */
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

/**
 * Formats a time in seconds to a string (e.g., "3:45").
 * @param {number} time The time in seconds.
 * @returns {string} The formatted time string.
 */
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

/**
 * Saves the current state (song index, volume, theme) to localStorage.
 */
function saveState() {
    localStorage.setItem('lastSongIndex', currentSongIndex);
    localStorage.setItem('lastVolume', audio.volume);
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

/**
 * Loads the saved state from localStorage.
 */
function loadState() {
    const savedIndex = localStorage.getItem('lastSongIndex');
    const savedVolume = localStorage.getItem('lastVolume');
    const savedTheme = localStorage.getItem('theme');

    if (savedIndex !== null) {
        currentSongIndex = parseInt(savedIndex, 10);
        loadSong(currentSongIndex);
    } else {
        loadSong(0); // Load first song if no state is saved
    }

    if (savedVolume !== null) {
        audio.volume = savedVolume;
        volumeSlider.value = savedVolume;
    }

    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    }
}

/**
 * Toggles the theme between dark and light mode.
 */
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    moonIcon.classList.toggle('hidden');
    sunIcon.classList.toggle('hidden');
    saveState();
}

/**
 * Toggles the visibility of the playlist panel.
 */
function togglePlaylistPanel() {
    playlistPanel.classList.toggle('open');
}

/**
 * Generates and displays the playlist items.
 */
function renderPlaylist() {
    playlistEl.innerHTML = ''; // Clear existing playlist
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.classList.add('playlist-item');
        li.dataset.index = index;

        li.innerHTML = `
            <img src="${song.img}" alt="${song.title}">
            <div class="song-item-info">
                <h4>${song.title}</h4>
                <span>${song.artist}</span>
            </div>
        `;
        
        li.addEventListener('click', () => {
            loadSong(index);
            audio.play();
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="ri-pause-fill"></i>';
            musicPlayer.classList.add('playing');
            saveState();
            togglePlaylistPanel();
        });

        playlistEl.appendChild(li);
    });
    updatePlaylistUI();
}

/**
 * Highlights the current song in the playlist.
 */
function updatePlaylistUI() {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.index) === currentSongIndex) {
            item.classList.add('active');
        }
    });
}

// --- Event Listeners ---
playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    saveState();
});
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
themeToggle.addEventListener('click', toggleTheme);
playlistToggle.addEventListener('click', togglePlaylistPanel);
closePlaylistBtn.addEventListener('click', togglePlaylistPanel);

shuffleBtn.addEventListener('click', () => {
    isShuffleOn = !isShuffleOn;
    shuffleBtn.classList.toggle('active', isShuffleOn);
});

repeatBtn.addEventListener('click', () => {
    isRepeatOn = !isRepeatOn;
    repeatBtn.classList.toggle('active', isRepeatOn);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
    } else if (e.code === 'ArrowRight') {
        nextSong();
    } else if (e.code === 'ArrowLeft') {
        prevSong();
    }
});

// --- Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    renderPlaylist();
});