---
layout: default
title: Home
---

<div class="hero">
  <div class="hero-grid">
    <div>
      <div class="kicker"><span class="dot"></span> Open‑source compliance automation</div>

      <h1>
        <span class="gradient-text">Get compliant fast</span><br/>
        without the busywork
      </h1>

      <p class="lede">
        GeekyGoose Compliance helps teams map evidence to controls, spot gaps, and ship audit‑ready reporting using AI —
        with support for local models (Ollama) and cloud providers.
      </p>

      <div class="hero-actions">
        <a class="btn btn-primary" href="https://github.com/q7technology/GeekyGoose-Compliance-Community" target="_blank" rel="noopener">View on GitHub</a>
        <a class="btn btn-ghost" href="{{ '/license' | relative_url }}">Review licensing</a>
        <a class="btn btn-outline" href="{{ '/commercial' | relative_url }}">Commercial options</a>
      </div>

      <div style="margin-top:16px;" class="pills">
        <span class="pill">Essential Eight</span>
        <span class="pill">ISO 27001 (roadmap)</span>
        <span class="pill">NIST / CIS (extensible)</span>
        <span class="pill">Multi‑tenant</span>
      </div>
    </div>

    <div class="hero-card">
      <h3>At a glance</h3>
      <div class="metric"><span class="num">0.3.0</span><span class="lbl">Current release</span></div>
      <div class="metric"><span class="num">AI</span><span class="lbl">Evidence → Control mapping</span></div>
      <div class="metric"><span class="num">Docker</span><span class="lbl">One‑command deploy</span></div>
      <div class="pills">
        <span class="pill">FastAPI</span>
        <span class="pill">Next.js</span>
        <span class="pill">Postgres</span>
        <span class="pill">MinIO</span>
        <span class="pill">Redis</span>
      </div>
    </div>
  </div>
</div>

<section class="section">
  <div class="section-title">
    <div>
      <h2>What you get</h2>
      <p>Clarity: simple sections, clean cards, and a single story from “scan” → “gap” → “report”.</p>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="icon">🤖</div>
      <h3>AI‑powered analysis</h3>
      <p>Automatically scan documents and map evidence to controls, with gap detection and remediation suggestions.</p>
    </div>

    <div class="card">
      <div class="icon">📊</div>
      <h3>Stakeholder reporting</h3>
      <p>Executive‑friendly summaries plus detailed, audit‑ready artefacts for assessors and internal reviewers.</p>
    </div>

    <div class="card">
      <div class="icon">🧩</div>
      <h3>Framework‑ready</h3>
      <p>Essential Eight today, with a clean path to ISO 27001, NIST CSF, CIS Controls and more.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="section-title">
    <div>
      <h2>Quick start</h2>
      <p>Run it locally in minutes with Docker Compose.</p>
    </div>
  </div>
  
<div markdown="1">
```bash
git clone https://github.com/q7technology/GeekyGoose-Compliance-Community.git
cd GeekyGoose-Compliance-Community

cp .env.example .env
docker-compose up -d

docker-compose exec api python init_db.py
docker-compose exec api python run_seed.py

# Open the web app
# http://localhost:3000
```</div>

  <div class="callout">
    <strong>Tip:</strong>
    <p>If you’re exposing the web UI to your LAN, check the <a href="{{ '/network-architecture' | relative_url }}">Network Architecture</a> page for the recommended Docker network layout.</p>
  </div>
</section>

<section class="section">
  <div class="section-title">
    <div>
      <h2>Licensing that fits</h2>
      <p>Stay open for the community, while protecting commercial use cases.</p>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="icon">🆓</div>
      <h3>Community (AGPLv3)</h3>
      <p>Perfect for self‑hosted/internal deployments and evaluation. Network use + modifications require source availability.</p>
      <div style="margin-top:14px;"><a class="btn btn-ghost" href="{{ '/license' | relative_url }}">Learn more</a></div>
    </div>

    <div class="card">
      <div class="icon">💼</div>
      <h3>Commercial</h3>
      <p>For SaaS/hosted offerings, private modifications, embedding, or when you want support + SLAs.</p>
      <div style="margin-top:14px;"><a class="btn btn-primary" href="{{ '/commercial' | relative_url }}">See options</a></div>
    </div>

    <div class="card">
      <div class="icon">🏷️</div>
      <h3>Trademark</h3>
      <p>Code is open; the name & logo are protected. Clear rules for forks, resellers, and community projects.</p>
      <div style="margin-top:14px;"><a class="btn btn-ghost" href="{{ '/trademark' | relative_url }}">Read policy</a></div>
    </div>
  </div>
</section>
