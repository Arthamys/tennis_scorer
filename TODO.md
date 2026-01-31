## Exporting match information with scorecards.
When exporting scorecards for a match, after all images have been generated, two new files should be added to the ZIP archive.
- A JSON format of the end of match statistics called `match-statistics.json`
Once all points in the history have been replayed, the final player statistics should be exported as a JSON object. The file should include the generation timestamp, the match details: number of sets, number of games in a set etc, the names of the players, and the player statistics.
This file needs to be compatible with a broad set of tools for later analysis, so it's important to create a JSON schema that can be shared along with the match statistics JSON file.

- A JSON format of the point history called `match-score.json`.
The file should include the generation timestamp, the match details: number of sets, number of games in a set etc, the names of the players and the array of points played with all their metadata.


## Break point statistics
The following statistics can be computed from the point metadata without user input.
- Break points
- Break point conversion rate

A Break point is a point where the returner (the player that is not currently serving) can score a game. This happens when the returner has a score of 40 and the server has a score bellow 40, or when the returner has an Advantage point. During a tie break, break points are not tracked.

The Break point conversion rate is the result of tracking the number of times a player has won the game where his opponent was serving and dividing it by the total number of break points the player had.


## Rally length in point history
- Rally length (optional)
The rally length is optional, it should be included in the metadata for a point and saved as a number. The statistics input panel should include an text input box where the number of shots played during the point can be typed in.
The rally length should not be displayed in the stats panel.


## Aces add a missed return to opponent
When a player scores and Ace, depending on the type of serve (first or second), the opponent's serve return missed statistics should increase. So if player1 scores an Ace on a first serve, player2's missed first serve return statistic should be increased by one.
If player1 scores an Ace on a second serve, player2's missed second serve return statistic should be increased by one.

## Add a test suite
The project should support Behavior Driven tests though the user of the Cucumber framework.
The feature files should be grouped by domain, such that there should be a set of tests for the scoring logic, and one for the statistics. UI testing should not be part of the Behavior driven tests.
The feature files should live under a `tests/scenarios` folder, and should include subfolders such as `scoring` and `statistics`.
example feature files would be: 
- `scenarios/scoring/`
    - `straight_game.feature`
    - `game_win_after_deuce.feature`
    - `score_wraps_to_deuce.feature`
    - `tie_break.feature`
    - `super_tie_break.feature`
    - `server_switching/`
        - `straight_game.feature`
        - `tie_break.feature`
        - `super_tie_break.feature`
        - `new_set.feature`
    - `undo/`
        - `during_tie_break.feature`
        - `after_game_win.feature`
        - `after_set_win.feature`
- `scenarios/statistics/`
    - `undo_statistics.feature`
    - `aces.feature`
    - `double_faults.feature`
    - `serve_percentages.feature`
    - `regular_points.feature`
    - `export/`
        - `point_history.feature`
        - `global_statistics.feature`
Each of the feature file is a cucumber/gherkin feature file that expresses test scenarios in english.
There should be a runner to test the project against these feature files.
Steps to interpret the feature files should live under `tests/runner` folder.