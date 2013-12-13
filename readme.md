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
Running `plan move thing [group]` moves them between
directories.

There's a special caveat for moving things to the "done"
directory. Things can only be moved to the "done"
directory/group from the "current" group, and this happens
when all of the tasks have been marked "done" in the
YAML section of the file.

### File format of the files
Thing files are just markdown.

Task files are markdown with a YAML header. This header contains
just two variables  One is called `days`. This is the estimate
of how long, in days, a particular task will take. It should be
no more than 1. Maybe I should switch it for hours, actually.

The other is called `done`, and it is whether the task is done.

## Development
Run tests with urchin.

    npm install -g urchin
    urchin ./test
