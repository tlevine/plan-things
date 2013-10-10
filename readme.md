Plan Things
=====

    $ plan -h

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

      -h, --help)       Show this help.
      -m, --message)    Description/story of the thing or task
      -t, --time)       Estimate of how long it's going to take
      -c, --current)    Put a story (not a task) on the metaphorical
                        board; move it to the "current" group.
      -p, --pass)       Decide not to do the story (not task);
                        move it to the "passed" group.
      -d, --done)       Mark a task (not a story) as done.

    For example,

        plan edit plan_trip email_bob -m 'Ask Bob about the thing.'

    If you specify no commands, you will be prompted
    to fill in the various fields interactively.
