Feature: Global Statistics Export
  Match statistics can be exported as JSON for external analysis. The
  export includes cumulative statistics for both players: aces, double
  faults, winners, errors, and serve percentages.

  Background:
    Given a new match with default configuration

  Scenario: Export statistics as valid JSON
    When player 1 scores a point on first serve as an ace
    And I export the match statistics
    Then the export should be valid JSON

  Scenario: Export contains both players
    When player 1 scores a point on first serve as a winner
    And I export the match statistics
    Then the export should contain player 1 statistics
    And the export should contain player 2 statistics

  Scenario: Exported statistics reflect actual aces
    When player 1 scores a point on first serve as an ace
    And player 1 scores a point on first serve as an ace
    And player 1 scores a point on first serve as an ace
    And I export the match statistics
    Then the exported statistics should show 3 aces for player 1
    And the exported statistics should show 0 aces for player 2

  Scenario: Export after complete game
    When player 1 scores 4 consecutive points on first serve as aces
    And I export the match statistics
    Then the exported statistics should show 4 aces for player 1
