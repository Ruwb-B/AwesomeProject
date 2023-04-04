import { generateUUID } from "./uid";




class calendar{

    static async getToken(username, password) {
        console.log('get token');
        url = 'https://courses.fit.hcmus.edu.vn/login/token.php?username='+username
                +'&password='+password+'&service=moodle_mobile_app';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if(data.errorcode === "invalidlogin"){
            return "error";
        }
        console.log("response: ", data);
        return data.token;
    }

    static async getCalendarData(token, month, year){
        console.log('get calendar data');
        url = 'https://courses.fit.hcmus.edu.vn/webservice/rest/server.php?wstoken='+token+'&wsfunction=core_calendar_get_calendar_monthly_view&moodlewsrestformat=json&year='+year+'&month='+month;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if(data.errorcode === "invalidtoken"){
            return "error";
        }
        const events = [];
        data.weeks.forEach(week => {
            week.days.forEach(day => {
                day.events.forEach((event)=> {
                    const timestamp = event.timestart;
                    const date = new Date(timestamp * 1000); 
                    const dateString = date.toLocaleDateString('vi-VN', {year: 'numeric', month: '2-digit', day: '2-digit'}).split('/').reverse().join('-'); 
                    const timeString = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); 
                    const id = generateUUID(6);
                    const eventItem = {
                        id: id,
                        title: event.name, 
                        description: event.course.fullname, 
                        isMoodle: true, 
                        dateString: dateString,
                        timeString: timeString
                    }
                    events.push(eventItem)
                });
            });
        });
        return events;
    }
}

export default calendar;