Feature: Server Switching During Super Tie-Break
  In a super tie-break, serve rotation follows the same rules as a
  regular tie-break: the first serve goes to whoever's turn it was,
  then alternating every two points throughout the tie-break.

  Background:
    Given a new match with 6 games per set and 2 sets to win

  Scenario: Super tie-break entered in deciding set
    # Get to deciding set
    When player 1 wins 6 games on first serve
    And player 2 wins 6 games on first serve
    # Super tie-break starts when first point is scored in deciding set
    When player 1 scores a point
    Then the match should be in a tie-break
    And player 2 should be serving
    When player 1 scores 2 points
    Then player 1 should be serving
