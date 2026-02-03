Feature: Game Win After Deuce
  When both players have scored three points (40-40), this is called
  deuce. A player must win two consecutive points from deuce to win
  the game: the first point gives "advantage", the second wins the game.

  Background:
    Given a new match with default configuration

  Scenario: Player 1 wins game after single deuce
    When the score reaches deuce
    Then the score should be 3-3 in points
    When player 1 scores a point on first serve as a winner
    Then the score should be 4-3 in points
    When player 1 scores a point on first serve as a winner
    Then player 1 should have 1 games
    And player 1 should have 0 points

  Scenario: Player 2 wins game after deuce
    When the score reaches deuce
    And player 2 scores a point on first serve as a winner
    And player 2 scores a point on first serve as a winner
    Then player 2 should have 1 games

  Scenario: Multiple deuce situations before game win
    When the score reaches deuce
    # Advantage player 1
    And player 1 scores a point on first serve as a winner
    Then the score should be 4-3 in points
    # Back to deuce
    And player 2 scores a point on first serve as a winner
    Then the score should be 4-4 in points
    # Advantage player 2
    And player 2 scores a point on first serve as a winner
    Then the score should be 4-5 in points
    # Back to deuce again
    And player 1 scores a point on first serve as a winner
    Then the score should be 5-5 in points
    # Player 1 takes advantage and wins
    And player 1 scores a point on first serve as a winner
    And player 1 scores a point on first serve as a winner
    Then player 1 should have 1 games

  Scenario: Advantage lost returns to deuce score
    When the score reaches deuce
    And player 1 scores a point on first serve as a winner
    Then the score should be 4-3 in points
    When player 2 scores a point on first serve as a winner
    Then the score should be 4-4 in points
    And the match should not be over
