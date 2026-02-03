Feature: Server Switching During Tie-Break
  In a tie-break, the player whose turn it was serves the first point.
  After that, serves alternate every two points, with the opponent
  serving points 2-3, then the original server for points 4-5, etc.

  Background:
    Given a new match with default configuration
    And the score is 6-6 in games

  Scenario: Tie-break starts after first point at 6-6
    # Tie-break mode is entered when first point is scored at 6-6
    When player 1 scores a point on first serve as a winner
    Then the match should be in a tie-break
    And player 1 should have 1 points
