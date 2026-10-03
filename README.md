# 🧠 NeuroLab

A browser-based platform for building and running cognitive science experiments with millisecond-accurate timing, no coding required.

**Live demo:** https://YOUR-APP.vercel.app
**Backend API:** https://YOUR-API.onrender.com
**Repo:** https://github.com/YOUR_USERNAME/NeuroLab

> The backend runs on a free tier and may take up to a minute to wake up on the first request.

## The problem

Cognitive science research has traditionally been limited to labs with specialised equipment and small participant pools. Running millisecond-sensitive experiments on the web is technically hard, which keeps researchers from reaching larger, more diverse samples. NeuroLab makes this accessible.

## Features

- **High-precision timing engine:** stimulus onset is recorded inside `requestAnimationFrame` (synced to the screen paint), and reaction times use `event.timeStamp` and `performance.now()` high-resolution clocks.
- **Visual experiment builder:** no code needed. Start from a template or build from scratch, with editable trials, colours, keys, fixation and time limits, plus trial randomisation.
- **Ready-made templates:** Stroop Test (response inhibition), Reaction Time Test (response speed) and Memory Recall (short-term memory). Every template has editable parameters.
- **Anonymous and ethical data handling:** random participant IDs (`crypto.randomUUID()`), a consent screen before every study, and no personal data collected.
- **Results dashboard:** participants, mean reaction time, accuracy, a full trial table and CSV export.
- **Shareable links:** copy a participant link and open it on any device.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), React Router |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| Hosting | Vercel (frontend), Render (backend) |

## Project structure

```
NeuroLab/
├── server/
│   ├── server.js
│   ├── config/db.js
│   ├── models/          Experiment.js, Response.js
│   ├── controllers/     experimentController.js, responseController.js
│   └── routes/          experimentRoutes.js, responseRoutes.js
└── client/
    └── src/
        ├── App.jsx, api.js, templates.js, index.css
        ├── pages/       Landing, Dashboard, Builder, Participate, Run, ResultsList, Results, NotFound
        └── components/  TrialRunner.jsx
```

## Run locally

**Prerequisites:** Node.js (LTS) and a free MongoDB Atlas cluster.



Open http://localhost:5173.

## Environment variables

| Where | Variable | Purpose |
|---|---|---|
| `server/.env` | `MONGO_URI` | MongoDB Atlas connection string |
| `server/.env` | `PORT` | Server port (default 5000) |
| Vercel | `VITE_API_URL` | URL of the deployed backend |

## Known limitations

- Browser timing accuracy is limited by monitor refresh rate (about 16.7 ms at 60 Hz) and input hardware, so it's typically within a few milliseconds of lab setups.
- There are no researcher accounts yet, so all experiments are visible to everyone.

## Future work

- Researcher login and private experiments
- Conditional branching and custom logic between trials
- Charts and analysis in the results page
- More templates (n-back, Flanker, Go/No-Go)
- Image and audio stimuli

## Team

Built for BIT N BUILD 
