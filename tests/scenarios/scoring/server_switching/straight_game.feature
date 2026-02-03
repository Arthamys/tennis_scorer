Feature: Server Switching After Straight Games
  The server alternates after each game. The player who serves first
  in a game serves all points of that game, then the opponent serves
  the next game. This ensures equal serving opportunities.

  Background:
    Given a new match with default configuration

  Scenario: Server switches after first game
    Then player 1 should be serving
    When player 1 wins a game on first serve
    Then player 2 should be serving

  Scenario: Server alternates through multiple games
    Then player 1 should be serving
    When player 1 wins a game on first serve
    Then player 2 should be serving
    When player 2 wins a game on first serve
    Then player 1 should be serving
    When player 1 wins a game on first serve
    Then player 2 should be serving

  Scenario: Server switches after break of serve
    Then player 1 should be serving
    # Player 2 breaks serve (wins game while player 1 serves)
    When player 2 wins a game on first serve
    Then player 2 should be serving
    And player 2 should have 1 games
