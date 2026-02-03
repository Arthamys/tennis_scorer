Feature: Regular Point Statistics
  Points are categorized by how they ended: winners (clean winning shots),
  unforced errors (mistakes without pressure), forced errors (mistakes
  under pressure), and net points. Errors are attributed to the losing player.

  Background:
    Given a new match with default configuration

  Scenario: Winners are tracked
    When player 1 scores a point on first serve as a winner
    Then player 1 should have 1 winners
    And player 2 should have 0 winners

  Scenario: Unforced errors are tracked for loser
    When player 2 scores a point on first serve as an unforced-error
    Then player 1 should have 1 unforced errors
    And player 2 should have 0 unforced errors

  Scenario: Forced errors are tracked for loser
    When player 2 scores a point on first serve as a forced-error
    Then player 1 should have 1 forced errors
    And player 2 should have 0 forced errors

  Scenario: Net points are tracked
    When player 1 scores a point on first serve as a net
    Then player 1 should have 1 points won at net
    And player 2 should have 0 points won at net

  Scenario: Points won on first serve
    When player 1 scores a point on first serve as a winner
    And player 1 scores a point on first serve as an ace
    Then player 1 should have 2 points won on first serve

  Scenario: Points won on second serve
    When player 1 scores a point on second serve as a winner
    Then player 1 should have 1 points won on second serve
