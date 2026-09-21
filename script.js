const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});


/* Our Work gallery: add your image filename to this list whenever you add a new image to images/. */
const ourWorkImages = [
  "images/crates-1.svg",
  "images/crates-2.svg",
  "images/crates-3.svg",
  "images/industrial-crates-mixed.svg",
  "images/stacked-crates-orange-blue.svg",
  "images/vegetable-crates-green.svg"
];

const ourWorkGallery = document.querySelector(".gallery");
if (ourWorkGallery && ourWorkImages.length) {
  ourWorkGallery.innerHTML = ourWorkImages.map((src, index) => `
    <div class="gallery-item">
      <img src="${src}" alt="Fortune Enterprises crate product ${index + 1}" loading="lazy"
           onerror="this.closest('.gallery-item').style.display='none';">
    </div>
  `).join("");
}


/* Our Work gallery - automatically loads every image in the GitHub /images folder. */
async function loadOurWorkGallery() {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  // This works automatically for normal username.github.io/repository-name GitHub Pages sites.
  const hostParts = window.location.hostname.split(".");
  const owner = hostParts[0];
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const repo = hostParts.length >= 3 && hostParts[1] === "github" && hostParts[2] === "io"
    ? (pathParts[0] || `${owner}.github.io`)
    : null;

  if (!owner || !repo) {
    console.warn("Automatic GitHub image loading needs a GitHub Pages URL.");
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/images`
    );

    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

    const files = await response.json();

    const imageFiles = files
      .filter(file => file.type === "file" && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name))
      .sort((a, b) => a.name.localeCompare(b.name));

    gallery.innerHTML = imageFiles.map(file => `
      <div class="gallery-item">
        <img src="${file.download_url}" alt="${file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")}" loading="lazy">
      </div>
    `).join("");

    if (!imageFiles.length) {
      gallery.innerHTML = "<p>No images added yet. Add photos to the images folder.</p>";
    }
  } catch (error) {
    console.error("Unable to load images from GitHub:", error);
    gallery.innerHTML = "<p>Images could not be loaded right now.</p>";
  }
}

loadOurWorkGallery();
