# Jarvis AI — frontend prototype

A mobile-friendly web app prototype for Jarvis AI, a smart assistant concept for learning, writing and business support.

## Files
- `index.html` — page structure and navigation
- `style.css` — responsive dark/electric-blue design
- `script.js` — navigation and demo interactions

## Run locally
Open `index.html` in a modern browser. No build step is needed for this frontend prototype.

## Important limitations
This version is a frontend prototype. The chat uses sample responses; it is not connected to a live AI model. There are no real user accounts, cloud storage, payment processing, or image/voice generation yet.

Before connecting a real AI provider:
- Create a backend/server function.
- Keep API keys on the server, never in browser JavaScript.
- Add authentication, rate limits, privacy protections and age-appropriate safeguards.
- Review provider pricing and terms before enabling paid features.

## Next development milestones
1. Test the mobile layout.
2. Add secure backend and real AI chat.
3. Add authentication and user data storage.
4. Add carefully scoped study and writing tools.
5. Evaluate installable PWA support.
