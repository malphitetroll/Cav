const {
    Listener
} = require('discord-akairo');

module.exports = class RoleDeleteListener extends Listener {
    constructor() {
        super('roleDelete', {
            emitter: 'client',
            event: 'roleDelete'
        });
    }

    async exec(role) {

    }
}