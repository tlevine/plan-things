#!/usr/bin/env node

/*
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var fs = require('fs')
var path = require('path')
var argv = require('optimist').argv
var mkdirp = require('mkdirp')
var spawn = require('child_process').spawn

function get_plan_dir(wd) {
  if (fs.existsSync(path.join(wd, '.git'))) {
    return path.join(wd, '.plans')
  } else if (wd === '/') {
    console.log('Could not find a git repository')
    process.exit(9)
  } else {
    return get_plan_dir(path.join(wd, '..'))
  }
}
var PLANS_DIR = get_plan_dir(path.resolve('.'))

var EDITOR = process.env.EDITOR || 'vi'

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
      console.log()
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
      var thing_dirs = fs.readdirSync(group_dir)
      for (i in thing_dirs) {
        console.log('  ' + thing_dirs[i])
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
    var thing_dir = path.join(PLANS_DIR, group, thing_id)
    var task_file = path.join(thing_dir, task_id + '.md')
    mkdirp.sync(thing_dir)

    var child = edit()
    child.on('exit', after_editing)
    function after_editing(e, code) {
      // Try parsing the file to make sure all is well.
      process.exit(0)
    }
    function edit(filename) {
      return spawn(EDITOR, [task_file], {stdio:'inherit'}) 
    }
  }
}

commands.help = function(_) {
  console.log(fs.readFileSync(path.join(__dirname, 'USAGE'), 'utf-8'))
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
