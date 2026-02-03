Feature: Server Switching at New Set
  Service rotation continues from one set to the next without resetting.
  The player who would have served next continues serving at the start
  of the new set, maintaining the alternating pattern.

  Background:
    Given a new match with default configuration

  Scenario: Server continues rotation into new set
    # Player 1 serves first
    Then player 1 should be serving
    # Player 1 wins 6 games (server alternates after each game)
    When player 1 wins 6 games on first serve
    Then player 1 should have 1 sets
    # After 6 games, server has alternated 6 times
    # P1->P2->P1->P2->P1->P2->P1, so P1 is serving after 6-0 set
    Then player 1 should be serving

  Scenario: Server after 6-0 set
    # P1 wins first 6 games
    When player 1 wins 6 games on first serve
    # Set is won 6-0
    Then player 1 should have 1 sets
    # After even number of games, original server is serving
    And player 1 should be serving
