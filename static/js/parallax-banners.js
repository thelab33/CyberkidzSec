/* Parallax banners powered by GSAP + ScrollTrigger */
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray(".parallax-banner").forEach(el => {
    const img = el.querySelector("img");
    img && gsap.to(img, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: .3 }
    });
  });
});
