<div id="emoji">💸️</div>
<script>
    const emoji = document.getElementById("emoji");

    // Taille de l'emoji
    const emojiSize = 80; // en pixels
    let x = 100;
    let y = 100;
    let dx = 3;
    let dy = 2;

    function animate() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      x += dx;
      y += dy;

      // Rebond sur les bords
      if (x + emojiSize >= width || x <= 0) {
        dx = -dx;
      }

      if (y + emojiSize >= height || y <= 0) {
        dy = -dy;
      }

      emoji.style.left = x + "px";
      emoji.style.top = y + "px";

      requestAnimationFrame(animate);
    }

    animate();
</script>





