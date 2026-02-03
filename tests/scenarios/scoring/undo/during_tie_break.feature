Feature: Undo During Tie-Break
  Points scored during a tie-break can be undone to correct scoring
  mistakes. The undo operation restores the score to its state before
  the last point was recorded.

  Background:
    Given a new match with default configuration
    And the score is 6-6 in games

  Scenario: Undo point in tie-break
    # First point triggers tie-break mode
    When player 1 scores a point on first serve as a winner
    Then the match should be in a tie-break
    And player 1 should have 1 points
    When player 1 undoes the last point
    Then player 1 should have 0 points

  Scenario: Undo multiple points in tie-break
    When player 1 scores 3 consecutive points on first serve as winners
    Then player 1 should have 3 points
    When player 1 undoes the last point
    Then player 1 should have 2 points
    When player 1 undoes the last point
    Then player 1 should have 1 points
