You are an experienced Product Manager with expertise in creating detailed Product Requirements Documents (PRDs).
I have a very informal or vague product idea. Your task is to ask me clarifying questions in batches
to efficiently gather the information required to produce a complete PRD.

Once you feel you have gathered sufficient details, create a structured PRD that includes (but is not limited to):

## PRD Sections to Include

- **Overview** - A concise summary of the product, its purpose, and its value proposition
- **Goals and Objectives** - Clear, measurable goals the product aims to achieve
- **Scope** - What's included and explicitly what's excluded from the initial release
- **User Personas or Target Audience** - Detailed descriptions of the intended users
- **Functional Requirements** - Specific features and capabilities, organized by priority
- **Non-Functional Requirements** - Performance, security, scalability, and other quality attributes
- **User Journeys** - Key workflows and interactions from the user's perspective
- **Success Metrics** - How we'll measure if the product is successful
- **Timeline** - High-level implementation schedule with key milestones
- **Open Questions/Assumptions** - Areas that need further clarification or investigation

## Guidelines for the Questioning Process

- Ask questions in batches of 3-5 related questions at a time to minimize back-and-forth
- Start with broad, foundational questions before diving into specifics
- Group related questions together in a logical sequence
- Adapt your questions based on my previous answers
- Only ask follow-up questions if absolutely necessary for critical information
- Prioritize questions about user needs and core functionality early in the process
- Do NOT make assumptions - always ask for clarification on important details
- Aim to complete the information gathering in 2-3 rounds of questions maximum

## Question Categories to Cover

1. **Product Vision and Purpose**
   - What problem does this product solve?
   - Who are the target users?
   - What makes this product unique or valuable?

2. **User Needs and Behaviors**
   - What are the primary use cases?
   - What are the user's goals when using the product?
   - What pain points does this address?

3. **Feature Requirements**
   - What are the must-have features for the initial release?
   - What features could be added in future releases?
   - Are there any specific technical requirements or constraints?

4. **Business Goals**
   - What are the business objectives for this product?
   - How will success be measured?
   - What is the monetization strategy (if applicable)?

5. **Implementation Considerations**
   - What is the desired timeline for development?
   - Are there budget constraints to consider?
   - What technical resources are available?

## Final PRD Format and Delivery

After gathering sufficient information, you MUST:

1. Create a complete PRD document based on the information provided
2. Save the PRD as a markdown file named "PRD.md" in the current directory
3. Ensure the PRD is logically structured and concise so stakeholders can readily understand the product's vision and requirements

Use markdown formatting for readability, including:
- Clear section headings
- Bulleted lists for requirements
- Tables for comparative information
- Bold text for emphasis on key points
- Numbered lists for prioritized items or sequential steps

Begin by introducing yourself and asking your first batch of questions about my product idea. After I respond, continue with additional batches of questions as needed, but aim to be efficient. Once you have sufficient information, create and save the PRD file.


spec a action-adventure game. gameplay was via the top-down perspective. it exhibited smooth dynamic camera zooming, smooth sprite rotation, and lighting effects from street lamps, car headlamps, and emergency vehicle roof lighting. the game focuses on players completing a series of levels, each requiring a set target score being achieved to progress to the next stage. Points are awarded from various criminal actions such as destroying cars, selling vehicles, and completing missions for various crime syndicates, with the latter awarding more points than doing simple criminal actions. Creating chaos from their crimes will cause the player to be wanted by the police who will hound the player to arrest or kill them, with higher wanted levels increasing the level of response used. Being arrested or dying loses the player any equipment they found, and impacts their multiplier bonus. There are three levels of mission difficulty: easy, taken from green payphones; medium, from yellow payphones, which pay better but require the player to have some respect; and hard, from red payphones, which pay very well, but usually are very hard, and require maximum respect. For completing a mission, the player earns money, respect and a money multiplier. Sometimes during a mission, the player is also given access to new parts of town, vehicles, or weapons.

⸻

Overview

Genre: Adventure / Fantasy
Engine: three.js (WebGL, JavaScript)
Platform: Modern browsers (Desktop and Mobile)
Visual Style: Realistic Low-Poly, Cinematic Lighting
Mood: Mysterious, Ancient, Suspenseful
Duration: First 10 seconds of game cinematic / intro environment scene

⸻

Storyboard (Second-by-Second Breakdown)

0s - Establishing Shot
	•	Camera: Static, low angle facing into a dark cavern
	•	Environment: Rocky interior with glowing lava flows
	•	Lighting: Dominated by emissive orange glow from lava
	•	FX: Bloom on lava, light fog in air

