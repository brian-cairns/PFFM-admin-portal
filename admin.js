const url = 'https://pffm.azurewebsites.net/'
const main = document.getElementById('mainContent')
main.style.display = 'none'

Promise.all([fetchIISS(),fetchFamilySessions(),fetchNotices(),fetchClients(), fetchStaff()])
	.then(() => main.style.display = 'block')
  .catch(console.error)

async function fetchIISS() {
    let path = 'IISSSession/all'
    let uri = url + path
    fetch(uri)
    .then(response => response.json())
    .then(data => populateIISS(data))
}

function populateIISS(data) {
	console.log(data)
  let total = 15
  let number = 0
  data.length < 15 ? number = data.length : number = total
  for (let i = 0; i < number; i++) {
    document.getElementById(`clientName${i+1}`).innerHTML = data[i].clientName;
    document.getElementById(`data${i+1}`).innerHTML = data[i].date
    document.getElementById(`ref${i+1}`).innerHTML = `<a href='./completed-forms/iiss-session-note?name=${data[i].clientName}'>IISS Session</a>`
  }
  for (let i = number; i < total; i++) {
    let tab = document.getElementById(`individualSessionBlock${i+1}`)
    tab.style.display = 'none'
  }
}

async function fetchFamilySessions() {
    path = 'familySession/all'
    let uri = url + path
    fetch(uri)
    .then(response => response.json())
    .then(data => populateFamilySessions(data))
}

function populateFamilySessions(data) {
	console.log(data)
  let total = 15
  let number = 0
  data.length < 15 ? number = data.length : number = total
  for (let i = 0; i < number; i++) {
    document.getElementById(`clientNamef${i+1}`).innerHTML = data[i].clientName;
    document.getElementById(`date${i+1}`).innerHTML = `${data[i].month}/${data[i].day}/${data[i].year}`
    document.getElementById(`ref-f${i+1}`).innerHTML = `<a href='./completed-forms/family-trainer-team-meeting?name=${data[i].clientName}'>IISS Session</a>`
  }
  for (let i = number; i < total; i++) {
    let tab = document.getElementById(`individualSessionBlock${i+1}`)
    tab.style.display = 'none'
  }
}

async function fetchNotices() {
  const url = 'https://pffm.azurewebsites.net/notices'
  const uri = `${url}/?name=admin`
  console.log(uri)
  fetch(uri)
    .then(response => response.json())
    .then(data => fillNotices(data))
}

async function fillNotices(data) {
  let priority = []
  let notPriority = []
  let notices = data
  console.log(notices)
  notices.forEach((notice) => {
    notice.priority == 'urgent' ? priority.push(notice.message) : notPriority.push(notice.message)
  })
  fillPriorityNotices(priority) 
  fillUpdates(notPriority)
}

function fillPriorityNotices(priority) {
  let max = 3
  let urgent = []
  let length = 0
  priority.length > max ? length = max : length = priority.length
  for (let i = 0; i < length; i++) {
    let urgentMsg = document.getElementById(`urgentMsg${i+1}`)
    urgentMsg.innerHTML = priority[i]
    urgent[i] = document.getElementById(`urgent${i+1}`)
    urgent[i].addEventListener('click', () => {
      deleteNotice(priority[i])
      for (let j = i; j < priority.length - 1; j++) {
        priority[j] = priority[j+1]
      }
      if (priority.length <= 1) {
        document.getElementById('urgentMsg1').innerHTML = ''
        return
      }
      priority.pop()
      fillPriorityNotices(priority)
    })
  }
  for (let k = length; k < max; k++) {
    document.getElementById(`urgentMsg${k + 1}`).innerHTML = ''
  }
}

function fillUpdates(notPriority) {
  let max = 5
  let length = 0
  let close = []
  notPriority.length > max ? length = max : length = notPriority.length
  for (let i = 0; i < length; i++) {
  	console.log(i)
    notPriority[i] = document.getElementById(`updateMsg${i + 1}`).innerHTML = notPriority[i]
    close[i] = document.getElementById(`close${i + 1}`)
    console.log(close[i])
    close[i].addEventListener('click', () => {
      deleteNotice(notPriority[i])
      for (let j = i; j < notPriority.length - 1; j++) {
        notPriority[j] = notPriority[j+1]
      }
      if (notPriority.length <= 1) {
        document.getElementById('updateMsg1').innerHTML = ''
        return
      }
      notPriority.pop()
      fillUpdates(notPriority)
    })
  }
  for (let k = length; k < max; k++) {
    document.getElementById(`updateMsg${k + 1}`).innerHTML = ''
  }
}

async function fetchClients() {
    path = 'client/all'
    let uri = url + path
    fetch(uri)
    .then(response => response.json())
    .then(data => populateClients(data))
}

function populateClients(data) {
		console.log(data)
    let max = 10
    let length = 0
    clients = []
    data.length > max ? length = max : length = data.length
    for (let i = 0; i < length; i++) {
        clients[i] = document.getElementById(`client${i+1}`)
        clients[i].innerHTML = data[i].name
        clients[i].addEventListener('click', () => {
            location.href = `./client-portal?name=${data[i].name}`
        })
    }
    for (let j = length; j < max; j++) {
        document.getElementById(`clientBox${j+1}`).style.display = 'none'
    }
}

async function fetchStaff() {
    path = 'employee/all'
    let uri = url + path
    fetch(uri)
    .then(response => response.json())
    .then(data => populateStaff(data))
}

function populateStaff(data) {
		console.log(data)
    let max = 5
    let length = 0
    staff = []
    ttlHrs = 0
    data.length > max ? length = max : length = data.length
    for (let i = 0; i < length; i++) {
    console.log(i)
        staff[i] = document.getElementById(`employee${i+1}`)
        staff[i].innerHTML = data[i].name
        staff[i].addEventListener('click', () => {
            location.href = `./staff-portal?name=${data[i].name}`
        })
        ttlHrs += staff[i].hrsWorked
    }
    document.getElementById('hrsWorked').innerHTML = ttlHrs.toString()
    for (let j = length; j < max; j++) {
    		console.log(j)
        document.getElementById(`employeeBox${j+1}`).style.display = 'none'
    }
}

const today = new Date()
const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const leapMos = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
function getPayPeriod() {
    let date = today.getDate()
    let month = today.getMonth() 
    let year = today.getFullYear()
    let days = 0

    Number.isInteger(year / 4) ? days = leapMos[month] : days= months[month]
    if (date < 15 && month != 1) { days = 15 } else {
        if (month == 1) {days = 14 }
    }

    return `${month + 1}/${days}/${year}`
}

document.getElementById('payday').innerHTML = getPayPeriod()
 