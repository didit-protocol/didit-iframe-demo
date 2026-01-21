# Didit Iframe Demo

Embed [Didit](https://didit.me) identity verification in your web app using an iframe.

## Quick Start

```bash
git clone https://github.com/didit-protocol/didit-iframe-demo.git
cd didit-iframe-demo
node server.js
```

Open http://localhost:3000 and choose a demo.

> For API Session, copy `.env.example` to `.env` and add your credentials first.

---

## Integration Methods

| Method | Backend Required | Callback | Best For |
|--------|-----------------|----------|----------|
| **UniLink** | No | From workflow config | Most use cases |
| **API Session** | Yes | Per-session | Custom data per user (vendor_data, metadata) |

---

## UniLink Integration (Recommended)

The simplest way to integrate. Just use your workflow's UniLink URL directly in an iframe — no backend needed.
The callback url will be the one you have in the workflow settings (in case you have one)

### Get Your UniLink URL

1. Go to the [Didit Console](https://business.didit.me)
2. Go to the workflow you want and click on → **Copy Link**
3. You will have copied the unilink URL (format: `https://verify.didit.me/u/{workflow_id_base64}`)

<img src="_readme/images/copy-link.gif" alt="Copy Link" width="400">

### Setup

1. Open `unilink.html`
2. Paste your UniLink URL (replace in line 103 of unilink.html):
   ```javascript
   const UNILINK_URL = 'https://verify.didit.me/u/YOUR_WORKFLOW_ID_BASE64';;
   ```
3. Open `unilink.html` in your browser (or serve with any static server)

### Copy & Paste (for your project)

**HTML:**

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

**CSS:**

```css
/* modal overlay */
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

/* modal content */
.didit-modal-content {
  position: relative;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

/* iframe */
#didit-iframe {
  width: 100%;
  height: 700px;
  border: none;
  display: block;
}
```

**JavaScript:**

```javascript
// paste your unilink url from the didit console
const UNILINK_URL = 'https://verify.didit.me/u/YOUR_WORKFLOW_ID_BASE64';

function openDiditModal() {
  document.getElementById('didit-iframe').src = UNILINK_URL;
  document.getElementById('didit-modal').classList.add('active');
}

function closeDiditModal() {
  document.getElementById('didit-modal').classList.remove('active');
  document.getElementById('didit-iframe').src = '';
}

// close on backdrop click
document.getElementById('didit-modal').addEventListener('click', (e) => {
  if (e.target.id === 'didit-modal') closeDiditModal();
});
```

**Usage:**

```html
<button onclick="openDiditModal()">Verify Identity</button>
```

> **Required:** The `allow` attribute on the iframe is mandatory for camera access during liveness detection.

---

## API Session Integration (Advanced)

Use this method when you need to:
- Pass custom `vendor_data` or `metadata` per session
- Set a different `callback` URL per session
- Track sessions server-side before verification starts

### Setup

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your credentials from [Didit Console](https://business.didit.me):
   ```
   API_KEY=your_api_key_here
   WORKFLOW_ID=your_workflow_id_here
   VERIFICATION_API_BASE_URL=verification.didit.me
   ```

3. Start server:
   ```bash
   node server.js
   ```

4. Open http://localhost:3000/api-session.html

### How It Works

1. Backend creates a session via [Create Session API](https://docs.didit.me/reference/create-session-verification-sessions)
2. API returns a `verification_url`
3. Frontend loads the URL in an iframe

---

## Project Structure

```
├── index.html        # landing page
├── unilink.html      # unilink demo (no backend)
├── api-session.html  # api session demo (requires backend)
├── server.js         # node.js server for api method
├── .env              # your credentials (gitignored)
└── .env.example      # template
```

## API Reference

- [UniLinks](https://docs.didit.me/reference/uni-links) - Fixed verification URLs
- [Create Session](https://docs.didit.me/reference/create-session-verification-sessions) - API session creation
- [Web App Integration](https://docs.didit.me/reference/web-app) - Integration options
- [Webhooks](https://docs.didit.me/reference/webhooks) - Get notified when verification completes

## License

MIT
