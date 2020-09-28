const request = require("superagent");

const URL = "https://api.ponycon.info/";

class PartialConvention {
    constructor(con) {
        this.id = con.id;
        this.name = con.name;
        this.website = con.website;
        this.icon = con.icon;
        this.times = con.times;

        this.started = Date.parse(con.times.start) - Date.now() < 0 ? true : false;
        this.ended = Date.parse(con.times.end) - Date.now() < 0 ? true : false;

        this.countdown = {
            "start": Date.parse(con.times.start) - Date.now(),
            "end": Date.parse(con.times.end) - Date.now()
        }

        this.online = con.online == 1 ? true : false;
    }
}

class Convention extends PartialConvention {
    constructor(con) {
        super(con);

        this.description = con.description;
        this.socials = {};

        con.socials.forEach(social => {
            this.socials[social.type] = social.url;
        });
    }
}

function getConvention(id) {
    return new Promise((res, rej) => {
        request.get(URL + `con/${id}`)
            .send()
            .then(result => {
                res(new Convention(result.body));
            })
            .catch(rej);
    });
}

function getConventions() {
    return new Promise((res, rej) => {
        request.get(URL + `con/all`)
            .send()
            .then(result => {
                let payload = [];

                result.body.forEach(con => {
                    payload.push(new PartialConvention(con));
                });

                res(payload);
            })
            .catch(rej);
    });
}

function search(query) {
    return new Promise((res, rej) => {
        request.get(URL + `con/search/${query}`)
            .send()
            .then(result => {
                let payload = [];

                result.body.forEach(con => {
                    payload.push(new PartialConvention(con));
                });

                res(payload);
            })
            .catch(rej);
    });
}

exports.getConvention = getConvention;
exports.getConventions = getConventions;
exports.search = search;