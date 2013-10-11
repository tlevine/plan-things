#!/bin/sh
set -e

if test -z "$PLAN_DIR"; then
  PLAN_DIR=~/.plan
fi

task_print() {
  echo '--------'
  echo "$MESSAGE"
  echo
  echo "($DAYS days)"
}

thing_print() {
  echo '========'
  echo "$MESSAGE"
  echo
  echo "($DAYS days)"
}

thing_total_days() {
  expression=$(grep -r -m1 '^DAYS=[0-9.][0-9.]*$' "$1" | cut -d= -f2 | tr '\n' + | sed 's/+$//')
  echo $expression | bc
}

# thing_edit ~/.plans/proposed/cardboard_comma/thing.sh
thing_edit() {
  thing_file="$1"
  echo 'MESSAGE=$(cat<<EOF

EOF
)' > "$thing_file"
  "$EDITOR" "$thing_file"
}

# task_edit ~/.plans/proposed/cardboard_comma/buy_glue.sh
task_edit() {
  task_file="$1"
  echo 'DAYS=
MESSAGE=$(cat<<EOF

EOF
)' > "$task_file"
  "$EDITOR" "$task_file"
}

# Is it "show","move","edit","help" or something else?
input_command() {
  valid=' show
          move
          edit
          help
  '
  if test -z "$1"; then
    echo other
  elif echo "$valid" | grep " $1$" > /dev/null; then
    echo "$1"
  else
    echo other
  fi
}

thing_find() {
  thing_name="$1"

  for group in proposed current passed done; do
    if test -e "${PLAN_DIR}/${group}/${thing_name}.sh"; then
      echo "${group}"
      return 0
    fi
  done
  return 1
}

thing_move() {
  thing="$1"
  new_group="$2"

  valid=' current
          proposed
          passed
         '
  if ! echo "$valid" | grep " $new_group$"; then
    echo 'You may only move to the groups "current", "proposed", and "passed".'
    return 2
  fi

  if old_group=$(thing_find "$thing" "$group"); then
    echo git mv "${PLAN_DIR}/${old_group}/${thing}.sh" "${PLAN_DIR}/${new_group}"
  else
    return 1
  fi
}

cmd_edit() {
  thing="$1"
  task="$2"

  if ! group=$(thing_find "$thing"); then
    group=proposed
    mkdir -p "${PLAN_DIR}/${group}/${thing}"
  fi

  if test -z "$task"; then
    thing_edit "${PLAN_DIR}/${group}/${thing}/thing.sh"
  else
    if ! test -e "${PLAN_DIR}/${group}/${thing}/thing.sh"; then
      mkdir -p "${PLAN_DIR}/${group}/${thing}"
      touch "${PLAN_DIR}/${group}/${thing}/thing.sh"
    fi
    task_edit "${PLAN_DIR}/${group}/${thing}/${task}.sh"
  fi
}

cmd_show() {
  group="$1"
  if test "$group" = all; then
    groups='proposed current passed done'
  else
    groups="$group"
  fi

  for group in $groups; do
    mkdir -p "$PLAN_DIR/$group"
    for thing in $(ls "$PLAN_DIR/$group"); do
      (
        . "${PLAN_DIR}/${group}/${thing}/thing.sh"
        DAYS=$(thing_total_days "${PLAN_DIR}/${group}/${thing}")
        thing_print
      )
    done
  done
}

USAGE="
Plan things, in a kind-of-xtreme way. Plans get saved in the
~/.plans directory, which you can version nicely in git.

USAGE: $0 show GROUP
       $0 move [thing id] GROUP
       $0 edit [thing id] [[task id]]
       $0 help

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
"

if true; then
  case $(input_command $1) in
    other) echo "$USAGE" && exit 1 ;;
    help)  echo "$USAGE" ;;
    edit)  cmd_edit "$2" "$3" ;;
    move)  thing_move "$2" "$3" ;;
    show)  cmd_show "$2" ;;
  esac
fi
