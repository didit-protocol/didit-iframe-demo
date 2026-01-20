# Didit Iframe Demo

A minimal demo showing how to embed [Didit](https://didit.me) identity verification in a web app using an iframe.

## Quick Start

1. **Copy environment file and add your credentials:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your credentials from the [Didit Console](https://business.didit.me):**
   ```
   API_KEY=your_api_key_here
   WORKFLOW_ID=your_workflow_id_here
   VERIFICATION_API_BASE_URL=verification.didit.me
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```

4. **Open http://localhost:3000**

## How It Works

1. **Backend** creates a verification session via the [Create Session API](https://docs.didit.me/reference/create-session-verification-sessions)
2. **Frontend** receives the `verification_url` and loads it in an iframe
3. **User** completes the verification flow inside the embedded iframe

## Project Structure

```
├── server.js      # node.js server - proxies api calls, keeps api_key secure
├── index.html     # frontend with iframe modal
├── .env           # your credentials (gitignored)
└── .env.example   # template for credentials
```

## Configuration

| Variable | Description |
|----------|-------------|
| `API_KEY` | Your API key from the Didit Console |
| `WORKFLOW_ID` | The workflow ID to use for verification sessions |
| `VERIFICATION_API_BASE_URL` | API host (`verification.didit.me`) |

## Copy & Paste Integration

### 1. CSS (add to your stylesheet)

```css
/* modal overlay - covers the screen with dark background */
#didit-modal {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
#didit-modal.active { display: flex; }

/* modal content - centered card */
.didit-modal-content {
  position: relative;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

/* iframe - full width inside modal */
#didit-iframe {
  width: 100%;
  height: 700px;
  border: none;
  display: block;
}
```

### 2. HTML (add anywhere in your body)

```html
<div id="didit-modal">
  <div class="didit-modal-content">
    <iframe
      id="didit-iframe"
      allow="camera; microphone; fullscreen; autoplay; encrypted-media"
    ></iframe>
  </div>
</div>
```

### 3. JavaScript (open/close the modal)

```javascript
// open modal with verification url
function openDiditModal(verificationUrl) {
  document.getElementById('didit-iframe').src = verificationUrl;
  document.getElementById('didit-modal').classList.add('active');
}

// close modal
function closeDiditModal() {
  document.getElementById('didit-modal').classList.remove('active');
  document.getElementById('didit-iframe').src = '';
}

// close on backdrop click (optional)
document.getElementById('didit-modal').addEventListener('click', (e) => {
  if (e.target.id === 'didit-modal') closeDiditModal();
});
```

### Usage

After creating a session via your backend, call:

```javascript
openDiditModal(response.url);
```

> **Required:** The `allow` attribute on the iframe is mandatory for camera access during liveness detection.

## API Reference

- [Create Session](https://docs.didit.me/reference/create-session-verification-sessions) - Create verification sessions
- [Web App Integration](https://docs.didit.me/reference/web-app) - Iframe and redirect options
- [Webhooks](https://docs.didit.me/reference/webhooks) - Get notified when verification completes

## License

MIT
