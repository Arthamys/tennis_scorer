Feature: Rally Length Tracking
  Rally length represents the number of shots played in a point.
  Aces and missed returns have a rally length of 1 (serve only or serve + failed return).

  Background:
    Given a new match with default configuration

  Scenario: Ace has rally length of 1 in point history
    When player 1 scores a point on first serve as an ace
    And I export the point history
    Then the export should contain 1 points
    And point 1 in the export should have rally length 1

  Scenario: Missed return has rally length of 1 in point history
    When player 1 scores a point on first serve as a missed_return
    And I export the point history
    Then the export should contain 1 points
    And point 1 in the export should have rally length 1

  Scenario: Second serve ace has rally length of 1
    When player 1 scores a point on second serve as an ace
    And I export the point history
    Then point 1 in the export should have rally length 1

  Scenario: Multiple aces all have rally length of 1
    When player 1 scores a point on first serve as an ace
    And player 1 scores a point on first serve as an ace
    And player 1 scores a point on second serve as an ace
    And I export the point history
    Then the export should contain 3 points
    And point 1 in the export should have rally length 1
    And point 2 in the export should have rally length 1
    And point 3 in the export should have rally length 1
