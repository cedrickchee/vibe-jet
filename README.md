# Vibe Jet

A browser-based 3D multiplayer flying game, arcade-style. Vibe coded using Gemini 2.5 Pro experimental model.

Date: 2025-03-26 - 2025-03-27

## Vibe coding a 3D game

Vibe coding is all the rage now since Andrej Karpathy popularized the idea and term in early 2025.

I have seen many cool vibe-coded 3D flying game and flight sim demos out there since xAI's Grok-3 launch. xAI encourage people to build games with Grok-3. Flashy demos are cherry-picked for hyping things. A little dose of healthy hype is good. You know what is better, if they can share their process of creating those games and we all can learn from it.

You are in the right place - I'm sharing everything I learn from my own vibe coding journey building an advanced 3D game.

## Screenshot and Videos

For now, check the screenshots and video in my Tweets/X Posts. I will move them here later.

- Demo (video) of me playtesting a jet fighter game flight physics, visuals and multiplayer position: https://xcancel.com/cedric_chee/status/1905508001823494601
- How I improved the game visual from boring to interesting: https://xcancel.com/cedric_chee/status/1905336549786747156
- How I vibe-coded the base game: https://xcancel.com/cedric_chee/status/1905300591041282400

## Prompt

Actual full prompt:

```md
Create a browser-based 3D flying game with multiplayer functionality using HTML, JavaScript, Three.js, and WebSockets. The game should be inspired by Pieter Levels' (levelsio) project at fly.pieter.com.

## Reference Materials
These references, they represent the original inspiration:
- Main game website: https://fly.pieter.com
- Twitter/X development thread starting on 2025-02-23: https://x.com/levelsio/status/1893350391158292550
- Key feature updates on Twitter/X:
  - https://x.com/levelsio/status/1893385114496766155
  - https://x.com/levelsio/status/1893468798101094587 (multiplayer with WebRTC)
  - https://x.com/levelsio/status/1894066879758508036 (FOV changes with speed)
  - https://x.com/levelsio/status/1894125123197964542 (night sky and space flying)
  - https://x.com/levelsio/status/1894359671172972760 (WebSockets server)
  - https://x.com/levelsio/status/1894429987006288259 (first playable alpha)
- Ideas board: https://ideasandbugs.com/?b=67bf044fffab95c913394529

## Core Game Features (prioritized)
1. 3D flight mechanics with realistic physics
   - Aircraft movement (roll, pitch, yaw)
   - Adjustable speed with afterburner option
   - Camera FOV that increases with speed
   - Collision detection with buildings

2. Visual elements
   - Urban landscape with skyscrapers
   - Day/night cycle with stars and moon
   - Aircraft model with contrails and effects
   - Dynamic lighting and shadows

3. Multiplayer functionality
   - WebSocket server (Python implementation)
   - Player position broadcasting (10 updates per second)
   - Basic security measures against spammers/hackers
   - Simple player identification

## Game Design
The game should be a fun free-to-play MMO flight simulator where players can fly and dogfight with friends online. Players should be able to share a link with friends to fly together in the same virtual space.

## Implementation Details

Please provide:
1. Complete, functioning HTML file with embedded JavaScript
2. Separate Node.js WebSocket server code
3. Clear documentation on how the components interact
4. Instructions for running the game

Important technical considerations:
- Be mindful that the game code can grow beyond 3000 lines in an HTML file (as noted in https://x.com/levelsio/status/1893679316384244046)
- Structure the code to allow for future extensions
- Use modular design patterns where appropriate
- Include comments explaining complex implementation details

## Output Format
First, provide the main HTML/JavaScript file that runs the game client.

Second, provide the Node.js WebSocket server code.

Finally, include setup instructions and explain how the multiplayer functionality works.

Feel free to suggest additional features that would enhance gameplay while maintaining performance and code quality.
```

## Gemini 2.5 Pro Output

Here is a sample of responses from Gemini 2.5 Pro (experimental) model. This one is the most important. It confirmed that the model is following my instructions correctly and suggested a plan of attack after it one-shotted a working game foundations, which is nothing more than a boring and basic 3D flying object game, not even a jet figther, just a cube representing the aircraft. LMAO!

