# 🎬 Awesome Seedance 2.5 — API, Prompts & Complete Guide

> The ultimate resource for Seedance 2.5 — ByteDance's next-gen AI video generation model. Covers API integration, prompt engineering, camera controls, multimodal workflows, and curated examples.

[![Seedance 2.5](https://img.shields.io/badge/Seedance-2.5-blue)](https://seed.bytedance.com)
[![Stars](https://img.shields.io/github/stars/Anil-matcha/awesome-seedance-2.5-api-prompts?style=social)](https://github.com/Anil-matcha/awesome-seedance-2.5-api-prompts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Table of Contents

- [What is Seedance 2.5?](#what-is-seedance-25)
- [Seedance 2.5 vs 2.0 — What's New](#seedance-25-vs-20--whats-new)
- [Capabilities](#capabilities)
- [API Integration](#api-integration)
  - [fal.ai](#falai)
  - [Replicate](#replicate)
  - [Volcano Engine / BytePlus](#volcano-engine--byteplus)
- [API Parameters](#api-parameters)
- [Prompt Engineering Guide](#prompt-engineering-guide)
  - [The 6-Step Formula](#the-6-step-formula)
  - [Camera Movement Vocabulary](#camera-movement-vocabulary)
  - [Lighting Keywords](#lighting-keywords)
  - [Multimodal Reference Syntax](#multimodal-reference-syntax)
- [Prompt Templates by Category](#prompt-templates-by-category)
  - [Cinematic / Film](#cinematic--film)
  - [Social Media / UGC](#social-media--ugc)
  - [Anime & Stylized](#anime--stylized)
  - [Advertising / Product](#advertising--product)
  - [Multi-Shot Sequences](#multi-shot-sequences)
- [Advanced Workflows](#advanced-workflows)
- [Tips & Best Practices](#tips--best-practices)
- [API Providers Comparison](#api-providers-comparison)
- [Resources & Links](#resources--links)

---

## What is Seedance 2.5?

**Seedance 2.5** is ByteDance's latest AI video generation model, built on the Seed video foundation. It is a significant upgrade over Seedance 2.0, with a focus on:

- **Multi-shot storytelling** — generate longer, cinematically coherent narratives from a single prompt
- **Character & brand consistency** — maintain the same face, clothing, and style across all shots
- **Director-grade camera control** — precise rack focus, crane shots, whip pans, and more
- **Native audio synchronization** — tighter lip-sync and sound design baked in at generation time
- **Better physics & motion stability** — realistic fluid dynamics, cloth simulation, and crowd motion

Seedance 2.5 accepts **text, images, video clips, and audio** as input and outputs **MP4 video with synchronized audio**.

---

## Seedance 2.5 vs 2.0 — What's New

| Feature | Seedance 2.0 | Seedance 2.5 |
|---|---|---|
| Multi-shot coherence | Basic | Director-grade, single-pass |
| Character consistency | Good | Excellent (cross-shot) |
| Camera controls | Standard | Advanced (rack focus, crane, whip pan) |
| Audio sync / lip-sync | Present | Enhanced, tighter |
| Physics / motion | Standard | Improved cloth & fluid sim |
| Style fusion | Basic | Brand-safe style fusion |
| Max resolution | 1080p | 1080p+ |
| Max duration | 15s | Longer sequences |

---

## Capabilities

- **Text-to-Video** — generate video from a text prompt alone
- **Image-to-Video** — animate a still image with motion
- **Video-to-Video** — restyle or extend an existing video clip
- **Audio-to-Video** — sync visuals to a provided audio track
- **Multi-modal** — combine text + image + audio in one generation
- **AI Dance / Motion Transfer** — make people, pets, or characters perform dance movements

### Supported Input Formats
- Images: JPEG, PNG, WebP (up to 9 images)
- Video: MP4, MOV (up to 3 clips, 15s total)
- Audio: WAV, MP3 (up to 3 files)

### Output Specs
- Resolutions: 480p, 720p, 1080p
- Durations: 4–15 seconds per clip
- Aspect Ratios: `21:9` `16:9` `4:3` `1:1` `3:4` `9:16`
- Format: MP4 with synchronized audio

---

## API Integration

### fal.ai

The easiest way to access Seedance 2.5 via API.

```bash
pip install fal-client
```

```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/seedance-2-5/text-to-video",
    arguments={
        "prompt": "A lone astronaut walks across a red Martian desert at golden hour, wide angle, cinematic",
        "resolution": "720p",
        "duration": "10",
        "aspect_ratio": "16:9",
        "generate_audio": True
    }
)

print(result["video"]["url"])
```

**Image-to-Video (fal.ai):**

```python
result = fal_client.subscribe(
    "fal-ai/seedance-2-5/image-to-video",
    arguments={
        "prompt": "The camera slowly pushes in as the woman turns to face us, hair blowing in the wind",
        "image_url": "https://your-image-url.com/photo.jpg",
        "resolution": "720p",
        "duration": "8",
        "aspect_ratio": "16:9",
        "generate_audio": True
    }
)
```

---

### Replicate

```bash
pip install replicate
```

```python
import replicate

output = replicate.run(
    "bytedance/seedance-2-5:latest",
    input={
        "prompt": "Cinematic drone shot over a misty Japanese forest at dawn, golden light filtering through cedar trees",
        "resolution": "720p",
        "duration": 10,
        "aspect_ratio": "16:9",
        "generate_audio": True
    }
)
```

---

### Volcano Engine / BytePlus

```python
import requests

headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

payload = {
    "model": "seedance-2-5",
    "prompt": "Your prompt here",
    "resolution": "720p",
    "duration": 10,
    "aspect_ratio": "16:9"
}

response = requests.post(
    "https://api.byteplus.com/v1/video/generate",
    json=payload,
    headers=headers
)
```

---

## API Parameters

| Parameter | Type | Options | Default | Description |
|---|---|---|---|---|
| `prompt` | string | — | required | Text description of the video |
| `image_url` | string | URL | — | Input image for img2vid |
| `end_image_url` | string | URL | — | Target end frame |
| `resolution` | string | `480p` `720p` `1080p` | `720p` | Output resolution |
| `duration` | string/int | `4`–`15` | `10` | Duration in seconds |
| `aspect_ratio` | string | `21:9` `16:9` `4:3` `1:1` `3:4` `9:16` | `16:9` | Output aspect ratio |
| `generate_audio` | bool | `true` `false` | `true` | Generate native audio |
| `seed` | int | any | random | For reproducible outputs |

---

## Prompt Engineering Guide

### The 6-Step Formula

Structure your prompts using this formula for best results. **The first 20–30 words carry the most weight** — Seedance locks in the subject and core action from the opening.

```
[SUBJECT] + [ACTION] + [ENVIRONMENT] + [CAMERA] + [STYLE] + [CONSTRAINTS]
```

**Target length: 60–100 words.**

**Example:**
```
A young chef (subject) carefully plates a dish with tweezers (action) 
in a Michelin-star restaurant kitchen at midnight (environment), 
close-up rack focus from hands to face (camera), 
warm tungsten lighting, cinematic 35mm film grain (style), 
no jump cuts, maintain consistent kitchen background (constraints).
```

---

### Camera Movement Vocabulary

Use these exact terms in your prompts for precise camera control:

| Movement | Prompt Keyword |
|---|---|
| Move toward subject | `slow push in` / `dolly in` |
| Move away from subject | `pull back` / `dolly out` |
| Horizontal slide | `tracking shot left/right` |
| Vertical rise | `crane up` / `boom up` |
| Follow subject | `steadicam follow shot` |
| Rotate around subject | `orbit shot` / `360 arc` |
| Quick pan | `whip pan left/right` |
| Lock still | `static shot` / `locked off camera` |
| Overhead | `bird's eye view` / `top-down` |
| Low angle | `worm's eye view` / `low angle` |
| Shaky, urgent | `handheld camera` |
| Smooth glide | `gimbal shot` |
| Background blur | `rack focus to subject` |

---

### Lighting Keywords

> **Lighting descriptions have the biggest single impact on video quality.** One strong lighting keyword beats ten adjectives.

| Look | Keyword |
|---|---|
| Film-quality warmth | `golden hour cinematography` |
| Night scene | `tungsten practical lighting` |
| Drama / mystery | `chiaroscuro lighting` |
| Studio clean | `soft box three-point lighting` |
| Neon / cyberpunk | `neon-drenched night scene` |
| Documentary | `natural available light` |
| Horror | `harsh under-lighting` |
| Beauty / fashion | `butterfly lighting` |
| Outdoor overcast | `diffused cloudy daylight` |

---

### Multimodal Reference Syntax

When passing images, videos, or audio alongside your prompt, reference them with `@Tags`:

```
@Image1 — reference a still image input
@Image2 — second image input
@Video1 — reference a video clip input
@Audio1 — reference an audio file input
```

**Example multimodal prompt:**
```
@Image1 is the main character. @Audio1 is the background score. 
She walks through a neon-lit Tokyo alley at night, camera tracking 
alongside her, cinematic depth of field, rain-soaked streets reflecting 
the neon signs, sync the footsteps to @Audio1.
```

---

### Shot Script Format (Advanced)

For multi-shot videos, use timecodes to control pacing:

```
[0:00–0:03] WIDE SHOT — Aerial view of a volcanic island at sunrise, slow push in.
[0:03–0:08] MEDIUM SHOT — A researcher emerges from a tent, looks toward the volcano, rack focus to her face.
[0:08–0:15] CLOSE-UP — Her eyes reflecting the distant glow, golden hour light, handheld slight tremor.
Style: BBC Planet Earth, 4K cinematic, natural sound design.
```

---

## Prompt Templates by Category

### Cinematic / Film

```
A weathered detective (50s, trench coat) lights a cigarette on a rain-soaked 
New York street at 3am, neon signs reflecting in puddles, slow dolly back 
to reveal the city behind him, film noir style, 35mm grain, chiaroscuro 
lighting, no dialogue.
```

```
Timelapse of storm clouds rolling over the Scottish Highlands, heather 
fields swaying in the wind below, golden sunset breaking through on the 
horizon, aerial pull-back reveal, Terrence Malick style cinematography.
```

---

### Social Media / UGC

```
A girl unboxes a luxury skincare set on a marble countertop, close-up of 
her hands removing tissue paper, product reveal in warm soft-box lighting, 
9:16 vertical, lifestyle aesthetic, satisfying ASMR sound design.
```

```
POV shot walking through a busy Tokyo street market at dusk, neon signs, 
food stalls, crowds, handheld camera, cinéma vérité style, authentic 
ambient street sounds, 9:16 vertical.
```

---

### Anime & Stylized

```
A lone samurai stands on a cherry blossom cliff at twilight, petals falling 
in slow motion around him, wide establishing shot, Studio Ghibli art style, 
painterly brush strokes, soft orchestral music, no dialogue.
```

```
Cyberpunk anime girl with neon pink hair walks through a holographic market 
on a rain-soaked megacity street, tracking shot, Makoto Shinkai lighting, 
bokeh depth of field, synthwave ambient audio.
```

---

### Advertising / Product

```
A sleek black electric car races along a coastal highway at golden hour, 
low tracking shot alongside the vehicle, salt spray and motion blur, 
cut to close-up of the steering wheel and dashboard, premium automotive 
ad aesthetic, orchestral score.
```

```
A barista pours a perfect latte art rose in a minimalist café, extreme 
close-up rack focus, warm tungsten practical lighting, steam rising, 
slow motion pour, ASMR coffee sounds.
```

---

### Multi-Shot Sequences

```
[0:00–0:04] AERIAL WIDE — Drone shot descending toward a mountain summit at dawn.
[0:04–0:09] MEDIUM — A hiker reaches the peak, arms raised, facing away from camera.
[0:09–0:15] CLOSE-UP — Her face turns to us, wind in her hair, tears in her eyes, sunrise light.
Style: Inspirational brand film, Hans Zimmer-style score, no dialogue.
```

---

## Advanced Workflows

### Character Consistency Across Shots

1. Start with a clear reference image of your character (`@Image1`)
2. Describe physical attributes explicitly in every shot: *"same woman, mid-30s, red dress, dark curly hair"*
3. Lock the lighting style in your opening prompt and repeat it per shot
4. Use `maintain character appearance throughout` as a trailing constraint

### Brand-Safe Style Fusion

```
[Brand palette: navy blue, warm gold, clean white]
A product (@Image1) sits on a marble surface, soft natural window light, 
navy and gold color grade, luxury minimal aesthetic, slow push in, 
brand colors maintained throughout, no text overlays.
```

### AI Dance / Motion Transfer

```
@Image1 is a person standing in a neutral pose. Apply full-body dance 
choreography — contemporary hip-hop style, maintain their exact face and 
clothing, smooth 24fps motion, rhythmic bass-driven audio sync, 9:16 vertical.
```

---

## Tips & Best Practices

- **Front-load the subject and action** — the first 20–30 words determine the output more than anything else
- **One lighting keyword > ten adjectives** — `golden hour cinematography` beats `warm, beautiful, glowing, soft, rich, vibrant...`
- **Be explicit about what NOT to do** — `no jump cuts`, `no text overlays`, `no camera shake` prevent common artifacts
- **Use film/director references as style anchors** — `Wes Anderson symmetry`, `Roger Deakins lighting`, `Wong Kar-wai color grade`
- **For 9:16 vertical**, explicitly state it and design composition for mobile framing (subjects centered, headroom at top)
- **Iterate on lighting first** — if a generation looks flat, add or change the lighting keyword before anything else
- **Use seeds for reproducibility** — save the seed of a generation you like to iterate from the same base

---

## API Providers Comparison

| Provider | Model ID | Strengths |
|---|---|---|
| [fal.ai](https://fal.ai) | `fal-ai/seedance-2-5/text-to-video` | Fastest, best uptime, great DX |
| [Replicate](https://replicate.com) | `bytedance/seedance-2-5:latest` | Familiar workflow, strong community |
| [Volcano Engine / BytePlus](https://www.byteplus.com) | `seedance-2-5` | Official ByteDance endpoint |
| [MuAPI](https://muapi.ai) | — | Aggregated access, fallover support |

---

## Resources & Links

- [Seedance Official (ByteDance)](https://seed.bytedance.com/en/seedance2_0)
- [BytePlus / Volcano Engine Docs](https://docs.byteplus.com/en/docs/ModelArk)
- [fal.ai Seedance Guide](https://fal.ai/learn/devs/seedance-1-5-prompt-guide)
- [Seedance 2.5 Release Notes](https://www.openpr.com/news/4555789/seedance-2-5-released-next-level-multi-shot-ai-video)
- [Prompt Guide by invideo.io](https://invideo.io/blog/seedance-2-0-prompt-guide/)
- [API Providers Comparison](https://blog.laozhang.ai/en/posts/seedance-2-api-providers-comparison)

---

## Contributing

PRs welcome! Add prompts, correct parameters, share API code examples, or link to new Seedance 2.5 resources. Open an issue to suggest a new category.

---

## License

MIT