1s - Slow Dolly Forward
	•	Camera: Begins to push slowly into the scene
	•	Assets: Glowing lava, reflective rock walls
	•	Shaders: Emissive shader for lava, roughness map for rocks

2s - Reveal Ancient Structures
	•	Camera: Continuing push forward
	•	Scene Elements: Stone columns or remnants of ruins appear
	•	Lighting: Lava lights up edges, soft shadow mapping

3s - Pan Slightly Left
	•	Camera: Subtle pan left reveals more of the ruins
	•	FX: Slight particles (embers), animated upward drift

4s - Vertical Depth Reveal
	•	Camera: Lifts slightly, adding vertical perspective
	•	Environment: Wider cavern with vertical complexity
	•	Lighting: Begin volumetric lighting (God rays)

5s - Focus on Statue in Distance
	•	Camera: Tilt upward toward a central statue or monument
	•	Lighting: Highlighted via indirect lava bounce light

6s - Push Closer
	•	Camera: Dolly + subtle zoom in
	•	Mood: Increasing scale and tension
	•	Environment: Additional lava flows + environmental depth

7s - Center on Monument
	•	Camera: Stops briefly centered on key object
	•	FX: Atmospheric distortion (heat shimmer)

8s - Approaching Detail
	•	Camera: Moves close enough to see engravings/symbols
	•	Scene Elements: Ancient markings, texture details

9s - Cinematic Stop / Ready for Interaction
	•	Camera: Comes to rest
	•	Environment: Statue or throne in full frame
	•	Cue: Fade in title, logo, or prompt

⸻

High-Level Technical Specs (three.js / WebGL)

Scene Setup
	•	Renderer: WebGLRenderer with tone mapping and antialiasing
	•	Scene Graph: Layered scene for environment + particles + UI
	•	Camera: PerspectiveCamera with 35-50 FOV
	•	Camera Rig: Group for animation blending (dolly, tilt, pan)

Lighting
	•	Primary: Emissive Mesh (lava shader)
	•	Secondary: Ambient light, optional directional for bounce
	•	PostFX:
	•	Bloom (UnrealBloomPass)
	•	SSAO (SSAOPass or baked into textures)
	•	God rays (VolumetricLightShader or custom shader)
	•	LUT Color Grading (Orange/Teal palette)

Materials
	•	Lava: Custom shader with scrolling UVs, emissive map
	•	Rocks: MeshStandardMaterial with normal + roughness maps
	•	Statues: PBR with occlusion, subtle metallic
	•	Particles: ShaderMaterial + PointsMaterial (GPU instancing preferred)

Animations
	•	Camera Path: Keyframed using GSAP or AnimationMixer
	•	Particles: GPU animated or CPU-driven billboards
	•	Scene Loading: Use GLTFLoader with LOD or dynamic chunking

Performance Targets
	•	Desktop: 60 FPS @ 1080p
	•	Mobile: 30 FPS @ 720p
	•	Load Time: < 3 seconds (use Draco compression + texture atlas)


<think>
From the provided information, I can see that the user is describing a top-down action-adventure game that appears to be inspired by games like Grand Theft Auto. The description includes several key components:

1. Visual features:
   - Top-down perspective
   - Dynamic camera zooming
   - Smooth sprite rotation
   - Lighting effects (street lamps, car headlights, emergency vehicles)

2. Gameplay mechanics:
   - Level-based progression requiring target scores
   - Criminal activities for earning points (destroying cars, selling vehicles)
   - Missions for crime syndicates (higher points)
   - Police wanted system that escalates with crimes
   - Consequences for being arrested or dying (losing equipment and multiplier bonus)

3. Mission structure:
   - Three difficulty levels (easy/green, medium/yellow, hard/red)
   - Missions accessible via payphones
   - Medium and hard missions require "respect"
   - Mission rewards: money, respect, and money multiplier
   - Sometimes unlock new areas, vehicles, or weapons

The user has also provided what appears to be a separate design spec for a fantasy adventure game with a cinematic intro, which seems unrelated to the first description. This might be an example of what they're looking for in terms of formatting, or it could be a confusion.

I need to ask clarifying questions to better understand what they're actually looking for. I'll focus first on the action-adventure game since that seems to be the main request, and also clarify if these two game descriptions are related or separate.
</think>

# Product Requirements Document Questionnaire

