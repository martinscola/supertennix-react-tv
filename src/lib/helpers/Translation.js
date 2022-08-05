import moment from 'moment-timezone';


function T(text) {
    var Translation = localStorage.getItem("translation");

    if(Translation === null) {
        Translation = {} ;
    } else {
        Translation = JSON.parse(Translation);
    }

    if (typeof(text) !== "string") return text
    return text.replace(/\$t\((.+?)\)/g, (match) => {
        let v = "";
        const path = match.substr(3, match.length - 4).trim();
        // console.log(path)
        if(Translation.hasOwnProperty(window.lang) && Translation[window.lang].hasOwnProperty(path)){
            v = Translation[window.lang][path]
        } else {
            v = path
            //$.post(api_url + "/set/translation", {"message": v})
        }
        return v
    }).replace(/\$d\((.+?)\)/g, (match) => {
        const path = match.substr(3, match.length - 4).trim();
        let spl = path.split(',')
        //date = moment.parseZone(spl[0]).local().toDate()
        let date = ""
        let timeZone = moment.tz.guess();
        if (spl[0] !== "") {
            date = moment.tz(spl[0] + "Z", timeZone).toDate()
        }
        let format = spl.slice(1).join(',')
        return T(strftime(format,date))
    })

}


function TranslateObject(obj) {
    if (typeof obj === 'object') {
        // iterating over the object using for..in
        for (var keys in obj) {
            //checking if the current value is an object itself
            if (typeof obj[keys] === 'object') {
                // if so then again calling the same function
                TranslateObject(obj[keys])
            } else {
                // else getting the value and replacing single { with {{ and so on
                var keyValue = T(obj[keys])
                obj[keys] = keyValue;
            }
        }
    }
    return obj;
}

function strftime(sFormat, date) {
    date === "" ? date = new Date(): date = new Date(date);

    // console.log(new Date(date).getDay())
    var nDay = date.getDay(),
        nDate = date.getDate(),
        nMonth = date.getMonth(),
        nYear = date.getFullYear(),
        nHour = date.getHours(),
        aDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        aMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
        isLeapYear = function() {
            return (nYear%4===0 && nYear%100!==0) || nYear%400===0;
        },
        getThursday = function() {
            var target = new Date(date);
            target.setDate(nDate - ((nDay+6)%7) + 3);
            return target;
        },
        zeroPad = function(nNum, nPad) {
            return ('' + (Math.pow(10, nPad) + nNum)).slice(1);
        };
    return sFormat.replace(/%[a-z]/gi, function(sMatch) {
        return {
            '%a': "$t("+aDays[nDay].slice(0,3)+")",
            '%A': "$t("+(aDays[nDay])+")",
            '%b': "$t("+(aMonths[nMonth].slice(0,3))+")",
            '%B': "$t("+(aMonths[nMonth])+")",
            '%c': date.toUTCString(),
            '%C': Math.floor(nYear/100),
            '%d': zeroPad(nDate, 2),
            '%e': nDate,
            '%F': date.toISOString().slice(0,10),
            '%G': getThursday().getFullYear(),
            '%g': ('' + getThursday().getFullYear()).slice(2),
            '%H': zeroPad(nHour, 2),
            '%I': zeroPad((nHour+11)%12 + 1, 2),
            '%j': zeroPad(aDayCount[nMonth] + nDate + ((nMonth>1 && isLeapYear()) ? 1 : 0), 3),
            '%k': '' + nHour,
            '%l': (nHour+11)%12 + 1,
            '%m': zeroPad(nMonth + 1, 2),
            '%M': zeroPad(date.getMinutes(), 2),
            '%p': (nHour<12) ? 'AM' : 'PM',
            '%P': (nHour<12) ? 'am' : 'pm',
            '%s': Math.round(date.getTime()/1000),
            '%S': zeroPad(date.getSeconds(), 2),
            '%u': nDay || 7,
            '%V': (function() {
                var target = getThursday(),
                    n1stThu = target.valueOf();
                target.setMonth(0, 1);
                var nJan1 = target.getDay();
                if (nJan1!==4) target.setMonth(0, 1 + ((4-nJan1)+7)%7);
                return zeroPad(1 + Math.ceil((n1stThu-target)/604800000), 2);
            })(),
            '%w': '' + nDay,
            '%x': date.toLocaleDateString(),
            '%X': date.toLocaleTimeString(),
            '%y': ('' + nYear).slice(2),
            '%Y': nYear,
            '%z': date.toTimeString().replace(/.+GMT([+-]\d+).+/, '$1'),
            '%Z': date.toTimeString().replace(/.+\((.+?)\)$/, '$1')
        }[sMatch] || sMatch;
    });
}

export {T, TranslateObject, strftime}