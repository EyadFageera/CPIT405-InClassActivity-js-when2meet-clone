const STSelect = document.getElementById('start-time')
const ETSelect = document.getElementById('end-time')
const CEventBtn = document.getElementById("submitMeeting")

let sHour = 8
let eHour = 17

PPDDMenu(STSelect, 8)
PPDDMenu(ETSelect, 17)

function PPDDMenu(selectElm, selectedValue){
    for(let i = 0; i<24; i++){
        let optionElm = document.createElement("option")
        let hour = i % 12 === 0? 12: i % 12;
        hour += ':00' 
        hour += i <12? ' AM' : ' PM'
        optionElm.text=hour;
        optionElm.value = i;

        if(i === selectedValue){
            optionElm.selected = true;
        }
        selectElm.appendChild(optionElm)
    }
}

STSelect.addEventListener('change', function(){
    sHour = parseInt(this.value)
    createTimeTable()

})

ETSelect.addEventListener('change', function(){
    eHour = parseInt(this.value)
    createTimeTable()
})

function createTimeTable(){
    const divContainer = document.getElementById('timeTable')

    let table = '<table><thead><tr><th></th>'
    const days = ["Sunday", "Monday", "Tuseday", "Wednesday", "Thursday", "Friday"]
    days.forEach(day =>{
        table += `<th class="day-header">${day}</th>`
    })
    table += '</tr></thead><tbody>'

    for(let i= sHour; i <= eHour; i++){
        let hour = i % 12 === 0? 12: i % 12;
        hour += ':00' 
        hour += i <12? ' AM' : ' PM'

        table += `<tr> <td class="time-label">${hour}</td>`;
        days.forEach(day =>{
            table += `
            <td class="time-slot"
                onclick="toggleTimeSlot(this)"
                data-day="${day}"
                data-time="${hour}">
            </td>`
        });
        table += '</tr>'
    }

    table += '</tbody></table>'
    
    divContainer.innerHTML = table;
}
createTimeTable()

const selectedTime = new Set();
function toggleTimeSlot(slot){
    const timeSlot = `${slot.dataset.day}-${slot.dataset.time}`
    if(selectedTime.has(timeSlot)){
        selectedTime.delete(timeSlot);
        slot.classList.remove("selected");
    }
    else{
        selectedTime.add(timeSlot);
        slot.classList.add("selected")
    }
}


CEventBtn.addEventListener("click", async function(){
    const Uname = document.getElementById("user-name").value;
    const Ename = document.getElementById("event-name").value;
    if(!Uname || !Ename){
        alert("please enter yourname and the event name")
        return;
    };
    const BPayload = {
        username: Uname,
        eventname: Ename,
        slots: [...selectedTime]
    }
    const API_URL = "https://jsonplaceholder.typicode.com/posts"
    const response = await fetch(API_URL,{
        method: 'POST',
        body: JSON.stringify(BPayload),
        headers: {
            'Content-type': 'application/json'
        }
    });
    const data = await response.json();
    console.log("we got this back from the server:")
    console.log(JSON.stringify(data))

    
})

