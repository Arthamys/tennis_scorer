Feature: Undo Statistics Reversal
  When a point is undone, all associated statistics must be reversed.
  This includes aces, double faults, winners, errors, and serve counts
  to maintain accurate cumulative statistics after corrections.

  Background:
    Given a new match with default configuration

  Scenario: Undo reverses ace count
    When player 1 scores a point on first serve as an ace
    Then player 1 should have 1 aces
    When player 1 undoes the last point
    Then player 1 should have 0 aces

  Scenario: Undo reverses double fault count
    When player 2 scores a point on second serve as a double-fault
    Then player 1 should have 1 double faults
    When player 1 undoes the last point
    Then player 1 should have 0 double faults

  Scenario: Undo reverses winner count
    When player 1 scores a point on first serve as a winner
    Then player 1 should have 1 winners
    When player 1 undoes the last point
    Then player 1 should have 0 winners

  Scenario: Undo reverses unforced error count
    When player 2 scores a point on first serve as an unforced-error
    Then player 1 should have 1 unforced errors
    When player 1 undoes the last point
    Then player 1 should have 0 unforced errors
