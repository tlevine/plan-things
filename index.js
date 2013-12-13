var fs = require('fs')
var argv = require('optimist').argv

var GROUPS = {
  "proposed":null,
  "current":null,
  "passed":null,
  "done":null
}
var commands = {}

commands.show = function(_) {
  if (_.length != 2) {
    console.log('You must specify a exactly one group.')
    process.exit(2)
  } else {
    var group = _[1]
  }
}

commands.move = function(_) {
  if (_.length != 3 || !(_[2] in GROUPS)) {
    console.log('You must specify a exactly one thing and one group.')
    process.exit(3)
  } else {
    var thing_id = _[1]
    var group = _[2]
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
    var task_id = _.length === 3 ?_[2] : null
  }
}

commands.help = function(_) {
  console.log(fs.readFileSync('USAGE', 'utf-8'))
  process.exit(0)
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
