Feature: Double Fault Statistics
  A double fault occurs when both the first and second serve fail to
  land in the service box. Double faults are attributed to the server
  and count as two missed first serve attempts in the serve totals.

  Background:
    Given a new match with default configuration

  Scenario: Single double fault is recorded
    When player 2 scores a point on second serve as a double-fault
    Then player 1 should have 1 double faults
    And player 2 should have 0 double faults

  Scenario: Multiple double faults are accumulated
    When player 2 scores a point on second serve as a double-fault
    And player 2 scores a point on second serve as a double-fault
    Then player 1 should have 2 double faults

  Scenario: Double fault affects serve totals
    When player 2 scores a point on second serve as a double-fault
    # Double fault with second serve tracking counts first serve attempts from both
    # the second serve tracking (implies first fault) and the double fault itself
    Then player 1 should have 0 first serves in out of 2 total
    And player 1 first serve percentage should be 0%
