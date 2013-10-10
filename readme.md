Plan Things
=====

    $ plan -h

    Plan things, in a kind-of-xtreme way. Plans get saved in the
    ~/.plans directory, which you can version nicely in git.

    USAGE: plan show GROUP
           plan edit [thing id] [[task id]] COMMANDS

    GROUP is one of the following.

      all
      proposed
      current
      passed
      done

    If you specify no GROUP, GROUP default to "current".

    COMMANDS is zero or more of the following.

      Commands that set other properties

      -m, --message)    Description/story of the thing or task
      -t, --time)       Estimate of how long it's going to take

      Commands that move things

      -c, --current)    Put a story (not a task) on the metaphorical
                        board; move it to the "current" group.
      -p, --pass)       Decide not to do the story (not task);
                        move it to the "passed" group.
      -d, --done)       Mark a task (not a story) as done.

      Commands that do other things

      -h, --help)       Show this help.

    For example,

        plan edit plan_trip email_bob -m 'Ask Bob about the thing.'

    If you specify no commands, you will be prompted
    to fill in the various fields interactively.

## Structure of the `~/.plans` directory
