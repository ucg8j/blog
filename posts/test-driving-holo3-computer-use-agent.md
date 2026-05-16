---
title: Test driving the best computer use FOSS agent, Holo3
permalink: /test-driving-holo3-computer-use-agent/
slug: test-driving-holo3-computer-use-agent
date: 2026-05-01
tags: tech, ai
excerpt: Running Holo3-35B-A3B locally as a computer-use agent for canvas-heavy browser GUIs.
layout: layouts/post.njk
---

*... that can fit on my laptop a 64gb RAM M4 Max.*

March 2026 was a threshold month for computer-use agents.

On March 5, [OpenAI released GPT-5.4](https://openai.com/index/introducing-gpt-5-4/) and reported a `75.0%` score on [OSWorld-Verified](https://benchlm.ai/benchmarks/osWorldVerified), a benchmark for autonomous desktop task completion through screenshots, mouse actions, and keyboard actions. The reported human baseline is `72.4%`, so this was **the first time a general computer-use agent had crossed human-level performance on that evaluation**.

Then, on March 31, [H Company](http://hcompany.ai/) a French AI Lab, [released Holo3](https://hcompany.ai/holo3). The larger Holo3-122B-A10B model reported `78.85%` on OSWorld-Verified, while the smaller [Holo3-35B-A3B model](https://huggingface.co/Hcompany/Holo3-35B-A3B) reported `77.8%`. That smaller model is the interesting one for local experimentation: it is a sparse mixture-of-experts VLM with `35B` total parameters and `3B` active parameters, fine-tuned from `Qwen/Qwen3.5-35B-A3B`, and released under Apache 2.0.

You might think, I can just just download Holo3, hit self-driving mode where all my computer work is on intelligent auto-pilot whilst I sit back and relax. Not quite. The useful agent emerged through repeated failures e.g. malformed JSON, screen coordinate issues, premature exits, stale browser tabs and steps that require remembering earlier content.

This is a write-up of what I imaginatively named `holo_agent` a test spin of the 35B Holo3 model, that drives a browser by looking at screenshots, choosing the next action, and executing that action through [Playwright](https://playwright.dev/).

My `holo_agent` is [Ralph-loop-esque](https://ralphify.co/docs/how-it-works/#what-gets-re-read-vs-what-stays-fixed), but for browser use rather than coding. Instead of re-running tests and feeding results back to a coding agent, it captures a screenshot, scans browser state, asks the VLM for one action, executes it, records a trace, and uses the result of that action to shape the next step.

## My setup for `holo_agent`

`holo_agent` is a browser automation harness for local computer-use models. Heavily vibe coded, a coding agent getting a computer use agent to work. It connects to an existing Chromium or Edge browser over CDP (how did I not know about [connect over CDP](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp) for existing session until now???), captures the current viewport, sends the screenshot plus structured context to my local Holo3 model running using [mlx-vlm](https://github.com/Blaizzy/mlx-vlm) (I've got to make use of my apple silicon), parses the model's JSON action, executes it, and records a trace of every step.

The goal was deliberately generic. A narrow workflow script can be much more finite and controllable. `holo_agent` aims at the lofty goal of generically being able to take actions via interfaces. Ok but why wouldn't you just parse the webpage structure and avoid using VLM...

## When Would You Use This?

You would not reach for a computer-use VLM first:

- If the system has an API, use the API.
- If the page is ordinary HTML with stable DOM elements, parse and automate the DOM.
- If the workflow is finite, known, and business-critical, write a deterministic script.
- If the task is mostly data transfer, validation, or form submission, avoid vision if you can.

You'd use this when the graphical interface is the only practical option. For example,

- Pure GUI interaction.
- Canvas-rendered modules.
- Screens where the important state is visual rather than available as inspectable DOM.

Old enterprises have plenty of ancient systems with no modern APIs. Computer use agents are capable of controlling entire desktops with multiple applications. I didn't want to handover my real desktop and don't have the tokens or 8hrs of time to vibe an a simulated desktop ([see scenario 3 of the Glm5.1 release](https://z.ai/blog/glm-5.1)). So I restricted the interface to the browser, I got chatGPT5.5 to vibe up a Canvas based series of tasks. Using a canvas means buttons exist to be clicked, but can't be seen via parsing the webpage. Here's the preview if you want to inspect the elements.

## My setup and lessons learned

Start or open a browser with remote debugging enabled:

```bash
/Applications/Microsoft\ Edge.app/Contents/MacOS/Microsoft\ Edge --remote-debugging-port=9222
```

CDP lets the agent operate in the same browser profile the user already trusts. It can reuse the live tab, preserve session storage, inherit browser extensions or enterprise policy, and avoid turning login into an automation problem.

Then run:

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

Each run writes screenshots, the model reasoning, the prompt fed into the model and which step into `trace.jsonl`, rendered via a `trace.html` viewer, and, when the model records useful notes.

This trace was not just an audit log. It was the development tool. Early traces showed repeated clicks, malformed actions, stale pages, premature exits, and missing context. Those failures became parser repair, action history, stale-page detection, loading guards, seeded knowledge, navigation policies, and deeper model-server health checks.

I started with a regular interface to navigate to iron out the setup issues. But it then navigated this consistently with ease. So the next step was to setup something much harder.

This repository includes a small static training portal at `examples/holo_training_portal`. It deliberately exercises the patterns that shaped the agent: a launch button, persistent navigation, a disabled Next button, a timed media-like wait, quiz feedback, retry behavior, and a final completion screen. You can [try the simple module here](/content/demos/holo-training-portal/).

There is also a second, less standard demo at `examples/holo_canvas_portal`. It is closer to the difficult interfaces that motivated the CreateJS path: canvas-rendered controls, subtle hotspots, decoys, disabled canvas navigation, and a final canvas completion action. You can [try the complex canvas module here](/content/demos/holo-canvas-portal/).

![Holo agent completing a canvas-based training module](/content/images/holo-agent/holo-canvas-agent-demo.gif)


## Screenshots Alone Are Not Enough

The first working version was the obvious one: take a screenshot, ask Holo3 for one JSON action, execute the action with Playwright, repeat.

That proved the model and local inference stack worked. It also exposed the limits immediately. The model could identify the page and usually pick the right intent, but raw visual coordinate control was not reliable enough for long workflows.

The failures were concrete:

- The model clicked the same target repeatedly while the page did not change.
- Coordinates were sometimes malformed or approximate.
- Buttons rendered inside canvas did not respond to ordinary Playwright clicks.
- The model treated visible-but-disabled navigation as usable.
- It tried to exit before a module was truly complete.

The main lesson was that a computer-use VLM should not be the whole controller. It should be the flexible planner inside a grounded browser harness.

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

## What Happened When I Removed The Grounding

To make sure I was not accidentally over-claiming the VLM's visual ability, I added an observation-based mode. In that mode the model still gets the screenshot and the task, but it does not see the `Interactive elements detected...` list, CreateJS stage labels, navigation button state, or precomputed snap-to-target data.

This made the simple module much harder. Holo3 often understood the right intent: launch the module, click checklist rows, start the media, answer the quiz, continue to confirmation. The problem was turning that intent into reliable browser actions. Once the SCORM and CreateJS clues were removed from the prompt, the harness had to do more work without reading DOM or canvas scene data ahead of time.

Getting the visual-only path through the simple module required:

- A shorter JSON action shape, because long optional schemas increased malformed output.
- Coordinate repair for responses such as scalar `coordinate` values, missing brackets, and truncated JSON.
- Device-pixel-ratio conversion, because screenshots and Playwright mouse input did not use the same coordinate space.
- Screenshot-only colored-button targeting for visible controls such as `Launch`, `Next`, and `Start Media`.
- Screenshot-only row detection for checklist-like controls.
- Loop detection, stale-screen warnings, and final-completion policy when the model kept clicking after the page was already done.

That result sharpened the lesson rather than disproving it. Holo3 can visually plan its way through a basic module, but the reliable system is still the VLM plus a compatibility layer around parsing, coordinates, clicking, state tracking, and completion policy.

The trace is worth browsing because it shows the actual development texture: malformed coordinates being repaired, row clicks being recentered, the model reaching the final `Training complete` screen, and the last remaining mistake where it kept clicking instead of emitting `task_complete`. I have hosted that trace as a static artifact here: [visual-only simple module trace](/content/traces/holo-agent/20260511T131133Z-complete-this-training-module/).

Then I ran the same visual-only mode against the harder canvas module without changing the harness again. That failed, which is the result I expected. The model launched the inspection, read the next task correctly, and repeatedly identified the green `Open coolant valve` as the right target. But the page did not advance. After 19 steps the loop guard stopped the run: Holo3 was visually right about the target, while the raw visual click path was not enough for that canvas interaction. That failure trace is here: [visual-only complex canvas trace](/content/traces/holo-agent/20260511T135749Z-complete-this-training-module/).

So the comparison is useful: grounded mode with CreateJS/SCORM clues turns the problem into choosing known interactive targets; visual-only mode forces the model and harness to recover everything from pixels. On the simple module that can be made to work. On the harder canvas module it exposed why the grounded event-dispatch path exists.

## Treat Clicking As A Compatibility Layer

One of the biggest implementation lessons was that not all browser clicks are equal.

For a normal DOM page, Playwright's `page.mouse.click(x, y)` is often fine. For canvas modules, that click can hit the canvas element without triggering the internal object that the learner would have clicked. The agent therefore dispatches events directly inside the page:

- Convert viewport coordinates to canvas/stage coordinates.
- Find the nearest interactive CreateJS object.
- Dispatch `mousedown`, `click`, and `pressup` events to the object.
- Fall back to DOM events and native Playwright clicks where appropriate.

The same principle led to a dedicated `nav_button` action. Persistent controls such as Next, Previous, Play, Pause, and Save/Exit are not just pixels; they have semantic state. The agent can dispatch directly to named navigation containers instead of trusting a visual coordinate.

## Parse Model Output Like It Will Be Messy

The system prompt asks for strict JSON. The model still sometimes returns almost-JSON:

- Code fences.
- Quoted numbers.
- Half-quoted coordinates.
- `action` instead of `action_type`.
- Missing brackets.
- Target lists as objects instead of strings.
- Coordinates embedded in reasoning instead of the `coordinate` field.

`actions.py` repairs common cases before giving up. This repair layer is not optional polish; it is what keeps a long browser run alive when the model output is semantically useful but syntactically imperfect.

This came directly from early demos. In one Google-search demo, the model knew what to do but produced malformed coordinates and lowercase key names. The fixes were small, but important: coordinate repair, action history, and key normalization from `enter` to `Enter`.

## History Prevents Repetition

The early loop was too stateless. It would type a search query, take a new screenshot, and then type the same query again because the prompt did not tell it what had already happened.

The agent now keeps recent action history and feeds it back to the model:

```text
Recent actions:
  1. typed "example query"
  2. pressed key "Enter"

Do NOT repeat these actions. Decide what to do NEXT.
```

History is also used by the controller itself. Repeated action fingerprints trigger loop detection. Repeated screenshot hashes trigger stale-page warnings. Repeated waits with clickable elements produce stronger instructions to interact instead of waiting forever.

The important distinction is that the model may explain its reasoning confidently even when nothing is changing. The harness has to measure effects.

## Loading And Video Need Hard Guards

Training modules exposed a recurring pattern: the browser shows something that looks clickable, but the underlying system is still loading, connecting, playing media, or waiting for an animation.

The agent now scans for loading state and video state:

- `LMS_CONNECTING`
- `PAGE_LOADING`
- `VIDEO_PLAYING`
- `VIDEO_PAUSED`
- `VIDEO_ENDED`

Those states are included in the prompt, but some are also enforced in code. If the module is loading, the model's click can be overridden to `wait`. If a video is playing and Next is disabled, the agent waits. If a video is paused, it uses Play. If Next is active and no video is playing, waiting can be overridden to Next.

This is a good general rule: if the browser can expose machine-readable state, do not make the model infer it from pixels.

## Completion Is A Policy, Not A Feeling

Computer-use models are eager to declare success. That is dangerous in multi-page workflows.

The agent learned to treat completion as a policy:

- Do not use `task_complete` just because the page looks stable.
- Do not treat an Exit or Resources button as evidence of completion.
- Do not use Save/Exit until a final completion, congratulations, summary, or certificate screen is visible.
- If Next is still available, the task is probably not complete.
- If too few content actions have happened, override premature completion.

This is one of the places where the harness has to be more conservative than the model.

## Quizzes Need Memory

The model can answer many visible questions, but long modules often ask questions based on earlier slides. Some questions also provide feedback after a wrong answer. Losing that information causes repeated guessing.

The agent asks the model to write notes on every step:

- Facts and definitions from the current slide.
- Quiz questions.
- Correct answers.
- Feedback after submission.
- Evidence that an option was wrong.

At the end of a run, those notes become `knowledge_summary.md`. On later runs for the same module, the agent loads relevant notes based on the module identifier and injects a small set into the prompt.

The first version only kept notes from the current run. Later iterations added cross-run seeding. Then the seeding had to be filtered, because failed runs can contain bad guesses. The loader now prefers successful traces and ranks evidence-heavy notes such as "feedback", "incorrect answer", and "not considered".

Memory is not just nice to have. It changes the agent from brute-force interaction to informed interaction.

## Deterministic Fallbacks Are A Feature

Some screens appeared often enough that calling the model every time was wasteful or brittle. The agent gained deterministic fallbacks for known states:

- Launch Content.
- Start or Resume Assessment.
- Confirm dialogs.
- Continue buttons.
- Known loading screens.
- Known multi-select patterns.
- Reattempt flows after incorrect feedback.
- Popup LMS connection errors.

This is not a retreat from using a VLM. It is the correct layering. Let the model handle the open-ended visual reasoning. Let deterministic code handle repeated, high-confidence browser states.

## Local Inference Is Operational Work

Running Holo3 locally adds a small operations problem to the agent. These runs were on a 64 GB M4 Max, and the trace logs make the resource profile visible instead of anecdotal.

In the successful canvas demo trace, the model reported about `46.3 GB` peak memory on each step. The prompts were small relative to the model context window: around `1.2K` to `1.5K` prompt tokens per step, with completion responses usually below `200` tokens. The run took `10` steps and about `100` seconds end to end. The slow part was inference, not clicking: individual model calls were usually several seconds, while click execution was typically single-digit milliseconds.

Across the saved local traces, many Holo3 runs reported the same peak-memory band, roughly `46.3 GB`. That is a meaningful chunk of a 64 GB machine. It is workable on this hardware, but it is not something to treat like a small background service.

The operational failure modes were also concrete:

- First startup can take time because the model must load before the first useful action.
- The server can bind a port but fail inference.
- Interrupted runs can leave zombie listeners.
- A simple `/v1/models` health check can pass while the next vision request hangs.
- Vision requests are memory-heavy enough that failed health checks and duplicate servers matter.

`agent.py` now owns more of this lifecycle. It checks the endpoint, probes inference, starts the server when needed, waits for readiness, handles ports, retries inference, and records token and peak-memory stats in traces.

The agent also downscales screenshots before inference while preserving full-resolution screenshots in the trace. That reduces image-token and memory pressure without sacrificing post-run debugging.

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

## The Shape Of The Final Harness

The mature pattern is:

1. Attach to a real authenticated browser session over CDP.
2. Capture a screenshot.
3. Scan the browser runtime for interactives, loading state, video state, and navigation state.
4. Build a prompt with task, screenshot, action history, current notes, and relevant prior evidence.
5. Ask the local VLM for exactly one action.
6. Repair and validate the response.
7. Resolve the action against grounded targets.
8. Execute through the right path: DOM, CreateJS, nav helper, mouse, keyboard, scroll, or wait.
9. Detect loops, stale pages, premature completion, and forbidden exits.
10. Persist a trace and repeat.

That is the core learning: the VLM is the planner, not the platform. The platform is the harness around it.

## What Worked

The strongest improvements were:

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

Each one removed a different source of fragility.

## What Still Feels Hard

Long web tasks remain brittle because the page can enter many states the model has never seen before. Quiz behavior is especially hard because visible UI state, prior slide content, and feedback from previous attempts all matter. Seeded knowledge helps, but only if the notes are high quality.

There is also a tension between generality and usefulness. A purely general agent gets stuck more often. A heavily specialized harness works better, but accumulates domain assumptions. The current code chooses a pragmatic middle: generic loop, generic browser-state scanning, and a few domain-shaped policies where traces showed repeated failure.

## The Takeaway

The biggest lesson from `holo_agent` is that computer-use VLMs become useful when you stop treating the screenshot as the whole world.

The browser knows things the screenshot does not: which controls are interactive, whether a button is disabled, whether a video is playing, whether the page is loading, and which object actually receives a click. The trace knows things the model forgot. Prior runs know things the current screenshot cannot show.

The visual-only ablation made this concrete. It was not a question of whether Holo3 could understand the screenshot. Often it could. The harder question was whether that understanding survived JSON formatting, coordinate systems, canvas hit testing, disabled controls, state changes, and completion policy. The more of that hidden state the harness exposed, the less the VLM had to guess.

The agent works by making that hidden state visible to the model, then enforcing the invariants the model should not be trusted to remember.
