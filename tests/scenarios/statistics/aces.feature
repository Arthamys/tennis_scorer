Feature: Ace Statistics
  An ace is a legal serve that the receiver fails to touch. Aces are
  counted per player and always contribute to first serve statistics
  since they occur on successful first serves.

  Background:
    Given a new match with default configuration

  Scenario: Single ace is recorded
    When player 1 scores a point on first serve as an ace
    Then player 1 should have 1 aces
    And player 2 should have 0 aces

  Scenario: Multiple aces are accumulated
    When player 1 scores a point on first serve as an ace
    And player 1 scores a point on first serve as an ace
    And player 1 scores a point on first serve as an ace
    Then player 1 should have 3 aces

  Scenario: Aces count toward first serve statistics
    When player 1 scores a point on first serve as an ace
    Then player 1 should have 1 first serves in out of 1 total
    And player 1 first serve percentage should be 100%

  Scenario: Game won with all aces
    When player 1 wins a game with aces
    Then player 1 should have 4 aces
    And player 1 should have 1 games

  Scenario: Aces count as missed returns for the opponent
    When player 1 scores a point on first serve as an ace
    Then player 2 should have 1 first serve missed returns
    And player 2 should have 0 second serve missed returns
    When player 1 scores a point on second serve as an ace
    Then player 2 should have 1 first serve missed returns
    And player 2 should have 1 second serve missed returns
