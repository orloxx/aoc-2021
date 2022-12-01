import { spawn } from 'child_process'

function run(day) {
  const p = spawn(`node ./days/${day}`, {
    shell: true,
    stdio: 'inherit',
  })
  p.on('close', () => {
    console.log(`Day ${day} finished.`)
  })
}

function getLastDay() {
  const [year] = process.env.npm_package_version.split('.')
  const endDate = new Date(`${year}-12-25`)
  const now = new Date()

  if (now.getTime() < endDate.getTime()) {
    return now.getDate()
  }
  return 25
}

try {
  const [, , day] = process.argv
  const lastDay = getLastDay()

  if (day && day === 'all') {
    for (let i = 1; i <= lastDay; i += 1) {
      run(i)
    }
  } else if (day) {
    run(day)
  } else {
    run(lastDay)
  }
} catch (error) {
  console.error(error)
}
