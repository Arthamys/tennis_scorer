Feature: Undo After Game Win
  A point that resulted in a game win can be undone, returning the
  score to its state before that winning point. This allows correction
  of mistakenly recorded game-winning points.

  Background:
    Given a new match with default configuration

  Scenario: Undo after winning a game
    When player 1 scores 4 points
    Then player 1 should have 1 games
    And player 1 should have 0 points
    When player 1 undoes the last point
    Then player 1 should have 0 games
    And the score should be 3-3 in points

  Scenario: Continue scoring after undo
    When player 1 scores 4 points
    Then player 1 should have 1 games
    When player 1 undoes the last point
    Then player 1 should have 0 games
    When player 1 scores a point
    And player 1 scores a point
    Then player 1 should have 1 games
