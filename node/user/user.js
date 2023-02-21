class user {
    constructor(channel) {
        this._channel = channel;

        this._ban_viewbot = false;
        this._except_ban_viewbot = new Array();

        this._osu_account = "";
        this._access_osu_account = false;
    }
}
let users = new Array();

module.exports = {
    user, users
}