```md
Suggested Additional Features:

1. Improved Visuals:

- Load actual 3D aircraft models (e.g., GLTF format using GLTFLoader).
- More varied building geometries and textures.
- Ground textures, hills, or procedural terrain.
- Particle systems for contrails, explosions (on collision/dogfighting), and engine effects.
- Post-processing effects (bloom, motion blur).

2. Enhanced Physics & Controls:

- More realistic lift, drag, and gravity simulation.
- Stalling mechanics.
- Smoother camera controls (e.g., lerping).
- Gamepad support (Gamepad API).

3. Gameplay:

- Weapons and dogfighting mechanics (shooting, health, damage).
- Objectives, missions, or collectibles.
- Leaderboards.
- Player customization (aircraft skins).
- Simple chat system via WebSockets.

4. Multiplayer Refinements:

- Client-Side Interpolation: Smooth out the movement of other players by interpolating between received network updates instead of snapping to new positions.
- Lag Compensation: More advanced techniques if implementing shooting/combat.
- Server-Side Validation: More robust checks on player movement/actions to prevent cheating.
- Scalability: Consider more advanced server architectures (e.g., spatial partitioning, multiple server instances) if expecting many players.

5. UI/UX:

- Minimap.
- Clearer indicators for other players (names, distance).
- Menus for settings, player lists, etc.
- Loading screen.

6. Sound:

- Engine sounds (varying with speed/boost).
- Collision sounds.
- Weapon firing sounds.
```

## Vibe Coding

I'm documenting my process and approach here. Basically, it's vibe coding but with a different take - a mix of good software engineering practices and scientific methods.

**Goals:**

- Keep everything as simple as possible (only add complexity if necessary)
- Full visibily into the tools I'm using for software development
(The main reason why I'm not even using Cursor/Windsurf/Claude Code. As an engineer, I prefer to build my own tools. For the sake of vibe coding, I'm not doing this, duh...)
- Evaluates the **raw power** of Gemini 2.5 Pro capabilities, especially GDM's claim about the double digit coding score jump in public benchmarks and reasoning improvements
- Evaluates the massive (million) input/output context length - how effective the context window utilization beyond 100k tokens, not just in theory but in practice

**Tools:**

