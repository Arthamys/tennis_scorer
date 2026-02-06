Feature: Missed Return Statistics
  A missed return occurs when the returner fails to return the serve.
  The missed return is tracked for the returner, categorized by whether
  it was a first serve or second serve that they failed to return.

  Background:
    Given a new match with default configuration

  Scenario: First serve missed return is recorded for the returner
    # Player 1 is serving by default, so Player 2 is returning
    When player 1 scores a point on first serve as a missed_return
    Then player 2 should have 1 first serve missed returns
    And player 2 should have 0 second serve missed returns
    And player 1 should have 0 first serve missed returns

  Scenario: Second serve missed return is recorded for the returner
    # Player 1 is serving by default, so Player 2 is returning
    When player 1 scores a point on second serve as a missed_return
    Then player 2 should have 0 first serve missed returns
    And player 2 should have 1 second serve missed returns
    And player 1 should have 0 second serve missed returns

  Scenario: Multiple missed returns are accumulated
    When player 1 scores a point on first serve as a missed_return
    And player 1 scores a point on first serve as a missed_return
    And player 1 scores a point on second serve as a missed_return
    Then player 2 should have 2 first serve missed returns
    And player 2 should have 1 second serve missed returns