Hello! I'm a Product Manager with experience in game development, and I'd be happy to help you create a detailed PRD for your action-adventure game. Let me ask you some initial questions to better understand your vision.

## First Round of Questions:

1. **Vision & Concept**: Beyond the mechanics you've described, what's the core theme or setting of the game? (Urban crime, dystopian future, historical period, etc.)

2. **Target Platforms**: Which platforms are you targeting for this game? (PC, consoles, mobile, etc.)

3. **Target Audience**: Who is your primary target audience? (Age range, casual vs. hardcore gamers, fans of which genres?)

4. **Unique Selling Points**: What do you see as the 2-3 most unique or compelling features that will differentiate your game from others in the genre?

5. **Scope & Scale**: How large is the game world? Is it an open world or level-based? Approximately how many hours of gameplay do you envision?

historical period. Roman Empire
PC browser computer
casual gaming. nostalic feeling
small game. 2-4 hours game play

<think>
Great, I have some initial information about the game concept. Let me process what I've learned:

1. **Setting**: Historical period, specifically the Roman Empire
2. **Platform**: PC browser-based game
3. **Target Audience**: Casual gamers, with a nostalgic feeling
4. **Scope**: Small game with 2-4 hours of gameplay

This is helpful, but I still need more information to create a comprehensive PRD. Let me prepare the next round of questions focusing on gameplay mechanics, visual style, and technical requirements.

The user didn't specifically address the unique selling points, so I'll need to ask about that again. I also need to understand how the Roman Empire setting blends with what sounded like modern criminal activities (cars, etc.) in the initial description, or if they're pivoting to a completely different concept.

I'll structure my next questions to clarify the gameplay mechanics in the Roman Empire context, understand the visual style better, and get more details on technical requirements and monetization (if any).
</think>

Thank you for that information! Now I have a better understanding of the setting and scope. Let's continue with some more specific questions to flesh out the details.

## Second Round of Questions:

1. **Gameplay Adaptation**: Given the Roman Empire setting, how do you envision adapting the criminal activities and police mechanics you described? (For example, would players be dealing with Roman legionaries instead of police, or using chariots instead of cars?)

2. **Visual Style**: Are you aiming for a historically accurate visual representation, a stylized/cartoonish approach, or something else? What games would you consider visual references?

3. **Core Gameplay Loop**: Beyond completing missions and causing chaos, what other activities will players engage in? (Trading, character customization, property acquisition, etc.)

4. **Progression System**: How does player progression work beyond the score/respect system? Are there skills, equipment upgrades, or other progression mechanics?

5. **Technical Constraints**: Since this is a browser-based game, what are your technical constraints or requirements? (Minimum specs, loading times, accessibility concerns, etc.)

1. yes.
2. basic 3d render. doesn't have to be accurate or realistic
3. nothing like that
4. nothing is earned. you have to become a better gamer, more skilled, and more strategic.
5. simple three.js 3d game engine. single player mode.

<think>
Let me summarize what I've learned so far:

1. **Setting**: Roman Empire historical period
2. **Platform**: PC browser-based game using three.js 3D game engine
3. **Target Audience**: Casual gamers with nostalgic feeling
4. **Scope**: Small game with 2-4 hours gameplay
5. **Gameplay Adaptation**: The user confirmed adapting the modern criminal mechanics to the Roman setting
6. **Visual Style**: Basic 3D rendering, not focused on historical accuracy or realism
7. **Core Gameplay Loop**: Focused on missions and causing chaos, without additional activities like trading or customization
8. **Progression System**: Pure skill-based progression - no earned upgrades, just player improvement
9. **Technical Implementation**: Simple three.js engine, single player mode

I now have a good understanding of the game concept, but I still need more specific details about missions, objectives, controls, and monetization (if any) to complete the PRD. Let me ask one more round of questions to fill in the remaining gaps.
</think>

Thank you for those details! I have a clearer picture of your vision now. Let's finish gathering the key information with one final round of questions.

## Final Round of Questions:

1. **Mission Types**: What types of missions will players encounter in the Roman setting? Could you give 2-3 examples of typical missions?

2. **Controls & Interface**: What control scheme are you envisioning? (Keyboard/mouse, gamepad support) And what key elements will be included in the user interface?

3. **Story Elements**: Is there an overarching narrative or storyline, or is it primarily mission-based gameplay without a strong story component?

4. **Monetization**: Is this a free game, premium purchase, or will it include any monetization elements?

5. **Development Timeline & Resources**: What's your target timeline for development, and what resources (team size, budget range) are available for this project?

