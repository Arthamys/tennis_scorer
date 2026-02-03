Feature: Tie-Break Scoring
  When a set reaches 6-6 in games, a tie-break is played. The first
  player to reach 7 points with a 2-point margin wins the tie-break
  and the set. Points are counted numerically (1, 2, 3...) not 15-30-40.

  Background:
    Given a new match with default configuration

  Scenario: Match enters tie-break when scoring at 6-6
    Given the score is 6-6 in games
    When player 1 scores a point on first serve as a winner
    Then the match should be in a tie-break

  Scenario: Player 1 wins tie-break 7-0
    Given the score is 6-6 in games
    When player 1 scores 7 consecutive points on first serve as winners
    Then player 1 should have 1 sets

  Scenario: Player 2 wins tie-break 7-5
    Given the score is 6-6 in games
    # Player 2 scores 5 points
    When player 2 scores 5 consecutive points on first serve as winners
    # Player 1 scores 5 points
    And player 1 scores 5 consecutive points on first serve as winners
    # Score is 5-5 in tie-break
    # Player 2 scores 2 more to win 7-5
    And player 2 scores a point on first serve as a winner
    And player 2 scores a point on first serve as a winner
    Then player 2 should have 1 sets

  Scenario: Tie-break requires 2-point margin
    Given the score is 6-6 in games
    When player 1 scores 6 consecutive points on first serve as winners
    And player 2 scores 6 consecutive points on first serve as winners
    Then the match should be in a tie-break
    # Both at 6-6 in tie-break
    When player 1 scores a point on first serve as a winner
    And player 2 scores a point on first serve as a winner
    # Now 7-7, still no winner
    Then the match should not be over
    # Player 1 wins 2 in a row to take it 9-7
    When player 1 scores a point on first serve as a winner
    And player 1 scores a point on first serve as a winner
    Then player 1 should have 1 sets
