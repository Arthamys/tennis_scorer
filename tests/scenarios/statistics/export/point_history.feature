Feature: Point History Export
  Point history records every point in chronological order. Each entry
  includes the server, point winner, serve type (first/second), and how
  the point ended, enabling detailed match replay and analysis.

  Background:
    Given a new match with default configuration

  Scenario: Export empty history
    When I export the point history
    Then the export should be valid JSON
    And the export should contain 0 points

  Scenario: Export single point
    When player 1 scores a point on first serve as a winner
    And I export the point history
    Then the export should be valid JSON
    And the export should contain 1 points

  Scenario: Export multiple points
    When player 1 scores a point on first serve as a winner
    And player 2 scores a point on first serve as a winner
    And player 1 scores a point on second serve as an ace
    And I export the point history
    Then the export should contain 3 points

  Scenario: Exported points have required fields
    When player 1 scores a point on first serve as a winner
    And I export the point history
    Then each point in the export should have a winner
    And each point in the export should have a server

  Scenario: Export after game win
    When player 1 scores 4 consecutive points on first serve as winners
    And I export the point history
    Then the export should contain 4 points