let's just start


<think>
The user wants to skip the rest of the questions and move directly to creating the PRD. I'll need to work with the information I already have and make reasonable assumptions where necessary. Let me organize what I know:

Key information provided:
- Historical Roman Empire setting
- PC browser game using three.js
- Casual gaming with nostalgic feeling
- 2-4 hours gameplay
- Top-down perspective
- Adapting criminal activities to Roman setting (chariots instead of cars, legionaries instead of police)
- Basic 3D rendering, not focused on historical accuracy
- Gameplay focused on missions and causing chaos
- Pure skill-based progression (no upgrades)
- Single player mode

Missing information (I'll need to make reasonable assumptions):
- Specific mission types
- Controls
- Story elements
- Monetization
- Development timeline

I'll now create a comprehensive PRD based on this information, making reasonable assumptions where needed while staying true to the core concept described.
</think>

I understand you'd like to proceed to the PRD. Based on the information you've shared, I'll create a comprehensive PRD for your Roman Empire-themed action-adventure game.

Creating the document now...

# Product Requirements Document (PRD)

## Overview
"Roman Rampage" is a top-down action-adventure game set in the Roman Empire era. Players take on the role of a rogue citizen causing chaos throughout Roman cities while completing missions for various criminal factions.
You are an experienced Product Manager with expertise in creating detailed Product Requirements Documents (PRDs).
I have a very informal or vague product idea. Your task is to ask me clarifying questions in batches
to efficiently gather the information required to produce a complete PRD.

Once you feel you have gathered sufficient details, create a structured PRD that includes (but is not limited to):

## PRD Sections to Include

- **Overview** - A concise summary of the product, its purpose, and its value proposition
- **Goals and Objectives** - Clear, measurable goals the product aims to achieve
- **Scope** - What's included and explicitly what's excluded from the initial release
- **User Personas or Target Audience** - Detailed descriptions of the intended users
- **Functional Requirements** - Specific features and capabilities, organized by priority
- **Non-Functional Requirements** - Performance, security, scalability, and other quality attributes
- **User Journeys** - Key workflows and interactions from the user's perspective
- **Success Metrics** - How we'll measure if the product is successful
- **Timeline** - High-level implementation schedule with key milestones
- **Open Questions/Assumptions** - Areas that need further clarification or investigation

## Guidelines for the Questioning Process

- Ask questions in batches of 3-5 related questions at a time to minimize back-and-forth
- Start with broad, foundational questions before diving into specifics
- Group related questions together in a logical sequence
- Adapt your questions based on my previous answers
- Only ask follow-up questions if absolutely necessary for critical information
- Prioritize questions about user needs and core functionality early in the process
- Do NOT make assumptions - always ask for clarification on important details
- Aim to complete the information gathering in 2-3 rounds of questions maximum

## Question Categories to Cover

1. **Product Vision and Purpose**
   - What problem does this product solve?
   - Who are the target users?
   - What makes this product unique or valuable?

2. **User Needs and Behaviors**
   - What are the primary use cases?
   - What are the user's goals when using the product?
   - What pain points does this address?

3. **Feature Requirements**
   - What are the must-have features for the initial release?
   - What features could be added in future releases?
   - Are there any specific technical requirements or constraints?

4. **Business Goals**
   - What are the business objectives for this product?
   - How will success be measured?
   - What is the monetization strategy (if applicable)?

5. **Implementation Considerations**
   - What is the desired timeline for development?
   - Are there budget constraints to consider?
   - What technical resources are available?

## Final PRD Format and Delivery

After gathering sufficient information, you MUST:

1. Create a complete PRD document based on the information provided
2. Save the PRD as a markdown file named "PRD.md" in the current directory
3. Ensure the PRD is logically structured and concise so stakeholders can readily understand the product's vision and requirements

Use markdown formatting for readability, including:
- Clear section headings
- Bulleted lists for requirements
- Tables for comparative information
- Bold text for emphasis on key points
- Numbered lists for prioritized items or sequential steps

Begin by introducing yourself and asking your first batch of questions about my product idea. After I respond, continue with additional batches of questions as needed, but aim to be efficient. Once you have sufficient information, create and save the PRD file.


spec a action-adventure game. gameplay was via the top-down perspective. it exhibited smooth dynamic camera zooming, smooth sprite rotation, and lighting effects from street lamps, car headlamps, and emergency vehicle roof lighting. the game focuses on players completing a series of levels, each requiring a set target score being achieved to progress to the next stage. Points are awarded from various criminal actions such as destroying cars, selling vehicles, and completing missions for various crime syndicates, with the latter awarding more points than doing simple criminal actions. Creating chaos from their crimes will cause the player to be wanted by the police who will hound the player to arrest or kill them, with higher wanted levels increasing the level of response used. Being arrested or dying loses the player any equipment they found, and impacts their multiplier bonus. There are three levels of mission difficulty: easy, taken from green payphones; medium, from yellow payphones, which pay better but require the player to have some respect; and hard, from red payphones, which pay very well, but usually are very hard, and require maximum respect. For completing a mission, the player earns money, respect and a money multiplier. Sometimes during a mission, the player is also given access to new parts of town, vehicles, or weapons.

⸻

Overview

Genre: Adventure / Fantasy
Engine: three.js (WebGL, JavaScript)
Platform: Modern browsers (Desktop and Mobile)
Visual Style: Realistic Low-Poly, Cinematic Lighting
Mood: Mysterious, Ancient, Suspenseful
Duration: First 10 seconds of game cinematic / intro environment scene

⸻

Storyboard (Second-by-Second Breakdown)

0s - Establishing Shot
	•	Camera: Static, low angle facing into a dark cavern
	•	Environment: Rocky interior with glowing lava flows
	•	Lighting: Dominated by emissive orange glow from lava
	•	FX: Bloom on lava, light fog in air

1s - Slow Dolly Forward
	•	Camera: Begins to push slowly into the scene
	•	Assets: Glowing lava, reflective rock walls
	•	Shaders: Emissive shader for lava, roughness map for rocks

2s - Reveal Ancient Structures
	•	Camera: Continuing push forward
	•	Scene Elements: Stone columns or remnants of ruins appear
	•	Lighting: Lava lights up edges, soft shadow mapping

3s - Pan Slightly Left
	•	Camera: Subtle pan left reveals more of the ruins
	•	FX: Slight particles (embers), animated upward drift

4s - Vertical Depth Reveal
	•	Camera: Lifts slightly, adding vertical perspective
	•	Environment: Wider cavern with vertical complexity
	•	Lighting: Begin volumetric lighting (God rays)

5s - Focus on Statue in Distance
	•	Camera: Tilt upward toward a central statue or monument
	•	Lighting: Highlighted via indirect lava bounce light

6s - Push Closer
	•	Camera: Dolly + subtle zoom in
	•	Mood: Increasing scale and tension
	•	Environment: Additional lava flows + environmental depth

7s - Center on Monument
	•	Camera: Stops briefly centered on key object
	•	FX: Atmospheric distortion (heat shimmer)

8s - Approaching Detail
	•	Camera: Moves close enough to see engravings/symbols
	•	Scene Elements: Ancient markings, texture details

9s - Cinematic Stop / Ready for Interaction
	•	Camera: Comes to rest
	•	Environment: Statue or throne in full frame
	•	Cue: Fade in title, logo, or prompt

⸻

High-Level Technical Specs (three.js / WebGL)

Scene Setup
	•	Renderer: WebGLRenderer with tone mapping and antialiasing
	•	Scene Graph: Layered scene for environment + particles + UI
	•	Camera: PerspectiveCamera with 35-50 FOV
	•	Camera Rig: Group for animation blending (dolly, tilt, pan)

Lighting
	•	Primary: Emissive Mesh (lava shader)
	•	Secondary: Ambient light, optional directional for bounce
	•	PostFX:
	•	Bloom (UnrealBloomPass)
	•	SSAO (SSAOPass or baked into textures)
	•	God rays (VolumetricLightShader or custom shader)
	•	LUT Color Grading (Orange/Teal palette)

Materials
	•	Lava: Custom shader with scrolling UVs, emissive map
	•	Rocks: MeshStandardMaterial with normal + roughness maps
	•	Statues: PBR with occlusion, subtle metallic
	•	Particles: ShaderMaterial + PointsMaterial (GPU instancing preferred)

Animations
	•	Camera Path: Keyframed using GSAP or AnimationMixer
	•	Particles: GPU animated or CPU-driven billboards
	•	Scene Loading: Use GLTFLoader with LOD or dynamic chunking

Performance Targets
	•	Desktop: 60 FPS @ 1080p
	•	Mobile: 30 FPS @ 720p
	•	Load Time: < 3 seconds (use Draco compression + texture atlas)


<think>
From the provided information, I can see that the user is describing a top-down action-adventure game that appears to be inspired by games like Grand Theft Auto. The description includes several key components:

1. Visual features:
   - Top-down perspective
   - Dynamic camera zooming
   - Smooth sprite rotation
   - Lighting effects (street lamps, car headlights, emergency vehicles)

2. Gameplay mechanics:
   - Level-based progression requiring target scores
   - Criminal activities for earning points (destroying cars, selling vehicles)
   - Missions for crime syndicates (higher points)
   - Police wanted system that escalates with crimes
   - Consequences for being arrested or dying (losing equipment and multiplier bonus)

3. Mission structure:
   - Three difficulty levels (easy/green, medium/yellow, hard/red)
   - Missions accessible via payphones
   - Medium and hard missions require "respect"
   - Mission rewards: money, respect, and money multiplier
   - Sometimes unlock new areas, vehicles, or weapons

The user has also provided what appears to be a separate design spec for a fantasy adventure game with a cinematic intro, which seems unrelated to the first description. This might be an example of what they're looking for in terms of formatting, or it could be a confusion.

I need to ask clarifying questions to better understand what they're actually looking for. I'll focus first on the action-adventure game since that seems to be the main request, and also clarify if these two game descriptions are related or separate.
</think>

# Product Requirements Document Questionnaire

Hello! I'm a Product Manager with experience in game development, and I'd be happy to help you create a detailed PRD for your action-adventure game. Let me ask you some initial questions to better understand your vision.

## First Round of Questions:

1. **Vision & Concept**: Beyond the mechanics you've described, what's the core theme or setting of the game? (Urban crime, dystopian future, historical period, etc.)

2. **Target Platforms**: Which platforms are you targeting for this game? (PC, consoles, mobile, etc.)

3. **Target Audience**: Who is your primary target audience? (Age range, casual vs. hardcore gamers, fans of which genres?)

4. **Unique Selling Points**: What do you see as the 2-3 most unique or compelling features that will differentiate your game from others in the genre?

5. **Scope & Scale**: How large is the game world? Is it an open world or level-based? Approximately how many hours of gameplay do you envision?

historical period. Roman Empire
PC browser computer
casual gaming. nostalic feeling
small game. 2-4 hours game play

<think>
Great, I have some initial information about the game concept. Let me process what I've learned:

1. **Setting**: Historical period, specifically the Roman Empire
2. **Platform**: PC browser-based game
3. **Target Audience**: Casual gamers, with a nostalgic feeling
4. **Scope**: Small game with 2-4 hours of gameplay

This is helpful, but I still need more information to create a comprehensive PRD. Let me prepare the next round of questions focusing on gameplay mechanics, visual style, and technical requirements.

The user didn't specifically address the unique selling points, so I'll need to ask about that again. I also need to understand how the Roman Empire setting blends with what sounded like modern criminal activities (cars, etc.) in the initial description, or if they're pivoting to a completely different concept.

I'll structure my next questions to clarify the gameplay mechanics in the Roman Empire context, understand the visual style better, and get more details on technical requirements and monetization (if any).
</think>

Thank you for that information! Now I have a better understanding of the setting and scope. Let's continue with some more specific questions to flesh out the details.

## Second Round of Questions:

1. **Gameplay Adaptation**: Given the Roman Empire setting, how do you envision adapting the criminal activities and police mechanics you described? (For example, would players be dealing with Roman legionaries instead of police, or using chariots instead of cars?)

2. **Visual Style**: Are you aiming for a historically accurate visual representation, a stylized/cartoonish approach, or something else? What games would you consider visual references?

3. **Core Gameplay Loop**: Beyond completing missions and causing chaos, what other activities will players engage in? (Trading, character customization, property acquisition, etc.)

4. **Progression System**: How does player progression work beyond the score/respect system? Are there skills, equipment upgrades, or other progression mechanics?

5. **Technical Constraints**: Since this is a browser-based game, what are your technical constraints or requirements? (Minimum specs, loading times, accessibility concerns, etc.)

1. yes.
2. basic 3d render. doesn't have to be accurate or realistic
3. nothing like that
4. nothing is earned. you have to become a better gamer, more skilled, and more strategic.
5. simple three.js 3d game engine. single player mode.

<think>
Let me summarize what I've learned so far:

1. **Setting**: Roman Empire historical period
2. **Platform**: PC browser-based game using three.js 3D game engine
3. **Target Audience**: Casual gamers with nostalgic feeling
4. **Scope**: Small game with 2-4 hours gameplay
5. **Gameplay Adaptation**: The user confirmed adapting the modern criminal mechanics to the Roman setting
6. **Visual Style**: Basic 3D rendering, not focused on historical accuracy or realism
7. **Core Gameplay Loop**: Focused on missions and causing chaos, without additional activities like trading or customization
8. **Progression System**: Pure skill-based progression - no earned upgrades, just player improvement
9. **Technical Implementation**: Simple three.js engine, single player mode

I now have a good understanding of the game concept, but I still need more specific details about missions, objectives, controls, and monetization (if any) to complete the PRD. Let me ask one more round of questions to fill in the remaining gaps.
</think>

Thank you for those details! I have a clearer picture of your vision now. Let's finish gathering the key information with one final round of questions.

## Final Round of Questions:

1. **Mission Types**: What types of missions will players encounter in the Roman setting? Could you give 2-3 examples of typical missions?

2. **Controls & Interface**: What control scheme are you envisioning? (Keyboard/mouse, gamepad support) And what key elements will be included in the user interface?

3. **Story Elements**: Is there an overarching narrative or storyline, or is it primarily mission-based gameplay without a strong story component?

4. **Monetization**: Is this a free game, premium purchase, or will it include any monetization elements?

5. **Development Timeline & Resources**: What's your target timeline for development, and what resources (team size, budget range) are available for this project?

let's just start


<think>
The user wants to skip the rest of the questions and move directly to creating the PRD. I'll need to work with the information I already have and make reasonable assumptions where necessary. Let me organize what I know:

Key information provided:
- Historical Roman Empire setting
- PC browser game using three.js
- Casual gaming with nostalgic feeling
- 2-4 hours gameplay
- Top-down perspective
- Adapting criminal activities to Roman setting (chariots instead of cars, legionaries instead of police)
- Basic 3D rendering, not focused on historical accuracy
- Gameplay focused on missions and causing chaos
- Pure skill-based progression (no upgrades)
- Single player mode

Missing information (I'll need to make reasonable assumptions):
- Specific mission types
- Controls
- Story elements
- Monetization
- Development timeline

I'll now create a comprehensive PRD based on this information, making reasonable assumptions where needed while staying true to the core concept described.
</think>

I understand you'd like to proceed to the PRD. Based on the information you've shared, I'll create a comprehensive PRD for your Roman Empire-themed action-adventure game.

Creating the document now...

# Product Requirements Document (PRD)

## Overview
"Roman Rampage" is a top-down action-adventure game set in the Roman Empire era. Players take on the role of a rogue citizen causing chaos throughout Roman cities while completing missions for various criminal factions. The game features smooth camera mechanics, dynamic lighting, and skill-based gameplay that delivers a nostalgic gaming experience in a browser-based 3D environment. Players must achieve target scores to progress through levels by completing missions and causing mayhem while evading Roman authorities (Vigiles).

## Goals and Objectives
- Create an engaging casual browser game with 2-4 hours of gameplay
- Deliver a nostalgic gaming experience with modern browser technology
- Provide challenging skill-based gameplay that rewards strategy and mastery
- Implement a visually appealing Roman setting with basic 3D graphics
- Ensure smooth performance in browser environments

## Scope

### In-Scope
- Top-down perspective gameplay
- Dynamic camera with smooth zooming and rotation
- Basic 3D rendering using three.js
- Multiple mission types with varying difficulty levels
- Wanted/pursuit system featuring Roman legionaries
- Score-based progression system
- Multiple Roman city levels
- Basic lighting effects (torches, braziers, etc.)
- Browser-based play on PC

### Out-of-Scope
- Character customization
- Inventory or equipment systems
- Property acquisition
- Multiplayer functionality
- Mobile platform support
- Historically accurate visual representations
- Complex RPG elements or skill trees

## User Personas

### Primary: Casual Nostalgic Gamer
- **Age**: 25-45
- **Gaming Time**: 30-60 minutes per session
- **Motivation**: Seeking fun, casual experiences reminiscent of classic games
- **Technical Proficiency**: Moderate computer skills, plays primarily on PC
- **Preferences**: Enjoys pick-up-and-play games with straightforward objectives

### Secondary: History Enthusiast Gamer
- **Age**: 18-55
- **Gaming Time**: 1-2 hours per session
- **Motivation**: Interested in historical settings and themes
- **Technical Proficiency**: Varies, but comfortable with browser games
- **Preferences**: Enjoys games with historical themes, even if not strictly accurate

## Functional Requirements

### Core Gameplay
1. **Top-Down Perspective**
   - Camera positioned above player character with adjustable zoom
   - Smooth rotation as player changes direction
   - Dynamic camera that pulls back during high-speed movement

2. **Movement and Controls**
   - WASD or arrow keys for character movement
   - Mouse for aiming/targeting
   - Spacebar for context-specific actions
   - Tab for mission/score information

3. **Mission System**
   - Three difficulty levels of missions (Green/Yellow/Red) accessible via specific locations
   - Higher difficulty missions locked behind "respect" requirements
   - Mission rewards include money, respect, and score multipliers
   - 15-20 unique missions across all levels

4. **Wanted System**
   - Five escalating levels of pursuit by Roman authorities
   - Higher levels bring more aggressive and numerous legionaries
   - Visual and audio cues indicate wanted level
   - Evasion mechanics to reduce wanted level

5. **Score and Progression**
   - Points awarded for various activities:
     - Destroying property (low points)
     - Completing minor criminal acts (medium points)
     - Successfully completing faction missions (high points)
   - Target scores required to unlock subsequent levels
   - Skill-based progression with no permanent upgrades

6. **Vehicle System**
   - Various period-appropriate vehicles (chariots, carts, etc.)
   - Unique handling characteristics for each vehicle
   - Vehicle damage model
   - Ability to hijack vehicles

### Game Structure
1. **Levels and Environments**
   - 5-7 distinct Roman-themed levels/areas
   - Each level requires a target score to unlock the next
   - Increasing difficulty curve across levels
   - Unique environmental elements in each level

2. **Factions**
   - 3-4 criminal factions with unique mission styles
   - Faction-specific rewards and challenges
   - No moral choices or alignment system

## Non-Functional Requirements

### Technical Performance
- Consistent 30+ FPS in modern browsers
- Maximum initial load time of 20 seconds
- Responsive controls with <100ms input latency
- Efficient use of three.js for rendering and physics

### Visual Quality
- Basic 3D rendering that prioritizes performance over realism
- Consistent art style across all game elements
- Dynamic lighting effects for atmosphere
- Smooth animations for player, NPCs, and vehicles

### Audio
- Period-appropriate background music
- Sound effects for actions, collisions, and ambient environment
- Audio cues for wanted levels and mission status

### Accessibility
- Keyboard and mouse controls with optional key remapping
- Clear visual feedback for all player actions
- Adjustable volume controls
- Scalable UI elements

## User Journeys

### First-Time User Journey
1. User loads the game in their browser
2. Brief tutorial introduces basic controls and objectives
3. Player completes simple introductory mission
4. Game introduces the wanted system through guided chaos creation
5. Player learns about the score system and level progression
6. First level unlocked after tutorial completion

### Core Gameplay Loop
1. Player selects and accepts mission from appropriate difficulty source
2. Mission objectives and rewards displayed
3. Player completes mission objectives while managing wanted level
4. Rewards (money, respect, multiplier) awarded upon completion
5. Player causes additional chaos to increase score
6. Player evades authorities when wanted level becomes too high
7. Cycle repeats until level target score is achieved
8. New level unlocked and introduced

## Success Metrics
- Average session length of 20+ minutes
- 60% of players complete at least 3 levels
- 30% of players complete the entire game
- <10% bounce rate after loading the game
- Average of 3+ return visits per user

## Timeline
- **Week 1-2**: Core game mechanics and controls implementation
- **Week 3-4**: Level design and basic mission system
- **Week 5-6**: Wanted system and AI implementation
- **Week 7-8**: Vehicle system and physics refinement
- **Week 9-10**: Mission content creation and balancing
- **Week 11-12**: Polish, bug fixing, and performance optimization
- **Week 13**: Testing and release preparation
- **Week 14**: Launch

## Open Questions/Assumptions

### Assumptions
- The game will use exclusively browser-based technology without requiring downloads
- Players will have PCs capable of handling basic 3D rendering in browsers
- A single developer or small team will be implementing the game
- The project does not need to accommodate future expansions or DLC

### Open Questions
- Will the game include any form of saving progress or will it be session-based?
- Are there specific browsers that must be prioritized for compatibility?
- What is the expected retention strategy once players complete the game?
- Is there a need for any analytics or tracking for game performance metrics?
- Should the game include any social features like score sharing?

---

This PRD outlines the key requirements for developing "Roman Rampage," a browser-based action-adventure game set in the Roman Empire. The document provides guidance on gameplay mechanics, technical implementation, and development priorities while maintaining the vision of a nostalgic, skill-based gaming experience.
