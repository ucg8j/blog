---
title: Holo3 Test driving the best computer use agent I could run on my laptop
permalink: /test-driving-holo3-computer-use-agent/
slug: test-driving-holo3-computer-use-agent
date: 2026-05-01
tags: tech, ai
excerpt: Running Holo3-35B-A3B locally as a computer-use agent for canvas-heavy browser GUIs.
layout: layouts/post.njk
---

March 2026 was a threshold month for computer-use agents.

On March 5, [OpenAI released GPT-5.4](https://openai.com/index/introducing-gpt-5-4/) and reported a `75.0%` score on [OSWorld-Verified](https://benchlm.ai/benchmarks/osWorldVerified), a benchmark for autonomous desktop task completion through screenshots, mouse actions, and keyboard actions. The reported human baseline is `72.4%`, so this was **the first time a general computer-use agent had crossed human-level performance on that evaluation**.

Then, on March 31, [H Company](http://hcompany.ai/) a French AI Lab, [released Holo3](https://hcompany.ai/holo3). The larger Holo3-122B-A10B model reported `78.85%` on OSWorld-Verified, while the smaller [Holo3-35B-A3B model](https://huggingface.co/Hcompany/Holo3-35B-A3B) reported `77.8%`. That smaller model is the interesting one for local experimentation: it is a sparse mixture-of-experts VLM with `35B` total parameters and `3B` active parameters, fine-tuned from `Qwen/Qwen3.5-35B-A3B`, and released under Apache 2.0.

One might think, I can just just download Holo3, hit self-driving mode where all my computer work is on intelligent auto-pilot whilst I sit back and relax.

<figure style="width: min(calc(100% + var(--post-media-overhang)), calc(100vw - var(--post-media-viewport-gutter)), var(--post-media-max-width)); margin: 2rem 0 2rem 50%; transform: translateX(-50%);">
  <img
    src="/content/images/holo-agent/holo3agent-human-relax-2026-05-17.png"
    alt="Robot using a computer while a human relaxes"
    style="display: block; width: 100%; max-width: none; height: auto; margin: 0; transform: none;"
  >
  <figcaption style="margin-top: 0.4rem; color: #6b7280; font-size: 0.9rem; line-height: 1.4;">
    ChatGPT generated 2026-05-17 "please generate a cartoon-ish style image where a robot is at the computer and the human is telling the robot what to whilst relaxing. {snippet of blog}" ... the third hand came free!
  </figcaption>
</figure>

Not quite!

## My approach

My unimaginatively named and heavily vibe coded `holo_agent`, what the cool kids following tech twitter call ['the harness'](https://www.theneuron.ai/explainer-articles/ai-harnesses-and-clis-explained-the-real-reason-everyones-talking-about-infrastructure/), takes the `Holo3-35B-A3B` model for a test spin, it connects to an existing browser, captures the current viewport, sends the screenshot plus structured context to Holo3 served locally by [mlx-vlm](https://github.com/Blaizzy/mlx-vlm) (M-series-maxxing, I can be cool too!), parses the model's JSON action, executes it via [Playwright](https://playwright.dev/), and records a trace of every step. It's [Ralph-loop-esque](https://ralphify.co/docs/how-it-works/#what-gets-re-read-vs-what-stays-fixed), but for browser use rather than coding.

![The agent loop](/content/images/holo-agent/holo-agent-loop.png)

**The goal was to see how well a VLM for 'computer use', running locally, is able to navigate interfaces.**

Start or open a browser with remote debugging enabled:

```bash
/Applications/Microsoft\ Edge.app/Contents/MacOS/Microsoft\ Edge --remote-debugging-port=9222
```

CDP lets the agent operate in the same browser profile the user already trusts. It can reuse the live tab, preserve session storage, inherit browser extensions or enterprise policy, and avoid turning login into an automation problem. How did I not know about [connect over CDP](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp) for an existing session until now?!?

I run my `holo-agent` via:

```bash
uv run holo-agent run "your goal is to complete this module" \
  --model-url http://localhost:8000/v1 \
  --cdp http://127.0.0.1:9222 \
  --url "https://example.com/module" \
  --max-steps 150 \
  --no-confirm
```

The model server is checked automatically. If the configured endpoint is not healthy, the agent starts:

```bash
uv run mlx_vlm.server --model mlx-community/Holo3-35B-A3B-8bit --port 8000
```

The health check is intentionally deeper than a simple `/v1/models` ping. Earlier runs revealed that a server can keep its HTTP listener alive while inference itself is broken, so the startup path also probes a tiny completion before trusting an existing server.

To inspect prior runs:

```bash
uv run holo-agent list
uv run holo-agent view artifacts/traces/<run-dir>
```

Each run writes screenshots, the model reasoning, the prompt fed into the model, step data, and any useful notes into `trace.jsonl`, rendered via a `trace.html` viewer.

The trace was my development tool. Early traces showed repeated clicks, malformed actions, stale pages, premature exits, and missing context. Those failures became parser repair, action history, stale-page detection, seeded knowledge, navigation policies, and deeper model-server health checks.

Ok but why wouldn't you just parse the webpage structure and avoid using a VLM...

## When Would You Use a Computer Use Agent?

You would not reach for a computer-use VLM first:

- If the system has an API, use the API. Computer use models can be [45x more expensive than using an API.](https://reflex.dev/blog/computer-use-is-45x-more-expensive-than-structured-apis/)
- If the page is ordinary HTML with stable DOM elements, parse and automate the DOM.
- If the workflow is finite, and known, write a deterministic script.
- If the task is mostly data transfer, validation, or form submission, avoid vision if you can.

You'd use this when the graphical interface is the only practical option. For example,

- Pure GUI interaction.
- Screens where the important state is visual rather than available as inspectable DOM e.g. Canvas-rendered modules.

Old enterprises have plenty of ancient systems with no modern APIs. Computer use agents have the potential to control entire desktops with multiple applications. I didn't want to handover my real desktop. So I restricted the interface to the browser and got `GPT-5.5` to create an exercise for the model to complete - a web based series of tasks.

I tested this in two stages: first with a regular training module, then with a harder canvas-rendered module where buttons exist to be clicked, but can't be seen via parsing the webpage.

## The Simple Module

I started with a regular interface to navigate to iron out the setup issues. But it then navigated this consistently with ease. So the next step was to set up something much harder.

You can [try the simple module here](/content/demos/holo-training-portal/).

![Holo agent completing the simple training module visually](/content/images/holo-agent/holo-simple-agent-visual-trace.gif)

This was the easier progression point for the agent because it still looked like a normal training portal: rectangular buttons, visible text labels, checklist rows, a single obvious quiz answer, and a final completion screen. Even without the interactive-element list, the targets were visually legible and mostly shaped like the controls humans expect to click.

## Screenshots Alone Are Not Enough

The first working version was the obvious one: take a screenshot, ask Holo3 for one JSON action, execute the action with Playwright, repeat.

That proved the model and local inference stack worked. It also exposed the limits immediately. The model could identify the page and usually pick the right intent, but raw visual coordinate control was not reliable enough for long workflows. The failures included:

- The model clicked the same target repeatedly while the page did not change.
- Coordinates were sometimes malformed or approximate.
- Buttons rendered inside canvas did not respond to ordinary Playwright clicks.
- The model treated visible-but-disabled navigation as usable.
- It tried to exit before a module was truly complete.

That pushed the first round of fixes toward the boring edges of the loop: parsing, coordinates, action history, and the definition of done.

## First Round Of Fixes

The first fixes were not exotic. They were the small pieces needed to keep a long browser run alive when the model's intent was useful but the action was imperfect.

### Parse Model Output Like It Will Be Messy

The system prompt asks for strict JSON. The model still sometimes returns almost-JSON:

- Code fences.
- Quoted numbers.
- Half-quoted coordinates.
- `action` instead of `action_type`.
- Missing brackets.
- Target lists as objects instead of strings.
- Coordinates embedded in reasoning instead of the `coordinate` field.

`actions.py` repairs common cases before giving up. This came directly from early simple attempts. My first working attempt, a simple 'do a google search of bags', the model knew what to do but produced malformed coordinates and lowercase key names.

### History Prevents Repetition

The early loop was too stateless. It would type a search query, take a new screenshot, and then type the same query again because the prompt did not tell it what had already happened.

The agent keeps recent action history and feeds it back to the model:

```text
Recent actions:
  1. typed "example query"
  2. pressed key "Enter"

Do NOT repeat these actions. Decide what to do NEXT.
```

History is also used by the controller itself. Repeated action fingerprints trigger loop detection. Repeated screenshot hashes trigger stale-page warnings. Repeated waits with clickable elements produce stronger instructions to interact instead of waiting forever.

I found sometimes the model would explain its reasoning confidently even when nothing was changing. The harness warning of stale pages helped the agent reason out of its loop.

### Coordinates Are Not Just Coordinates

I also tested a stricter screenshot-only path on the simple module. Getting that visual-only path through the run required:

- A shorter JSON action shape, because long optional schemas increased malformed output.
- Coordinate repair for responses such as scalar `coordinate` values, missing brackets, and truncated JSON.
- Device-pixel-ratio conversion, because screenshots and Playwright mouse input did not use the same coordinate space.
- Screenshot-only colored-button targeting for visible controls such as `Launch`, `Next`, and `Start Media`.
- Screenshot-only row detection for checklist-like controls.
- Loop detection, stale-screen warnings, and final-completion policy when the model kept clicking after the page was already done.

That result sharpened the lesson rather than disproving it. Holo3 can visually plan its way through a basic module, but the reliable system is still the VLM plus a compatibility layer around parsing, coordinates, clicking, state tracking, and completion policy.

The trace is worth browsing because it shows the actual development texture: malformed coordinates being repaired, row clicks being recentered, the model reaching the final `Training complete` screen, and the last remaining mistake where it kept clicking instead of emitting `task_complete`. I have hosted that trace as a static artifact here: [visual-only simple module trace](/content/traces/holo-agent/20260511T131133Z-complete-this-training-module/).

## The Canvas Module

There is also a second, less standard demo at `examples/holo_canvas_portal`. It is closer to the difficult interfaces that motivated the CreateJS path: canvas-rendered controls, subtle hotspots, decoys, disabled canvas navigation, and a final canvas completion action. You can [try the complex canvas module here](/content/demos/holo-canvas-portal/).

![Holo agent completing a canvas-based training module](/content/images/holo-agent/holo-canvas-agent-demo.gif)

I later extended that canvas portal into an 8-step benchmark: valve selection, clue sweep, mirror target, dial lock, shutter latch, quiz, glyph lock, and route trace. In three grounded runs, Holo3 reached `6/8` each time. It cleared the first six tasks with the CreateJS element list, snapped coordinates, and JS-dispatched canvas clicks, then failed at the glyph lock before reaching the final route-tracing task. The struggle was not basic click grounding; it was visual symbol interpretation and maintaining the correct glyph sequence under repeated retries.

## Ground The Model In Page State

The agent now scans the page before every model call and includes an interactive-element list in the prompt.

For ordinary DOM pages, the scanner looks for buttons, links, tabs, menu items, radio buttons, checkboxes, inputs, role-based controls, click handlers, and shadow roots.

For canvas-based modules, it walks the CreateJS stage, extracts clickable display objects, resolves visible labels where possible, and records their viewport coordinates.

The model sees context like:

```text
Interactive elements detected on this slide:
  - START ASSESSMENT at [643, 712]
  - answer1_mc.selection at [287, 391]
  - SUBMIT at [1013, 781]

Navigation controls:
  - Previous [DISABLED] at [1043, 853]
  - Play/Pause [ACTIVE] at [1108, 853]
  - Next [ACTIVE] at [1180, 853]
  - Save & Exit [ACTIVE] at [1215, 42]
```

This changed the model's job from "estimate where to click from pixels" to "choose from grounded targets". The executor then snaps model coordinates or text targets back to those known interactives.

## When I Removed The Grounding

To make sure I was not accidentally over-claiming the VLM's visual ability, I added an observation-based mode. In that mode the model still gets the screenshot and the task, but it does not see the `Interactive elements detected...` list, [CreateJS](https://createjs.com/) stage labels, navigation button state, or precomputed snap-to-target data.

This made the simple module much harder. Holo3 often understood the right intent: launch the module, click checklist rows, start the media, answer the quiz, continue to confirmation. The problem was turning that intent into reliable browser actions. Once the SCORM and CreateJS clues were removed from the prompt, the harness had to do more work without reading DOM or canvas scene data ahead of time.

Then I ran the same visual-only mode against the harder canvas module without changing the harness again. That failed, which is the result I expected. The model launched the inspection, read the next task correctly, and repeatedly identified the green `Open coolant valve` as the right target. But the page did not advance. After 19 steps the loop guard stopped the run: Holo3 was visually right about the target, while the raw visual click path was not enough for that canvas interaction. That failure trace is here: [visual-only complex canvas trace](/content/traces/holo-agent/20260511T135749Z-complete-this-training-module/).

So the comparison is useful: grounded mode with CreateJS/SCORM clues turns the problem into choosing known interactive targets; visual-only mode forces the model and harness to recover everything from pixels. On the simple module, that can be made to work. On the harder canvas module, it exposed why the grounded event-dispatch path exists.

## Treat Clicking As A Compatibility Layer

One of the biggest hurdles was that not all browser clicks are equal.

For a normal DOM page, Playwright's `page.mouse.click(x, y)` is often fine. For canvas modules, that click can hit the canvas element without triggering the internal object that the learner would have clicked. The agent therefore dispatches events directly inside the page:

- Convert viewport coordinates to canvas/stage coordinates.
- Find the nearest interactive CreateJS object.
- Dispatch `mousedown`, `click`, and `pressup` events to the object.
- Fall back to DOM events and native Playwright clicks where appropriate.

## Local Inference

These runs were on a 64 GB M4 Max, and the trace logs make the resource profile visible instead of anecdotal. In the successful canvas demo trace, the model reported about `46.3 GB` peak memory on each step. The prompts were small relative to the model context window: around `1.2K` to `1.5K` prompt tokens per step, with completion responses usually below `200` tokens. The run took `10` steps and about `100` seconds end to end. The slow part was inference.

The harness downscales screenshots before inference while preserving full-resolution screenshots in the trace. That reduces image-token and memory pressure without sacrificing post-run debugging.

## Traces Are The Development Loop

The trace system became the most valuable debugging tool.

Each step records:

- The screenshot.
- The prompt without embedded base64.
- The raw model response.
- The parsed action.
- Parse errors.
- Screenshot, inference, execution, and total step timing.
- Token counts.
- Peak memory.
- The final run status.
- Knowledge notes.

![Trace viewer showing screenshots, reasoning, parsed actions, timings, tokens, and memory](/content/images/holo-agent/holo-trace-viewer-demo.gif)

The HTML viewer makes this inspectable while a run is still live. Failed traces are especially valuable because they show exactly what the model saw, what it was told, what it returned, what the parser understood, and whether the page changed.

This was the main observability surface. When the agent got into loops, the trace made the failure concrete: the screenshot stayed the same, the prompt history showed repeated actions, the raw model response explained why it thought the action was still sensible, and the parsed action showed whether the harness had repaired or overridden it. That combination is much more useful than logs alone because it lets you debug both sides of the loop: the model's visual reasoning and the controller's execution policy.

Most of the agent's current safeguards came from reading those traces and promoting repeated failures into code.

## My Takeaways

- CDP attachment to an existing browser, instead of launching a fresh unauthenticated one.
- Interactive-element scanning, especially for canvas and custom controls.
- JS-dispatched CreateJS events.
- A semantic `nav_button` action.
- Action history in the prompt.
- JSON repair and key normalization.
- Loop detection and screenshot-hash stale detection.
- Loading/video state guards.
- Cross-run knowledge summaries.
- Deterministic fallbacks for repeated screens.
- Live and final trace viewers.
- Deep model-server health checks.
- There is also a tension between generality and usefulness. A purely general agent gets stuck more often. A heavily specialized harness works better, but accumulates domain and workflow assumptions and would require customised deployment.
