Feature: Score Wraps to Deuce
  When both players reach 40 (three points each), the game enters deuce.
  If the player with advantage loses the next point, the score returns
  to deuce. This continues until one player wins by two points.

  Background:
    Given a new match with default configuration

  Scenario: Score reaches 40-40 (deuce)
    When player 1 scores a point
    And player 1 scores a point
    And player 1 scores a point
    Then the score should be 3-0 in points
    When player 2 scores a point
    And player 2 scores a point
    And player 2 scores a point
    Then the score should be 3-3 in points

  Scenario: Score goes through multiple advantages
    When the score reaches deuce
    And player 1 scores a point
    Then the score should be 4-3 in points
    When player 2 scores a point
    Then the score should be 4-4 in points
    When player 2 scores a point
    Then the score should be 4-5 in points
    When player 1 scores a point
    Then the score should be 5-5 in points

  Scenario: Game is not won at 4-3 (advantage)
    When the score reaches deuce
    And player 1 scores a point
    Then the score should be 4-3 in points
    And player 1 should have 0 games
    And the match should not be over
