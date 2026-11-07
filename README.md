# Absolute Colouring 🎨

A cheerful, tactile kids art studio and colouring game featuring 50 hand-crafted vector scenes across 8 magical worlds. Built with modern web standards, zero runtime dependencies, pure Web Audio API sound synthesis, and deployable instantly on Cloudflare Workers.

🌟 **Live Game:** [https://colouring.nextgenlabs.workers.dev](https://colouring.nextgenlabs.workers.dev)

---

## 🎨 50 Colouring Scenes across 8 Worlds

- 🐻 **Animals (8):** Cuddly Bear, Kitty Cat, Happy Puppy, Bunny Hop, Playful Fox, Brave Lion Cub, Cheerful Panda, Baby Elephant
- 🦕 **Dinosaurs (6):** Dino Roar, Stego Stomp, Dino Egg, Gentle Brachio, Sky Pterosaur, Three-Horn Trike
- 🚗 **Things that go (6):** Zoom Car, Big Truck, Choo Choo Train, Sky Flyer, Little Sailboat, Yellow Submarine
- 🐠 **Under the sea (6):** Friendly Fish, Octopus Party, Whale Splash, Sea Turtle, Jumping Dolphin, Beach Crab
- 🚀 **Space (5):** Rocket to the Stars, Space Robot, UFO Visit, Little Astronaut, Ringed Planet
- 🦄 **Make believe (6):** Magic Castle, Unicorn Dreams, Little Dragon, Ocean Mermaid, Magic Hat & Wand, Meadow Fairy
- 🧁 **Yummy treats (6):** Cupcake Cutie, Ice Cream Stack, Donut Party, Cheesy Pizza, Happy Burger, Birthday Cake
- 🌈 **Nature (7):** Flower Power, Rainbow Skies, Big Friendly Tree, Sunny Weather, Mushroom Cottage, Butterfly Bloom, Campfire Night

---

## ✨ Studio Features

- 🪣 **Tap-to-Fill (Bucket):** Instant coloring of SVG regions with gentle highlight glow.
- 🖍️ **Freehand Drawing:** Smooth crayon, marker, and sparkling glitter trail brushes with 3 size options.
- ⭐ **Sticker Stamps:** 16 cheerful emoji stamps (stars, hearts, flowers, butterflies, paw prints, crowns, balloons).
- 🧽 **Eraser:** Cleans individual regions or removes freehand brush strokes.
- ✨ **12 Magic Designer Themes:** Bubblegum Pop, Sunny Day, Ocean Splash, Jungle Jumble, Galaxy Glow, Pastel Dream, Neon Night, Rainbow Party, Forest Friends, Mono Pop, Sherbet Fizz, Mermaid Lagoon.
- 🔊 **Synthesized Web Audio Engine:** Zero audio asset dependencies. Pure procedural audio pops, fills, stamps, sparkle chimes, and celebration fanfare.
- ↩️ **Undo / Redo:** 50-step history stack.
- 💾 **Save & Print:** Exports high-res PNG pictures and clean coloring sheet printouts.
- 🎉 **Tada Celebration:** High-performance 60fps confetti cannon with celebration chime.
- 💾 **Progress Persistence:** Remembers colored pages and previews them in the gallery.

---

## 🚀 Development & Deployment

### Local Server
```bash
node server.js
# Or
npm start
```
Open [http://localhost:3000](http://localhost:3000)

### Automated Test Suite
```bash
node tools/test.mjs
# Or
npm test
```

### Build & Deploy to Cloudflare Workers
```bash
npm run deploy
```
Deployed at: **[https://colouring.nextgenlabs.workers.dev](https://colouring.nextgenlabs.workers.dev)**
