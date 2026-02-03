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

## Add a progress bar to the screen when exporting scorecards.
While the scorecards are begin generated, there should be a progress bar that indicates how far along the process is during the point replay.
The progress bar should be at the top of the screen so that it is clearly visible.
There must be a label above the progress bar to indicate that the scorecards are being generated.

## Move the match winner "pop-up" to the top of the screen
When the match ends, the "pop-up" card to indicate that there is a winner should be moved to the top of the screen so that it's clearly visible.