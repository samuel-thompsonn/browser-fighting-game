## 3/2/2021
- I'm trying to figure out why there's an extra Visualizer in the top left
corner of the client whenever it is not the first to connect to the
server.
  - To replicate:
  1. Launch fresh server
  2. Run client
  3. Close client
  4. Run second client. Observe that there's an inert visualizer in the
  top left corner.
  - SOLVED: It's just because the map was being initialized with one
  starting dummy visualizer mapped to 0.
- When a client disconnects, their visualizer in other clients' visualizers
is still there.
  - The fix: Send a special message on the socket to a client to indicate
  a character has ceased to exist.

## TODO:
- Functionality:
  - Hitboxes/Hurtboxes
    - How will they be implemented?
      - Every game loop, every two characters will be checked for collision
      in a 2-dimensional loop. 
      - All collisions are symmetrical, and are dependent on the predicted
      next position of a character, which is based on the effect of their
      current state (or the pre-effect of their next state?) 
      - Collision events?
        1. hurtbox 1 to hurtbox 2 -> they move up next to each other and no
          further
        2. hurtbox 1 to hitbox 2 -> char1 reacts to being hit
          - this means a hitbox should also have a specified knockback velocity
          and damage.
        3. hitbox 1 to hurtbox 2 -> char2 reacts to being hit
        4. hitbox 1 to hitbox 2 -> nothing for now. Maybe a 'clash' animation
    - Idea: It's like XML so it's in a JSON file and it consists of a list of
    circles/ellipses/boxes, and together they make up the hitbox.
  - Make sure mutliple clients receive updates about every character upon
  state changes
- Make it possible for an effect to be applied pre- or post- change,
so that movement isn't offset by one frame
- Make it possible to define an animation as a homogeneous group of states
in a characte file, so that I don't have to make 60+ nodes for it by hand.
- Improve design by extracting out functionality and refactoring controls
so that there's a controller interfacing with data gatherers (clientlistener)
and with data consumers (characters)
## Design dilemmas:
- Idea 1:
  - Instantiate a model
  - When a client connects:
    - Create a character
    - add the character to the model
    - assign the client handler to the character
    - problem: what about when that character is destroyed and we want to
    give them another character? The important thing is that there's a
    difference between a CLIENT and a PLAYER. A CLIENT has a persistent
    connection and can tell the game that they'd like to get a new character,
    but only if they don't already have a character.
      - That's an interaction with the game when it's in a "lobby" state,
      and the controls are when the game is in an "in-game" state.
  - So when a client connects:
    - Don't instantiate a character until they ask for one to be instantiated
    with certain specs. Then put it in te model and give it to them.
    - Then give them various interfaces based on game state.

  - Make sure that the rate at which animations update is independent of
the rate at which the game sends updates to clients
  - That doesn't make sense. Messages are sent to the client as soon as an
  update occurs, and updates occur once every game loop which is on a fixed
  timer.
  - The real problem is that the update speed is independent from the
  movement speed. However, running at fewer updates per second should not
  change movement per update.
  - Solution: Make a fixed number of state updates per second, but a non-fixed
  number of game loop runs per second.
    - But what could be the motivation for this? hmm.

- Problem: The client handler absorbs information about controls from the
user, and this information needs to get to the updating function in the
Character class. But the information isn't consumed immediately; instead,
it is placed in a map and referenced when we need to update the gamestate.
So who stores this map?
  - Idea 1: Client stores the map
    - But that sucks because then we have to poll the client or otherwise
    bug them to get the data to our gameModel
  - Idea 2: gameModel stores the map
    - But then gameModel is storing information about each player, instead
    of the player storing information about themselves
  - Idea 3: character stores the map
    - But then a character update won't be a function of its current state
    and inputs, since it will store previous inputs.
    - Solution: A character keeps track of its own controls, then
    throws them away upon an update!
  - Idea 4: There's an object that acts as a controls map. It has two
  interfaces: The part that lets it modify controls (accessible from the
  client listener) and the part that lets you read the controls (accessible
  from the character). When a client disconnects, the controller knows,
  and it clears its controls.