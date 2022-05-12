var moment = require('moment'); 

function formatDate(timestamp){
    return moment(timestamp).format('MMMM Do YYYY, h:mm a');
}

module.exports = formatDate;