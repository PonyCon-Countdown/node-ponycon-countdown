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

async function getConvention(id) {
    request.get(URL + `con/${id}`)
        .send()
        .then(res => {
            return new Convention(res.body);
        })
        .catch(error => {
            throw error;
        });
}

async function getConventions() {
    request.get(URL + `con/all`)
        .send()
        .then(res => {
            let payload = [];

            res.body.forEach(con => {
                payload.push(new PartialConvention(con));
            });

            return payload;
        })
        .catch(error => {
            throw error;
        });
}

async function search(query) {
    request.get(URL + `con/search/${query}`)
        .send()
        .then(res => {
            let payload = [];

            res.body.forEach(con => {
                payload.push(new PartialConvention(con));
            });

            return payload;
        })
        .catch(error => {
            throw error;
        });
}

exports.getConvention = getConvention;
exports.getConventions = getConventions;
exports.search = search;