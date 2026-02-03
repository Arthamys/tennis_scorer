Feature: Straight Game Win (Love Game)
  A game is won when a player scores four points (15, 30, 40, game)
  and the opponent has fewer than three points. This is called a
  "love game" when the opponent scores zero points.

  Background:
    Given a new match with default configuration

  Scenario: Player 1 wins a love game with winners
    When player 1 scores 4 consecutive points on first serve as winners
    Then player 1 should have 1 games
    And player 1 should have 0 points
    And player 2 should have 0 games

  Scenario: Player 2 wins a love game with winners
    # First, player 1 wins a game so player 2 serves
    When player 1 scores 4 consecutive points on first serve as winners
    And player 2 scores 4 consecutive points on first serve as winners
    Then player 2 should have 1 games
    And the score should be 1-1 in games

  Scenario: Player 1 wins a love game with aces
    When player 1 scores 4 consecutive points on first serve as aces
    Then player 1 should have 1 games
    And player 1 should have 4 aces

  Scenario: Player 1 wins multiple love games
    When player 1 wins 3 games on first serve
    Then player 1 should have 3 games
    And player 2 should have 0 games
