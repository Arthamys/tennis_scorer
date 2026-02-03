Feature: Undo After Set Win
  A point that resulted in a set win can be undone, returning the
  match to its state before that winning point. The games and points
  are restored to their previous values.

  Background:
    Given a new match with default configuration

  Scenario: Undo after winning a set
    When player 1 wins 6 games on first serve
    Then player 1 should have 1 sets
    And player 1 should have 0 games
    When player 1 undoes the last point
    Then player 1 should have 0 sets
    And the score should be 5-5 in games
