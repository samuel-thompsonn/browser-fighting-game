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