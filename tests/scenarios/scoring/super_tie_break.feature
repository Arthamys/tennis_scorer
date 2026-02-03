Feature: Super Tie-Break (Deciding Set)
  In the deciding set (when sets are tied at one set all in a best-of-3),
  a super tie-break is played instead of a full set. The first player to
  reach 10 points with a 2-point margin wins the match.

  Background:
    Given a new match with 6 games per set and 2 sets to win

  Scenario: Match enters super tie-break in deciding set
    # Player 1 wins first set 6-0
    When player 1 wins 6 games on first serve
    Then player 1 should have 1 sets
    # Player 2 wins second set 6-0
    When player 2 wins 6 games on first serve
    Then player 2 should have 1 sets
    # Both have 1 set, this is the deciding set
    # Super tie-break mode is entered when first point is scored
    When player 1 scores a point on first serve as a winner
    Then the match should be in a tie-break

  Scenario: Player 1 wins super tie-break 10-0
    # Win sets to reach deciding set
    When player 1 wins 6 games on first serve
    And player 2 wins 6 games on first serve
    # Win super tie-break with 10 points
    When player 1 scores 10 consecutive points on first serve as winners
    Then player 1 should have won the match

  Scenario: Super tie-break requires 2-point margin
    # Get to deciding set
    When player 1 wins 6 games on first serve
    And player 2 wins 6 games on first serve
    # Both score 9 points
    When player 1 scores 9 consecutive points on first serve as winners
    And player 2 scores 9 consecutive points on first serve as winners
    Then the match should be in a tie-break
    And the match should not be over
    # Need 2 point margin
    When player 1 scores a point on first serve as a winner
    Then the match should not be over
    When player 1 scores a point on first serve as a winner
    Then player 1 should have won the match
