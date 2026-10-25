// Runs inline in <head>, before the first paint, so nothing flashes in and then hides. It marks <html data-motion>
// (the CSS in app/tokens.css only hides blocks under it), then marks each block `data-in` as it scrolls into view.
// Skipped with reduced motion or without IntersectionObserver, and without JavaScript it never runs: the page
// then shows in full, as before.
export const motionScript = `(function () {
  var d = document.documentElement;
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  d.setAttribute("data-motion", "");
  function start() {
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.style.setProperty("--reveal-delay", n++ * 70 + "ms");
        el.setAttribute("data-in", "");
        io.unobserve(el);
        // Drop the delay once in, so a tab switch later on shows its rows straight away
        setTimeout(function () { el.style.removeProperty("--reveal-delay"); }, 1200 + n * 70);
      });
    }, { rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".site main > :not(header), .site main > header > *, .site footer").forEach(function (el) {
      io.observe(el);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();`;
