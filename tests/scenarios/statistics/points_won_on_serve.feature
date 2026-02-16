Feature: Track points won on First and Second serve
  When a player is serving, we collect statistics on the points won by the
  server after scoring a first or second serve.
  These statistics should only be updated for the server.
  When the returner scores a point, that should not impact the points won on
  first or second serve of the server.

  Background:
    Given a new match with default configuration

Scenario: Win a point on first serve
    When player 1 scores a point on first serve as a winner
    Then player 1 should have 1 points won on first serve
    And player 1 should have 0 points won on second serve
    And player 2 should have 0 points won on first serve
    And player 2 should have 0 points won on second serve


Scenario: Win a point on second serve
    When player 1 scores a point on second serve as a winner
    Then player 1 should have 0 points won on first serve
    And player 1 should have 1 points won on second serve
    And player 2 should have 0 points won on first serve
    And player 2 should have 0 points won on second serve

Scenario: Returner scoring doesn't impact points won on serve statistics
    When player 2 scores a point on second serve as a winner
    Then player 1 should have 0 points won on first serve
    And player 1 should have 0 points won on second serve
    And player 2 should have 0 points won on first serve
    And player 2 should have 0 points won on second serve

Scenario: Both players have their statistics tracked
    When player 1 scores a point on first serve as an ace
    When player 1 scores a point on first serve as a winner
    When player 1 scores a point on second serve as an ace
    When player 1 scores a point on second serve as an unforced_error
    Then player 1 should have 2 points won on first serve
    And player 1 should have 2 points won on second serve
    And player 2 should have 0 points won on first serve
    And player 2 should have 0 points won on second serve 
    When player 2 scores 2 points
    When player 2 scores a point on second serve as a winner
    Then player 1 should have 2 points won on first serve
    And player 1 should have 2 points won on second serve
    And player 2 should have 2 points won on first serve
    And player 2 should have 1 points won on second serve 
 