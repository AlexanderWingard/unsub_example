var wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" + document.location.host + "/ws";

var connection = new autobahn.Connection({
    url: wsuri,
    realm: "realm1"
});

connection.onopen = function(session, details) {
    var t1 = 0;
    var t2 = 1000;
    setInterval(function() { session.publish("channel1", [t1++], {}, {exclude_me: false}); }, 1000);
    setInterval(function() { session.publish("channel2", [t2++], {}, {exclude_me: false}); }, 1000);
}

function on_data(args) {
    document.getElementById("output").innerHTML = JSON.stringify(args);
}

var sub;
window.onhashchange = function() {
    var channel = window.location.hash.slice(1);
    unsub(sub).then(function() {
        connection.session.subscribe(channel, on_data)
            .catch((err) => { console.log("err" + err);})
            .then(function(subscription) {
                sub = subscription;
            });
    });
};

function unsub(channel) {
    return new Promise((resolve, reject) => {
        if(sub instanceof autobahn.Subscription) {
            resolve(connection.session.unsubscribe(channel));
        } else {
            resolve(true);
        }
    });
}

connection.open();