- Model: Gemini Advanced (both web and mobile app when I'm on the move)
- IDE: VSCode
- Version control: git
- Terminal

**Process:**

- Prototyping style - rapid iterations
- Copying and pasting code from Gemini Advanced into a local IDE like VScode


These are steps right after I sent my first prompt to Gemini 2.5 Pro and it one-shotted a solid flying game foundation for continuous improvement.

I follow the above plan of attack and go on and ask Gemini to improved the visuals, like "... make the game visuals appealing ...". I like to start small and implement tasks, step-by-step. But I let Gemini know my ambitious goal upfront. This is how I set up Gemini (actually Claude too) to the success path, right off the bat.

Then, I just ask Gemini to add an actual jet figther model in GLTF format. It one-shotted this task again, no bugs.

The jet figther orientation is facing the wrong side of the 3D world axis. I spend an extra ~30% of my time going back and forth asking Gemini to fix or correct the code and explain the fix to me. Game development, especially 3D is not my strongest domain. This is another area where Gemini 2.5 Pro is flexing its reasoning power. It's so fascinating to see it's thinking tokens - how it digress, back-track, feeling the "aha" moment, etc. This is very useful when the final answer or solution doesn't work. I can go back and see all the proposed methods/strategies/solutions Gemini have considered. For example, in the thinking tokens, it contains a link to a copyrighted GLTF aircraft model. Gemini prefer to give solution and code that respect copyright. I'm still in control and for rapid prototyping, I just use the copyrighted version and change it later. Eventually, Gemini solved the issue.

From here on, everything else on the plan is easily implemented. I go on and ask Gemini to "make the building geometries and textures more interesting.". I copy paste the code from Gemini Advanced into my local VSCode.

I continue iterating, vibe coding. I asked it to "add ground textures or procedural terrain." As a Gemini user since 1.5, this is the first time I've ever seen how good is Gemini creative design capabilities. Gemini not only follow my instruction correctly, it goes beyond my requirements and make a ground filled with some nice grass texture, instead of a flat light green pane. Gemini also design and style it literally like hills (wavy countour with low peaks scattered all over the ground). Amazing to see the game design become lively with such change. No longer bland and boring.

It's so fun tweaking the game design together with Gemini. I don't have to crack my brain so hard and sweat out doing such tasks. I leave the heavy-lifting to Gemini while I focus on the idea, requirements, game design, and tasks management. This is not solely Gemini 2.5 Pro strength. In fact, every frontier LLMs can unlock and enable you to work in this way, pretty much.

Next, I move on to a new task. I asked Gemini to "make the urban landscape 10x better. add and Eiffel Tower, Merlion. my life depends on this.". Funnily, it refuse to comply with my demand. lol. Gemini said "... this is beyond the scope, will increase the complexities, blah, blah, ..." It suggested a different solution and explained the strategy (pros and cons) for its decision. The middle-ground solution is adding clustered of houses spread across the ground and generate four random 3D polygons as the placeholder for the iconic landscape object that emulate Eiffel Tower, The Colosseum, Golden Gate Bridge, etc. This is good enough for now.

I can go on and on from here. I hope you understand my approach and process so far.

That's my vibe coding story, although a short one. I'm continuing my game development. It's far from complete. I will share more glory details soon as I continue implementing the game features.

## Gemini 2.5 Pro Reviews

- Content-window: Very good. o1 Pro is the closest I've experienced. It can maintain a single Gemini Advanced chat session for building out the full-featured game. I haven't notice any crazy hallucinations that I missed except it made up a wrong link to the Three.js texture loader libray for the specific (and older version) of Three.js that I'm using. I didn't picked this version myself. Gemini did from the start. I also checked against the usual [AI blindspots in LLMs while coding](https://ezyang.github.io/ai-blindspots/). I haven't encounter a situation where the models do not know how to stop digging when they get into trouble. Claude/DeepSeek-R1 is prone to this sometimes. The advantage of not using Cursor-like IDEs is I have good visibily what gets into the model context window. AFAIK, Cursor did some funky context processing that might affect your prompt in big way and change the course of development to fall into the pit of failure.
- Usage limit: Initially, I want to use Google's AI Studio for branching out chat and context. I digress after seeing Logan's Tweet about the rate limit issues. So far, I haven't hit the rate limit in Gemini Advanced. If you put Cursor with Claude Sonnet 3.7 and Gemini 2.5 Pro side-by-side, I think you will feel demoralizing. Anthropic's Claude is all great except the API rate limits is not good for zoning out while coding. I think we can finally ditch Claude?
- Gemini Thinking: Strong but fast. Time and time again, it's reasoning can surprise you (as described in my story). It can come out the best solution. What is better than best solution? A solution that doesn't need to be clever and break all good coding practices, disregard your existing codebase, etc. One example is where it code up the game engine algorithm for calculating max player speed using the thrust constant, ground size, and damping. It started out without damping and only add damping later in the development. It suggested code changes that is really neat after thinking long because of the complications involved and trying not to break the existing game logics/algorithms. This is only a few examples where I think it clearly demonstrated it's thinking power. It's great.

## Setup for Development

Step 0:
- Install Node.js (v18 and above)

Clone project:

```sh
$ git clone https://github.com/cedrickchee/vibe-jet.git
$ cd vibe-jet
```

Install NPM packages:

```sh
$ npm i
```

Start the web servers. Run:

```sh
# run the web server for serving HTML and assets (JS, CSS, images, GLTF model files)
$ npx serve

# run the WebSocket server for multiplayer
$ node server.js
```

---

## How this project came about?

I started this project in 2024 for evaluating large language models (LLMs) because the common benchmarks and public leaderboards are quickly saturated. Vibe check cannot scale - it can take a full-time job just to keep up with the fast pace of LLMs progress now. But vibe check provides important signals that common benchmarks and public leaderboards doesn't. Common benchmarks only capture half of the story. You cannot easily tell if the SoTA LLM is bechmaxxing or more than that.
