const audio = document.getElementById("audioPlayer");
const playPause = document.getElementById("playPause");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.getElementById("progressContainer");
const volumeControl = document.getElementById("volumeControl");

playPause.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playPause.textContent = "⏸️";
  } else {
    audio.pause();
    playPause.textContent = "▶️";
  }
});

audio.addEventListener("timeupdate", () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = progress + "%";
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value;
});


let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
  const sliderWrapper = document.querySelector('.slider-wrapper');
  const slideWidth = slides[0].clientWidth;
  sliderWrapper.style.transform = `translateX(-${index * slideWidth}px)`;
}

setInterval(() => {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}, 3000); // Troca de slide a cada 3 segundos
