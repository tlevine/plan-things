#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var argv = require('optimist').argv
var mkdirp = require('mkdirp')

var PLANS_DIR = path.join(process.env.HOME, '.plans')
var GROUPS = {
  "proposed":null,
  "current":null,
  "passed":null,
  "done":null
}
var GROUPS_LIST = [
  "proposed",
  "current",
  "passed",
  "done"
]
var commands = {}

commands.show = function(_) {
  if (_.length < 1 || _.length > 2) {
    console.log('You must specify no group or one group.')
    process.exit(2)
  } else if (_.length === 1) {
    for (group in GROUPS) {
      console.log(group + '\n')
      list_group(group)
    }
  } else if (_.length === 2 && !(_[1] in GROUPS)) {
    console.log('"' + _[1] + '" is not a valid group.')
    process.exit(8)
  } else {
    var group = _[1]
    list_group(group)
  }

  function list_group(group) {
    var group_dir = path.join(PLANS_DIR, group)
    if (fs.existsSync(group_dir)) {
      for (thing_dir in fs.readdirSync(group_dir)) {
        console.log('  ' + thing_dir)
        // Add time estimates too.
      }
    }
  }
}

commands.move = function(_) {
  if (_.length != 3 || !(_[2] in GROUPS)) {
    console.log('You must specify a exactly one thing and one group.')
    process.exit(3)
  } else {
    var thing_id = _[1]
    var new_group = _[2]

    var old_group = find_group(thing_id)

    if (old_group === null) {
      console.log('There is no thing of this name.')
    } else {
      var old_thing = path.join(PLANS_DIR, old_group, thing_id)
      var new_thing = path.join(PLANS_DIR, new_group, thing_id)
      mkdirp.sync(path.join(PLANS_DIR, new_group))
      mv(old_thing, new_thing)
    }
  }
  function mv(a,b) {
    fs.renameSync(a,b) // Switch this for git
  }
}

commands.edit = function(_) {
  if (_.length < 2 ) {
    console.log('You must specify a exactly one thing.')
    process.exit(4)
  } else if (_.length > 3) {
    console.log('You must specify zero or one tasks.')
    process.exit(5)
  } else {
    var thing_id = _[1]
    var task_id = _.length === 3 ?_[2] : "index"
    var group = find_group(thing_id)
    if (group === null) {
      group = 'proposed'
    }
    var thing_dir = path.join(PLANS_DIR, group, thing_id, task_id)
    var task_file = path.join(thing_dir, task_id)
    mkdirp.sync(thing_dir)
    console.log('Edit this file:',task_file)
    process.exit(0)
  }
}

commands.help = function(_) {
  console.log(fs.readFileSync('USAGE', 'utf-8'))
  process.exit(0)
}


function find_group(thing_id) {
  var in_groups = GROUPS_LIST.map(thing_in_group).filter(identity1)
  var group = in_groups.length === 0 ? null : in_groups[0][0]
  return group

  function identity1(x) { return x[1] }
  function thing_in_group(group) {
    return [group, fs.existsSync(path.join(PLANS_DIR, group, thing_id))]
  }
}

function cli() {
  if (argv._.length > 0 && argv._[0] in commands) {
    commands[argv._[0]](argv._)
  } else {
    console.log('You must specify a command.')
    process.exit(1)
  }
}

cli()
