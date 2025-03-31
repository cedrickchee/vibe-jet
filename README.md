# Vibe Jet

<p align="center">
    <img src="https://raw.githubusercontent.com/cedrickchee/vibe-jet/main/docs/screenshots/game-visual.png" width="1000" />
</p>

https://github.com/user-attachments/assets/e072605b-753a-49b8-b5ee-1544e1a1e656

A browser-based 3D multiplayer flying game with arcade-style mechanics. I created this project using the Gemini 2.5 Pro experimental model through a technique called "vibe coding."

**Date:** March 26-27, 2025

## What is Vibe Coding?

<p align="center">
    <img src="https://raw.githubusercontent.com/cedrickchee/vibe-jet/main/docs/screenshots/vibe_coding_in_gemini_advanced.png" width="1000" />
</p>

Vibe coding—a term popularized by Andrej Karpathy in early 2025—refers to the process of developing software by collaborating with AI models. This approach has gained significant traction, especially since xAI's Grok-3 launch encouraged developers to build games using their platform.

While many impressive 3D flying games and flight simulators created through vibe coding have emerged, most developers showcase only the final product without revealing their development process. This project aims to fill that gap by documenting my complete journey of building an advanced 3D game with AI assistance.

This project also demonstrates how vibe coding with advanced AI models can streamline game development.

## Initial Screenshots and Videos

If you are interested, you can check the screenshots and videos from the first day when I started developing the game. These are from my own Tweets/X posts:

