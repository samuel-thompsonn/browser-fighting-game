- Refactor "afterEnd" and "interrupt" modifiers on transitions to be object oriented
- Add reaction to damage and knockback when getting hit
- modify collision knockback effect and transition effect interface to
use a passed list of string args rather than magically knowing the names
properties to query in the collision entity.
  - cooler solution: build the names into the instance of the transition effect,
  since they are not expected to change over time.
- replace distinction between collisions and controls with a general interface
for transitions that have CONDITIONS and EFFECTS, just like in the 2D game
engine.
- make knockback strength of character affect knockback strength of
attacks