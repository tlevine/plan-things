Plan Things
=====
Like notecards-on-a-table, but portable, digitized, scriptable
and in a git repository

    $ plan help

    Plan things, in a kind-of-xtreme way. Plans get saved in the
    ~/.plans directory, which you can version nicely in git.

    USAGE: plan show GROUP
           plan move [thing id] GROUP
           plan edit [thing id] [[task id]]
           plan help

    GROUP is one of the following.

      proposed
      current
      passed
      done

    plan show: List the things and tasks in a group.
      In addition to the four groups above, you can
      specify "all", which will list all the things.

    plan move: Move a thing to a different group.

    plan help: Show this help.

    plan edit: Edit the description of a story or task
               and the estimated duration of a task.

## Structure of the `~/.plans` directory
The plans directory is structured like so.

    ~/.plans/
      .gitignore
      .cache
      proposed/
        plan_trip/
          thing.sh
          book_flight.sh
          call_bob.sh
        ...
      current/
        make_a_cardboard_comma/
          thing.sh
          buy_glue.sh
          find_cardboard.sh
        ...
      passed/
        ...
      done/
        ...

Now I explain that structure in more precision.

### Root level
The `~/.plans` directory contais four directories,
called `proposed`, `current`, `passed`, and `done`.
These directories are called *groups*, and each group
ctories contains a bunch of *things*.

The `~/.plans` directory contais two other files,
`.gitignore` and `.cache`. `.gitignore` just says
`.cache\n`, and `.cache` is a cache file.

### Things
Each thing directory contains a file called `thing.sh`.
This file has most of the thing-specific information.
All of the other files are tasks, named `${task_name}.sh`,
and they contain the task-specific information.

The one piece of information that is not encoded in the
thing directory is the group of which the thing is a part.
This information is instead encoded as the group directory
in which the thing directory is located.

Newly created things start in the `proposed` directory.
Running `plan edit thing -[bcp]` moves them between
directories. They can only be moved to the "done"
directory/group from the "current" group, and this happens
when all of the tasks have been marked "done", with
`plan edit thing task -d`.

### File format of the `.sh` files
All of the variables are set as shell scripts that are sourced.
(It [doesn't seem](http://wiki.bash-hackers.org/howto/conffile)
like there's a native shell configuration language or anything.)

Here's an example thing file.

    MESSAGE=$(cat<<EOF
    As someone who runs plan-things on barebones computers,
    I want plan-things to work with POSIX-compliant shell rather
    than just BASH so that I can use plan-things on all my computers.
    EOF)

And here's a task file.

    DAYS=0.25
    MESSAGE=$(cat<<EOF
    Set up the tests to run in multiple shells.
    EOF)

## Development
Run tests with urchin.

    npm install -g urchin
    urchin ./test