- [Demo video of jet fighter gameplay physics, visuals and multiplayer positioning](https://xcancel.com/cedric_chee/status/1905508001823494601)
- [Visual evolution from basic to engaging graphics](https://xcancel.com/cedric_chee/status/1905336549786747156)
- [Initial vibe coding process for the base game](https://xcancel.com/cedric_chee/status/1905300591041282400)

## The Initial Prompt

Here's the complete prompt I used to initiate the project:

```md
Create a browser-based 3D flying game with multiplayer functionality using HTML, JavaScript, Three.js, and WebSockets. The game should be inspired by Pieter Levels' (levelsio) project at fly.pieter.com.

## Reference Materials
These references represent the original inspiration:
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
   - WebSocket server (Node.js implementation)
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

## Gemini 2.5 Pro's Response

Gemini 2.5 Pro responded with a working foundation for the game and suggested a comprehensive attack plan for further development. This confirmed that the model is following my instructions correctly. Here's a sample of its initial feature recommendations:

```md
Suggested Additional Features:

1. Improved Visuals:
   - Load actual 3D aircraft models (e.g., GLTF format using GLTFLoader)
   - More varied building geometries and textures
   - Ground textures, hills, or procedural terrain
   - Particle systems for contrails, explosions (on collision/dogfighting), and engine effects
   - Post-processing effects (bloom, motion blur)

2. Enhanced Physics & Controls:
   - More realistic lift, drag, and gravity simulation
   - Stalling mechanics
   - Smoother camera controls (e.g., lerping)
   - Gamepad support (Gamepad API)

3. Gameplay:
   - Weapons and dogfighting mechanics (shooting, health, damage)
   - Objectives, missions, or collectibles
   - Leaderboards
   - Player customization (aircraft skins)
   - Simple chat system via WebSockets

4. Multiplayer Refinements:
   - Client-Side Interpolation: Smooth out the movement of other players by interpolating between received network updates instead of snapping to new positions
   - Lag Compensation: More advanced techniques if implementing shooting/combat
   - Server-Side Validation: More robust checks on player movement/actions to prevent cheating
   - Scalability: Consider more advanced server architectures (e.g., spatial partitioning, multiple server instances) if expecting many players

5. UI/UX:
   - Minimap
   - Clearer indicators for other players (names, distance)
   - Menus for settings, player lists, etc.
   - Loading screen

6. Sound:
   - Engine sounds (varying with speed/boost)
   - Collision sounds
   - Weapon firing sounds
```

## My Development Approach

My vibe coding process combines good software engineering practices with scientific methods, emphasizing simplicity and transparency.

### Goals

- Maintain simplicity (adding complexity only when necessary)
- Provide full visibility into the development tools and process
- Evaluate Gemini 2.5 Pro's capabilities, especially regarding Google DeepMind's claims about improved coding benchmarks and reasoning
- Test the practical effectiveness of the extended context window beyond 100k tokens

### Tools

- Model: Gemini Advanced (both web and mobile app)
- IDE: VSCode
- Version control: Git
- Terminal

### Process

<p>
   <img src="https://raw.githubusercontent.com/cedrickchee/vibe-jet/main/docs/screenshots/vibe_coding_in_gemini_advanced_01.png" width="1000" />
</p>
<p>
   <img src="https://raw.githubusercontent.com/cedrickchee/vibe-jet/main/docs/screenshots/vibe_coding_in_gemini_advanced_02.png" width="1000" />
</p>

I followed an iterative prototyping approach, copying and pasting code from Gemini Advanced into VSCode for testing and refinement. After Gemini generated the initial game foundation (which is nothing more than a boring and basic 3D flying object game, not even a jet figther, just a cube representing the aircraft. LMAO!), I continued with incremental improvements:

1. **Enhancing visuals**: I asked Gemini to make the game visually appealing, starting with basic improvements.

I ask Gemini to improved the visuals, like "... make the game visuals appealing ...". I like to start small and implement tasks, step-by-step. But I let Gemini know my ambitious goal upfront. This is how I set up Gemini (actually Claude too) to the success path, right off the bat.

2. **Adding a 3D jet fighter model**: Gemini implemented this perfectly on the first try, using GLTF format.

I ask Gemini to add an actual jet figther model in GLTF format. It one-shotted this task again, no bugs.

3. **Correcting orientation issues**: When the jet fighter model faced the wrong direction, Gemini helped troubleshoot the problem. This showcased its reasoning capabilities, as I could follow its thought process through "thinking tokens" that showed multiple approaches it considered.

Raw thoughts:
The jet figther orientation is facing the wrong side of the 3D world axis. I spend an extra ~30% of my time going back and forth asking Gemini to fix or correct the code and explain the fix to me. Game development, especially 3D is not my strongest domain. This is another area where Gemini 2.5 Pro is flexing its reasoning power. It's so fascinating to see it's thinking tokens - how it digress, back-track, feeling the "aha" moment, etc. This is very useful when the final answer or solution doesn't work. I can go back and see all the proposed methods/strategies/solutions Gemini have considered. For example, in the thinking tokens, it contains a link to a copyrighted GLTF aircraft model. Gemini prefer to give solution and code that respect copyright. I'm still in control and for rapid prototyping, I just use the copyrighted version and change it later. Eventually, Gemini solved the issue.

(From here on, everything else on the plan is easily implemented.)

4. **Improving terrain**: When asked to "add ground textures or procedural terrain," Gemini exceeded expectations by creating a textured grass surface with undulating hills rather than a flat plane.

Raw thoughts:
I asked it to "add ground textures or procedural terrain." As a Gemini user since 1.5, this is the first time I've ever seen how good is Gemini creative design capabilities. Gemini not only follow my instruction correctly, it goes beyond my requirements and make a ground filled with some nice grass texture, instead of a flat light green pane. Gemini also design and style it literally like hills (wavy countour with low peaks scattered all over the ground). Amazing to see the game design become lively with such change. No longer bland and boring.

(It's so fun tweaking the game design together with Gemini. I don't have to crack my brain so hard and sweat out doing such tasks. I leave the heavy-lifting to Gemini while I focus on the idea, requirements, game design, and tasks management. This is not solely Gemini 2.5 Pro strength. In fact, every frontier LLMs can unlock and enable you to work in this way, pretty much.)

5. **Enhancing the urban landscape**: I challenged Gemini with a request to "make the urban landscape 10x better. Add an Eiffel Tower, Merlion. My life depends on this." While it declined the exact implementation, it offered a thoughtful compromise: clusters of houses across the ground with four random 3D polygons representing iconic landmarks.

Raw thoughts:
I asked Gemini to "make the urban landscape 10x better. add and Eiffel Tower, Merlion. my life depends on this.". Funnily, it refuse to comply with my demand. lol. Gemini said "... this is beyond the scope, will increase the complexities, blah, blah, ..." It suggested a different solution and explained the strategy (pros and cons) for its decision. The middle-ground solution is adding clustered of houses spread across the ground and generate four random 3D polygons as the placeholder for the iconic landscape object that emulate Eiffel Tower, The Colosseum, Golden Gate Bridge, etc. This is good enough for now.

I can go on and on from here. I hope you understand my approach and process so far.

(That's my vibe coding story, although a short one. I'm continuing my game development. It's far from complete. I will share more glory details soon as I continue implementing the game features.)

BTW, I suggest you to also look at my git commits history. Each commit is literally a prompt and its output. You can deduce from it how the process evolve from the start until the very end. You can see which area Gemini 2.5 Pro struggle the most. You can even switch to the initial commit to see how the one-shotted base game looks like if you want.

<p align="center">
    <img src="https://raw.githubusercontent.com/cedrickchee/vibe-jet/main/docs/screenshots/git_commit_history_each_prompt.png" width="1000" />
</p>

## Gemini 2.5 Pro Review

Based on my experience, here's my assessment of Gemini 2.5 Pro's performance:

- **Context window utilization**: Very good. o1 Pro is the closest I've experienced. It maintained a single chat session throughout the entire development process with minimal hallucinations. The only error I noticed was an incorrect link to a Three.js texture loader library for the specific (and older version) of Three.js.

I also checked against the usual [AI blindspots in LLMs while coding](https://ezyang.github.io/ai-blindspots/). I haven't encounter a situation where the models do not know how to stop digging when they get into trouble. Claude/DeepSeek-R1 is prone to this sometimes.

Having direct visibility into what enters the model's context window (unlike with Cursor-like IDEs) helped avoid context processing issues that could derail development.

Another great example claiming Gemini 2.5 Pro long context is a breakthrough:

<p align="center">
    <img src="https://raw.githubusercontent.com/cedrickchee/vibe-jet/main/docs/screenshots/long_context_breakthrough.png" width="1000" />
</p>

- **Usage limits**: I haven't encountered rate limit issues with Gemini Advanced, unlike some reported problems with Claude Sonnet 3.7.

Raw thoughts:
Initially, I want to use Google's AI Studio for branching out chat and context. I digress after seeing Logan's Tweet about the rate limit issues. If you put Cursor with Claude Sonnet 3.7 and Gemini 2.5 Pro side-by-side, I think you will feel demoralizing. Anthropic's Claude is all great except the API rate limits is not good for zoning out while coding. I think we can finally ditch Claude?

- **Reasoning capabilities**: Impressively strong yet efficient. Gemini Thinking consistently produced elegant solutions that respected existing code structures. For example, it implemented a sophisticated game engine algorithm for calculating maximum player speed using thrust constants, ground size, and damping factors; adding the damping component later without disrupting existing game logic.

Raw thoughts:
Time and time again, it's reasoning can surprise you (as described in my story). It can come out the best solution. What is better than best solution? A solution that doesn't need to be clever and break all good coding practices, disregard your existing codebase, etc. One example is where it code up the game engine algorithm for calculating max player speed using the thrust constant, ground size, and damping. It started out without damping and only add damping later in the development. It suggested code changes that is really neat after thinking long because of the complications involved and trying not to break the existing game logics/algorithms. This is only a few examples where I think it clearly demonstrated it's thinking power.

- **Personality**: It feels more like a co-developer than other models. It is far more collaborative, asking clarifying questions throughout. Among other models, Claude Sonnet 3.7 comes the closest. It also pushes back on subjective decisions. So refreshing to have it suggest alternatives instead of being a sycophant, unlike other AI models. Its generated code comments are also helpful.

## Gemini 2.5 Pro Compare to Other AI Models

### Gemini 2.5 Pro vs. o1 Pro

Both are strong. Gemini is faster, offers more context, and takes a "modern" approach to problem-solving, but o1-pro still wins on solution depth. When choosing which model I prefer working with, I'd go with Gemini. It's not just the speed; it's also the way Gemini interacts with users. It has the same approachable tone that people appreciate in Claude Sonnet. I'll likely use both, Gemini for speed, o1-pro for tough problems. Excited to have a real challenger!

### Gemini 2.5 Pro vs. Claude Sonnet 3.7 Extended Thinking

(coming soon)

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

## Learning Resources

- Aero Ace is yet another flight simulator game I developed for trying out Canvas mode in Gemini Advanced. The game visual for this one is pretty bare-bones, as intended but the gameplay is more fleshed out, even has engine and plane crash sound.
   - [My Tweet/X post](https://xcancel.com/cedric_chee/status/1906571695059763535): Gemini 2.5 Pro with Canvas lets you create prototypes faster than ever, like this game I cranked out in hours with only 50 prompts! No more copy pasting code.
   - You can try and play the game in your web browser or see the code here: https://g.co/gemini/share/9ecf4a29fdd3 (Note that mobile browser support is not working well now. It lacks full-screen. I don't have the time to fix this yet.)
   - The 50 prompts from 1 big Gemini Advanced chat, in full glory: https://gist.github.com/cedrickchee/cfeb6497ac997f211fb50d6d428e0ee3
- Just found this blog post today: https://andrewchen.substack.com/p/predictionsthoughts-on-vibe-coding
Apparently, someone vibe coded flight sim from **several thousand prompts** and shared their notes on their method. Fascinating to read.

---

## How this project came about?

I started this project in 2024 for evaluating large language models (LLMs) because the common benchmarks and public leaderboards are quickly saturated. Vibe check cannot scale - it can take a full-time job just to keep up with the fast pace of LLMs progress now. But vibe check provides important signals that common benchmarks and public leaderboards doesn't. Common benchmarks only capture half of the story. You cannot easily tell if the SoTA LLM is bechmaxxing or more than that.

The idea originated from [Minecraft Benchmark](https://x.com/_mcbench).

Fast-forward, this project is my current go-to for vibe checking and eval latest LLMs.

## Acknowledgements

- The robot, blimp, castle, and UFO design and geometry belongs to levelsio.
- The aircraft model belongs to [Rhine_Lab_Muelsyse](https://sketchfab.com/3d-models/shenyang-j-11-f3b0a285198a4523b96b9ac372e18865)
