Feature: Serve Percentage Statistics
  First serve percentage is calculated as (first serves in) divided by
  (total serve points). A point won on second serve implies the first
  serve was a fault, increasing the total without adding to first serves in.

  Background:
    Given a new match with default configuration

  Scenario: 100% first serve percentage
    When player 1 scores a point on first serve as a winner
    And player 1 scores a point on first serve as a winner
    Then player 1 first serve percentage should be 100%

  Scenario: 50% first serve percentage with second serves
    When player 1 scores a point on first serve as a winner
    And player 1 scores a point on second serve as a winner
    Then player 1 first serve percentage should be 50%
    And player 1 should have 1 first serves in out of 2 total

  Scenario: Mixed serve results
    # 3 first serves in, 1 second serve (implies 1 first fault)
    When player 1 scores a point on first serve as a winner
    And player 1 scores a point on first serve as a winner
    And player 1 scores a point on first serve as a winner
    And player 1 scores a point on second serve as a winner
    Then player 1 should have 3 first serves in out of 4 total
    And player 1 first serve percentage should be 75%

  Scenario: Zero percentage when no serves made
    Then player 1 first serve percentage should be 0%
    And player 2 first serve percentage should be 0%
